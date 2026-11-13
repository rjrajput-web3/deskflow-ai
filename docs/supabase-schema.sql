-- DeskFlow AI — Supabase schema (Sprint 2, docs only — no live DB yet).
-- This DDL is the documented target only. The live site runs in demo mode
-- (localStorage-backed store, `lib/store.ts`) until the Supabase integration
-- is built (client + env vars + auth) — configuring env vars alone today
-- would change nothing: no Supabase client exists in the code yet.
--
-- PostgreSQL DDL for the 8 core tables. Run in the Supabase SQL editor when
-- the Supabase step lands. NO auth dependency in this DDL: there is no
-- `auth.users` foreign key anywhere — auth wiring (Supabase Auth, RLS
-- policies bound to auth.uid()) is a LATER phase. RLS is enabled on every
-- table now so nothing is accidentally public; policies are added in that
-- later phase.
--
-- Conventions: UUID primary keys (gen_random_uuid), every table has
-- workspace_id (FK to workspaces) except workspaces itself, and created_at
-- timestamps default to now(). Money is numeric USD, never floats.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- workspaces
create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  tagline text,
  hours text,
  open_time text,
  close_time text,
  days_open text,
  escalation_rules jsonb not null default '[]'::jsonb,
  plan text not null default 'Starter',
  status text not null default 'active', -- active | trial | suspended
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ services
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  name text not null,
  price_usd numeric(10, 2) not null default 0,
  duration_minutes integer,
  created_at timestamptz not null default now()
);
create index if not exists services_workspace_id_idx on services (workspace_id);

-- ------------------------------------------------------------- knowledge_docs
create table if not exists knowledge_docs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  title text not null,
  kind text not null default 'text', -- url | text | file
  content text not null default '',
  source_url text,
  created_at timestamptz not null default now()
);
create index if not exists knowledge_docs_workspace_id_idx on knowledge_docs (workspace_id);

-- -------------------------------------------------------------- conversations
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  customer_name text not null,
  customer_email text,
  channel text not null default 'WhatsApp', -- WhatsApp | Website chat
  escalated boolean not null default false,
  taken_over boolean not null default false,
  last_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists conversations_workspace_id_idx on conversations (workspace_id);

-- Message history lives inside conversations as JSONB in this demo schema
-- (one row per thread, messages appended). Split to a messages table later
-- if threads grow large.
-- (No separate messages table in Sprint 2 by design.)

-- ---------------------------------------------------------------------- leads
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  name text not null,
  email text,
  source text not null default 'WhatsApp',
  status text not null default 'New', -- New | Contacted | Booked | Won | Lost
  value_usd numeric(10, 2) not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_workspace_id_idx on leads (workspace_id);
create index if not exists leads_status_idx on leads (status);

-- --------------------------------------------------------------- appointments
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  customer_name text not null,
  service_name text not null,
  appointment_date date not null,
  appointment_time text not null,
  amount_usd numeric(10, 2) not null default 0,
  status text not null default 'Confirmed', -- Confirmed | Pending | Completed | Cancelled
  created_at timestamptz not null default now()
);
create index if not exists appointments_workspace_id_idx on appointments (workspace_id);
create index if not exists appointments_date_idx on appointments (appointment_date);

-- -------------------------------------------------------------- subscriptions
-- Billing rows. `plan` mirrors lib/site.ts PLANS (Starter/Growth/Pro/Agency).
-- No payment provider is wired in Sprint 2; provider fields stay null until
-- the billing step. NEVER store card details here.
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  plan text not null default 'Starter',
  status text not null default 'trial', -- trial | active | past_due | cancelled
  replies_limit integer not null default 500,
  provider text, -- e.g. 'stripe' | 'gumroad' — null until billing lands
  provider_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists subscriptions_workspace_id_idx on subscriptions (workspace_id);

-- ----------------------------------------------------------------- usage_logs
-- One row per billable event (AI reply, booking, webhook). Used for plan-cap
-- enforcement and the admin usage bars.
create table if not exists usage_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  event_type text not null, -- ai_reply | booking_created | webhook_received | escalation | lead_captured
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists usage_logs_workspace_id_idx on usage_logs (workspace_id);
create index if not exists usage_logs_created_at_idx on usage_logs (created_at);

-- ------------------------------------------------------------------------ RLS
-- Enabled on every table now; policies are added in the auth phase
-- (per-workspace access bound to the workspace owner via Supabase Auth).
alter table workspaces enable row level security;
alter table services enable row level security;
alter table knowledge_docs enable row level security;
alter table conversations enable row level security;
alter table leads enable row level security;
alter table appointments enable row level security;
alter table subscriptions enable row level security;
alter table usage_logs enable row level security;
