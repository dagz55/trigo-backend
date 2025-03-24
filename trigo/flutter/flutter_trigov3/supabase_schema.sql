-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create the container_logs table
create table if not exists public.container_logs (
    id uuid default uuid_generate_v4() primary key,
    container_id text not null,
    status text not null,
    action text not null,
    timestamp timestamptz default now(),
    created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.container_logs enable row level security;

-- Create policies for authentication
create policy "Enable read access for authenticated users"
    on public.container_logs
    for select
    to authenticated
    using (true);

create policy "Enable insert access for authenticated users"
    on public.container_logs
    for insert
    to authenticated
    with check (true);

-- Create indexes
create index if not exists idx_container_logs_timestamp 
    on public.container_logs using btree (timestamp desc);

create index if not exists idx_container_logs_container_id 
    on public.container_logs using btree (container_id); 