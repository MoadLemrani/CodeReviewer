def build_review_prompt(diff: str, language: str, context: str = "") -> str:
    context_block = f"Context: {context}\n" if context else ""
    lang_instruction = (
        f"The language is {language}."
        if language != "auto-detect"
        else "Identify the programming language first, then analyze."
    )

    return f"""{context_block}{lang_instruction}
Analyze this code diff and return a JSON object with:
- "summary": high-level overview
- "bugs": list of {{"line": "line or range", "description": "what", "severity": "hugh|medium|low", "fix": "suggestion"}}
- "security": list of {{"line": "line or range", "desription": "vulnerability", "severity": "high|medium|low"}}
- "style": list of {{"line": "line or range", "description": "issue"}}
- "suggestions": list of {{"description": "improvement"}}

Diff:
{diff}"""