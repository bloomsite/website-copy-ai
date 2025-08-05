import os
import time
from typing import Dict

from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

from dotenv import load_dotenv

load_dotenv()
PROJECT_ENDPOINT = os.getenv("PROJECT_ENDPOINT")
AGENT_ID = os.getenv("AGENT_ID")

class AgentError(RuntimeError):
    pass

def _ensure_client() -> AIProjectClient:
    if not PROJECT_ENDPOINT or not AGENT_ID:
        raise AgentError("PROJECT_ENDPOINT and AGENT_ID must be set in environment.")
    return AIProjectClient(endpoint=PROJECT_ENDPOINT, credential=DefaultAzureCredential())

def generate_content_with_agent(payload: Dict, timeout_sec: int = 60) -> str:
    """
    payload: { tone, audience, goal, description, pageType }
    returns: assistant text content
    """
    page = payload.get('pageType')
    goal = payload.get('goal')
    audience = payload.get('audience')
    tone = payload.get('tone')
    description = payload.get('description')

    client = _ensure_client()
    with client:
        # Create a new thread for the request
        thread = client.agents.threads.create()

        # Prepare prompt for agent
        user_prompt = (
            f"Write a text for the {page} page. With the goal to {goal} the audience which mainly consists of {audience} use the following tone {tone} here is the description of the text: {description}"
        )

        # Add user message to thread 
        client.agents.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_prompt,
        )

        # Start the run with the agent 
        run = client.agents.runs.create(
            thread_id=thread.id,
            agent_id=AGENT_ID
        )

        # 5. Poll timing until completion
        start_time = time.time()
        while True:
            run = client.agents.runs.get(thread_id=thread.id, run_id=run.id)
            if run.status in ("completed", "failed", "cancelled"):
                break
            if time.time() - start_time > timeout_sec:
                raise AgentError("Agent run timed out.")
            time.sleep(1)

        if run.status != "completed":
            raise AgentError(f"Run did not complete successfully: {run.status}")

        # 6. Retrieve response (last message in the thread by the agent)
        msgs = list(client.agents.messages.list(thread_id=thread.id))
        assistant_msgs = [m for m in msgs if m.role == "assistant"]
        content_text = assistant_msgs[-1].content[0].text.value if assistant_msgs else ""

        if not content_text:
            raise AgentError("No content returned by agent.")
        return content_text
