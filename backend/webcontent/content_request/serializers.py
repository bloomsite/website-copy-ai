# yourapp/serializers.py
import re
from django.utils.html import strip_tags
from rest_framework import serializers

class GenerateContentSerializer(serializers.Serializer):
    TONE_CHOICES = [
        ("professional", "professional"),
        ("friendly", "friendly"),
        ("persuasive", "persuasive"),
        ("informative", "informative"),
        ("casual", "casual"),
    ]
    GOAL_CHOICES = [
        ("increase-sales", "increase-sales"),
        ("build-awareness", "build-awareness"),
        ("educate-audience", "educate-audience"),
        ("promote-event", "promote-event"),
        ("generate-leads", "generate-leads"),
    ]
    PAGE_CHOICES = [
        ("home", "home"),
        ("about", "about"),
        ("product", "product"),
        ("offer", "offer"),
    ]

    # If you’ll fetch these from the backend later, switch to CharField and validate against your DB list.
    tone = serializers.ChoiceField(choices=TONE_CHOICES)
    audience = serializers.CharField(allow_blank=False, max_length=100)  # e.g., "jongeren"
    goal = serializers.ChoiceField(choices=GOAL_CHOICES)
    description = serializers.CharField(allow_blank=False, trim_whitespace=True)
    pageType = serializers.ChoiceField(choices=PAGE_CHOICES)

    MIN_WORDS = 15

    def validate_description(self, value: str) -> str:
        # Strip HTML, collapse whitespace, enforce wordcount
        text = strip_tags(value or "")
        text = re.sub(r"\s+", " ", text).strip()
        word_count = len(re.findall(r"\b\w+\b", text))
        if word_count < self.MIN_WORDS:
            raise serializers.ValidationError(
                f"Please provide at least {self.MIN_WORDS} words (currently {word_count})."
            )
        return text
