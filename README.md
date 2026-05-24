# Supply Chain AI Value Navigator

A professional pre-sales cockpit designed for supply-chain conversations, enabling strategic alignment between AI initiatives and client needs.

The Supply Chain AI Value Navigator helps identify, rank, and size the most relevant AI initiatives for specific clients and buyers. It filters out the noise, highlighting only the proven solutions and value ranges that matter most in the current context.

The product answers one question for the seller and the client at the same time:

> For this client and this buyer, which 3 to 5 supply-chain AI initiatives should
> we lead with, what proof do we have, and what value range can we credibly
> discuss?

## Key Features

- **Value Chain Map:** An interactive 8-stage, 17-step map featuring relevance-driven highlighting, demo/case chips, and recommended AI initiatives. Includes dynamic filtering for "relevant only" or "quick wins."
- **Opportunity Calculator:** A comprehensive tool for estimating business value, featuring editable revenue/cost-pool tables, transparent low/high formula calculations, phased roadmaps, and scenario exports.
- **Customizable UI:** Features a built-in light/dark theme toggle to match presentation environments.
- **Data-Driven Intelligence:** Powered by an Excel workbook (`supply_chain_demo_mapping.xlsx`) that acts as the single source of truth for all demos, case studies, and problem statements (downloadable directly from the UI).
- **AI-Enhanced Profiling (Optional):** Integration with OpenAI to infer structured company profiles and tailor recommendations automatically.

## Prerequisites

- **Python 3.10** or higher.
- The `supply_chain_demo_mapping.xlsx` workbook must be present in the project root directory.
- (Optional) An OpenAI API key for automated company profile inference.

## Quick Start

### Windows

```cmd
git clone https://github.com/PythonicVarun/sc_ai_value_navigator
cd sc_ai_value_navigator
copy .env.example .env
:: Optional: Edit .env to add OPENAI_API_KEY for LLM inference
run.bat
```

### macOS / Linux

```bash
git clone https://github.com/PythonicVarun/sc_ai_value_navigator
cd sc_ai_value_navigator
cp .env.example .env
# Optional: Edit .env to add OPENAI_API_KEY for LLM inference
./run.sh
```

Once the server is running, navigate to `http://127.0.0.1:8000` in your web browser.

### Manual Installation

If you prefer to run the application manually without the helper scripts:

```bash
# if uv is installed
uv sync
# if not using uv, create a virtual environment and install dependencies
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# run the application
python app.py  # If using uv: uv run python app.py
```

## Configuration

Environment variables can be configured in the `.env` file. See `.env.example` for available options.

| Variable          | Default                            | Description                                                                                                      |
| :---------------- | :--------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`  | _(unset)_                          | Enables AI-driven company analysis. If unset, the application operates in manual mode with pre-configured seeds. |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1`        | Optional override for the OpenAI API base URL (useful for Azure OpenAI or proxies).                              |
| `OPENAI_MODEL`    | `gpt-5.4-mini`                     | The OpenAI model used for inference (requires a JSON-mode capable chat model).                                   |
| `EXCEL_PATH`      | `./supply_chain_demo_mapping.xlsx` | The path to the demo-mapping Excel workbook.                                                                     |
| `PORT`            | `8000`                             | The port on which the local web server will run.                                                                 |

## Application Logic

### Data Contract

The application reads from the `supply_chain_demo_mapping.xlsx` workbook on every request (read-only). The workbook must contain a `Mapping` sheet (or use the first sheet) detailing value chain stages, client pain points, associated assets, and ROI assumptions. An optional `ROI Assumptions` sheet can also be included.

### How the math works

The Opportunity Calculator estimates annual value using the following formula:

$$
\text{Annual Value} = \text{Addressable Base} \times \text{Improvement Potential} \times \text{Adoption Factor} \times \text{Confidence Factor}
$$

All inputs are editable within the UI. Portfolio totals are aggregated and adjusted by a configurable overlap discount to prevent double-counting across overlapping initiatives.

### Export Capabilities

Scenarios can be exported directly from the calculator sidebar in multiple formats:

- **CSV:** Tabular data of selected initiatives.
- **JSON:** Comprehensive scenario summary, including assumptions and links.
- **Markdown:** Formatted summary suitable for presentations or reports.

## Project Structure

```text
sc_ai_value_navigator/
├── app.py                            # FastAPI backend server
├── requirements.txt                  # Python dependencies
├── .env.example                      # Environment variables template
├── run.bat / run.sh                  # Startup scripts
├── supply_chain_demo_mapping.xlsx    # Core data mapping (source of truth)
└── static/                           # Frontend assets
    ├── index.html
    ├── styles.css
    └── app.js
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
