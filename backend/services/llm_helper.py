import json
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("API KEY IS MISSING")

client = Groq(api_key=GROQ_API_KEY)


def explain_with_groq(prompt: str):
    try:
        resp = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.2,
            max_tokens=400,
        )

        return resp.choices[0].message.content

    except Exception as e:
        print("[LLM] Groq call failed:", e)
        return None


def make_llm_explanation(summary: dict) -> str:
    prompt = f"""
Kamu adalah CyberGuardian, asisten cybersecurity untuk analisis tiket.

TUGAS:
Jelaskan hasil deteksi pesan tiket ini dan whitelist secara singkat, jelas, dan human-friendly.

ATURAN:
- Jangan mengarang informasi
- Jangan membuat URL atau identitas palsu
- Risk score selalu 0–100 (0 aman, 100 berbahaya)
- Jika whitelist null = "user tidak mengisi"
- Gunakan hanya data input

INPUT:
{json.dumps(summary, indent=2)}

FORMAT OUTPUT (WAJIB):
- Tulis tepat 3 baris, masing-masing diawali label berikut:
  1) Risk Score:
  2) Whitelist:
  3) Saran:
- Maksimal 3 kalimat per baris
- Satu baris = satu topik

GAYA:
- Singkat, langsung
- Tanpa intro/penutup
"""
    out = explain_with_groq(prompt)
    if out:
        return out.strip()
