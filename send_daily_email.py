import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import time
import schedule
import pytz

# Set your timezone
TIMEZONE = pytz.timezone('Asia/Singapore')  # Change this to your desired timezone

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
    current_date = datetime.now(TIMEZONE).strftime("%Y-%m-%d")
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
    current_datetime = datetime.now(TIMEZONE)
    current_date = current_datetime.date()
    start_date = datetime(2024, 7, 21, tzinfo=TIMEZONE).date()
    scheduled_time = current_datetime.replace(hour=9, minute=30, second=0, microsecond=0)
    
    if current_date >= start_date:
        if current_datetime.time() < scheduled_time.time():
            send_email()
        schedule.every().day.at("09:30").do(send_email)

# Run the job immediately when the script starts
job()

# Keep the script running
while True:
    schedule.run_pending()
    time.sleep(60)  # Wait for 60 seconds before checking again
