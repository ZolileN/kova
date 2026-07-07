import os
from typing import Dict, Any, Optional

class YocoAdapter:
    def __init__(self):
        self.secret_key = os.environ.get("YOCO_SECRET_KEY", "mock-yoco-key")

    async def create_payment_charge(
        self, 
        amount: float, 
        currency: str, 
        token: str, 
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Initiate payment charge via Yoco API."""
        if self.secret_key == "mock-yoco-key":
            return {
                "id": f"yoco_chg_{os.urandom(8).hex()}",
                "amount": amount,
                "currency": currency,
                "status": "successful",
                "metadata": metadata
            }

        try:
            import requests
            url = "https://online.yoco.co/v1/charges"
            headers = {
                "X-Auth-Secret-Key": self.secret_key,
                "Content-Type": "application/json"
            }
            payload = {
                "token": token,
                "amountInCents": int(amount * 100),
                "currency": currency,
                "metadata": metadata
            }
            response = requests.post(url, json=payload, headers=headers)
            if response.status_code == 201:
                return response.json()
            return {"error": response.text, "status": "failed"}
        except Exception as e:
            return {"error": str(e), "status": "failed"}
