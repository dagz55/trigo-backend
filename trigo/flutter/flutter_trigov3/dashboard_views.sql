-- View for current container status with timestamps
create or replace view public.vw_container_status as
select 
    cl.container_id,
    cl.status,
    cl.action,
    cl.timestamp,
    cl.created_at,
    row_number() over (partition by cl.container_id order by cl.timestamp desc) as rn
from public.container_logs cl;

-- View for daily container operations summary
create or replace view public.vw_daily_operations as
select 
    date_trunc('day', cl.timestamp) as day,
    cl.action,
    count(*) as operation_count
from public.container_logs cl
group by date_trunc('day', cl.timestamp), cl.action
order by day desc;

-- View for container health monitoring
create or replace view public.vw_container_health as
select 
    cl.container_id,
    cl.status,
    cl.timestamp,
    cl.action,
    row_number() over (partition by cl.container_id order by cl.timestamp desc) as rn
from public.container_logs cl
where cl.status in ('healthy', 'unhealthy', 'starting')
order by cl.timestamp desc;

-- View for container uptime analysis
create or replace view public.vw_container_uptime as
with status_changes as (
    select 
        container_id,
        status,
        timestamp,
        lag(timestamp) over (partition by container_id order by timestamp) as prev_timestamp,
        lag(status) over (partition by container_id order by timestamp) as prev_status
    from public.container_logs
)
select 
    container_id,
    status,
    timestamp,
    prev_timestamp,
    extract(epoch from (timestamp - prev_timestamp))/3600 as hours_in_status
from status_changes
where prev_timestamp is not null
order by timestamp desc; 