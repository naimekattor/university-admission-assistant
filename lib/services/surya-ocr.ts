/**
 * Client service to communicate with the local Python Surya OCR FastAPI microservice (http://127.0.0.1:8000/ocr).
 */
export async function extractWithSuryaOCR(pdfBuffer: Buffer, fileName = 'document.pdf'): Promise<string | null> {
  const suryaBaseUrl = process.env.SURYA_OCR_URL || 'http://127.0.0.1:8000';

  try {
    // 1. Health check to ensure Surya Python service is running
    const healthRes = await fetch(`${suryaBaseUrl}/health`, { signal: AbortSignal.timeout(1500) }).catch(() => null);
    if (!healthRes || !healthRes.ok) {
      console.log('[Surya OCR] Python microservice is offline at http://127.0.0.1:8000. Skipping Surya OCR.');
      return null;
    }

    console.log(`[Surya OCR] Posting "${fileName}" (${pdfBuffer.length} bytes) to Surya Python OCR service...`);

    // 2. Post file to Python FastAPI endpoint /ocr
    const formData = new FormData();
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    formData.append('file', blob, fileName);

    const response = await fetch(`${suryaBaseUrl}/ocr`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Surya OCR HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.success && data.text) {
      console.log(`[Surya OCR] Successfully extracted ${data.text.length} characters across ${data.page_count || 1} page(s).`);
      return data.text.trim();
    }

    return null;
  } catch (err: any) {
    console.warn('[Surya OCR] Surya OCR request failed or skipped:', err.message || err);
    return null;
  }
}
