import os
import json
from typing import Dict, Any, Optional
from openai import AsyncOpenAI

class OpenAIAdapter:
    def __init__(self):
        # Fallback to mock key if not provided
        self.api_key = os.environ.get("OPENAI_API_KEY", "mock-key")
        self.client = AsyncOpenAI(api_key=self.api_key) if self.api_key != "mock-key" else None

    async def get_chat_response(self, system_prompt: str, user_message: str) -> str:
        """Call OpenAI chat completion API."""
        if not self.client:
            return f"[MOCK OPENAI REPLY] Under system prompt '{system_prompt[:30]}...', you asked: '{user_message}'"
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.3
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            return f"[Error connecting to OpenAI: {str(e)}]"

    async def extract_receipt_data(self, file_url: str) -> Dict[str, Any]:
        """OCR parsing pipeline using GPT-4o Vision or structured output."""
        if not self.client:
            # High-fidelity mock response
            return {
                "merchant": "Trattoria Sostanza",
                "amount": 84.50,
                "currency": "EUR",
                "tax": 7.68,
                "category": "food",
                "date": "2026-08-04",
                "description": "Team lunch in Florence"
            }

        try:
            # Vision call simulating parsing a receipt image
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert OCR receipt parser. Extract variables from the receipt image URL provided. "
                            "Return a JSON object containing: merchant, amount (float), currency (3-letter code), "
                            "tax (float), category (food, accommodation, transport, visa, other), date (YYYY-MM-DD), description."
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Please parse this receipt image link: {file_url}"
                    }
                ]
            )
            parsed_text = response.choices[0].message.content or "{}"
            return json.loads(parsed_text)
        except Exception as e:
            return {"error": f"Failed to parse receipt: {str(e)}"}
