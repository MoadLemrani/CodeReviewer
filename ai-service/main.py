from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from enum import Enum
from prompt_builder import build_review_prompt
from llm_client import get_review

app = FastAPI()

MAX_DIFF_CHARS = 6000

class Language(str, Enum):
    python = "python"
    java = "java"
    javascript = "javascript"
    typescript = "typescript"
    cpp = "cpp"
    go = "go"
    auto = "auto-detect"

class ReviewRequest(BaseModel):
    diff: str
    language: Language = Language.auto
    context: str = ""

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/review")
def review(request: ReviewRequest):
    diff = request.diff
    if len(diff) > MAX_DIFF_CHARS:
        diff = diff[:MAX_DIFF_CHARS] + "\n... (truncated for length)"

    prompt = build_review_prompt(diff, request.language, request.context)
    result = get_review(prompt)

    if result.get("error"):
        return JSONResponse(status_code=503, content=result)
    
    return result