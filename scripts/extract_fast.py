import os
import sys
import time
import argparse
import pymupdf  # PyMuPDF
import pytesseract
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

# Force UTF-8 terminal encoding on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ================= Configuration =================
DEFAULT_OUTPUT_FILE = "output.md"
TESSERACT_CMD = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
LANGUAGES = "ben+eng"  # Bangla + English bilingual OCR
DPI = 200              # Sweet spot for high accuracy + max speed
MAX_WORKERS = 8        # Parallel threads for multi-core processing
# =================================================

# Configure Tesseract binary path
if os.path.exists(TESSERACT_CMD):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD


def process_single_page(page_data):
    """Processes a single page: uses digital text if available (>50 chars), otherwise runs OCR."""
    page_num, digital_text, img = page_data
    
    # 1. Fast Path: If page has rich digital text (>50 chars), use it directly (0.005s)
    if digital_text and len(digital_text.strip()) > 50:
        return page_num, digital_text.strip(), "Digital Text"
    
    # 2. OCR Path: Scanned image page -> Parallel Tesseract OCR (~1s per page)
    try:
        ocr_text = pytesseract.image_to_string(img, lang=LANGUAGES)
        return page_num, ocr_text.strip(), "OCR (Bangla+English)"
    except Exception as e:
        return page_num, f"*(OCR Error: {e})*", "OCR Error"


def extract_pdf_fast(pdf_path: str, output_file: str = DEFAULT_OUTPUT_FILE, dpi: int = DPI, workers: int = MAX_WORKERS):
    """Converts admission circular PDFs into structured Markdown with parallel processing."""
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at '{pdf_path}'")
        sys.exit(1)

    start_time = time.time()
    print(f"⚡ Opening '{pdf_path}'...")
    
    doc = pymupdf.open(pdf_path)
    total_pages = len(doc)
    print(f"📄 Total pages: {total_pages}")

    # Step 1: Render / load pages directly in memory
    print("🚀 Preparing pages in memory...")
    pages_to_process = []
    for i, page in enumerate(doc):
        raw_text = page.get_text()
        # Direct zero-overhead memory buffer conversion
        pix = page.get_pixmap(dpi=dpi)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        pages_to_process.append((i + 1, raw_text, img))
    doc.close()

    # Step 2: Parallel extraction across CPU cores
    worker_count = min(total_pages, workers)
    print(f"🧠 Extracting {total_pages} pages in parallel using {worker_count} workers...")
    with ThreadPoolExecutor(max_workers=worker_count) as executor:
        results = list(executor.map(process_single_page, pages_to_process))

    # Sort results by page number
    results.sort(key=lambda x: x[0])

    # Step 3: Format and save Markdown
    markdown_sections = []
    for page_num, text, method in results:
        print(f"  ✓ Page {page_num} processed via [{method}] ({len(text)} characters)")
        if text:
            section = f"## Page {page_num}\n\n{text}"
        else:
            section = f"## Page {page_num}\n\n*(No text detected)*"
        markdown_sections.append(section)

    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n\n---\n\n".join(markdown_sections))

    elapsed = time.time() - start_time
    print(f"\n🎉 Completed in {elapsed:.2f} seconds! Output saved to '{output_file}'")
    return output_file


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fast Bilingual (Bangla+English) PDF to Structured Markdown Converter")
    parser.add_argument("pdf_path", nargs="?", help="Path to admission PDF file")
    parser.add_argument("-o", "--output", default=DEFAULT_OUTPUT_FILE, help="Output markdown file path (default: output.md)")
    parser.add_argument("--dpi", type=int, default=DPI, help="DPI for page rasterization (default: 200)")
    parser.add_argument("--workers", type=int, default=MAX_WORKERS, help="Number of parallel worker threads (default: 8)")
    
    args = parser.parse_args()
    
    if not args.pdf_path:
        print("Usage: python extract_fast.py <path_to_pdf> [-o output.md]")
        sys.exit(1)
        
    extract_pdf_fast(args.pdf_path, args.output, args.dpi, args.workers)
