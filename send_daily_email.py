import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import time
import schedule

def send_email():
    # Email configuration
    sender_email = "your_email@example.com"
    receiver_email = "recipient@example.com"
    password = "your_email_password"

    # Create message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email

    # Get current date and format it
    current_date = datetime.now().strftime("%Y-%m-%d")
    message["Subject"] = f"WFH {current_date}"

    # Email body
    body = """
    Hi Team,

    I will be working from home today.

    Thanks,
    [Your Name]
    """
    message.attach(MIMEText(body, "plain"))

    # Create SMTP session
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, password)
        server.send_message(message)

def job():
    current_date = datetime.now().date()
    start_date = datetime(2024, 7, 21).date()
    
    if current_date >= start_date:
        send_email()

# Schedule the job to run daily at 8:00 AM
schedule.every().day.at("08:00").do(job)

# Keep the script running
while True:
    schedule.run_pending()
    time.sleep(60)  # Wait for 60 seconds before checking again
