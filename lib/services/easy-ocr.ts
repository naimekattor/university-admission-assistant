/**
 * Client service to communicate with the local Python EasyOCR FastAPI microservice (http://127.0.0.1:8000/ocr).
 * Renders pages at 400 DPI and extracts Bangla & English text.
 */
export async function extractWithEasyOCR(pdfBuffer: Buffer, fileName = 'document.pdf'): Promise<string | null> {
  const easyOcrBaseUrl = process.env.EASY_OCR_URL || 'http://127.0.0.1:8000';

  try {
    // 1. Health check to ensure Python EasyOCR service is online
    const healthRes = await fetch(`${easyOcrBaseUrl}/health`, { signal: AbortSignal.timeout(2000) }).catch(() => null);
    if (!healthRes || !healthRes.ok) {
      console.log('[EasyOCR] Python microservice is offline at http://127.0.0.1:8000. Skipping EasyOCR.');
      return null;
    }

    console.log(`[EasyOCR] Posting "${fileName}" (${pdfBuffer.length} bytes) to EasyOCR Python service (400 DPI, bn+en)...`);

    // 2. Post file to Python FastAPI endpoint /ocr
    const formData = new FormData();
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    formData.append('file', blob, fileName);

    const response = await fetch(`${easyOcrBaseUrl}/ocr`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`EasyOCR HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success && data.text) {
      console.log(`[EasyOCR] Successfully extracted ${data.text.length} characters across ${data.page_count || 1} page(s).`);
      return data.text.trim();
    }

    return null;
  } catch (err: any) {
    console.warn('[EasyOCR] EasyOCR request failed or skipped:', err.message || err);
    return null;
  }
}
