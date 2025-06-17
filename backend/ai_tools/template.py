from email_manager.models import Department

def generate_prompt():
    department_list = [dep.name for dep in Department.objects.all()]
    print(department_list)
    department_text = "\n- " + "\n- ".join(department_list)
    
    prompt = f"Analyze this email and classify it into one of these departments:{department_text}"

    prompt += """Sender: {sender}
    Subject: {subject}
    Main Content: {body}

    Provide only the department name as output.
    """
    return prompt