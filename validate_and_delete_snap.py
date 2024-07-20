import boto3
import sys
import re
from botocore.exceptions import ClientError

def validate_snapshot(snapshot_id):
    ec2 = boto3.client('ec2')
    try:
        response = ec2.describe_snapshots(SnapshotIds=[snapshot_id])
        if response['Snapshots']:
            snapshot = response['Snapshots'][0]
            state = snapshot['State']
            start_time = snapshot['StartTime']
            volume_id = snapshot.get('VolumeId', 'N/A')
            volume_size = snapshot.get('VolumeSize', 'N/A')
            
            print(f"Snapshot ID: {snapshot_id}")
            print(f"State: {state}")
            print(f"Start Time: {start_time}")
            print(f"Volume ID: {volume_id}")
            print(f"Volume Size: {volume_size} GiB")
            
            return True
    except ClientError as e:
        if e.response['Error']['Code'] == 'InvalidSnapshot.NotFound':
            print(f"Snapshot {snapshot_id} not found.")
        else:
            print(f"Error validating snapshot {snapshot_id}: {e}")
    return False

def delete_snapshot(snapshot_id):
    ec2 = boto3.client('ec2')
    try:
        ec2.delete_snapshot(SnapshotId=snapshot_id)
        print(f"Successfully deleted snapshot {snapshot_id}")
        return True
    except ClientError as e:
        print(f"Error deleting snapshot {snapshot_id}: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_and_delete_snap.py <snapshot_id1> <snapshot_id2> ...")
        sys.exit(1)

    snapshot_ids = sys.argv[1:]
    for snapshot_id in snapshot_ids:
        if not re.match(r'^snap-[0-9a-f]{17}$', snapshot_id):
            print(f"Invalid snapshot ID format: {snapshot_id}")
            continue

        if validate_snapshot(snapshot_id):
            delete_snapshot(snapshot_id)
        else:
            print(f"Skipping deletion of invalid snapshot: {snapshot_id}")

if __name__ == "__main__":
    main()
