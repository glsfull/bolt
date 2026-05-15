# Queues

Heavy analysis processing is modeled as queued work: upload, OCR, AI
normalization and report generation. The first production option is Supabase
Queue/pgmq, with room to swap to a managed queue without changing mobile routes.
