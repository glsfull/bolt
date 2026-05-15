-- Stage 1 schema plan for the production Supabase backend.
-- This file is intentionally additive to the new backend scaffold and does not
-- modify the read-only Bolt prototype under project/.

create schema if not exists app_private;

create table if not exists public.analysis_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid,
  source_file_path text not null,
  status text not null check (status in ('uploaded', 'ocr_processing', 'ai_processing', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_report_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_file_path text,
  status text not null check (status in ('queued', 'generating', 'ready', 'failed')),
  signed_url_expires_at timestamptz,
  medical_disclaimer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_feature_flags (
  key text primary key,
  enabled boolean not null default false,
  disabled_reason text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists app_private.ocr_provider_settings (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  model text not null,
  monthly_limit integer not null,
  enabled boolean not null default false,
  secret_ref text not null,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id),
  action text not null,
  target_table text not null,
  target_id text not null,
  created_at timestamptz not null default now()
);

alter table public.analysis_jobs enable row level security;
alter table public.doctor_report_jobs enable row level security;
alter table public.app_feature_flags enable row level security;
alter table public.admin_audit_log enable row level security;

create index if not exists analysis_jobs_user_status_idx on public.analysis_jobs(user_id, status, created_at desc);
create index if not exists doctor_report_jobs_user_status_idx on public.doctor_report_jobs(user_id, status, created_at desc);

-- Storage setup target:
-- insert into storage.buckets (id, name, public)
-- values ('analysis-files', 'analysis-files', false),
--        ('doctor-reports', 'doctor-reports', false)
-- on conflict (id) do update set public = false;
