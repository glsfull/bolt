-- Stage 4 production Supabase schema.
-- Applies the medical-data tables, owner-scoped RLS, private storage buckets,
-- indexes, and audit trail required before real health data is connected.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tg_profiles_updated_at on public.profiles;
drop trigger if exists tg_health_profiles_updated_at on public.health_profiles;
drop trigger if exists tg_analyses_updated_at on public.analyses;
drop trigger if exists tg_analysis_jobs_updated_at on public.analysis_jobs;
drop trigger if exists tg_doctor_reports_updated_at on public.doctor_reports;
drop trigger if exists tg_medications_updated_at on public.medications;
drop trigger if exists tg_health_programs_updated_at on public.health_programs;
drop trigger if exists tg_admin_settings_updated_at on public.admin_settings;
drop trigger if exists tg_audit_analyses on public.analyses;
drop trigger if exists tg_audit_analysis_markers on public.analysis_markers;
drop trigger if exists tg_audit_doctor_reports on public.doctor_reports;
drop trigger if exists tg_audit_risk_assessments on public.risk_assessments;
drop trigger if exists tg_audit_admin_settings on public.admin_settings;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  role text not null default 'user' check (role in ('user', 'doctor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.health_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sex text not null default 'unspecified',
  birth_date date,
  weight_kg numeric(5,1),
  height_cm integer,
  blood_type text,
  chronic_conditions text[] not null default array[]::text[],
  allergies text[] not null default array[]::text[],
  medications_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.analysis_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket_id text not null default 'analysis-files',
  storage_path text not null,
  original_file_name text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size >= 0),
  signed_upload_url_created_at timestamptz,
  signed_url_expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (bucket_id, storage_path)
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_file_id uuid references public.analysis_files(id) on delete set null,
  type text not null default 'blood',
  type_label text not null default 'Анализ',
  collected_at date,
  status text not null default 'uploaded' check (status in ('uploaded', 'ocr_processing', 'ai_processing', 'completed', 'failed')),
  raw_text text not null default '',
  summary jsonb not null default '{}'::jsonb,
  health_score integer check (health_score between 0 and 100),
  abnormal_count integer not null default 0 check (abnormal_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_markers (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  code text,
  name text not null,
  value numeric,
  value_text text,
  unit text not null default '',
  ref_min numeric,
  ref_max numeric,
  status text not null check (status in ('low', 'normal', 'high', 'critical')),
  category text not null default 'Общее',
  interpretation text not null default '',
  recommendation text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.analysis_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_file_id uuid references public.analysis_files(id) on delete set null,
  analysis_id uuid references public.analyses(id) on delete set null,
  status text not null default 'uploaded' check (status in ('uploaded', 'ocr_processing', 'ai_processing', 'completed', 'failed')),
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid references public.analyses(id) on delete set null,
  bucket_id text not null default 'doctor-reports',
  storage_path text,
  status text not null default 'queued' check (status in ('queued', 'generating', 'ready', 'failed')),
  report_summary jsonb not null default '{}'::jsonb,
  medical_disclaimer text not null,
  signed_url_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid references public.analyses(id) on delete set null,
  name text not null,
  score integer not null check (score between 0 and 100),
  level text not null check (level in ('low', 'medium', 'high')),
  factors jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  model_version text not null default 'rules-v1',
  created_at timestamptz not null default now()
);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  dosage text not null default '',
  unit text not null default '',
  times text[] not null default array[]::text[],
  start_date date,
  end_date date,
  notes text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.health_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'lifestyle',
  duration_days integer not null default 30 check (duration_days > 0),
  goals text[] not null default array[]::text[],
  triggers jsonb not null default '[]'::jsonb,
  nutrition_plan jsonb not null default '{}'::jsonb,
  lifestyle_tips jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  secret_ref text,
  enabled boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  action text not null,
  target_table text not null,
  target_id text not null,
  old_row jsonb,
  new_row jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.health_profiles enable row level security;
alter table public.analysis_files enable row level security;
alter table public.analyses enable row level security;
alter table public.analysis_markers enable row level security;
alter table public.analysis_jobs enable row level security;
alter table public.doctor_reports enable row level security;
alter table public.risk_assessments enable row level security;
alter table public.medications enable row level security;
alter table public.health_programs enable row level security;
alter table public.admin_settings enable row level security;
alter table public.audit_log enable row level security;

create policy "Profiles are owner readable" on public.profiles for select to authenticated using (auth.uid() = id or public.is_admin());
create policy "Profiles are owner writable" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Profiles are owner insertable" on public.profiles for insert to authenticated with check (auth.uid() = id);

create policy "Health profiles are owner readable" on public.health_profiles for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "Health profiles are owner writable" on public.health_profiles for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Analysis files are owner readable" on public.analysis_files for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "Analysis files are owner writable" on public.analysis_files for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Analyses are owner readable" on public.analyses for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "Analyses are owner writable" on public.analyses for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Analysis markers are owner readable" on public.analysis_markers for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "Analysis markers are owner writable" on public.analysis_markers for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Analysis jobs are owner readable" on public.analysis_jobs for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "Analysis jobs are owner writable" on public.analysis_jobs for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Doctor reports are owner readable" on public.doctor_reports for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "Doctor reports are owner writable" on public.doctor_reports for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Risk assessments are owner readable" on public.risk_assessments for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "Risk assessments are owner writable" on public.risk_assessments for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Medications are owner readable" on public.medications for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "Medications are owner writable" on public.medications for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Active health programs are readable" on public.health_programs for select to authenticated using (active or public.is_admin());
create policy "Admins manage health programs" on public.health_programs for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins manage admin settings" on public.admin_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins read audit log" on public.audit_log for select to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('analysis-files', 'analysis-files', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('doctor-reports', 'doctor-reports', false, 10485760, array['application/pdf'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Users read own analysis storage objects"
  on storage.objects for select to authenticated
  using (bucket_id = 'analysis-files' and owner = auth.uid());

create policy "Users upload own analysis storage objects"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'analysis-files' and owner = auth.uid());

create policy "Users read own doctor report storage objects"
  on storage.objects for select to authenticated
  using (bucket_id = 'doctor-reports' and owner = auth.uid());

create policy "Service role writes doctor report storage objects"
  on storage.objects for insert to service_role
  with check (bucket_id = 'doctor-reports');

comment on table public.analysis_files is 'Files are private; clients request createSignedUploadUrl/createSignedUrl via Edge Functions.';
comment on table public.doctor_reports is 'Reports are private; clients receive short-lived createSignedUrl links only.';

create index if not exists health_profiles_user_idx on public.health_profiles(user_id);
create index if not exists analysis_files_user_created_idx on public.analysis_files(user_id, created_at desc);
create index if not exists analyses_user_created_idx on public.analyses(user_id, created_at desc);
create index if not exists analysis_markers_analysis_status_idx on public.analysis_markers(analysis_id, status);
create index if not exists analysis_jobs_user_status_idx on public.analysis_jobs(user_id, status, created_at desc);
create index if not exists doctor_reports_user_status_idx on public.doctor_reports(user_id, status, created_at desc);
create index if not exists risk_assessments_user_level_idx on public.risk_assessments(user_id, level, created_at desc);
create index if not exists medications_user_active_idx on public.medications(user_id, active);
create index if not exists audit_log_target_idx on public.audit_log(target_table, target_id, created_at desc);

create or replace function public.audit_table_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (actor_user_id, action, target_table, target_id, old_row, new_row)
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id::text, old.id::text),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );
  return coalesce(new, old);
end;
$$;

create trigger tg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger tg_health_profiles_updated_at before update on public.health_profiles for each row execute function public.set_updated_at();
create trigger tg_analyses_updated_at before update on public.analyses for each row execute function public.set_updated_at();
create trigger tg_analysis_jobs_updated_at before update on public.analysis_jobs for each row execute function public.set_updated_at();
create trigger tg_doctor_reports_updated_at before update on public.doctor_reports for each row execute function public.set_updated_at();
create trigger tg_medications_updated_at before update on public.medications for each row execute function public.set_updated_at();
create trigger tg_health_programs_updated_at before update on public.health_programs for each row execute function public.set_updated_at();
create trigger tg_admin_settings_updated_at before update on public.admin_settings for each row execute function public.set_updated_at();

create trigger tg_audit_analyses after insert or update or delete on public.analyses for each row execute function public.audit_table_changes();
create trigger tg_audit_analysis_markers after insert or update or delete on public.analysis_markers for each row execute function public.audit_table_changes();
create trigger tg_audit_doctor_reports after insert or update or delete on public.doctor_reports for each row execute function public.audit_table_changes();
create trigger tg_audit_risk_assessments after insert or update or delete on public.risk_assessments for each row execute function public.audit_table_changes();
create trigger tg_audit_admin_settings after insert or update or delete on public.admin_settings for each row execute function public.audit_table_changes();
