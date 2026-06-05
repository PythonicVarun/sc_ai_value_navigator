"""Supply Chain AI Value Navigator - FastAPI backend.

The Excel file `supply_chain_demo_mapping.xlsx` in the project folder is the source
of truth for demos, cases, problem statements and tags.
"""

from __future__ import annotations

import gc
import io
import json
import os
import secrets
import time
from pathlib import Path
from typing import Any, Optional

import pandas as pd
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials
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

ADMIN_PATH = (os.getenv("ADMIN_PATH") or "").strip()
ADMIN_USERNAME = (os.getenv("ADMIN_USERNAME") or "").strip()
ADMIN_PASSWORD = (os.getenv("ADMIN_PASSWORD") or "").strip()
ADMIN_ENABLED = bool(ADMIN_PATH and ADMIN_USERNAME and ADMIN_PASSWORD)

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
    "Plan & Simulate",
    "Source & Procure",
    "Make & Package",
    "Store & Fulfill",
    "Deliver & Transport",
    "Trade, Compliance & Documents",
    "Control Tower & Governance",
]

SUPPORTED_INDUSTRIES = [
    "Healthcare & Life Sciences",
    "Consumer packaged goods / beverages",
    "Retail",
    "Logistics / Supply Chain",
    "Manufacturing",
    "Automotive",
    "Technology",
    "Energy / Utilities",
    "Other",
]

SUPPORTED_OBJECTIVES = [
    "Cost to serve reduction",
    "Service level improvement",
    "Working capital reduction",
    "Yield improvement",
    "Revenue growth",
    "Compliance / leakage reduction",
    "Data modernization",
    "Sustainability / carbon reduction",
]


ARCHETYPE_STAGE_MAPPING = {
    "3PL / logistics provider": [
        "Plan & Simulate",
        "Store & Fulfill",
        "Deliver & Transport",
        "Control Tower & Governance",
    ],
    "Parcel / last-mile carrier": [
        "Plan & Simulate",
        "Store & Fulfill",
        "Deliver & Transport",
        "Control Tower & Governance",
    ],
    "Freight forwarder / cargo operator": [
        "Plan & Simulate",
        "Deliver & Transport",
        "Trade, Compliance & Documents",
        "Control Tower & Governance",
    ],
    "CPG / bottler": [
        "Plan & Simulate",
        "Source & Procure",
        "Make & Package",
        "Store & Fulfill",
        "Deliver & Transport",
        "Control Tower & Governance",
    ],
    "Manufacturer": [
        "Plan & Simulate",
        "Source & Procure",
        "Make & Package",
        "Store & Fulfill",
        "Deliver & Transport",
        "Control Tower & Governance",
    ],
    "Pharma / MedTech manufacturer": [
        "Plan & Simulate",
        "Source & Procure",
        "Make & Package",
        "Store & Fulfill",
        "Deliver & Transport",
        "Trade, Compliance & Documents",
        "Control Tower & Governance",
    ],
    "Distributor / wholesaler": [
        "Plan & Simulate",
        "Source & Procure",
        "Store & Fulfill",
        "Deliver & Transport",
        "Control Tower & Governance",
    ],
    "Retail / omnichannel operator": [
        "Plan & Simulate",
        "Source & Procure",
        "Store & Fulfill",
        "Deliver & Transport",
        "Control Tower & Governance",
    ],
    "Asset-heavy network operator": [
        "Plan & Simulate",
        "Store & Fulfill",
        "Deliver & Transport",
        "Control Tower & Governance",
    ],
    "Procurement-led enterprise": [
        "Plan & Simulate",
        "Source & Procure",
        "Trade, Compliance & Documents",
        "Control Tower & Governance",
    ],
    "Enterprise data / platform team": [
        "Plan & Simulate",
        "Source & Procure",
        "Make & Package",
        "Store & Fulfill",
        "Deliver & Transport",
        "Trade, Compliance & Documents",
        "Control Tower & Governance",
    ],
}


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
        "supported_industries": SUPPORTED_INDUSTRIES,
        "supported_objectives": SUPPORTED_OBJECTIVES,
        "universal_steps": UNIVERSAL_STEPS,
        "archetype_stage_mapping": ARCHETYPE_STAGE_MAPPING,
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

    if "Demo Catalog" in xl.sheet_names:
        mapping_sheet = "Demo Catalog"
    elif "Mapping" in xl.sheet_names:
        mapping_sheet = "Mapping"
    else:
        mapping_sheet = xl.sheet_names[0]
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
        return JSONResponse(
            status_code=200, content={"ok": True, "data": data, "model": OPENAI_MODEL}
        )
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


