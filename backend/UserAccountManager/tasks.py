import imaplib

# def check_new_emails():
#     try:
#         # Connect to IMAP server
#         mail = imaplib.IMAP4_SSL(IMAP_SERVER)
#         mail.login(EMAIL, PASSWORD)

#         # Select the inbox
#         mail.select("inbox")

#         # Search for unread emails
#         status, messages = mail.search(None, "UNSEEN")  # Fetch unread emails

#         if status == "OK":
#             for num in messages[0].split():
#                 # Fetch email by ID
#                 status, msg_data = mail.fetch(num, "(RFC822)")
#                 for response_part in msg_data:
#                     if isinstance(response_part, tuple):
#                         # Parse email
#                         msg = email.message_from_bytes(response_part[1])
#                         subject, encoding = decode_header(msg["Subject"])[0]
#                         if isinstance(subject, bytes):
#                             subject = subject.decode(encoding or "utf-8")

#                         sender = msg.get("From")
#                         print(f"New Email from: {sender}, Subject: {subject}")

#         # Close connection
#         mail.logout()

#     except Exception as e:
#         print(f"Error checking emails: {e}")