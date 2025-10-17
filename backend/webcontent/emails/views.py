from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def set_password_email(context: dict, user_email):
    try:
        subject = "Stel jouw bloomsite wachtwoord in!"


        html_message = render_to_string("content/set-password-email.html", context=context)
        plain_message = strip_tags(html_message)

        message = EmailMultiAlternatives(
            subject=subject, 
            body=plain_message,
            from_email=None,
            to=[user_email],
        )

        message.attach_alternative(html_message, "text/html")
        message.send()

        return True 
    except Exception as e: 
        print(e)
        return False

