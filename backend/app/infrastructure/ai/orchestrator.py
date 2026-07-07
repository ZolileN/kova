import json
from typing import Dict, Any, Optional
from langgraph.graph import StateGraph, END
from app.infrastructure.ai.state import GraphState
from app.infrastructure.adapters.openai_adapter import OpenAIAdapter

class AIOrchestrator:
    def __init__(self):
        self.openai = OpenAIAdapter()
        self._build_workflow()

    async def orchestrator_node(self, state: GraphState) -> Dict[str, Any]:
        """Routes user intent to specific specialized agents."""
        user_message = state.messages[-1]["content"] if state.messages else ""
        
        system_prompt = (
            "You are the central orchestrator of Kova travel assistant. "
            "Examine the user message and categorize their intent into one of these active agents:\n"
            "- planner (timeline, destinations, itinerary creation)\n"
            "- ledger (expenses, ledger balances, splits, contributions)\n"
            "- visa (visa rules, passports, document validation)\n"
            "- policy (corporate compliance validation)\n"
            "Return a JSON string: {\"agent\": \"planner|ledger|visa|policy\"}."
        )
        
        # Call model to route query
        decision_raw = await self.openai.get_chat_response(system_prompt, user_message)
        
        # Clean response for JSON parsing
        try:
            if "```json" in decision_raw:
                decision_raw = decision_raw.split("```json")[1].split("```")[0].strip()
            decision = json.loads(decision_raw)
            agent = decision.get("agent", "planner")
        except Exception:
            agent = "planner"  # Default fallback
            
        return {
            "active_agent": agent,
            "next_step": agent
        }

    async def planner_agent_node(self, state: GraphState) -> Dict[str, Any]:
        """Handles journey itineraries, locations, dates, and drafts travel plans."""
        user_message = state.messages[-1]["content"] if state.messages else ""
        system_prompt = (
            "You are Kova's Travel Planner Agent. Your job is to draft and refine journey timelines. "
            "Suggest destinations, flights, hotels, and custom travel activities in a structured manner."
        )
        response = await self.openai.get_chat_response(system_prompt, user_message)
        
        # Return updated messages
        new_messages = list(state.messages)
        new_messages.append({"role": "assistant", "content": response})
        return {
            "messages": new_messages,
            "next_step": "end"
        }

    async def ledger_agent_node(self, state: GraphState) -> Dict[str, Any]:
        """Manages expenses, transaction inputs, contributions, ledger totals, and split suggestions."""
        user_message = state.messages[-1]["content"] if state.messages else ""
        system_prompt = (
            "You are Kova's Ledger Agent. Your job is to calculate splits, record expenses, "
            "advise on payments, and summarize balances in the journey ledger."
        )
        response = await self.openai.get_chat_response(system_prompt, user_message)
        
        new_messages = list(state.messages)
        new_messages.append({"role": "assistant", "content": response})
        return {
            "messages": new_messages,
            "next_step": "end"
        }

    async def visa_agent_node(self, state: GraphState) -> Dict[str, Any]:
        """Audits travel schedules against member passport details and alerts on visa needs."""
        user_message = state.messages[-1]["content"] if state.messages else ""
        system_prompt = (
            "You are Kova's Visa Agent. Check travel documents and passport requirements "
            "against destinations, advising on entry rules and visas."
        )
        response = await self.openai.get_chat_response(system_prompt, user_message)
        
        new_messages = list(state.messages)
        new_messages.append({"role": "assistant", "content": response})
        return {
            "messages": new_messages,
            "next_step": "end"
        }

    async def policy_agent_node(self, state: GraphState) -> Dict[str, Any]:
        """Audits journey costs and details against corporate travel limits and parameters."""
        user_message = state.messages[-1]["content"] if state.messages else ""
        system_prompt = (
            "You are Kova's Corporate Policy Agent. Review travel plans against company travel policies "
            "(spending caps, transport class constraints) and recommend approval changes."
        )
        response = await self.openai.get_chat_response(system_prompt, user_message)
        
        new_messages = list(state.messages)
        new_messages.append({"role": "assistant", "content": response})
        return {
            "messages": new_messages,
            "next_step": "end"
        }

    def _should_route(self, state: GraphState) -> str:
        """Determines the routing key based on active agent selection."""
        return state.next_step or "end"

    def _build_workflow(self):
        """Construct the StateGraph workflows."""
        workflow = StateGraph(GraphState)
        
        # Add nodes
        workflow.add_node("orchestrator", self.orchestrator_node)
        workflow.add_node("planner", self.planner_agent_node)
        workflow.add_node("ledger", self.ledger_agent_node)
        workflow.add_node("visa", self.visa_agent_node)
        workflow.add_node("policy", self.policy_agent_node)
        
        # Set Entrypoint
        workflow.set_entry_point("orchestrator")
        
        # Configure routing edges
        workflow.add_conditional_edges(
            "orchestrator",
            self._should_route,
            {
                "planner": "planner",
                "ledger": "ledger",
                "visa": "visa",
                "policy": "policy",
                "end": END
            }
        )
        
        # Connect sub-agents back to End
        workflow.add_edge("planner", END)
        workflow.add_edge("ledger", END)
        workflow.add_edge("visa", END)
        workflow.add_edge("policy", END)
        
        # Compile graph
        self.app = workflow.compile()

    async def process_query(self, user_id: str, message: str, journey_id: Optional[str] = None) -> str:
        """Execute the LangGraph orchestrator loop for a user query."""
        initial_state = GraphState(
            messages=[{"role": "user", "content": message}],
            user_id=user_id,
            journey_id=journey_id
        )
        
        # Run graph execution
        final_state = await self.app.ainvoke(initial_state)
        
        # Extract last assistant message
        if final_state and "messages" in final_state:
            messages = final_state["messages"]
            if messages and messages[-1]["role"] == "assistant":
                return messages[-1]["content"]
        
        return "I apologize, but I could not formulate a travel plan response."
