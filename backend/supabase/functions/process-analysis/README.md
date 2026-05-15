# process-analysis

Edge Function orchestration boundary for uploaded analyses.

Inputs:
- authenticated user id;
- private storage file path;
- analysis type.

Responsibilities:
- create or update an analysis row;
- enqueue OCR work;
- prevent duplicate processing for the same file;
- expose processing status for polling or realtime updates.
