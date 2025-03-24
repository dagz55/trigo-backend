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

-- Create indexes
create index if not exists idx_container_logs_timestamp 
    on public.container_logs (timestamp desc);

create index if not exists idx_container_logs_container_id 
    on public.container_logs (container_id); 