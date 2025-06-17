from dotenv import load_dotenv
import os
from mail import MailService
from langchain.chains import LLMChain
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
# import django.conf import settings

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
model = 'gemini-1.5-pro-latest'

mail = MailService("USER_ACCESS_TOKEN")

content = mail.fetch_unread_messages()

# print(content)
sender = content.get('sender', "")
subject = content.get('subject', "")
body = content.get('body', "")

llm = GoogleGenerativeAI(model=model, google_api_key=api_key, verbose=True)


prompt = """
Analyze this email and classify it into one of these departments:
- Support
- Sales
- HR
- Billing

Sender: {sender}
Subject: {subject}
Main Content: {body}

Provide only the department name as output.
"""

em_prompt = PromptTemplate(
            template=prompt, input_variables=["sender", 'subject', "body"]
        )

print(sender)
chain = LLMChain(prompt=em_prompt, llm=llm)

# result = chain.run({"sender": sender, 'subject': subject, "body": body})

try:
    result = chain.run({"sender": sender, 'subject': subject, "body": body})
    print(result)
except Exception as e:
    print(f"Error in LLMChain execution: {e}")

