from django.conf import settings
from langchain_google_genai import GoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from .template import generate_prompt

class AI():
    api_key = settings.GEMINI_API_KEY
    model = 'gemini-1.5-pro-latest'
    llm = GoogleGenerativeAI(model=model, google_api_key=api_key, verbose=True)

    @classmethod
    def get_departement(cls, email_content):
        prompt = generate_prompt()
        em_prompt = PromptTemplate(
            template=prompt, input_variables=["sender", 'subject', "body"]
        )
        query = {"sender": email_content.get('sender', ""), 
         'subject': email_content.get('subject', ""), 
         "body": email_content.get('body', "")}
        
        departement =  cls.run(query, em_prompt)

        return departement


    @classmethod   
    def run(cls, query, prompt):
        chain = LLMChain(prompt=prompt, llm=cls.llm)

        try:
            result = chain.run(query)
            return result
        except Exception as e:
            print(f"Error in LLMChain execution: {e}")
