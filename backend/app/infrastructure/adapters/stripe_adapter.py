import os
from typing import Dict, Any, Optional

class StripeAdapter:
    def __init__(self):
        self.secret_key = os.environ.get("STRIPE_SECRET_KEY", "mock-stripe-key")
        # In a real app: import stripe; stripe.api_key = self.secret_key

    async def create_checkout_session(
        self, 
        amount: float, 
        currency: str, 
        success_url: str, 
        cancel_url: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a Stripe checkout session for contribution payment."""
        if self.secret_key == "mock-stripe-key":
            # Generate high-fidelity mock session
            mock_session_id = f"cs_test_{os.urandom(8).hex()}"
            return {
                "id": mock_session_id,
                "url": f"https://checkout.stripe.com/pay/{mock_session_id}",
                "status": "success"
            }
        
        # Real integration code (wrapped in exception handler)
        try:
            import stripe
            stripe.api_key = self.secret_key
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': currency,
                        'product_data': {
                            'name': f"Journey Contribution: {metadata.get('journey_title', 'Trip')}",
                        },
                        'unit_amount': int(amount * 100),
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata
            )
            return {"id": session.id, "url": session.url, "status": "success"}
        except Exception as e:
            return {"error": str(e), "status": "failed"}

    def construct_event(self, payload: bytes, sig_header: str, webhook_secret: str) -> Optional[Dict[str, Any]]:
        """Verify webhook signature and construct Stripe event."""
        if self.secret_key == "mock-stripe-key":
            # Parse mock payload
            import json
            try:
                event_data = json.loads(payload.decode('utf-8'))
                return event_data
            except Exception:
                return None
        
        try:
            import stripe
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
            return event
        except Exception:
            return None
