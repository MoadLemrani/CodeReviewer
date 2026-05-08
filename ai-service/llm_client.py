from openai import OpenAI
import os
import json
from dotenv import load_dotenv
import logging

#logging config
logging.basicConfig(level = logging.ERROR)
logger = logging.getLogger(__name__)

load_dotenv()

#initialize the client with api key and base url (api endpoint)
client = OpenAI(
    api_key = os.getenv("GROQ_API_KEY"),
    base_url = "https://api.groq.com/openai/v1"
)

def get_review(prompt: str) -> dict:
    raw = None
    try:
        #the API request
        response = client.chat.completions.create(
            model = "llama-3.3-70b-versatile",
            messages = [
                {
                    "role" : "system",
                    "content": (
                        "You review code diffs and return structured findings.\n"
                        "- Flag security issues with severity: high.\n"
                        "- Never invent issues not present in the diff."
                    )
                },
                {
                    "role" : "user", #not client
                    "content" : prompt
                }
            ],
            response_format = {"type" : "json_object"}
        )

        #parse the output : deserialize JSON string
        raw = response.choices[0].message.content
        return json.loads(raw)
    except json.JSONDecodeError :
        logger.error("JSONDecodeError -> raw : %s", raw)
        return{
            "error" : True,
            "message" : "Something went wrong. Please try again."
        }
    except Exception as e :
        logger.error("Review service error : %s", str(e))
        return{
            "error" : True,
            "message" : "Something went wrong. Please try again."
        }




