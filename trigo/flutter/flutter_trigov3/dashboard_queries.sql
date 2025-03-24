-- Panel 1: Current Container Status
select 
    container_id,
    status,
    action,
    timestamp,
    created_at
from public.vw_container_status
where rn = 1
order by timestamp desc;

-- Panel 2: Container Health Overview
select 
    container_id,
    status,
    timestamp,
    action
from public.vw_container_health
where rn = 1
order by timestamp desc;

-- Panel 3: Operations by Day (Last 7 Days)
select 
    day,
    action,
    operation_count
from public.vw_daily_operations
where day >= current_date - interval '7 days'
order by day desc, action;

-- Panel 4: Container Uptime (Last 24 Hours)
select 
    container_id,
    round(sum(hours_in_status)::numeric, 2) as uptime_hours
from public.vw_container_uptime
where timestamp >= current_timestamp - interval '24 hours'
group by container_id
order by uptime_hours desc;

-- Panel 5: Recent Actions
select 
    container_id,
    action,
    status,
    timestamp
from public.container_logs
order by timestamp desc
limit 10;

-- Panel 6: Health Status Distribution
select 
    status,
    count(*) as count
from public.vw_container_health
where rn = 1
group by status
order by count desc; 