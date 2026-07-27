import os
import re
import threading
from fastapi import FastAPI
from pydantic import BaseModel
from llama_cpp import Llama

app = FastAPI()

_lockExplain = threading.Lock()
_llmExplain = None

EXPLAIN_MODEL_PATH = "./models/qwen2.5-1.5b-instruct-q4_k_m.gguf"

def _loadExplain():
    global _llmExplain
    if _llmExplain is None:
        with _lockExplain:
            if _llmExplain is None:
                _llmExplain = Llama(
                    model_path=EXPLAIN_MODEL_PATH,
                    n_ctx=2048,
                    n_threads=os.cpu_count(),
                    verbose=False,
                )
    return _llmExplain

def _clean_explanation(text: str) -> str:
    markers = ["Task:", "Rules:", "Journal Entry:", "Detected mood", "Is mood mixed:"]
    for marker in markers:
        idx = text.find(marker)
        if idx != -1:
            text = text[:idx]
    return text.strip()

def trim_explanation(text: str) -> str:
    text = text.strip()
    if text.endswith((".", "!", "?")):
        return text
    matches = list(re.finditer(r'[^.!?]+[.!?]', text))
    if matches:
        return text[:matches[-1].end()].strip()
    return text

class ExplainRequest(BaseModel):
    text: str
    mood_label: str
    mood_score: float
    is_mixed: bool

class ExplainResponse(BaseModel):
    explanation: str

@app.post("/explain", response_model=ExplainResponse)
def explain(req: ExplainRequest):
    word_count = len(req.text.split())
    if word_count < 10:
        return ExplainResponse(explanation=(
            f"Your entry is short, but it carries a tone that leans towards {req.mood_label}. "
            "Consider writing more next time for a deeper mood insight!"
        ))

    llm = _loadExplain()

    messages = [
        {
            "role": "system",
            "content": (
                "You explain the output of a mood classifier. The classifier has already selected the mood.\n"
                "Never disagree with the classifier. Do not evaluate whether the classifier is correct.\n"
                "Your only task is to explain which words or events in the journal support the detected mood."
            )
        },
        {
            "role": "user",
            "content": (
                f"Journal Entry:\n{req.text}\n\n"
                f"Detected mood:\n{req.mood_label}\n\n"
                "Task:\n"
                "Explain what parts of the journal support this detected mood. Your only task is to explain which words or events in the journal support the detected mood.\n"
                "Rules:\n"
                "- Write exactly two sentences.\n"
                "- Only use information written in the journal.\n"
                "- Do not use bullet points.\n"
                "- Do not use numbered lists.\n"
                "- Do not write headings.\n"
                "- End after the second sentence.\n"
                "- End with a period.\n"
                "- Refer to the author as 'you'\n"
                "- Ensure the grammar is proper."
            )
        }
    ]

    output = llm.create_chat_completion(
        messages=messages,
        max_tokens=100,
        temperature=0.4,
        top_p=0.9,
        repeat_penalty=1.3,
        stop=["\nTask:", "\nRules:", "\nJournal Entry:", "\nDetected mood"],
    )

    raw_text = output["choices"][0]["message"]["content"]
    cleaned = _clean_explanation(raw_text)
    return ExplainResponse(explanation=trim_explanation(cleaned))

@app.get("/health")
def health():
    return {"status": "ok"}