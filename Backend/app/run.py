from google import genai
from app.core.config import setting

client = genai.Client(api_key=setting.GEMINI_API_KEY)

try:
    models = list(client.models.list())
    print(f"Found {len(models)} models:\n")

    for model in models:
        print(model.name)

except Exception as e:
    print(type(e).__name__)
    print(e)