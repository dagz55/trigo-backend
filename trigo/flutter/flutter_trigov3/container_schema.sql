-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create the container_logs table
create table if not exists public.container_logs (
    id uuid default uuid_generate_v4() primary key,
    container_id text not null,
    status text not null,
    action text not null,
    timestamp timestamptz default now(),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create indexes for better query performance
create index idx_container_logs_timestamp 
    on public.container_logs (timestamp desc);

create index idx_container_logs_container_id 
    on public.container_logs (container_id);

-- Create a function to handle updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Create a trigger for updated_at
create trigger set_container_logs_updated_at
    before update on public.container_logs
    for each row
    execute function public.handle_updated_at();

-- Rename the trigger
ALTER TRIGGER set_container_logs_updated_at ON public.container_logs 
RENAME TO container_logs_update_timestamp;

-- Enable RLS (Row Level Security)
alter table public.container_logs enable row level security;

-- Create RLS policies
create policy "Enable read for authenticated users"
    on public.container_logs
    for select
    to authenticated
    using (true);

create policy "Enable insert for authenticated users"
    on public.container_logs
    for insert
    to authenticated
    with check (true);

-- Grant permissions
grant usage on schema public to authenticated;
grant all on public.container_logs to authenticated;

-- Add table comment
comment on table public.container_logs is 'Stores Docker container status and operation logs'; 