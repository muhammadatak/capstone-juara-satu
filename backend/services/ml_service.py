import torch.nn.functional as F
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding,
    pipeline,
)
import torch

model = "D:/capstone-juara-satu/backend/services/model"
tokenizer = AutoTokenizer.from_pretrained(model)
model = AutoModelForSequenceClassification.from_pretrained(model)


def predict_text(data: str):
    inputs = tokenizer(data, return_tensors="pt", truncation=True, padding=True)

    inputs = {k: v.to(model.device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    probs = F.softmax(outputs.logits, dim=1)

    # probabilitas kelas phishing
    phishing_prob = probs[0][1].item()

    # ubah jadi integer 0-100
    risk_score = int(phishing_prob * 100)

    return risk_score