# ---------------------------------------------------------------------------
# Admin: replace the demo-mapping workbook at runtime
# ---------------------------------------------------------------------------

_basic = HTTPBasic(auto_error=False)


def _admin_guard(slug: str, credentials: Optional[HTTPBasicCredentials]) -> None:
    """Reject anything that doesn't have the right slug AND valid credentials.

    A wrong slug returns 404 so the route is indistinguishable from any other
    missing path. A right slug with bad/missing creds returns 401 with a
    WWW-Authenticate header so browsers prompt for username/password.
    """
    if not ADMIN_ENABLED or not secrets.compare_digest(slug, ADMIN_PATH):
        raise HTTPException(status_code=404, detail="Not Found")

    user_ok = bool(credentials) and secrets.compare_digest(
        credentials.username, ADMIN_USERNAME
    )
    pass_ok = bool(credentials) and secrets.compare_digest(
        credentials.password, ADMIN_PASSWORD
    )
    if not (user_ok and pass_ok):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": 'Basic realm="Admin Console"'},
        )


_ADMIN_HTML_PATH = STATIC_DIR / "admin.html"


@app.get("/admin/{slug}", include_in_schema=False)
def admin_page(
    slug: str, credentials: Optional[HTTPBasicCredentials] = Depends(_basic)
) -> FileResponse:
    _admin_guard(slug, credentials)
    return FileResponse(_ADMIN_HTML_PATH, media_type="text/html")


@app.get("/admin/{slug}/status", include_in_schema=False)
def admin_status(
    slug: str, credentials: Optional[HTTPBasicCredentials] = Depends(_basic)
) -> dict[str, Any]:
    _admin_guard(slug, credentials)
    if not EXCEL_PATH.exists():
        return {"present": False, "filename": EXCEL_PATH.name}
    stat = EXCEL_PATH.stat()
    info: dict[str, Any] = {
        "present": True,
        "filename": EXCEL_PATH.name,
        "size_bytes": stat.st_size,
        "modified_iso": pd.Timestamp(stat.st_mtime, unit="s", tz="UTC")
        .tz_convert("UTC")
        .isoformat(),
    }
    try:
        with pd.ExcelFile(EXCEL_PATH) as xl:
            sheet = "Mapping" if "Mapping" in xl.sheet_names else xl.sheet_names[0]
            df = pd.read_excel(xl, sheet)
            info["sheet"] = sheet
            info["row_count"] = int(len(df))
            info["sheet_names"] = xl.sheet_names
    except Exception as e:
        info["read_error"] = str(e)

    backup_path = EXCEL_PATH.with_suffix(EXCEL_PATH.suffix + ".bak")
    if backup_path.exists():
        bstat = backup_path.stat()
        info["backup"] = {
            "filename": backup_path.name,
            "size_bytes": bstat.st_size,
            "modified_iso": pd.Timestamp(bstat.st_mtime, unit="s", tz="UTC")
            .tz_convert("UTC")
            .isoformat(),
        }
    else:
        info["backup"] = None
    return info


@app.get("/admin/{slug}/download", include_in_schema=False)
def admin_download(
    slug: str, credentials: Optional[HTTPBasicCredentials] = Depends(_basic)
) -> FileResponse:
    _admin_guard(slug, credentials)
    if not EXCEL_PATH.exists():
        raise HTTPException(status_code=404, detail="Excel file not found.")
    return FileResponse(
        EXCEL_PATH,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=EXCEL_PATH.name,
    )


@app.get("/admin/{slug}/download-backup", include_in_schema=False)
def admin_download_backup(
    slug: str, credentials: Optional[HTTPBasicCredentials] = Depends(_basic)
) -> FileResponse:
    """Download the most recent .bak (the workbook as it was before the last save/upload)."""
    _admin_guard(slug, credentials)
    backup_path = EXCEL_PATH.with_suffix(EXCEL_PATH.suffix + ".bak")
    if not backup_path.exists():
        raise HTTPException(status_code=404, detail="No backup available.")

    # Serve under a friendly name like `supply_chain_demo_mapping.previous.xlsx`
    download_name = EXCEL_PATH.stem + ".previous" + EXCEL_PATH.suffix
    return FileResponse(
        backup_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=download_name,
    )


def _write_in_place(path: Path, data: bytes) -> None:
    """
    Overwrite *path* with *data*, retrying on transient Windows locks.
    """
    last_err: Optional[BaseException] = None
    for attempt in range(8):
        try:
            with open(path, "wb") as fh:
                fh.write(data)
            return
        except OSError as e:
            last_err = e
            if attempt == 3:
                gc.collect()
            time.sleep(0.1 * (attempt + 1))
    assert last_err is not None
    raise last_err


