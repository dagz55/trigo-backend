import logging
import os
from datetime import datetime

import docker
from dotenv import load_dotenv
from fpdf import FPDF
from supabase import Client, create_client

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in .env file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configure logging
logging.basicConfig(filename='docker_manager.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize Docker client
docker_client = docker.from_env()

# Function to log container status to Supabase
def log_to_supabase(container_id: str, status: str, action: str):
    try:
        data = {
            "container_id": container_id,
            "status": status,
            "action": action,
            "timestamp": datetime.utcnow().isoformat()
        }
        supabase.table('container_logs').insert(data).execute()
        logging.info(f'Logged to Supabase: {data}')
    except Exception as e:
        logging.error(f'Error logging to Supabase: {e}')

# PDF Report class
class PDFReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Daily Docker Status Report', 0, 1, 'C')

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def add_container_status(self, container_id, status):
        self.set_font('Arial', '', 12)
        self.cell(0, 10, f'Container {container_id}: {status}', 0, 1)

# Function to start containers
def start_containers():
    try:
        for container in docker_client.containers.list(all=True):
            container.start()
            log_to_supabase(container.id, container.status, "start")
            logging.info(f'Started container {container.id}')
    except Exception as e:
        logging.error(f'Error starting containers: {e}')

# Function to stop containers
def stop_containers():
    try:
        for container in docker_client.containers.list():
            container.stop()
            log_to_supabase(container.id, "stopped", "stop")
            logging.info(f'Stopped container {container.id}')
    except Exception as e:
        logging.error(f'Error stopping containers: {e}')

# Function to restart containers
def restart_containers():
    try:
        for container in docker_client.containers.list():
            container.restart()
            log_to_supabase(container.id, "restarted", "restart")
            logging.info(f'Restarted container {container.id}')
    except Exception as e:
        logging.error(f'Error restarting containers: {e}')

# Function to generate daily PDF report
def generate_pdf_report():
    pdf = PDFReport()
    pdf.add_page()
    
    try:
        # Get container logs from Supabase for the report
        response = supabase.table('container_logs').select("*").order('timestamp', desc=True).limit(50).execute()
        if response.data:
            for log in response.data:
                status_text = f"{log['container_id']}: {log['status']} ({log['action']}) at {log['timestamp']}"
                pdf.add_container_status(log['container_id'], status_text)
    except Exception as e:
        logging.error(f'Error getting logs from Supabase: {e}')
        # Fallback to current container status
        for container in docker_client.containers.list(all=True):
            pdf.add_container_status(container.id, container.status)
    
    report_name = f'docker_status_{datetime.now().strftime("%Y%m%d")}.pdf'
    pdf.output(report_name)
    logging.info(f'Generated PDF report: {report_name}')

# Main function
def main():
    action = input("Enter action (start/stop/restart): ").strip().lower()
    if action == 'start':
        start_containers()
    elif action == 'stop':
        stop_containers()
    elif action == 'restart':
        restart_containers()
    else:
        logging.error('Invalid action')
        print('Invalid action. Please enter start, stop, or restart.')
    generate_pdf_report()

if __name__ == '__main__':
    main() 