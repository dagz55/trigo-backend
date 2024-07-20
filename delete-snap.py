import boto3
import botocore
import sys

def validate_snapshot(snapshot_id):
    ec2 = boto3.client('ec2')
    try:
        response = ec2.describe_snapshots(SnapshotIds=[snapshot_id])
        if response['Snapshots']:
            snapshot = response['Snapshots'][0]
            state = snapshot['State']
            if state == 'completed':
                return True
            else:
                print(f"Snapshot {snapshot_id} is in {state} state. Skipping deletion.")
                return False
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == 'InvalidSnapshot.NotFound':
            print(f"Snapshot {snapshot_id} not found. Skipping deletion.")
        else:
            print(f"Error validating snapshot {snapshot_id}: {e}")
        return False

def delete_snapshot(snapshot_id):
    ec2 = boto3.client('ec2')
    try:
        ec2.delete_snapshot(SnapshotId=snapshot_id)
        print(f"Successfully deleted snapshot {snapshot_id}")
    except botocore.exceptions.ClientError as e:
        print(f"Error deleting snapshot {snapshot_id}: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python delete-snap.py <snapshot_id1> <snapshot_id2> ...")
        sys.exit(1)

    for snapshot_id in sys.argv[1:]:
        if validate_snapshot(snapshot_id):
            delete_snapshot(snapshot_id)

if __name__ == "__main__":
    main()
