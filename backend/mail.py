from bs4 import BeautifulSoup
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import base64
import json
import re


class MailService():
    
    def __init__(self, access_token):
        self.access_token = access_token
        self.service = self._get_gmail_service()
    
    def get_credentials(self):
        return Credentials(token=self.access_token)

    def _get_gmail_service(self):
        cred = self.get_credentials()
        return build("gmail", "v1", credentials=cred)

    def fetch_unread_messages(self):
        try:
            results = self.service.users().messages().list(
                userId="me", labelIds=["INBOX"], q="is:unread", maxResults=1
            ).execute()

            messages = results.get("messages", [])

            if not messages:
                return {}
            
            for message in messages:
                msg_id = message["id"]
                email_info = self.get_email_info(message["id"])
                self.service.users().messages().modify(
                    userId="me", id=msg_id, body={"removeLabelIds": ["UNREAD"]}
                ).execute()

                # print(email_info)
            
                return email_info
        
        except Exception as error:
            raise ValueError(f"An error occurred while fetching emails: {error}")
        

    
    def get_email_info(self, msg_id):
        message = self.service.users().messages().get(
            userId="me", id=msg_id
        ).execute()

        payload = message.get("payload", {})
        headers = {header["name"].lower(): header["value"] for header in payload.get("headers", [])}
    
        return {
            "id": msg_id,
            "threadId": message.get("threadId"),
            "messageId": headers.get("message-id"),
            "references": headers.get("references", ""),
            "sender": headers.get("from", "Unknown"),
            "subject": headers.get("subject", "No Subject"),
            "body": self._get_email_body(payload),
        }

    
    def _get_email_body(self, payload):
        """
        Extract the email body, prioritizing text/plain over text/html.
        Handles multipart messages, avoids duplicating content, and strips HTML if necessary.
        """
        def decode_data(data):
            """Decode base64-encoded data."""
            return base64.urlsafe_b64decode(data).decode('utf-8').strip() if data else ""

        def extract_body(parts):
            """Recursively extract text content from parts."""
            for part in parts:
                mime_type = part.get('mimeType', '')
                data = part['body'].get('data', '')
                if mime_type == 'text/plain':
                    return decode_data(data)
                if mime_type == 'text/html':
                    html_content = decode_data(data)
                    return self._extract_main_content_from_html(html_content)
                if 'parts' in part:
                    result = extract_body(part['parts'])
                    if result:
                        return result
            return ""

        # Process single or multipart payload
        if 'parts' in payload:
            body = extract_body(payload['parts'])
        else:
            data = payload['body'].get('data', '')
            body = decode_data(data)
            if payload.get('mimeType') == 'text/html':
                body = self._extract_main_content_from_html(body)

        return self._clean_body_text(body)
    
    def _extract_main_content_from_html(self, html_content):
        """
        Extract main visible content from HTML.
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        for tag in soup(['script', 'style', 'head', 'meta', 'title']):
            tag.decompose()
        return soup.get_text(separator='\n', strip=True)

    def _clean_body_text(self, text):
        """
        Clean up the email body text by removing extra spaces and newlines.
        """
        return re.sub(r'\s+', ' ', text.replace('\r', '').replace('\n', '')).strip()


    def forward_department_email(self, email_id, forward_to):
        try:
            # Retrieve the email details using the given ID
            message = self.service.users().messages().get(userId="me", id=email_id, format="full").execute()

            # Extract email headers
            payload = message.get("payload", {})
            headers = payload.get("headers", [])

            # Get subject and sender
            subject = next((h["value"] for h in headers if h["name"] == "Subject"), "No Subject")
            sender = next((h["value"] for h in headers if h["name"] == "From"), "Unknown Sender")

            # Extract the body content (HTML preferred)
            body = ""
            if "parts" in payload:
                for part in payload["parts"]:
                    mime_type = part.get("mimeType")
                    body_data = part.get("body", {}).get("data", "")

                    # Prioritize HTML content
                    if mime_type == "text/html":
                        body = base64.urlsafe_b64decode(body_data).decode("utf-8")
                        break
                    elif mime_type == "text/plain":
                        body = base64.urlsafe_b64decode(body_data).decode("utf-8")

            if not body:
                body = "<p>No content available</p>"

            # Create a new MIME email with HTML formatting
            new_message = MIMEMultipart()
            new_message["to"] = forward_to
            new_message["from"] = "me"  # Authenticated user
            new_message["subject"] = f"FWD: {subject} (from {sender})"

            # Attach the HTML body
            new_message.attach(MIMEText(body, "html"))

            # Encode the email message
            encoded_message = base64.urlsafe_b64encode(new_message.as_bytes()).decode("utf-8")

            # Send the email via Gmail API
            send_result = self.service.users().messages().send(
                userId="me",
                body={"raw": encoded_message}
            ).execute()

            print(f"Email forwarded to {forward_to}: {send_result}")
            return send_result

        except Exception as error:
            print(f"An error occurred while forwarding the email: {error}")
            return {}



    














# def get_structured_email(service):
#     """Fetch one unread email and format it for AI processing."""

#     try:
#         # Get the first unread email
#         results = service.users().messages().list(userId="me", labelIds=["INBOX"], q="is:unread", maxResults=1).execute()
#         messages = results.get("messages", [])

#         if not messages:
#             print("No unread messages found.")
#             return None

#         msg_id = messages[0]["id"]
#         msg_details = service.users().messages().get(userId="me", id=msg_id).execute()
#         payload = msg_details.get("payload", {})
#         headers = payload.get("headers", [])

#         subject = sender = None
#         for header in headers:
#             if header["name"] == "Subject":
#                 subject = header["value"]
#             if header["name"] == "From":
#                 sender = header["value"]

#         # Decode email body
#         parts = payload.get("parts", [])
#         body = None
#         if parts:
#             for part in parts:
#                 if part.get("mimeType") == "text/plain":
#                     body = part["body"].get("data")
#                     if body:
#                         body = base64.urlsafe_b64decode(body).decode("utf-8")

#         # Format structured string for AI processing
#         structured_data = json.dumps({
#             "sender": sender,
#             "subject": subject,
#             "body": body if body else "No text content"
#         }, indent=4)

#         print("Structured Data for AI Processing:\n", structured_data)

#         # Mark email as read (optional)
#         service.users().messages().modify(userId="me", id=msg_id, body={"removeLabelIds": ["UNREAD"]}).execute()

#         return structured_data

#     except Exception as e:
#         print(f"Error: {e}")
#         return None

# def process_email_with_ai(email_data):
#     """Send structured email data to an AI model (Placeholder Function)."""
#     if email_data:
#         # Replace this with actual AI processing logic (e.g., API call)
#         print("Sending email to AI model for categorization...\n")
#         # Example AI response simulation
#         ai_response = {"category": "Work", "confidence": 0.95}
#         print(f"AI Categorization Result: {ai_response}")

# # Example usage: Fetch stored token from DB and process one email at a time
# # creds = Credentials(token=USER_ACCESS_TOKEN)
# # service = build("gmail", "v1", credentials=creds)

# # email_data = get_structured_email(service)
# # process_email_with_ai(email_data)
# mail = MailService(USER_ACCESS_TOKEN)
# email_info = mail.fetch_unread_messages()
# mail.forward_department_email(email_info['id'], "deathland2352@gmail.com")
# from ai_tools.main import AI
# from email_manager.models import Department
# from email_manager.serializer import EmailSerializer
# from dotenv import load_dotenv

# load_dotenv()

# mail = MailService(USER_ACCESS_TOKEN)
# message_content = mail.fetch_unread_messages()

# department_name = AI.get_departement(message_content)

# department = Department.objects.filter(name=department_name).first()
# message_content['forward_to'] = department
# serializer = EmailSerializer(data=message_content)
# serializer.save(raise_exception=True)



