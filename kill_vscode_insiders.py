import os
import signal
import subprocess

def kill_vscode_insiders():
    # Get the list of processes
    try:
        # Use 'pgrep' to find process IDs for VS Code Insiders
        pids = subprocess.check_output(["pgrep", "-f", "code-insiders"]).decode().split()
    except subprocess.CalledProcessError:
        print("No VS Code Insiders processes found.")
        return

    # Kill each process
    for pid in pids:
        try:
            pid = int(pid)
            os.kill(pid, signal.SIGKILL)
            print(f"Killed VS Code Insiders process with PID: {pid}")
        except ProcessLookupError:
            print(f"Process {pid} has already terminated.")
        except ValueError:
            print(f"Invalid PID: {pid}")

if __name__ == "__main__":
    kill_vscode_insiders()