def _install_bytes(data: bytes, dest: Path) -> Optional[str]:
    """
    Install *data* as *dest*, preserving the prior contents as a .bak.

    Returns the basename of the backup file, or None if there was no prior
    file to back up.
    """
    backup_name: Optional[str] = None
    if dest.exists():
        try:
            prior = dest.read_bytes()
        except OSError as e:
            raise OSError(f"Could not read existing workbook for backup: {e}")
        backup_path = dest.with_suffix(dest.suffix + ".bak")
        _write_in_place(backup_path, prior)
        backup_name = backup_path.name

    _write_in_place(dest, data)
    return backup_name


@app.post("/admin/{slug}/upload", include_in_schema=False)
async def admin_upload(
    slug: str,
    file: UploadFile = File(...),
    credentials: Optional[HTTPBasicCredentials] = Depends(_basic),
) -> dict[str, Any]:
    _admin_guard(slug, credentials)

    raw_name = file.filename or "upload.xlsx"
    if not raw_name.lower().endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Only .xlsx files are accepted.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(contents) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (>25 MB).")

    EXCEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    # Validate that pandas can open the bytes and that a usable sheet exists.
    try:
        with pd.ExcelFile(io.BytesIO(contents)) as xl:
            sheet = "Mapping" if "Mapping" in xl.sheet_names else xl.sheet_names[0]
            df = pd.read_excel(xl, sheet)
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Workbook is not a valid Excel file: {e}"
        )
    if df.shape[0] == 0:
        raise HTTPException(status_code=400, detail=f"Sheet '{sheet}' has no rows.")

    backup_name = _install_bytes(contents, EXCEL_PATH)

    return {
        "ok": True,
        "filename": EXCEL_PATH.name,
        "sheet": sheet,
        "row_count": int(len(df)),
        "backup": backup_name,
    }


@app.get("/admin/{slug}/data", include_in_schema=False)
def admin_data(
    slug: str, credentials: Optional[HTTPBasicCredentials] = Depends(_basic)
) -> dict[str, Any]:
    """Return every sheet as {columns, rows} for the in-browser editor."""
    _admin_guard(slug, credentials)
    if not EXCEL_PATH.exists():
        raise HTTPException(status_code=404, detail="Excel file not found.")

    sheets: dict[str, dict[str, Any]] = {}
    with pd.ExcelFile(EXCEL_PATH) as xl:
        names = list(xl.sheet_names)
        for name in names:
            df = pd.read_excel(xl, name).fillna("").astype(str)
            sheets[name] = {
                "columns": [str(c) for c in df.columns],
                "rows": df.values.tolist(),
            }
    return {"filename": EXCEL_PATH.name, "sheet_names": names, "sheets": sheets}


class _SheetPayload(BaseModel):
    columns: list[str]
    rows: list[list[Any]]


class _SavePayload(BaseModel):
    sheets: dict[str, _SheetPayload]


@app.post("/admin/{slug}/save", include_in_schema=False)
def admin_save(
    slug: str,
    payload: _SavePayload,
    credentials: Optional[HTTPBasicCredentials] = Depends(_basic),
) -> dict[str, Any]:
    """Persist edited rows back to the workbook, preserving sheet order."""
    _admin_guard(slug, credentials)

    if not payload.sheets:
        raise HTTPException(status_code=400, detail="No sheets provided.")
    for name, sheet in payload.sheets.items():
        if not sheet.columns:
            raise HTTPException(
                status_code=400, detail=f"Sheet '{name}' has no columns."
            )
        width = len(sheet.columns)
        for i, row in enumerate(sheet.rows):
            if len(row) != width:
                raise HTTPException(
                    status_code=400,
                    detail=f"Sheet '{name}' row {i + 1} has {len(row)} cells; expected {width}.",
                )

    EXCEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    total_rows = 0
    buf = io.BytesIO()
    try:
        with pd.ExcelWriter(buf, engine="openpyxl") as writer:
            for name, sheet in payload.sheets.items():
                df = pd.DataFrame(sheet.rows, columns=sheet.columns)
                df.to_excel(writer, sheet_name=name[:31], index=False)
                total_rows += len(df)
        data = buf.getvalue()
        backup_name = _install_bytes(data, EXCEL_PATH)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not write workbook: {e}")

    return {
        "ok": True,
        "filename": EXCEL_PATH.name,
        "sheet_count": len(payload.sheets),
        "row_count": total_rows,
        "backup": backup_name,
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="127.0.0.1", port=port, reload=False)
