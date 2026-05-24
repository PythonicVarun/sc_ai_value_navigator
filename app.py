"""Supply Chain AI Value Navigator - FastAPI backend.

The Excel file `supply_chain_demo_mapping.xlsx` in the project folder is the source
of truth for demos, cases, problem statements and tags.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Optional

import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()


ROOT = Path(__file__).resolve().parent
EXCEL_PATH = Path(os.getenv("EXCEL_PATH", ROOT / "supply_chain_demo_mapping.xlsx"))
STATIC_DIR = ROOT / "static"

OPENAI_API_KEY = (os.getenv("OPENAI_API_KEY") or "").strip()
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").strip()
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.4-mini").strip() or "gpt-5.4-mini"

app = FastAPI(title="Supply Chain AI Value Navigator")


SUPPORTED_ARCHETYPES = [
    "3PL / logistics provider",
    "Parcel / last-mile carrier",
    "Freight forwarder / cargo operator",
    "CPG / bottler",
    "Manufacturer",
    "Pharma / MedTech manufacturer",
    "Distributor / wholesaler",
    "Retail / omnichannel operator",
    "Asset-heavy network operator",
    "Procurement-led enterprise",
    "Enterprise data / platform team",
]

UNIVERSAL_STEPS = [
    "Demand Sensing",
    "Demand & Supply Plan",
    "Inventory & Safety Stock",
    "Supplier Readiness",
    "Inbound Receipt & Quality",
    "Production Plan",
    "Line Execution",
    "Warehouse Receipt",
    "Inventory Visibility",
    "Allocate & Pick",
    "Load & Dispatch",
    "Route & Delivery Execution",
    "Customer Order & Promise",
    "Customer Service & Claims",
    "Pricing & Trade",
    "Revenue / Network Optimization",
    "Data Foundation",
]


SYSTEM_PROMPT = """You are an enterprise supply-chain consulting analyst.

You produce assumption-based company profiles for pre-sales workshops. Your output
must be a single JSON object that exactly follows the schema the user requests.

Be honest about uncertainty: pick a confidence between 0 and 1 that reflects how
well-known the company is to you. Use plausible defaults where data is thin; flag
those in the assumptions list and in missing_inputs_to_confirm.

Do not present revenue, headcount or operating model as verified facts.
"""


def _build_user_prompt(company_name: str) -> str:
    return f"""Profile the company: "{company_name}"

Return JSON with EXACTLY these keys:

{{
  "company_name": str,
  "inferred_industry": str,
  "archetype": one of {SUPPORTED_ARCHETYPES!r},
  "operating_model": str (short phrase),
  "region": str,
  "confidence": float 0..1,
  "summary": str (1-2 sentences),
  "relevant_value_chain_steps": list of step names drawn from {UNIVERSAL_STEPS!r},
  "likely_revenue_drivers": [
    {{"name": str, "exposure_pct": number 0..100, "ai_leverage_range": "X-Y%"}}
  ],
  "likely_cost_pools": [
    {{"name": str, "cost_pct": number 0..100, "ai_addressable_range": "X-Y%"}}
  ],
  "recommended_initiatives": list[str] (3 to 6 entries),
  "assumptions": list[str],
  "missing_inputs_to_confirm": list[str]
}}

Rules:
- archetype MUST be one of the supported values; if unsure, pick the closest.
- relevant_value_chain_steps must use the universal step names verbatim.
- 3 to 8 revenue drivers and 4 to 9 cost pools.
- Be specific to the company's likely operating model (e.g. bottler, parcel carrier).
- Only return the JSON object. No surrounding markdown.
"""


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/api/config")
def get_config() -> dict[str, Any]:
    return {
        "llm_available": bool(OPENAI_API_KEY),
        "model": OPENAI_MODEL if OPENAI_API_KEY else None,
        "excel_present": EXCEL_PATH.exists(),
        "excel_name": EXCEL_PATH.name,
        "supported_archetypes": SUPPORTED_ARCHETYPES,
        "universal_steps": UNIVERSAL_STEPS,
    }


@app.get("/api/mapping")
def get_mapping() -> dict[str, Any]:
    if not EXCEL_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail=(
                f"Demo mapping file not found. Please place "
                f"{EXCEL_PATH.name} in the app folder or set EXCEL_PATH in .env."
            ),
        )
    try:
        xl = pd.ExcelFile(EXCEL_PATH)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not open workbook: {e}")

    mapping_sheet = "Mapping" if "Mapping" in xl.sheet_names else xl.sheet_names[0]
    try:
        df = pd.read_excel(xl, mapping_sheet)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not read sheet: {e}")

    df = df.fillna("").astype(str)
    rows = df.to_dict(orient="records")

    roi: Optional[list[dict[str, Any]]] = None
    if "ROI Assumptions" in xl.sheet_names:
        try:
            roi_df = pd.read_excel(xl, "ROI Assumptions").fillna("")
            roi = roi_df.astype(str).to_dict(orient="records")
        except Exception:
            roi = None

    return {
        "rows": rows,
        "row_count": len(rows),
        "sheet": mapping_sheet,
        "roi_assumptions": roi,
        "source_file": EXCEL_PATH.name,
    }


class AnalyzeRequest(BaseModel):
    company_name: str


@app.post("/api/analyze")
def analyze_company(req: AnalyzeRequest) -> JSONResponse:
    name = (req.company_name or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Company name is required.")
    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=400,
            detail="OpenAI API key not configured. Running in manual mode.",
        )

    client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_prompt(name)},
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        raw = response.choices[0].message.content or "{}"
        data = json.loads(raw)
        return {"ok": True, "data": data, "model": OPENAI_MODEL}
    except json.JSONDecodeError as e:
        return JSONResponse(
            status_code=200,
            content={"ok": False, "error": f"LLM returned invalid JSON: {e}"},
        )
    except Exception as e:
        return JSONResponse(
            status_code=200,
            content={"ok": False, "error": f"LLM call failed: {e}"},
        )


# ---------------------------------------------------------------------------
# Static frontend
# ---------------------------------------------------------------------------

if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/favicon.ico")
def favicon() -> Response:
    return Response(status_code=204)


@app.get("/supply_chain_demo_mapping.xlsx")
def download_excel() -> FileResponse:
    if not EXCEL_PATH.exists():
        raise HTTPException(status_code=404, detail="Excel file not found.")
    return FileResponse(
        EXCEL_PATH,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=EXCEL_PATH.name,
    )


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="127.0.0.1", port=port, reload=False)
