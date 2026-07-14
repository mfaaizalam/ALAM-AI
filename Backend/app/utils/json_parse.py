# This file has only one responsibility:
# Convert Gemini's response into valid Python data.

import json
import re

def parse_json(text:str)->dict:
    text = re.sub(
        r"^```json|```$",
        "",
        text.strip(),
        flags=re.MULTILINE
     ).strip()

    return json.loads(text)