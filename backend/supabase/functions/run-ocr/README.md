# run-ocr

Edge Function boundary for OCR providers.

Responsibilities:
- read PDF/JPG/PNG/HEIC files from private Storage with service credentials;
- call the configured OCR provider;
- normalize extracted text and marker candidates;
- persist OCR artifacts without exposing provider keys to the mobile client.
