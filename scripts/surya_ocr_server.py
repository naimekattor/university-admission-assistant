import os
import io
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("surya-ocr-server")

app = FastAPI(title="Surya OCR Microservice", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy-loaded predictors (warm in memory after first request)
_rec_predictor = None
_det_predictor = None

def get_predictors():
    global _rec_predictor, _det_predictor
    if _rec_predictor is None:
        logger.info("Loading Surya OCR RecognitionPredictor & DetectionPredictor (first time, may take a moment)...")
        from surya.recognition import RecognitionPredictor
        from surya.detection import DetectionPredictor
        _rec_predictor = RecognitionPredictor()
        _det_predictor = DetectionPredictor()
        logger.info("Surya OCR predictors loaded and warm.")
    return _rec_predictor, _det_predictor

# ─── PDF to Images (Poppler-free) ─────────────────────────────────────────────

def pdf_to_images(contents: bytes, dpi: int = 300) -> list:
    """Convert PDF bytes to list of RGB PIL Images using pypdfium2 (no Poppler needed)."""
    try:
        import pypdfium2 as pdfium
        pdf = pdfium.PdfDocument(contents)
        images = [page.render(scale=dpi / 72).to_pil().convert("RGB") for page in pdf]
        logger.info(f"pypdfium2 rendered {len(images)} page(s) at {dpi} DPI.")
        return images
    except Exception as e:
        logger.warning(f"pypdfium2 failed ({e}), trying PyMuPDF...")

    try:
        import fitz
        doc = fitz.open(stream=contents, filetype="pdf")
        images = []
        for page in doc:
            pix = page.get_pixmap(dpi=dpi)
            images.append(Image.frombytes("RGB", [pix.width, pix.height], pix.samples))
        logger.info(f"PyMuPDF rendered {len(images)} page(s).")
        return images
    except Exception as e:
        logger.error(f"PyMuPDF also failed: {e}")
        raise RuntimeError("PDF rendering failed. Install pypdfium2: pip install pypdfium2")

# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Surya OCR Microservice",
        "version": "2.0.0",
        "models_loaded": _rec_predictor is not None,
    }

@app.post("/ocr")
async def run_ocr_endpoint(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file contents")

    filename = file.filename or "upload"
    is_pdf = filename.lower().endswith(".pdf") or file.content_type == "application/pdf"

    # ── Convert to images ──
    if is_pdf:
        try:
            logger.info(f"Rendering PDF '{filename}' to images...")
            images = pdf_to_images(contents, dpi=300)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        try:
            images = [Image.open(io.BytesIO(contents)).convert("RGB")]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    if not images:
        raise HTTPException(status_code=400, detail="No pages found in input")

    logger.info(f"Running Surya OCR on {len(images)} page(s)...")

    try:
        rec_predictor, det_predictor = get_predictors()

        # Surya v0.22+ API: RecognitionPredictor(images, layout_results=None, full_page=True)
        # full_page=True: skip layout detection, OCR the entire page as text
        predictions = rec_predictor(images, full_page=True)

        extracted_pages = []
        for i, pred in enumerate(predictions):
            lines = getattr(pred, "text_lines", [])
            page_text = "\n".join(getattr(line, "text", "") for line in lines)
            extracted_pages.append(f"--- Page {i + 1} ---\n{page_text}")

        full_text = "\n\n".join(extracted_pages)
        logger.info(f"Surya OCR done. Extracted {len(full_text)} characters from {len(images)} page(s).")

        return {
            "success": True,
            "filename": filename,
            "page_count": len(images),
            "text": full_text,
        }

    except Exception as e:
        logger.error(f"Surya OCR error: {e}")
        raise HTTPException(status_code=500, detail=f"OCR failed: {e}")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting Surya OCR FastAPI on http://127.0.0.1:{port}")
    uvicorn.run(app, host="127.0.0.1", port=port)
