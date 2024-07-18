import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import time
import schedule
import pytz

# Set your timezone
TIMEZONE = pytz.timezone('Asia/Singapore')  # Change this to your desired timezone

# Work schedule
WORK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
SIGN_IN_TIME = "12:00"
SIGN_OUT_TIME = "21:00"

def send_email(subject, body):
    # Email configuration
    sender_email = "your_email@example.com"
    receiver_email = "recipient@example.com"
    password = "your_email_password"

    # Create message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    # Create SMTP session
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, password)
        server.send_message(message)

def sign_in():
    current_date = datetime.now(TIMEZONE).strftime("%Y-%m-%d")
    subject = f"WFH Status: Signed In - {current_date}"
    body = f"""
Dear Team,

This is to inform you that I have signed in for work from home at {SIGN_IN_TIME}.

Date: {current_date}
Status: Signed In
Time: {SIGN_IN_TIME}

Best regards,
[Your Name]
    """
    send_email(subject, body)

def sign_out():
    current_date = datetime.now(TIMEZONE).strftime("%Y-%m-%d")
    subject = f"WFH Status: Signed Out - {current_date}"
    body = f"""
Dear Team,

This is to inform you that I have signed out from work at {SIGN_OUT_TIME}.

Date: {current_date}
Status: Signed Out
Time: {SIGN_OUT_TIME}

Best regards,
[Your Name]
    """
    send_email(subject, body)

def job():
    current_datetime = datetime.now(TIMEZONE)
    current_day = current_datetime.strftime('%A')
    
    if current_day in WORK_DAYS:
        schedule.every().day.at(SIGN_IN_TIME).do(sign_in)
        schedule.every().day.at(SIGN_OUT_TIME).do(sign_out)

# Schedule the job to run daily
schedule.every().day.at("00:01").do(job)

# Run the job immediately when the script starts
job()

# Keep the script running
while True:
    schedule.run_pending()
    time.sleep(60)  # Wait for 60 seconds before checking again
