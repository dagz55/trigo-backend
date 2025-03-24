-- Create container status view
create or replace view public.vw_container_status as
select 
    container_id,
    status,
    action,
    timestamp,
    created_at,
    row_number() over (partition by container_id order by timestamp desc) as rn
from public.container_logs;

-- Create container health view
create or replace view public.vw_container_health as
select 
    container_id,
    status,
    timestamp,
    action,
    row_number() over (partition by container_id order by timestamp desc) as rn
from public.container_logs
where status in ('healthy', 'unhealthy', 'starting')
order by timestamp desc; 