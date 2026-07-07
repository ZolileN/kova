import os
import hashlib
from typing import Dict, Any

class OzowAdapter:
    def __init__(self):
        self.private_key = os.environ.get("OZOW_PRIVATE_KEY", "mock-ozow-key")
        self.site_code = os.environ.get("OZOW_SITE_CODE", "mock-site-code")

    def _generate_signature(self, values: Dict[str, Any]) -> str:
        """Ozow requires signing requests by concatenating sorted variables + private key and hashing with SHA512."""
        # Simple signature generation logic for Ozow integration
        concatenated = "".join(str(values[k]) for k in sorted(values.keys()))
        concatenated += self.private_key
        return hashlib.sha512(concatenated.encode('utf-8')).hexdigest()

    async def initiate_payment(
        self, 
        amount: float, 
        currency: str, 
        transaction_reference: str, 
        bank_reference: str,
        cancel_url: str,
        error_url: str,
        success_url: str
    ) -> Dict[str, Any]:
        """Generate payment redirection payload for Ozow Instant EFT."""
        payload = {
            "siteCode": self.site_code,
            "countryCode": "ZA",
            "currencyCode": currency,
            "amount": f"{amount:.2f}",
            "transactionReference": transaction_reference,
            "bankReference": bank_reference,
            "cancelUrl": cancel_url,
            "errorUrl": error_url,
            "successUrl": success_url,
            "isTest": True
        }
        
        # Add hash signature
        payload["hash"] = self._generate_signature(payload)
        
        if self.private_key == "mock-ozow-key":
            mock_id = f"ozow_{os.urandom(8).hex()}"
            return {
                "paymentUrl": f"https://pay.ozow.com/{mock_id}",
                "siteCode": self.site_code,
                "amount": amount,
                "status": "initiated",
                "hash": payload["hash"]
            }

        return {
            "paymentUrl": f"https://pay.ozow.com/?siteCode={self.site_code}&hash={payload['hash']}",
            "status": "initiated"
        }
