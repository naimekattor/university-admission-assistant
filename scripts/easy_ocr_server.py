import sys
import os
import io
import logging

# Force UTF-8 encoding for stdout/stderr on Windows to avoid 'charmap' codec errors with tqdm (\u2588) or Bangla characters
os.environ["PYTHONIOENCODING"] = "utf-8"
if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'buffer'):
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("easy-ocr-server")

app = FastAPI(title="EasyOCR Microservice (Bangla + English)", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy-loaded EasyOCR reader
_easyocr_reader = None

def get_easyocr_reader():
    global _easyocr_reader
    if _easyocr_reader is None:
        logger.info("Initializing EasyOCR Reader for Bangla ('bn') and English ('en')...")
        import easyocr
        import torch

        use_gpu = torch.cuda.is_available()
        logger.info(f"EasyOCR GPU Acceleration: {use_gpu} (CUDA available: {use_gpu})")

        # Initialize EasyOCR reader with Bengali and English
        _easyocr_reader = easyocr.Reader(['bn', 'en'], gpu=use_gpu)
        logger.info("EasyOCR Reader loaded successfully.")
    return _easyocr_reader


# ─── PDF to Images (400 DPI) ───────────────────────────────────────────────────

def pdf_to_images(contents: bytes, dpi: int = 400) -> list:
    """Render PDF pages to PIL Images at specified DPI (default 400 DPI)."""
    scale = dpi / 72.0

    # 1. Try pypdfium2 first
    try:
        import pypdfium2 as pdfium
        pdf = pdfium.PdfDocument(contents)
        images = [page.render(scale=scale).to_pil().convert("RGB") for page in pdf]
        logger.info(f"pypdfium2 rendered {len(images)} page(s) at {dpi} DPI.")
        return images
    except Exception as e:
        logger.warning(f"pypdfium2 rendering failed ({e}), trying PyMuPDF...")

    # 2. Try PyMuPDF (fitz) fallback
    try:
        import fitz
        doc = fitz.open(stream=contents, filetype="pdf")
        images = []
        for page in doc:
            pix = page.get_pixmap(dpi=dpi)
            images.append(Image.frombytes("RGB", [pix.width, pix.height], pix.samples))
        logger.info(f"PyMuPDF rendered {len(images)} page(s) at {dpi} DPI.")
        return images
    except Exception as e:
        logger.error(f"PyMuPDF rendering also failed: {e}")
        raise RuntimeError("PDF rendering failed. Please install pypdfium2 or PyMuPDF.")


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "EasyOCR Microservice (bn+en)",
        "version": "1.0.0",
        "dpi": 400,
        "reader_loaded": _easyocr_reader is not None,
    }


@app.post("/ocr")
async def run_ocr_endpoint(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file contents")

    filename = file.filename or "document.pdf"
    is_pdf = filename.lower().endswith(".pdf") or file.content_type == "application/pdf"

    # Step 1: Render pages to RGB PIL images at 400 DPI
    if is_pdf:
        try:
            logger.info(f"Rendering PDF '{filename}' at 400 DPI...")
            images = pdf_to_images(contents, dpi=400)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"PDF rendering error: {e}")
    else:
        try:
            images = [Image.open(io.BytesIO(contents)).convert("RGB")]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {e}")

    if not images:
        raise HTTPException(status_code=400, detail="No pages found in input file")

    # Step 2: Run EasyOCR (Bangla + English)
    logger.info(f"Running EasyOCR (bn+en) on {len(images)} page(s)...")

    try:
        import numpy as np
        reader = get_easyocr_reader()
        extracted_pages = []

        for i, img in enumerate(images):
            img_np = np.array(img)
            # Read text with paragraph=True for natural block grouping
            results = reader.readtext(img_np, detail=0, paragraph=True)
            
            page_text = "\n\n".join(results) if results else ""
            extracted_pages.append(f"--- Page {i + 1} ---\n{page_text}")

        full_text = "\n\n".join(extracted_pages)
        logger.info(f"EasyOCR completed. Extracted {len(full_text)} characters across {len(images)} page(s).")

        return {
            "success": True,
            "filename": filename,
            "page_count": len(images),
            "text": full_text,
        }

    except Exception as e:
        err_msg = str(e).encode('utf-8', 'replace').decode('utf-8')
        logger.error(f"EasyOCR error: {err_msg}")
        raise HTTPException(status_code=500, detail=f"OCR execution failed: {err_msg}")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting EasyOCR FastAPI server on http://127.0.0.1:{port}")
    uvicorn.run(app, host="127.0.0.1", port=port)
