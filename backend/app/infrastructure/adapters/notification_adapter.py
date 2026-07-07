import os
from typing import Optional

class NotificationAdapter:
    def __init__(self):
        self.twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID", "mock-twilio-sid")
        self.twilio_auth = os.environ.get("TWILIO_AUTH_TOKEN", "mock-twilio-auth")
        self.email_key = os.environ.get("SENDGRID_API_KEY", "mock-sendgrid-key")

    async def send_sms(self, phone_number: str, message: str) -> bool:
        """Send travel updates/alerts via SMS (using Twilio or Mock)."""
        if self.twilio_sid == "mock-twilio-sid":
            print(f"[MOCK SMS TO {phone_number}]: {message}")
            return True

        try:
            from twilio.rest import Client
            client = Client(self.twilio_sid, self.twilio_auth)
            client.messages.create(
                body=message,
                to=phone_number,
                from_=os.environ.get("TWILIO_PHONE_NUMBER")
            )
            return True
        except Exception as e:
            print(f"Failed to send Twilio SMS: {str(e)}")
            return False

    async def send_email(self, email_address: str, subject: str, body: str) -> bool:
        """Send receipts and budget settlements via email."""
        if self.email_key == "mock-sendgrid-key":
            print(f"[MOCK EMAIL TO {email_address}]: Subject: {subject} | Body: {body[:50]}...")
            return True

        try:
            import sendgrid
            from sendgrid.helpers.mail import Mail, Email, To, Content
            sg = sendgrid.SendGridAPIClient(api_key=self.email_key)
            from_email = Email(os.environ.get("FROM_EMAIL", "alerts@kova.os"))
            to_email = To(email_address)
            content = Content("text/plain", body)
            mail = Mail(from_email, to_email, subject, content)
            sg.client.mail.send.post(request_body=mail.get())
            return True
        except Exception as e:
            print(f"Failed to send SendGrid email: {str(e)}")
            return False
