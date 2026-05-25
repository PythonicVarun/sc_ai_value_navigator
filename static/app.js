// =====================================================================
// Supply Chain AI Value Navigator — frontend
// =====================================================================

// ---- Theme bootstrap (runs before any rendering to avoid a flash) ----
const THEME_KEY = "theme.v1";
(function applyInitialTheme() {
    let saved = null;
    try {
        saved = localStorage.getItem(THEME_KEY);
    } catch {
        /* private mode */
    }
    const theme = saved === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
})();

// -------------------- Constants & reference data --------------------

const STAGES = [
    { id: "Plan", label: "Plan" },
    { id: "Source", label: "Source" },
    { id: "Make", label: "Make" },
    { id: "Store", label: "Store" },
    { id: "Move", label: "Move" },
    { id: "Deliver", label: "Deliver" },
    { id: "Commercial", label: "Commercial" },
    { id: "Enable", label: "Enable" },
];

const STEPS = [
    { n: 1, label: "Demand Sensing", stage: "Plan" },
    { n: 2, label: "Demand & Supply Plan", stage: "Plan" },
    { n: 3, label: "Inventory & Safety Stock", stage: "Plan" },
    { n: 4, label: "Supplier Readiness", stage: "Source" },
    { n: 5, label: "Inbound Receipt & Quality", stage: "Source" },
    { n: 6, label: "Production Plan", stage: "Make" },
    { n: 7, label: "Line Execution", stage: "Make" },
    { n: 8, label: "Warehouse Receipt", stage: "Store" },
    { n: 9, label: "Inventory Visibility", stage: "Store" },
    { n: 10, label: "Allocate & Pick", stage: "Store" },
    { n: 11, label: "Load & Dispatch", stage: "Move" },
    { n: 12, label: "Route & Delivery Execution", stage: "Move" },
    { n: 13, label: "Customer Order & Promise", stage: "Deliver" },
    { n: 14, label: "Customer Service & Claims", stage: "Deliver" },
    { n: 15, label: "Pricing & Trade", stage: "Commercial" },
    { n: 16, label: "Revenue / Network Optimization", stage: "Enable" },
    { n: 17, label: "Data Foundation", stage: "Enable" },
];

const ARCHETYPES = [
    {
        id: "3PL / logistics provider",
        examples: "DHL Supply Chain, GXO, XPO, Geodis.",
    },
    {
        id: "Parcel / last-mile carrier",
        examples: "DPD, Evri, FedEx Ground, Royal Mail Parcels.",
    },
    {
        id: "Freight forwarder / cargo operator",
        examples:
            "Kuehne+Nagel, DHL Global Forwarding, airport cargo operators.",
    },
    {
        id: "CPG / bottler",
        examples:
            "Swire Coca-Cola, Coca-Cola Europacific Partners, Pepsi bottlers.",
    },
    {
        id: "Manufacturer",
        examples: "industrial, packaging, electronics, chemical manufacturers.",
    },
    {
        id: "Pharma / MedTech manufacturer",
        examples: "Novartis, J&J MedTech, Stryker, generics manufacturers.",
    },
    {
        id: "Distributor / wholesaler",
        examples:
            "healthcare distributors, spare parts distributors, foodservice distributors.",
    },
    {
        id: "Retail / omnichannel operator",
        examples: "grocery, pharmacy, specialty retail, ecommerce retailers.",
    },
    {
        id: "Asset-heavy network operator",
        examples: "ports, airports, rail, energy logistics, depots.",
    },
    {
        id: "Procurement-led enterprise",
        examples:
            "chemicals, utilities, industrials with large supplier spend.",
    },
    {
        id: "Enterprise data / platform team",
        examples: "CIO/CDO teams modernising supply chain data platforms.",
    },
];

const BUYERS = [
    {
        id: "CEO / Country Head",
        focus: "EBITDA, growth, total value, top 3-5 initiatives.",
    },
    {
        id: "COO / Operations Head",
        focus: "throughput, SLA, productivity, capacity, execution bottlenecks.",
    },
    {
        id: "Chief Supply Chain Officer",
        focus: "planning, resilience, inventory, service, end-to-end visibility.",
    },
    {
        id: "Logistics / Transport Head",
        focus: "fleet, linehaul, route density, OTIF, cost per stop.",
    },
    {
        id: "Manufacturing / Plant Head",
        focus: "yield, downtime, quality, scrap, line performance.",
    },
    {
        id: "Procurement Head",
        focus: "supplier risk, price volatility, spend, contract leakage.",
    },
    {
        id: "CFO / Finance Head",
        focus: "cost pools, payback, leakage, confidence.",
    },
    {
        id: "CDO / CIO / Data Head",
        focus: "data readiness, architecture, governance, platform assets.",
    },
    {
        id: "Customer Experience Head",
        focus: "complaints, claims, service quality, contact-center cost.",
    },
    {
        id: "Commercial / Revenue Head",
        focus: "pricing, trade spend, customer profitability, growth.",
    },
];

const OBJECTIVES = [
    "Cost to serve reduction",
    "Service level improvement",
    "Working capital reduction",
    "Yield improvement",
    "Revenue growth",
    "Compliance / leakage reduction",
    "Data modernization",
    "Sustainability / carbon reduction",
];

// Archetype → high-relevance step labels
const ARCHETYPE_HIGH_STEPS = {
    "3PL / logistics provider": [
        "Demand Sensing",
        "Demand & Supply Plan",
        "Warehouse Receipt",
        "Allocate & Pick",
        "Load & Dispatch",
        "Route & Delivery Execution",
        "Customer Order & Promise",
        "Customer Service & Claims",
        "Pricing & Trade",
        "Revenue / Network Optimization",
        "Data Foundation",
    ],
    "Parcel / last-mile carrier": [
        "Demand Sensing",
        "Demand & Supply Plan",
        "Warehouse Receipt",
        "Load & Dispatch",
        "Route & Delivery Execution",
        "Customer Order & Promise",
        "Customer Service & Claims",
        "Pricing & Trade",
        "Revenue / Network Optimization",
        "Data Foundation",
    ],
    "Freight forwarder / cargo operator": [
        "Demand Sensing",
        "Supplier Readiness",
        "Inbound Receipt & Quality",
        "Load & Dispatch",
        "Route & Delivery Execution",
        "Customer Order & Promise",
        "Customer Service & Claims",
        "Pricing & Trade",
        "Revenue / Network Optimization",
        "Data Foundation",
    ],
    "CPG / bottler": [
        "Demand Sensing",
        "Demand & Supply Plan",
        "Inventory & Safety Stock",
        "Supplier Readiness",
        "Production Plan",
        "Line Execution",
        "Warehouse Receipt",
        "Inventory Visibility",
        "Allocate & Pick",
        "Load & Dispatch",
        "Route & Delivery Execution",
        "Pricing & Trade",
        "Revenue / Network Optimization",
        "Data Foundation",
    ],
    Manufacturer: [
        "Supplier Readiness",
        "Inbound Receipt & Quality",
        "Production Plan",
        "Line Execution",
        "Warehouse Receipt",
        "Inventory Visibility",
        "Load & Dispatch",
        "Revenue / Network Optimization",
        "Data Foundation",
    ],
    "Pharma / MedTech manufacturer": [
        "Supplier Readiness",
        "Inbound Receipt & Quality",
        "Production Plan",
        "Line Execution",
        "Inventory Visibility",
        "Load & Dispatch",
        "Route & Delivery Execution",
        "Customer Service & Claims",
        "Revenue / Network Optimization",
        "Data Foundation",
    ],
    "Distributor / wholesaler": [
        "Demand Sensing",
        "Inventory & Safety Stock",
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
    ],
    "Retail / omnichannel operator": [
        "Demand Sensing",
        "Demand & Supply Plan",
        "Inventory & Safety Stock",
        "Warehouse Receipt",
        "Inventory Visibility",
        "Allocate & Pick",
        "Route & Delivery Execution",
        "Customer Order & Promise",
        "Customer Service & Claims",
        "Pricing & Trade",
        "Revenue / Network Optimization",
        "Data Foundation",
    ],
    "Asset-heavy network operator": [
        "Demand Sensing",
        "Demand & Supply Plan",
        "Warehouse Receipt",
        "Load & Dispatch",
        "Route & Delivery Execution",
        "Customer Order & Promise",
        "Revenue / Network Optimization",
        "Data Foundation",
    ],
    "Procurement-led enterprise": [
        "Demand Sensing",
        "Supplier Readiness",
        "Inbound Receipt & Quality",
        "Inventory & Safety Stock",
        "Pricing & Trade",
        "Revenue / Network Optimization",
        "Data Foundation",
    ],
    "Enterprise data / platform team": [
        "Data Foundation",
        "Revenue / Network Optimization",
        "Demand Sensing",
        "Inventory Visibility",
        "Customer Service & Claims",
        "Pricing & Trade",
    ],
};

const STEP_CHALLENGES = {
    "Demand Sensing": ["planning", "data"],
    "Demand & Supply Plan": ["planning"],
    "Inventory & Safety Stock": ["planning", "data"],
    "Supplier Readiness": ["data", "comp"],
    "Inbound Receipt & Quality": ["data", "comp"],
    "Production Plan": ["planning", "exec"],
    "Line Execution": ["exec", "data"],
    "Warehouse Receipt": ["exec", "data"],
    "Inventory Visibility": ["data"],
    "Allocate & Pick": ["exec"],
    "Load & Dispatch": ["exec"],
    "Route & Delivery Execution": ["exec", "data"],
    "Customer Order & Promise": ["exec", "comm"],
    "Customer Service & Claims": ["comp", "data"],
    "Pricing & Trade": ["comm"],
    "Revenue / Network Optimization": ["comm", "planning"],
    "Data Foundation": ["foundation"],
};

const CHALLENGE_LABELS = {
    data: { label: "Data / Visibility Gaps", cls: "dot-data" },
    planning: { label: "Planning Disconnects", cls: "dot-planning" },
    exec: { label: "Execution Coordination", cls: "dot-exec" },
    comm: { label: "Commercial Decision Support", cls: "dot-comm" },
    comp: { label: "Compliance / Leakage", cls: "dot-comp" },
    foundation: { label: "Data Foundation", cls: "dot-foundation" },
};

const BUYER_STEP_BOOSTS = {
    "CEO / Country Head": {
        "Revenue / Network Optimization": 0.1,
        "Pricing & Trade": 0.08,
        "Demand Sensing": 0.05,
    },
    "COO / Operations Head": {
        "Line Execution": 0.1,
        "Load & Dispatch": 0.08,
        "Route & Delivery Execution": 0.08,
        "Warehouse Receipt": 0.06,
    },
    "Chief Supply Chain Officer": {
        "Demand & Supply Plan": 0.1,
        "Inventory & Safety Stock": 0.1,
        "Inventory Visibility": 0.08,
        "Demand Sensing": 0.06,
    },
    "Logistics / Transport Head": {
        "Load & Dispatch": 0.12,
        "Route & Delivery Execution": 0.12,
        "Customer Service & Claims": 0.04,
    },
    "Manufacturing / Plant Head": {
        "Production Plan": 0.12,
        "Line Execution": 0.12,
        "Inbound Receipt & Quality": 0.06,
    },
    "Procurement Head": {
        "Supplier Readiness": 0.14,
        "Inbound Receipt & Quality": 0.08,
        "Pricing & Trade": 0.04,
    },
    "CFO / Finance Head": {
        "Pricing & Trade": 0.08,
        "Revenue / Network Optimization": 0.08,
        "Demand & Supply Plan": 0.04,
    },
    "CDO / CIO / Data Head": {
        "Data Foundation": 0.14,
        "Inventory Visibility": 0.06,
        "Revenue / Network Optimization": 0.06,
    },
    "Customer Experience Head": {
        "Customer Service & Claims": 0.14,
        "Customer Order & Promise": 0.1,
    },
    "Commercial / Revenue Head": {
        "Pricing & Trade": 0.14,
        "Revenue / Network Optimization": 0.1,
        "Customer Order & Promise": 0.04,
    },
};

// ----- KPIs / data / levers / discovery questions per step -----
const STEP_DETAIL = {
    "Demand Sensing": {
        why_default:
            "Short-cycle demand signals close the gap between forecast and shelf reality.",
        challenges: [
            "Promo and weather volatility",
            "POS / sell-out blind spots",
            "Manual planner overrides",
        ],
        levers: [
            "ML demand sensing",
            "Causal lift modelling",
            "Promo and weather covariates",
            "Exception-based planner workflow",
        ],
        kpis: [
            "Forecast accuracy (WAPE)",
            "Bias",
            "Forecast value-add",
            "Service level",
        ],
        data: [
            "POS / shipment history",
            "Promo calendar",
            "Weather / events",
            "Master data SKU mapping",
        ],
        questions: [
            "Where do we lose most accuracy — promo, new SKUs, or new stores?",
            "Who currently overrides forecasts and why?",
            "What's the cost of last-mile stockouts today?",
        ],
    },
    "Demand & Supply Plan": {
        why_default:
            "Convert forecasts into binding KPI targets across cost, service and capacity.",
        challenges: [
            "Plans diverge by function",
            "Scenarios take weeks",
            "Targets disconnected from S&OP",
        ],
        levers: [
            "Scenario simulation",
            "Constraint-based supply plan",
            "KPI-linked planning workflows",
        ],
        kpis: [
            "Plan attainment",
            "S&OP cycle time",
            "Inventory turns",
            "Service",
        ],
        data: ["Demand forecast", "Capacity and BOM", "Cost-to-serve drivers"],
        questions: [
            "How long does it take to model a scenario today?",
            "Are S&OP outcomes tied to financial KPIs?",
        ],
    },
    "Inventory & Safety Stock": {
        why_default:
            "Right-size safety stocks given lead time, variability and service targets.",
        challenges: [
            "Working capital tied up",
            "Service slip-ups despite high inventory",
        ],
        levers: [
            "Multi-echelon optimization",
            "Service-cost frontier",
            "Slow-mover policies",
        ],
        kpis: ["Stock cover days", "Service", "Write-offs"],
        data: ["Inventory snapshots", "Lead times", "Demand variability"],
        questions: [
            "Which SKUs drive 80% of working capital?",
            "Are safety-stock policies updated dynamically?",
        ],
    },
    "Supplier Readiness": {
        why_default:
            "Anticipate supplier risk and price moves before they hit margin and service.",
        challenges: [
            "Supplier risk hidden",
            "Commodity volatility",
            "Spend leakage",
        ],
        levers: [
            "Supplier intelligence",
            "Commodity price forecasting",
            "Spend visibility / fair price",
        ],
        kpis: [
            "OTIF supplier",
            "Spend under management",
            "Price variance vs benchmark",
        ],
        data: [
            "ERP spend",
            "PO history",
            "Commodity indices",
            "Supplier scorecards",
        ],
        questions: [
            "Where is supplier risk highest today?",
            "How is fair price set for top categories?",
        ],
    },
    "Inbound Receipt & Quality": {
        why_default: "Catch supplier quality and document issues at the dock.",
        challenges: [
            "Manual receiving and document checks",
            "Latent quality issues",
        ],
        levers: [
            "Document AI on COA / DG paperwork",
            "Vision QC",
            "Supplier scorecards",
        ],
        kpis: [
            "First-pass yield",
            "Receiving cycle time",
            "Defects per million",
        ],
        data: ["Receiving logs", "Quality samples", "Supplier docs"],
        questions: [
            "What % of receipts require manual document review?",
            "Which suppliers cause most rework?",
        ],
    },
    "Production Plan": {
        why_default:
            "Sequence the lines to balance service, changeover cost and inventory.",
        challenges: [
            "Sub-optimal line allocation",
            "Long changeovers",
            "Constraint blind spots",
        ],
        levers: [
            "Production scheduling AI",
            "Digital twin",
            "Constraint visualization",
        ],
        kpis: ["Plan adherence", "Changeover hours", "Throughput"],
        data: ["Production orders", "Routing", "Constraints"],
        questions: [
            "How dynamic is the production plan today?",
            "What are the top 3 constraints?",
        ],
    },
    "Line Execution": {
        why_default:
            "Detect quality drift, downtime, and waste on the line in real time.",
        challenges: ["Unplanned downtime", "Scrap and rework", "Quality drift"],
        levers: [
            "Process monitor",
            "Defect detection / vision",
            "Predictive maintenance",
            "Digital twin",
        ],
        kpis: ["OEE", "Yield", "Scrap rate", "MTBF"],
        data: ["Line sensors", "Quality logs", "Maintenance history"],
        questions: [
            "Which lines cost the most in scrap?",
            "Is OEE drift visible in real time?",
        ],
    },
    "Warehouse Receipt": {
        why_default: "Balance dock, labor and storage to keep flow moving.",
        challenges: ["Dock congestion", "Labor planning", "Yard visibility"],
        levers: [
            "Facility scheduling",
            "Labor planning",
            "Vision putaway",
            "Slotting AI",
        ],
        kpis: ["Dock-to-stock time", "Labor productivity", "Yard dwell time"],
        data: ["ASN", "Yard data", "Labor rosters"],
        questions: [
            "What's the biggest dock or yard bottleneck?",
            "How is labor planned today?",
        ],
    },
    "Inventory Visibility": {
        why_default: "Single source of truth across nodes and channels.",
        challenges: [
            "Data lives in silos",
            "Phantom inventory",
            "Channel conflicts",
        ],
        levers: ["Inventory graph", "Real-time visibility", "Event streaming"],
        kpis: [
            "Inventory accuracy",
            "Cycle count variance",
            "Lost-sale events",
        ],
        data: ["ERP, WMS, store, e-com inventory"],
        questions: [
            "How current is your inventory view?",
            "Can sales see real-time availability?",
        ],
    },
    "Allocate & Pick": {
        why_default:
            "Allocate stock to orders intelligently to maximise margin and OTIF.",
        challenges: ["Allocation rules outdated", "Pick walk waste"],
        levers: ["Order allocation", "Pick path optimization", "Wave planning"],
        kpis: ["Pick lines per hour", "OTIF", "Travel time"],
        data: ["Order book", "Inventory by location"],
        questions: [
            "How are scarce SKUs allocated today?",
            "Is pick density optimised by wave?",
        ],
    },
    "Load & Dispatch": {
        why_default:
            "Plan trucks and waves to maximise cube and minimise empty miles.",
        challenges: ["Low cube utilization", "Last-minute load build"],
        levers: ["Load build optimization", "Wave planning", "Cross-dock"],
        kpis: [
            "Cube utilization",
            "On-time dispatch",
            "Cost per delivered unit",
        ],
        data: ["Order, stop, vehicle data"],
        questions: [
            "What's your current cube utilization?",
            "How often are loads rebuilt last minute?",
        ],
    },
    "Route & Delivery Execution": {
        why_default: "Dynamic routing, ETA and driver productivity at scale.",
        challenges: [
            "Static routes",
            "Inaccurate ETAs",
            "Driver productivity gaps",
        ],
        levers: [
            "Dynamic route sequencing",
            "Predictive ETA",
            "Driver twin",
            "Network optimization",
        ],
        kpis: ["Stops per route", "OTIF", "ETA accuracy", "Cost per stop"],
        data: ["Route history", "Telematics", "POD"],
        questions: [
            "How are routes built today — daily, weekly, static?",
            "What's the cost of failed delivery?",
        ],
    },
    "Customer Order & Promise": {
        why_default:
            "Promise dates the network can keep — and explain when it cannot.",
        challenges: ["Over-promising", "Manual exception handling"],
        levers: [
            "Available-to-promise",
            "Order orchestration",
            "Predictive ATP",
        ],
        kpis: ["Order fill rate", "Promise vs delivery", "OTIF"],
        data: ["Inventory, capacity, transit"],
        questions: [
            "How is ATP calculated today?",
            "Which orders break promises most?",
        ],
    },
    "Customer Service & Claims": {
        why_default: "Reduce contact volume, handle time and claim leakage.",
        challenges: ["High WISMO volume", "Claims leakage", "Slow resolution"],
        levers: [
            "GenAI deflection",
            "Claims AI",
            "Address quality AI",
            "Conversational analytics",
        ],
        kpis: ["Contact rate", "AHT", "Claim ratio", "CSAT"],
        data: ["Tickets, calls, claims, addresses"],
        questions: [
            "What % of contacts are WISMO?",
            "How much do claims cost annually?",
        ],
    },
    "Pricing & Trade": {
        why_default: "Right price, right discount, right service-level fee.",
        challenges: [
            "Trade-spend leakage",
            "Inconsistent pricing",
            "Limited elasticity insight",
        ],
        levers: [
            "Pricing optimization",
            "Trade analytics",
            "Elasticity modelling",
        ],
        kpis: ["Margin", "Realised price", "Trade ROI"],
        data: ["Pricing, promo, lift, customer data"],
        questions: [
            "How is trade spend measured today?",
            "Where is leakage hidden?",
        ],
    },
    "Revenue / Network Optimization": {
        why_default: "Re-shape the network for cost, service and growth.",
        challenges: [
            "Costly network design",
            "Sub-scale lanes",
            "Sustainability targets",
        ],
        levers: [
            "Network optimisation",
            "Cost-carbon trade-off",
            "Yield intelligence",
        ],
        kpis: ["Network cost", "Carbon per shipment", "Yield per lane"],
        data: ["Network, cost, demand, carbon"],
        questions: [
            "When was the network last re-optimised?",
            "Are carbon targets in the plan?",
        ],
    },
    "Data Foundation": {
        why_default:
            "Lakehouse, classification, conversational analytics and RAG to unlock everything else.",
        challenges: [
            "Fragmented data",
            "Slow self-service analytics",
            "No reusable AI assets",
        ],
        levers: [
            "Lakehouse",
            "Classification",
            "Conversational analytics",
            "Knowledge search / RAG",
        ],
        kpis: ["Data quality score", "Time to insight", "Active data products"],
        data: ["All sources"],
        questions: [
            "What's the single biggest data gap?",
            "Where would conversational analytics save time?",
        ],
    },
};

// ----- Cost pool tables per archetype -----
// each entry: [pool name, pool_pct_low, pool_pct_high, addressable_low, addressable_high, improvement_low, improvement_high]
const COST_POOLS = {
    "CPG / bottler": [
        ["Raw materials / ingredients", 0.2, 0.35, 0.1, 0.25, 0.005, 0.015],
        ["Packaging materials", 0.08, 0.15, 0.15, 0.35, 0.01, 0.03],
        ["Manufacturing conversion", 0.08, 0.15, 0.4, 0.7, 0.02, 0.06],
        ["Warehousing", 0.03, 0.07, 0.5, 0.75, 0.05, 0.12],
        ["Primary transport", 0.03, 0.08, 0.4, 0.7, 0.04, 0.1],
        ["Secondary distribution", 0.05, 0.12, 0.5, 0.8, 0.04, 0.12],
        ["Trade spend / discounts", 0.1, 0.25, 0.15, 0.35, 0.01, 0.04],
        ["Inventory / lost sales exposure", 0.08, 0.15, 0.4, 0.7, 0.02, 0.06],
        ["Customer service / claims", 0.01, 0.03, 0.5, 0.8, 0.1, 0.25],
    ],
    "3PL / logistics provider": [
        ["Last-mile labor", 0.25, 0.35, 0.5, 0.8, 0.05, 0.12],
        ["Linehaul and trunking", 0.1, 0.18, 0.4, 0.7, 0.03, 0.08],
        ["Sortation and depot ops", 0.08, 0.14, 0.5, 0.75, 0.04, 0.1],
        ["Fleet ownership and maintenance", 0.06, 0.1, 0.3, 0.6, 0.03, 0.08],
        ["Fuel / energy", 0.04, 0.08, 0.5, 0.8, 0.04, 0.1],
        ["Customer service", 0.02, 0.05, 0.6, 0.85, 0.1, 0.3],
        ["Failed deliveries and claims", 0.01, 0.04, 0.5, 0.8, 0.1, 0.25],
        ["Pricing / yield leakage", 0.01, 0.03, 0.4, 0.7, 0.05, 0.15],
    ],
    "Parcel / last-mile carrier": [
        ["Last-mile labor", 0.25, 0.35, 0.5, 0.8, 0.05, 0.12],
        ["Linehaul and trunking", 0.1, 0.18, 0.4, 0.7, 0.03, 0.08],
        ["Sortation and depot ops", 0.08, 0.14, 0.5, 0.75, 0.04, 0.1],
        ["Fleet ownership and maintenance", 0.06, 0.1, 0.3, 0.6, 0.03, 0.08],
        ["Fuel / energy", 0.04, 0.08, 0.5, 0.8, 0.04, 0.1],
        ["Customer service", 0.02, 0.05, 0.6, 0.85, 0.1, 0.3],
        ["Failed deliveries and claims", 0.01, 0.04, 0.5, 0.8, 0.1, 0.25],
        ["Pricing / yield leakage", 0.01, 0.03, 0.4, 0.7, 0.05, 0.15],
    ],
    Manufacturer: [
        ["Materials", 0.3, 0.5, 0.1, 0.25, 0.005, 0.02],
        ["Conversion cost", 0.1, 0.2, 0.4, 0.7, 0.02, 0.08],
        ["Maintenance / downtime", 0.02, 0.06, 0.4, 0.7, 0.05, 0.15],
        ["Scrap / rework", 0.01, 0.05, 0.4, 0.75, 0.05, 0.2],
        ["Warehouse / logistics", 0.04, 0.1, 0.4, 0.75, 0.04, 0.12],
        ["Customer service", 0.01, 0.03, 0.5, 0.8, 0.1, 0.2],
    ],
    "Pharma / MedTech manufacturer": [
        ["Manufacturing cost", 0.1, 0.2, 0.4, 0.7, 0.02, 0.08],
        ["Quality and compliance effort", 0.03, 0.08, 0.4, 0.7, 0.1, 0.3],
        ["Distribution and freight", 0.03, 0.08, 0.4, 0.7, 0.04, 0.12],
        ["Inventory / working capital", 0.08, 0.15, 0.4, 0.7, 0.02, 0.06],
        ["Regulatory documentation", 0.02, 0.06, 0.5, 0.8, 0.2, 0.5],
        ["Supplier / material risk", 0.05, 0.15, 0.2, 0.45, 0.01, 0.03],
    ],
    "Freight forwarder / cargo operator": [
        ["Linehaul / capacity", 0.15, 0.25, 0.35, 0.6, 0.03, 0.08],
        ["Customs / documentation", 0.03, 0.07, 0.5, 0.8, 0.1, 0.3],
        ["Customer service", 0.03, 0.06, 0.55, 0.8, 0.1, 0.25],
        ["Pricing / yield leakage", 0.01, 0.04, 0.4, 0.7, 0.05, 0.15],
        ["Operations / coordination", 0.04, 0.08, 0.4, 0.65, 0.04, 0.12],
    ],
    "Distributor / wholesaler": [
        ["Cost of goods", 0.6, 0.75, 0.05, 0.15, 0.002, 0.01],
        ["Warehousing", 0.03, 0.07, 0.5, 0.75, 0.05, 0.12],
        ["Outbound transport", 0.04, 0.09, 0.5, 0.75, 0.04, 0.12],
        ["Inventory / write-offs", 0.05, 0.12, 0.4, 0.7, 0.02, 0.06],
        ["Customer service", 0.01, 0.03, 0.5, 0.8, 0.1, 0.25],
        ["Pricing / margin leakage", 0.01, 0.04, 0.4, 0.7, 0.05, 0.15],
    ],
    "Retail / omnichannel operator": [
        ["Cost of goods", 0.55, 0.7, 0.05, 0.15, 0.002, 0.01],
        ["Last-mile / fulfilment", 0.04, 0.1, 0.45, 0.75, 0.05, 0.12],
        ["Store labor", 0.08, 0.14, 0.3, 0.6, 0.02, 0.06],
        ["Inventory / shrink", 0.04, 0.1, 0.4, 0.7, 0.03, 0.1],
        ["Customer service", 0.01, 0.03, 0.55, 0.8, 0.1, 0.25],
        ["Pricing / promo leakage", 0.03, 0.08, 0.25, 0.5, 0.02, 0.08],
    ],
    "Asset-heavy network operator": [
        ["Asset utilization", 0.15, 0.25, 0.3, 0.55, 0.03, 0.1],
        ["Maintenance", 0.04, 0.1, 0.4, 0.7, 0.05, 0.15],
        ["Energy / fuel", 0.05, 0.12, 0.4, 0.7, 0.04, 0.12],
        ["Labor", 0.15, 0.25, 0.3, 0.55, 0.02, 0.08],
        ["Network design", 0.03, 0.08, 0.4, 0.7, 0.03, 0.1],
    ],
    "Procurement-led enterprise": [
        ["Material spend", 0.4, 0.6, 0.05, 0.15, 0.005, 0.02],
        ["Indirect spend", 0.05, 0.15, 0.15, 0.4, 0.02, 0.08],
        ["Inventory / working capital", 0.05, 0.12, 0.4, 0.7, 0.02, 0.06],
        ["Supplier risk exposure", 0.03, 0.08, 0.25, 0.55, 0.02, 0.08],
    ],
    "Enterprise data / platform team": [
        ["Decision latency cost", 0.02, 0.06, 0.5, 0.8, 0.08, 0.25],
        ["Data ops / build cost", 0.01, 0.04, 0.55, 0.85, 0.15, 0.4],
        ["Forecast / planning cost", 0.03, 0.08, 0.4, 0.7, 0.03, 0.12],
        ["Customer experience", 0.01, 0.03, 0.55, 0.8, 0.1, 0.25],
    ],
};

// ----- Revenue / value drivers per archetype -----
const REVENUE_DRIVERS = {
    "CPG / bottler": [
        ["Core volume", 0.68, 0.02, 0.05],
        ["Premium / mix uplift", 0.14, 0.03, 0.08],
        ["Trade effectiveness", 0.1, 0.05, 0.15],
        ["New distribution coverage", 0.05, 0.02, 0.06],
        ["Inventory availability", 0.03, 0.01, 0.03],
    ],
    "3PL / logistics provider": [
        ["Parcel / shipment volume", 0.6, 0.02, 0.05],
        ["Premium services", 0.15, 0.04, 0.1],
        ["B2B contract yield", 0.15, 0.03, 0.08],
        ["New shipper acquisition", 0.05, 0.03, 0.08],
        ["Customer retention", 0.05, 0.01, 0.04],
    ],
    "Parcel / last-mile carrier": [
        ["Parcel volume", 0.65, 0.02, 0.05],
        ["Premium services", 0.15, 0.04, 0.1],
        ["B2B contract yield", 0.12, 0.03, 0.08],
        ["New shipper acquisition", 0.05, 0.03, 0.08],
        ["Customer retention", 0.03, 0.01, 0.04],
    ],
    Manufacturer: [
        ["Core product volume", 0.7, 0.01, 0.03],
        ["Premium / mix", 0.15, 0.02, 0.06],
        ["Service / aftermarket", 0.1, 0.03, 0.1],
        ["New customer acquisition", 0.05, 0.02, 0.06],
    ],
    "Pharma / MedTech manufacturer": [
        ["Core product volume", 0.65, 0.01, 0.03],
        ["Service contracts", 0.1, 0.03, 0.1],
        ["New launch ramp", 0.15, 0.02, 0.08],
        ["Compliance risk avoidance", 0.1, 0.02, 0.06],
    ],
    "Freight forwarder / cargo operator": [
        ["Forwarding volume", 0.6, 0.02, 0.05],
        ["Premium / express", 0.15, 0.04, 0.1],
        ["Contract yield", 0.2, 0.03, 0.08],
        ["New customer acquisition", 0.05, 0.02, 0.06],
    ],
    "Distributor / wholesaler": [
        ["Core sales volume", 0.7, 0.01, 0.03],
        ["Premium service tiers", 0.15, 0.03, 0.08],
        ["New customer acquisition", 0.1, 0.02, 0.06],
        ["Margin from pricing", 0.05, 0.02, 0.06],
    ],
    "Retail / omnichannel operator": [
        ["In-store sales", 0.55, 0.01, 0.03],
        ["E-commerce", 0.25, 0.03, 0.08],
        ["Loyalty / repeat", 0.15, 0.02, 0.06],
        ["New format / category", 0.05, 0.02, 0.06],
    ],
    "Asset-heavy network operator": [
        ["Throughput volume", 0.7, 0.02, 0.05],
        ["Premium / express slot", 0.15, 0.03, 0.08],
        ["Long-term contracts", 0.15, 0.02, 0.06],
    ],
    "Procurement-led enterprise": [
        ["Output volume", 0.8, 0.01, 0.03],
        ["Service / aftermarket", 0.15, 0.02, 0.06],
        ["New contract wins", 0.05, 0.02, 0.06],
    ],
    "Enterprise data / platform team": [
        ["Internal product adoption", 0.5, 0.05, 0.2],
        ["Decision quality uplift", 0.3, 0.03, 0.1],
        ["Reuse of accelerators", 0.2, 0.05, 0.15],
    ],
};

// ----- Initiative library per archetype -----
// Each initiative: low_pct (of revenue), high_pct, pool, vc_step, mechanism, effort, time_to_pilot, proof, tags
const INITIATIVES = {
    "CPG / bottler": [
        {
            id: "ds-inv",
            name: "Demand Sensing & Inventory Optimization",
            vc_step: "Demand Sensing",
            pool: "Inventory / lost sales exposure",
            mechanism:
                "Short-cycle SKU-store forecasts driving safety-stock and replenishment.",
            low_pct: 0.002,
            high_pct: 0.0073,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["demand", "forecasting", "planning", "inventory"],
        },
        {
            id: "prod-twin",
            name: "Production Digital Twin",
            vc_step: "Production Plan",
            pool: "Manufacturing conversion",
            mechanism:
                "Simulate line allocation, changeovers and constraint moves.",
            low_pct: 0.0017,
            high_pct: 0.006,
            effort: "L",
            tts: "12-16 weeks",
            proof: "demo",
            tags: ["twin", "production", "simulation"],
        },
        {
            id: "line-q",
            name: "Line Quality & Defect Detection",
            vc_step: "Line Execution",
            pool: "Manufacturing conversion",
            mechanism:
                "Vision and process-monitor models flag drift and defects on the line.",
            low_pct: 0.001,
            high_pct: 0.0035,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["vision", "quality", "line"],
        },
        {
            id: "wh-lab",
            name: "Warehouse Labor Productivity",
            vc_step: "Warehouse Receipt",
            pool: "Warehousing",
            mechanism: "Labor planning, slotting and dock scheduling.",
            low_pct: 0.001,
            high_pct: 0.0028,
            effort: "M",
            tts: "8-10 weeks",
            proof: "demo",
            tags: ["warehouse", "labor", "slotting"],
        },
        {
            id: "route",
            name: "Load & Route Optimization",
            vc_step: "Route & Delivery Execution",
            pool: "Secondary distribution",
            mechanism: "Dynamic route sequencing, cube/load build, and ETA.",
            low_pct: 0.0017,
            high_pct: 0.0055,
            effort: "M",
            tts: "8-12 weeks",
            proof: "case",
            tags: ["route", "distribution", "ETA"],
        },
        {
            id: "price",
            name: "Pricing & Trade Analytics",
            vc_step: "Pricing & Trade",
            pool: "Trade spend / discounts",
            mechanism:
                "Elasticity, trade-spend ROI, and price-mix recommendations.",
            low_pct: 0.002,
            high_pct: 0.006,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["pricing", "trade", "elasticity"],
        },
        {
            id: "supp",
            name: "Supplier & Commodity Intelligence",
            vc_step: "Supplier Readiness",
            pool: "Raw materials / ingredients",
            mechanism:
                "Commodity forecasting, fair-price and supplier-risk scoring.",
            low_pct: 0.0007,
            high_pct: 0.0023,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["supplier", "commodity", "procurement"],
        },
        {
            id: "cs-ai",
            name: "Customer Service & Claims AI",
            vc_step: "Customer Service & Claims",
            pool: "Customer service / claims",
            mechanism: "GenAI deflection and claims classification.",
            low_pct: 0.0007,
            high_pct: 0.002,
            effort: "S",
            tts: "6-8 weeks",
            proof: "demo",
            tags: ["claims", "GenAI", "service"],
        },
        {
            id: "data-fnd",
            name: "Data Foundation & Conversational Analytics",
            vc_step: "Data Foundation",
            pool: "Inventory / lost sales exposure",
            mechanism: "Lakehouse + RAG + classification to unlock the above.",
            low_pct: 0.0005,
            high_pct: 0.0018,
            effort: "L",
            tts: "12-20 weeks",
            proof: "accelerator",
            tags: ["data", "RAG", "platform"],
        },
    ],
    "Parcel / last-mile carrier": [
        {
            id: "route-seq",
            name: "Dynamic Route & Stop Sequencing",
            vc_step: "Route & Delivery Execution",
            pool: "Last-mile labor",
            mechanism: "Sequence stops per route to maximise drops per hour.",
            low_pct: 0.005,
            high_pct: 0.014,
            effort: "M",
            tts: "8-12 weeks",
            proof: "case",
            tags: ["route", "last-mile"],
        },
        {
            id: "pred-eta",
            name: "Predictive ETA",
            vc_step: "Customer Order & Promise",
            pool: "Customer service",
            mechanism: "Per-stop ETA model fed back to WISMO and ops.",
            low_pct: 0.001,
            high_pct: 0.0035,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["ETA", "prediction"],
        },
        {
            id: "cs-genai",
            name: "GenAI Customer-Service Deflection",
            vc_step: "Customer Service & Claims",
            pool: "Customer service",
            mechanism: "WISMO + claims deflection via GenAI.",
            low_pct: 0.002,
            high_pct: 0.006,
            effort: "S",
            tts: "6-8 weeks",
            proof: "demo",
            tags: ["GenAI", "service", "WISMO"],
        },
        {
            id: "vol-fc",
            name: "Demand & Volume Forecasting",
            vc_step: "Demand Sensing",
            pool: "Sortation and depot ops",
            mechanism: "Depot-day volume forecasts to drive staffing.",
            low_pct: 0.001,
            high_pct: 0.003,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["forecasting", "volume"],
        },
        {
            id: "depot-twin",
            name: "Depot Go-Live Digital Twin",
            vc_step: "Warehouse Receipt",
            pool: "Sortation and depot ops",
            mechanism: "Simulate depot moves, sortation changes and labor.",
            low_pct: 0.001,
            high_pct: 0.003,
            effort: "L",
            tts: "12-16 weeks",
            proof: "demo",
            tags: ["twin", "depot"],
        },
        {
            id: "price-yld",
            name: "Pricing & Yield Intelligence",
            vc_step: "Pricing & Trade",
            pool: "Pricing / yield leakage",
            mechanism:
                "Customer-segment price recommendations and yield monitor.",
            low_pct: 0.0008,
            high_pct: 0.003,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["pricing", "yield"],
        },
        {
            id: "driver",
            name: "Driver Productivity / Driver Twin",
            vc_step: "Route & Delivery Execution",
            pool: "Last-mile labor",
            mechanism: "Driver-level performance, coaching and route fit.",
            low_pct: 0.001,
            high_pct: 0.0035,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["driver", "productivity"],
        },
        {
            id: "claims-aq",
            name: "Claims & Address-Quality AI",
            vc_step: "Customer Service & Claims",
            pool: "Failed deliveries and claims",
            mechanism:
                "Address scoring and claim classification reduces failures.",
            low_pct: 0.0008,
            high_pct: 0.0025,
            effort: "S",
            tts: "6-8 weeks",
            proof: "demo",
            tags: ["claims", "address", "quality"],
        },
    ],
    "3PL / logistics provider": [
        {
            id: "dyn-route",
            name: "Dynamic Route Sequencing",
            vc_step: "Route & Delivery Execution",
            pool: "Last-mile labor",
            mechanism: "Per-shift route build with constraints.",
            low_pct: 0.004,
            high_pct: 0.012,
            effort: "M",
            tts: "8-12 weeks",
            proof: "case",
            tags: ["route", "3PL"],
        },
        {
            id: "pred-eta",
            name: "Predictive ETA",
            vc_step: "Customer Order & Promise",
            pool: "Customer service",
            mechanism: "Per-stop ETA model.",
            low_pct: 0.001,
            high_pct: 0.0035,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["ETA"],
        },
        {
            id: "depot",
            name: "Warehouse / Depot Productivity",
            vc_step: "Warehouse Receipt",
            pool: "Sortation and depot ops",
            mechanism: "Labor planning, slotting, dock scheduling.",
            low_pct: 0.0015,
            high_pct: 0.005,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["warehouse", "depot"],
        },
        {
            id: "price-yld",
            name: "Pricing & Yield Intelligence",
            vc_step: "Pricing & Trade",
            pool: "Pricing / yield leakage",
            mechanism: "Customer-lane yield analytics.",
            low_pct: 0.0008,
            high_pct: 0.003,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["pricing", "yield"],
        },
        {
            id: "cs-genai",
            name: "GenAI Customer-Service Deflection",
            vc_step: "Customer Service & Claims",
            pool: "Customer service",
            mechanism: "Status & claims deflection at scale.",
            low_pct: 0.0018,
            high_pct: 0.005,
            effort: "S",
            tts: "6-8 weeks",
            proof: "demo",
            tags: ["GenAI", "service"],
        },
        {
            id: "fuel",
            name: "Fuel & Telematics Optimization",
            vc_step: "Route & Delivery Execution",
            pool: "Fuel / energy",
            mechanism: "Telematics-fed coaching and routing.",
            low_pct: 0.0008,
            high_pct: 0.003,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["fuel", "telematics"],
        },
        {
            id: "data-fnd",
            name: "Data Foundation",
            vc_step: "Data Foundation",
            pool: "Operations / coordination",
            mechanism: "Lakehouse + RAG to unlock the rest.",
            low_pct: 0.001,
            high_pct: 0.0035,
            effort: "L",
            tts: "12-20 weeks",
            proof: "accelerator",
            tags: ["data", "platform"],
        },
    ],
    Manufacturer: [
        {
            id: "sched",
            name: "Production Scheduling AI",
            vc_step: "Production Plan",
            pool: "Conversion cost",
            mechanism: "Constraint-aware scheduling.",
            low_pct: 0.002,
            high_pct: 0.007,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["scheduling"],
        },
        {
            id: "qual",
            name: "Line Quality & Defect Detection",
            vc_step: "Line Execution",
            pool: "Scrap / rework",
            mechanism: "Vision + process monitor on critical lines.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["quality", "vision"],
        },
        {
            id: "maint",
            name: "Predictive Maintenance",
            vc_step: "Line Execution",
            pool: "Maintenance / downtime",
            mechanism: "Sensor-driven failure prediction.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "12-16 weeks",
            proof: "case",
            tags: ["maintenance"],
        },
        {
            id: "supp",
            name: "Supplier & Commodity Intelligence",
            vc_step: "Supplier Readiness",
            pool: "Materials",
            mechanism: "Risk + fair-price + commodity forecasting.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["supplier", "commodity"],
        },
        {
            id: "inv",
            name: "Inventory & Replenishment",
            vc_step: "Inventory & Safety Stock",
            pool: "Warehouse / logistics",
            mechanism: "MEIO + replenishment.",
            low_pct: 0.001,
            high_pct: 0.0035,
            effort: "M",
            tts: "10-12 weeks",
            proof: "demo",
            tags: ["inventory"],
        },
    ],
    "Pharma / MedTech manufacturer": [
        {
            id: "qa",
            name: "Quality & Compliance AI",
            vc_step: "Inbound Receipt & Quality",
            pool: "Quality and compliance effort",
            mechanism: "Document AI + vision QC.",
            low_pct: 0.003,
            high_pct: 0.012,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["quality", "GxP"],
        },
        {
            id: "regdoc",
            name: "Regulatory Documentation AI",
            vc_step: "Data Foundation",
            pool: "Regulatory documentation",
            mechanism: "GenAI for regulatory authoring and review.",
            low_pct: 0.005,
            high_pct: 0.02,
            effort: "M",
            tts: "12-16 weeks",
            proof: "demo",
            tags: ["regulatory", "GenAI"],
        },
        {
            id: "cold",
            name: "Cold-Chain / Distribution AI",
            vc_step: "Route & Delivery Execution",
            pool: "Distribution and freight",
            mechanism: "Cold-chain visibility and route optimization.",
            low_pct: 0.001,
            high_pct: 0.005,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["cold-chain", "route"],
        },
        {
            id: "plan",
            name: "Production Scheduling & MEIO",
            vc_step: "Production Plan",
            pool: "Manufacturing cost",
            mechanism: "Constraint scheduling and multi-echelon inventory.",
            low_pct: 0.002,
            high_pct: 0.008,
            effort: "L",
            tts: "12-16 weeks",
            proof: "demo",
            tags: ["scheduling", "MEIO"],
        },
        {
            id: "risk",
            name: "Supplier & Material Risk",
            vc_step: "Supplier Readiness",
            pool: "Supplier / material risk",
            mechanism: "Risk scoring and dual-sourcing simulation.",
            low_pct: 0.001,
            high_pct: 0.003,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["risk", "supplier"],
        },
    ],
    "Freight forwarder / cargo operator": [
        {
            id: "docai",
            name: "Shipping Document AI",
            vc_step: "Customer Service & Claims",
            pool: "Customs / documentation",
            mechanism: "Extract + check shipping docs at scale.",
            low_pct: 0.002,
            high_pct: 0.008,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["documents", "customs"],
        },
        {
            id: "delay",
            name: "Cargo Delay Prediction",
            vc_step: "Route & Delivery Execution",
            pool: "Linehaul / capacity",
            mechanism: "Predict and explain delays per leg.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["delay", "cargo"],
        },
        {
            id: "cs",
            name: "GenAI Service & Trade Support",
            vc_step: "Customer Service & Claims",
            pool: "Customer service",
            mechanism: "Status + classification deflection.",
            low_pct: 0.0015,
            high_pct: 0.005,
            effort: "S",
            tts: "6-8 weeks",
            proof: "demo",
            tags: ["GenAI", "service"],
        },
        {
            id: "yield",
            name: "Yield & Pricing Intelligence",
            vc_step: "Pricing & Trade",
            pool: "Pricing / yield leakage",
            mechanism: "Per-lane yield monitor.",
            low_pct: 0.0008,
            high_pct: 0.003,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["yield", "pricing"],
        },
    ],
    "Distributor / wholesaler": [
        {
            id: "inv",
            name: "Inventory & Replenishment",
            vc_step: "Inventory & Safety Stock",
            pool: "Inventory / write-offs",
            mechanism: "MEIO + ordering optimisation.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["inventory"],
        },
        {
            id: "route",
            name: "Route & Load Optimization",
            vc_step: "Route & Delivery Execution",
            pool: "Outbound transport",
            mechanism: "Dynamic routing + cube.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "8-12 weeks",
            proof: "case",
            tags: ["route"],
        },
        {
            id: "cs",
            name: "Customer Service AI",
            vc_step: "Customer Service & Claims",
            pool: "Customer service",
            mechanism: "WISMO + claims deflection.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "S",
            tts: "6-8 weeks",
            proof: "demo",
            tags: ["GenAI", "service"],
        },
        {
            id: "price",
            name: "Pricing & Margin Intelligence",
            vc_step: "Pricing & Trade",
            pool: "Pricing / margin leakage",
            mechanism: "Customer-level price recommendations.",
            low_pct: 0.001,
            high_pct: 0.0035,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["pricing"],
        },
        {
            id: "fc",
            name: "Demand Forecasting",
            vc_step: "Demand Sensing",
            pool: "Inventory / write-offs",
            mechanism: "SKU-customer level forecasts.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["forecasting"],
        },
    ],
    "Retail / omnichannel operator": [
        {
            id: "demand",
            name: "Demand Sensing & Allocation",
            vc_step: "Demand Sensing",
            pool: "Inventory / shrink",
            mechanism: "Store-SKU forecasts driving allocation.",
            low_pct: 0.0015,
            high_pct: 0.005,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["demand", "allocation"],
        },
        {
            id: "omni",
            name: "Order Promise & Orchestration",
            vc_step: "Customer Order & Promise",
            pool: "Last-mile / fulfilment",
            mechanism: "ATP + node selection.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["ATP"],
        },
        {
            id: "cs",
            name: "GenAI Customer Service",
            vc_step: "Customer Service & Claims",
            pool: "Customer service",
            mechanism: "Conversational service across channels.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "S",
            tts: "6-8 weeks",
            proof: "demo",
            tags: ["GenAI"],
        },
        {
            id: "price",
            name: "Pricing & Promo Optimization",
            vc_step: "Pricing & Trade",
            pool: "Pricing / promo leakage",
            mechanism: "Promo lift and price elasticity.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["pricing", "promo"],
        },
        {
            id: "lm",
            name: "Last-Mile Optimization",
            vc_step: "Route & Delivery Execution",
            pool: "Last-mile / fulfilment",
            mechanism: "Routing + slotting + ETA.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["route"],
        },
    ],
    "Asset-heavy network operator": [
        {
            id: "asset",
            name: "Asset Utilization & Slot Optimization",
            vc_step: "Demand & Supply Plan",
            pool: "Asset utilization",
            mechanism: "Slot allocation + dwell reduction.",
            low_pct: 0.002,
            high_pct: 0.008,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["utilization"],
        },
        {
            id: "pm",
            name: "Predictive Maintenance",
            vc_step: "Line Execution",
            pool: "Maintenance",
            mechanism: "Sensor-driven failure prediction.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "12-16 weeks",
            proof: "case",
            tags: ["maintenance"],
        },
        {
            id: "energy",
            name: "Energy Optimization",
            vc_step: "Route & Delivery Execution",
            pool: "Energy / fuel",
            mechanism: "Energy curve & throughput.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "10-14 weeks",
            proof: "demo",
            tags: ["energy"],
        },
        {
            id: "network",
            name: "Network Design Optimization",
            vc_step: "Revenue / Network Optimization",
            pool: "Network design",
            mechanism: "Cost-carbon-service trade-offs.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "L",
            tts: "12-20 weeks",
            proof: "demo",
            tags: ["network"],
        },
    ],
    "Procurement-led enterprise": [
        {
            id: "spend",
            name: "Spend Visibility & Classification",
            vc_step: "Supplier Readiness",
            pool: "Indirect spend",
            mechanism: "Auto-classify and analyse spend.",
            low_pct: 0.003,
            high_pct: 0.012,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["spend", "classification"],
        },
        {
            id: "fair",
            name: "Fair Price & Should-Cost",
            vc_step: "Supplier Readiness",
            pool: "Material spend",
            mechanism: "Reference cost models.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["price", "should-cost"],
        },
        {
            id: "risk",
            name: "Supplier Risk Intelligence",
            vc_step: "Supplier Readiness",
            pool: "Supplier risk exposure",
            mechanism: "Risk scoring + alerts.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["risk", "supplier"],
        },
        {
            id: "comm",
            name: "Commodity Forecasting",
            vc_step: "Supplier Readiness",
            pool: "Material spend",
            mechanism: "Predictive commodity moves.",
            low_pct: 0.0008,
            high_pct: 0.003,
            effort: "S",
            tts: "6-10 weeks",
            proof: "demo",
            tags: ["commodity"],
        },
    ],
    "Enterprise data / platform team": [
        {
            id: "lake",
            name: "Supply Chain Lakehouse",
            vc_step: "Data Foundation",
            pool: "Data ops / build cost",
            mechanism: "Lakehouse + data products.",
            low_pct: 0.003,
            high_pct: 0.012,
            effort: "L",
            tts: "12-20 weeks",
            proof: "accelerator",
            tags: ["lakehouse", "platform"],
        },
        {
            id: "rag",
            name: "Knowledge Search / RAG",
            vc_step: "Data Foundation",
            pool: "Decision latency cost",
            mechanism: "RAG over policies, manuals, SOPs.",
            low_pct: 0.002,
            high_pct: 0.008,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["RAG", "GenAI"],
        },
        {
            id: "conv",
            name: "Conversational Analytics",
            vc_step: "Data Foundation",
            pool: "Decision latency cost",
            mechanism: "Natural-language access to data products.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["analytics", "NL"],
        },
        {
            id: "class",
            name: "Data Classification & Quality",
            vc_step: "Data Foundation",
            pool: "Data ops / build cost",
            mechanism: "Auto-classification with rule + ML.",
            low_pct: 0.001,
            high_pct: 0.004,
            effort: "M",
            tts: "8-12 weeks",
            proof: "demo",
            tags: ["classification", "quality"],
        },
    ],
};

// =====================================================================
// STATE
// =====================================================================

// Single source of truth for the "fresh scenario" baseline. The Reset button
// rolls every editable field back to this object. Anything not listed here
// (excelRows, hasExcel, llmAvailable) is environment state and is preserved.
const SCENARIO_DEFAULTS = () => ({
    archetype: "CPG / bottler",
    buyer: "COO / Operations Head",
    region: "Asia Pacific",
    objective: "Cost to serve reduction",
    maturity: "Medium",
    showRelevantOnly: true,
    quickWinsOnly: false,
    selectedStep: null,
    inference: null,
    company: "Swire Coca-Cola",
    calc: {
        company: "Swire Coca-Cola",
        revenue: 3_000_000_000,
        sites: 14,
        warehouses: 32,
        shipments: 48_000_000,
        distribution: "Hybrid",
        confidence: 75,
        adoptLow: 0.7,
        adoptHigh: 1.0,
        overlapLow: 15,
        overlapHigh: 30,
        revDriverOverrides: {},
        costPoolOverrides: {},
        initiativeEnabled: {},
        initiativeOverrides: {},
    },
});

const state = {
    excelRows: [],
    hasExcel: false,
    llmAvailable: false,
    ...SCENARIO_DEFAULTS(),
};

// =====================================================================
// UTILITIES
// =====================================================================

// ---- Lucide-style icon set (24×24 viewBox, stroke=currentColor) ----
const ICONS = {
    building:
        '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    barChart:
        '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    pieChart:
        '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    crosshair:
        '<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>',
    search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    shieldCheck:
        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
    trendUp:
        '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    trendDown:
        '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    database:
        '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    message:
        '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    checkCircle:
        '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    package:
        '<path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    warehouse:
        '<path d="M3 21V8l9-5 9 5v13"/><path d="M3 21h18"/><path d="M9 21V12h6v9"/>',
    tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
    download:
        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    fileText:
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    braces: '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
    fileCode:
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 12 8 14 10 16"/><polyline points="14 12 16 14 14 16"/>',
    map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
    award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    externalLink:
        '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    helpCircle:
        '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    sliders:
        '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    sigma: '<path d="M18 7V4H6l6 8-6 8h12v-3"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    refresh:
        '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    calendar:
        '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    boxes: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    headphones:
        '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    chevronRight: '<polyline points="9 18 15 12 9 6"/>',
    chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
    chevronsLeft:
        '<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>',
    chevronsRight:
        '<polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>',
    panelLeft:
        '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>',
    panelRight:
        '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
};

function iconHTML(name, size = 14, cls = "") {
    const inner = ICONS[name];
    if (!inner) return "";
    return `<span class="icon ${cls}" aria-hidden="true"><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg></span>`;
}

function iconEl(name, size = 14, cls = "") {
    const span = document.createElement("span");
    span.className = ("icon " + cls).trim();
    span.setAttribute("aria-hidden", "true");
    const inner = ICONS[name] || "";
    span.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
    return span;
}

// Stage-to-icon mapping for value-chain map column heads
const STAGE_ICON = {
    Plan: "calendar",
    Source: "inbox",
    Make: "tool",
    Store: "warehouse",
    Move: "truck",
    Deliver: "package",
    Commercial: "tag",
    Enable: "database",
};

// Inject icons into every element that carries data-icon="name"
function decorateStaticIcons() {
    document.querySelectorAll("[data-icon]").forEach((node) => {
        if (node.querySelector(":scope > .icon")) return; // already decorated
        const name = node.dataset.icon;
        const size = parseInt(node.dataset.iconSize || "14", 10);
        node.insertAdjacentHTML("afterbegin", iconHTML(name, size));
    });
}

// ---- Resizable + collapsible side panes ----------------------------------
// Each pane installs a draggable handle on its inner edge and a chevron
// toggle inside the pane corner. Widths and collapsed state persist to
// localStorage so the seller's layout sticks between sessions.

// ---- Theme toggle ---------------------------------------------------------
function setupThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const paintIcon = () => {
        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";
        btn.innerHTML = iconHTML(isDark ? "sun" : "moon", 15);
        btn.title = isDark ? "Switch to light theme" : "Switch to dark theme";
        btn.setAttribute("aria-label", btn.title);
    };

    btn.addEventListener("click", () => {
        const current =
            document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try {
            localStorage.setItem(THEME_KEY, next);
        } catch {
            /* ignore */
        }
        paintIcon();
    });

    paintIcon();
}

function setupResizablePanes() {
    setupPane({
        paneEl: document.querySelector("#tab-map > div > .sidebar"),
        scope: document.querySelector("#tab-map"),
        side: "right", // pane is on the LEFT, handle/toggle on its right
        cssVar: "--sidebar-w",
        defaultW: 304,
        minW: 232,
        maxW: 480,
        storageKey: "pane.map.sidebar.v1",
    });
    setupPane({
        paneEl: document.querySelector("#tab-map > div > .detail-pane"),
        scope: document.querySelector("#tab-map"),
        side: "left", // pane is on the RIGHT, handle/toggle on its left
        cssVar: "--detail-w",
        defaultW: 360,
        minW: 288,
        maxW: 540,
        storageKey: "pane.map.detail.v1",
        defaultCollapsed: true,
    });
    setupPane({
        paneEl: document.querySelector("#tab-calc > div > .sidebar"),
        scope: document.querySelector("#tab-calc"),
        side: "right",
        cssVar: "--sidebar-w",
        defaultW: 320,
        minW: 256,
        maxW: 480,
        storageKey: "pane.calc.sidebar.v1",
    });
}

function setupPane({
    paneEl,
    scope,
    side,
    cssVar,
    defaultW,
    minW,
    maxW,
    storageKey,
    defaultCollapsed = false,
}) {
    if (!paneEl || !scope) return;

    const loadState = () => {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || "{}");
        } catch {
            return {};
        }
    };
    const saveState = (s) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(s));
        } catch {
            /* ignore */
        }
    };

    let saved = loadState();
    let width = Number.isFinite(+saved.w)
        ? Math.max(minW, Math.min(maxW, +saved.w))
        : defaultW;
    let collapsed =
        "collapsed" in saved ? !!saved.collapsed : !!defaultCollapsed;

    const collapsedW = 40;

    // Chevron direction: pointing to where the pane will move when clicked.
    // Open sidebar → chevronLeft (will collapse leftward). Collapsed → chevronRight.
    const arrowIcon = () => {
        if (side === "right") return collapsed ? "chevronRight" : "chevronLeft";
        return collapsed ? "chevronLeft" : "chevronRight";
    };

    // Header bar (sticky, lives at top of the pane). The toggle button lives inside it,
    // so it's never clipped by the pane's overflow:auto and never overlaps form controls.
    const header = document.createElement("div");
    header.className = `pane-header pane-header-${side}`;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "pane-toggle";
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        collapsed = !collapsed;
        saveState({ w: width, collapsed });
        applyState();
    });
    header.appendChild(toggle);
    paneEl.insertBefore(header, paneEl.firstChild);

    // Resizer sits at the pane's inner edge (right:0 for sidebar, left:0 for detail).
    // No overflow clipping since we don't extend past the edge.
    const resizer = document.createElement("div");
    resizer.className = `pane-resizer pane-resizer-${side}`;
    resizer.title = "Drag to resize · double-click to reset";
    paneEl.parentElement.appendChild(resizer);

    const applyState = () => {
        scope.style.setProperty(
            cssVar,
            collapsed ? `${collapsedW}px` : `${width}px`,
        );
        paneEl.classList.toggle("pane-collapsed", collapsed);
        toggle.title = collapsed ? "Expand panel" : "Collapse panel";
        toggle.setAttribute("aria-label", toggle.title);
        toggle.innerHTML = iconHTML(arrowIcon(), 13);
    };

    let dragging = false;
    let startX = 0;
    let startW = 0;

    resizer.addEventListener("mousedown", (e) => {
        if (collapsed) return;
        if (e.button !== 0) return;
        dragging = true;
        startX = e.clientX;
        startW = paneEl.getBoundingClientRect().width;
        resizer.classList.add("dragging");
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
        e.preventDefault();
    });

    const onMove = (e) => {
        if (!dragging) return;
        const delta = e.clientX - startX;
        const dir = side === "right" ? 1 : -1;
        const next = Math.max(minW, Math.min(maxW, startW + delta * dir));
        width = next;
        scope.style.setProperty(cssVar, `${next}px`);
    };
    const onUp = () => {
        if (!dragging) return;
        dragging = false;
        resizer.classList.remove("dragging");
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        saveState({ w: width, collapsed });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    // Double-click handle resets to the default width (and expands if collapsed)
    resizer.addEventListener("dblclick", () => {
        width = defaultW;
        collapsed = false;
        saveState({ w: width, collapsed });
        applyState();
    });

    applyState();
}

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const el = (tag, opts = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(opts)) {
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k === "text") node.textContent = v;
        else if (k.startsWith("on") && typeof v === "function")
            node.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v !== undefined && v !== null) node.setAttribute(k, v);
    }
    if (typeof children === "string") node.append(children);
    else for (const c of children || []) if (c != null) node.append(c);
    return node;
};

const formatMoney = (n) => {
    if (!isFinite(n) || n == null) return "—";
    const abs = Math.abs(n);
    if (abs >= 1e9) return `$${(n / 1e9).toFixed(abs >= 10e9 ? 1 : 2)}B`;
    if (abs >= 1e6) return `$${(n / 1e6).toFixed(abs >= 10e6 ? 1 : 1)}M`;
    if (abs >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
    return `$${Math.round(n)}`;
};

const formatCompact = (n) => {
    if (!isFinite(n) || n == null) return "—";
    if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
    if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
    return String(n);
};

const fmtRange = (low, high) => `${formatMoney(low)} - ${formatMoney(high)}`;
const fmtPct = (x, dp = 1) => `${(x * 100).toFixed(dp)}%`;

function showToast(msg, kind = "info", ttl = 3500) {
    const iconName =
        { info: "info", success: "checkCircle", error: "alert" }[kind] ||
        "info";
    const t = el("div", {
        class: `toast toast-${kind}`,
        html: iconHTML(iconName, 14) + `<span>${msg}</span>`,
    });
    $("#toast-host").append(t);
    setTimeout(() => {
        t.style.opacity = "0";
        t.style.transform = "translateX(20px)";
        t.style.transition = "all .3s";
    }, ttl - 350);
    setTimeout(() => t.remove(), ttl);
}

function showBanner(kind, htmlMsg) {
    const host = $("#banner-host");
    const iconName =
        { info: "info", warn: "alert", error: "alert" }[kind] || "info";
    const banner = el("div", {
        class: `banner banner-${kind}`,
        html: iconHTML(iconName, 16) + `<span>${htmlMsg}</span>`,
    });
    const x = el("button", {
        class: "banner-x",
        text: "×",
        onclick: () => banner.remove(),
    });
    banner.append(x);
    host.append(banner);
}

// Map an Excel step label to one or more universal step labels.
function mapExcelStep(excelStepLabel) {
    if (!excelStepLabel) return [];
    const overrides = {
        "Knowledge Search / RAG": ["Data Foundation"],
        "Data Foundation / Conversational Analytics": ["Data Foundation"],
        "Data Foundation / Lakehouse": ["Data Foundation"],
        "Data Foundation / Classification": ["Data Foundation"],
        "Sustainability / Cost-Carbon Tradeoff": [
            "Revenue / Network Optimization",
        ],
        "Customer Order, Claims, Compliance": [
            "Customer Order & Promise",
            "Customer Service & Claims",
        ],
        "Document AI / Shipping Documents": ["Customer Service & Claims"],
        "Customs / Trade Compliance": ["Customer Service & Claims"],
        "Proof of Delivery / Claims": ["Customer Service & Claims"],
        "Labor Planning / Capacity Planning": ["Demand & Supply Plan"],
        "Demand Sensing / Demand-Supply Plan": [
            "Demand Sensing",
            "Demand & Supply Plan",
        ],
        "Production Plan / Line Execution": [
            "Production Plan",
            "Line Execution",
        ],
        "Production Plan / Plant Cost": ["Production Plan"],
        "Line Execution / Process Monitor": ["Line Execution"],
        "Line Execution / Quality": ["Line Execution"],
        "Warehouse Receipt / Facility Scheduling": ["Warehouse Receipt"],
        "Warehouse Receipt / Billing": ["Warehouse Receipt"],
        "Route & Delivery Execution / Network Optimization": [
            "Route & Delivery Execution",
            "Revenue / Network Optimization",
        ],
        "Route & Delivery Execution / Freight Optimization": [
            "Route & Delivery Execution",
        ],
        "Route & Delivery Execution / Fleet": ["Route & Delivery Execution"],
        "Route & Delivery Execution / Cargo Delay": [
            "Route & Delivery Execution",
        ],
        "Demand & Supply Plan / Network Simulation": ["Demand & Supply Plan"],
        "Supplier Readiness / Procurement Planning": ["Supplier Readiness"],
        "Supplier Readiness / Spend Optimization": ["Supplier Readiness"],
        "Supplier Readiness / Fair Price": ["Supplier Readiness"],
    };
    if (overrides[excelStepLabel]) return overrides[excelStepLabel];

    // Heuristic: split tokens and substring match
    const lc = excelStepLabel.toLowerCase();
    const hits = STEPS.filter(
        (s) =>
            lc.includes(s.label.toLowerCase().split(" & ")[0].toLowerCase()) ||
            lc.includes(s.label.toLowerCase()),
    );
    if (hits.length) return hits.map((h) => h.label);
    return [excelStepLabel];
}

function rowsForStep(stepLabel) {
    return state.excelRows.filter((r) => {
        const mapped = mapExcelStep(r["Value Chain Step"] || "");
        return mapped.includes(stepLabel);
    });
}

function archetypeFitScore(row, archetype) {
    const fit = (row["Archetype Fit"] || "").toLowerCase();
    if (!fit) return 0;
    if (fit.includes(archetype.toLowerCase())) return 1;
    // Loose match on the head token
    const head = archetype.split("/")[0].trim().toLowerCase();
    return fit.includes(head) ? 0.6 : 0;
}

function relevanceScore(stepLabel) {
    let score = 0.3;
    const highList = ARCHETYPE_HIGH_STEPS[state.archetype] || [];
    if (highList.includes(stepLabel)) score = 0.8;

    const buyerBoosts = BUYER_STEP_BOOSTS[state.buyer] || {};
    score += buyerBoosts[stepLabel] || 0;

    if (state.inference?.relevant_value_chain_steps?.includes(stepLabel)) {
        score = Math.max(score, 0.78) + 0.08;
    }

    // Excel evidence
    const rows = rowsForStep(stepLabel);
    const archHits = rows.filter(
        (r) => archetypeFitScore(r, state.archetype) > 0.5,
    ).length;
    score += Math.min(0.1, archHits * 0.025);

    return Math.min(1, score);
}

function relevanceTier(score) {
    if (score >= 0.7) return "high";
    if (score >= 0.45) return "med";
    return "low";
}

// =====================================================================
// RENDER: Map header / sidebar
// =====================================================================

function populateSelects() {
    // archetypes
    const aOpts = ARCHETYPES.map(
        (a) => `<option value="${a.id}">${a.id}</option>`,
    ).join("");
    $("#archetype-select").innerHTML = aOpts;
    $("#calc-archetype").innerHTML = aOpts;
    $("#archetype-select").value = state.archetype;
    $("#calc-archetype").value = state.archetype;

    // buyers
    const bOpts = BUYERS.map(
        (b) => `<option value="${b.id}">${b.id}</option>`,
    ).join("");
    $("#buyer-select").innerHTML = bOpts;
    $("#calc-buyer").innerHTML = bOpts;
    $("#buyer-select").value = state.buyer;
    $("#calc-buyer").value = state.buyer;

    // objectives (calc)
    $("#calc-objective").innerHTML = OBJECTIVES.map(
        (o) => `<option>${o}</option>`,
    ).join("");
    $("#calc-objective").value = state.objective;
    $("#objective-select").value = state.objective;

    updateArchetypeHelper();
    updateBuyerHelper();
}

function updateArchetypeHelper() {
    const a = ARCHETYPES.find((x) => x.id === state.archetype);
    $("#archetype-helper").textContent = a ? `Examples: ${a.examples}` : "";
}

function updateBuyerHelper() {
    const b = BUYERS.find((x) => x.id === state.buyer);
    $("#buyer-helper").textContent = b ? `Focus: ${b.focus}` : "";
}

function renderChallengeLegend() {
    const host = $("#challenge-legend");
    host.innerHTML = "";
    for (const [k, v] of Object.entries(CHALLENGE_LABELS)) {
        const span = el("span", { class: "legend-item" }, [
            el("span", { class: `legend-dot ${v.cls}` }),
            el("span", { text: v.label }),
        ]);
        host.append(span);
    }
}

function renderInferenceCard() {
    const body = $("#inference-body");
    const mode = $("#inference-mode");
    body.innerHTML = "";
    if (!state.inference) {
        body.append(
            el(
                "div",
                { class: "muted-line" },
                "Enter a company name and click Analyze Company.",
            ),
        );
        const modeIcon = state.llmAvailable ? "cpu" : "helpCircle";
        mode.innerHTML =
            iconHTML(modeIcon, 11) +
            `<span>${state.llmAvailable ? "LLM ready" : "Manual"}</span>`;
        mode.className = state.llmAvailable
            ? "chip chip-accent"
            : "chip chip-grey";
        return;
    }
    const inf = state.inference;
    const modeLabel = inf._manual
        ? "Manual seed"
        : `LLM · ${Math.round((inf.confidence ?? 0.5) * 100)}%`;
    mode.innerHTML =
        iconHTML(inf._manual ? "helpCircle" : "cpu", 11) +
        `<span>${modeLabel}</span>`;
    mode.className = "chip chip-accent";

    const fields = [
        ["Industry", "tag", inf.inferred_industry],
        ["Archetype", "layers", inf.archetype],
        ["Operating model", "tool", inf.operating_model],
        ["Region", "globe", inf.region],
    ];
    fields.forEach(([k, ic, v]) => {
        if (v)
            body.append(
                el("div", {
                    class: "infer-row",
                    html: `<span class="infer-key">${iconHTML(ic, 11)}${k}:</span> <span class="infer-val">${v}</span>`,
                }),
            );
    });
    if (inf.summary)
        body.append(
            el("p", {
                class: "muted-line",
                text: inf.summary,
                style: "font-style: normal; color: var(--text-soft); margin: 8px 0 0;",
            }),
        );

    if (inf.assumptions?.length) {
        body.append(
            el("div", {
                class: "infer-row",
                html: `<span class="infer-key">${iconHTML("info", 11)}Assumptions</span>`,
            }),
        );
        const ul = el("ul", { class: "inference-list" });
        inf.assumptions.forEach((a) => ul.append(el("li", { text: a })));
        body.append(ul);
    }
    if (inf.missing_inputs_to_confirm?.length) {
        body.append(
            el("div", {
                class: "infer-row",
                html: `<span class="infer-key">${iconHTML("alert", 11)}Confirm with client</span>`,
            }),
        );
        const ul = el("ul", { class: "inference-list" });
        inf.missing_inputs_to_confirm.forEach((a) =>
            ul.append(el("li", { text: a })),
        );
        body.append(ul);
    }
}

// =====================================================================
// RENDER: Value-chain map
// =====================================================================

function renderMap() {
    const canvas = $("#map-canvas");
    canvas.innerHTML = "";

    for (const stage of STAGES) {
        const stageSteps = STEPS.filter((s) => s.stage === stage.id);
        const col = el("div", { class: "stage-col" });
        const head = el("div", { class: "stage-head" }, [
            el("span", {
                class: "stage-head-label",
                html:
                    iconHTML(STAGE_ICON[stage.id] || "grid", 13) +
                    `<span>${stage.label}</span>`,
            }),
            el("span", {
                class: "stage-count",
                text: String(stageSteps.length),
            }),
        ]);
        col.append(head);

        for (const step of stageSteps) {
            const score = relevanceScore(step.label);
            const tier = relevanceTier(score);
            const rows = rowsForStep(step.label);
            const demoCount = rows.filter((r) =>
                /demo|accelerator/i.test(r["Asset Type"] || ""),
            ).length;
            const caseCount = rows.filter((r) =>
                /case/i.test(r["Asset Type"] || ""),
            ).length;

            // If "show relevant only", hide low; or collapse
            if (state.showRelevantOnly && tier === "low") {
                const card = el(
                    "div",
                    {
                        class: `step-card r-low collapsed`,
                        "data-step": step.label,
                    },
                    [
                        el("div", { class: "step-row1" }, [
                            el("span", {
                                class: "step-num",
                                text: String(step.n),
                            }),
                        ]),
                        el("div", { class: "step-label", text: step.label }),
                    ],
                );
                if (state.selectedStep === step.label)
                    card.classList.add("selected");
                card.addEventListener("click", () => selectStep(step.label));
                attachStepTooltip(card, step.label);
                col.append(card);
                continue;
            }

            // dots
            const dotKeys = STEP_CHALLENGES[step.label] || [];
            const dots = el(
                "div",
                { class: "step-dots" },
                dotKeys.map((k) => {
                    return el("span", {
                        class: `cat-dot ${CHALLENGE_LABELS[k]?.cls || ""}`,
                        title: CHALLENGE_LABELS[k]?.label || k,
                    });
                }),
            );

            const card = el(
                "div",
                {
                    class: `step-card r-${tier}${state.selectedStep === step.label ? " selected" : ""}`,
                    "data-step": step.label,
                },
                [
                    el("div", { class: "step-row1" }, [
                        el("span", { class: "step-num", text: String(step.n) }),
                        el("span", { class: "relevance-pill", text: tier }),
                    ]),
                    el("div", { class: "step-label", text: step.label }),
                    el("div", { class: "step-meta" }, [
                        el("div", { class: "step-counts" }, [
                            demoCount
                                ? el("span", {
                                      class: "count-chip has-demo",
                                      text: `${demoCount} demo${demoCount > 1 ? "s" : ""}`,
                                  })
                                : null,
                            caseCount
                                ? el("span", {
                                      class: "count-chip has-case",
                                      text: `${caseCount} case${caseCount > 1 ? "s" : ""}`,
                                  })
                                : null,
                            !demoCount && !caseCount
                                ? el("span", {
                                      class: "count-chip",
                                      text: "no assets",
                                  })
                                : null,
                        ]),
                        dots,
                    ]),
                ],
            );
            card.addEventListener("click", () => selectStep(step.label));
            attachStepTooltip(card, step.label);
            col.append(card);
        }

        canvas.append(col);
    }
}

// =====================================================================
// Step-card hover tooltip
// Shows: Horizontal Tags · Client Question · all demo links (";" splits)
// =====================================================================

let _stepTooltipEl = null;
let _stepTooltipHideTimer = null;
let _stepTooltipBoundOnce = false;

function _ensureStepTooltip() {
    if (_stepTooltipEl) return _stepTooltipEl;
    _stepTooltipEl =
        document.getElementById("step-tooltip") ||
        (() => {
            const d = document.createElement("div");
            d.id = "step-tooltip";
            d.className = "step-tooltip";
            d.setAttribute("role", "tooltip");
            d.setAttribute("aria-hidden", "true");
            document.body.appendChild(d);
            return d;
        })();

    if (!_stepTooltipBoundOnce) {
        _stepTooltipBoundOnce = true;
        _stepTooltipEl.addEventListener("mouseenter", () => {
            if (_stepTooltipHideTimer) {
                clearTimeout(_stepTooltipHideTimer);
                _stepTooltipHideTimer = null;
            }
        });
        _stepTooltipEl.addEventListener("mouseleave", () => {
            _hideStepTooltipSoon(0);
        });
        // Hide on scroll / resize so it never floats over the wrong card.
        window.addEventListener(
            "scroll",
            () => _hideStepTooltipNow(),
            true,
        );
        window.addEventListener("resize", () => _hideStepTooltipNow());
    }
    return _stepTooltipEl;
}

function _buildStepTooltipContent(stepLabel) {
    const rows = rowsForStep(stepLabel);

    // Horizontal Tags - de-duped, preserves first-seen order.
    const tagSet = new Set();
    rows.forEach((r) => {
        (r["Horizontal Tags"] || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((t) => tagSet.add(t));
    });

    // Group by demo asset; each demo can have multiple URLs (semicolon-split).
    const demosByName = new Map();
    rows.forEach((r) => {
        const name = (r["Demo or Case Asset"] || "Demo").trim();
        const raw = (r["Demo Hyperlink"] || "").toString();
        const urls = raw
            .split(";")
            .map((s) => s.trim())
            .filter((u) => u && !isPlaceholderLink(u));
        if (!urls.length) return;
        if (!demosByName.has(name)) demosByName.set(name, new Set());
        const bucket = demosByName.get(name);
        urls.forEach((u) => bucket.add(u));
    });

    const wrap = el("div", { class: "step-tooltip-inner" });
    wrap.append(el("div", { class: "tt-title", text: stepLabel }));

    if (tagSet.size) {
        wrap.append(
            el("div", { class: "tt-section" }, [
                el("div", {
                    class: "tt-head",
                    html:
                        iconHTML("tag", 11) + `<span>Horizontal tags</span>`,
                }),
                el(
                    "div",
                    { class: "tt-tags" },
                    [...tagSet].map((t) =>
                        el("span", { class: "tt-chip", text: t }),
                    ),
                ),
            ]),
        );
    }

    const totalLinks = [...demosByName.values()].reduce(
        (n, s) => n + s.size,
        0,
    );

    const section = el("div", { class: "tt-section" }, [
        el("div", {
            class: "tt-head",
            html:
                iconHTML("eye", 11) +
                `<span>Demo link${totalLinks === 1 ? "" : "s"}</span>`,
        }),
    ]);

    if (!demosByName.size) {
        section.append(
            el("div", {
                class: "tt-empty",
                text: rows.length
                    ? "No demo links available for this step yet."
                    : "No assets linked in the workbook for this step.",
            }),
        );
    } else {
        const demoList = el("div", { class: "tt-demos" });
        [...demosByName.entries()].forEach(([name, urlSet]) => {
            const urls = [...urlSet];
            const demoBlock = el("div", { class: "tt-demo" });
            demoBlock.append(el("div", { class: "tt-demo-name", text: name }));
            const links = el("div", { class: "tt-links" });
            urls.forEach((url, i) => {
                const label = urls.length > 1 ? `Link ${i + 1}` : "Open demo";
                links.append(
                    el("a", {
                        class: "tt-link",
                        href: url,
                        target: "_blank",
                        rel: "noreferrer",
                        title: url,
                        html:
                            iconHTML("externalLink", 11) +
                            `<span>${label}</span>`,
                    }),
                );
            });
            demoBlock.append(links);
            demoList.append(demoBlock);
        });
        section.append(demoList);
    }
    wrap.append(section);

    return wrap;
}

function _positionStepTooltip(tt, anchor) {
    const margin = 10;
    const pad = 12;
    tt.style.left = "-9999px";
    tt.style.top = "-9999px";
    tt.style.maxWidth = "340px";
    const r = anchor.getBoundingClientRect();
    const ttRect = tt.getBoundingClientRect();
    const ttW = ttRect.width;
    const ttH = ttRect.height;

    let left = r.right + margin;
    let top = r.top;

    if (left + ttW > window.innerWidth - pad) {
        left = r.left - ttW - margin;
    }
    if (left < pad) {
        left = Math.min(
            window.innerWidth - ttW - pad,
            Math.max(pad, r.left),
        );
        top = r.bottom + margin;
    }
    if (top + ttH > window.innerHeight - pad) {
        top = Math.max(pad, window.innerHeight - ttH - pad);
    }
    tt.style.left = `${Math.round(left)}px`;
    tt.style.top = `${Math.round(top)}px`;
}

function _showStepTooltip(card, stepLabel) {
    if (_stepTooltipHideTimer) {
        clearTimeout(_stepTooltipHideTimer);
        _stepTooltipHideTimer = null;
    }
    const tt = _ensureStepTooltip();
    const content = _buildStepTooltipContent(stepLabel);
    if (!content) return;
    tt.innerHTML = "";
    tt.appendChild(content);
    tt.classList.add("visible");
    tt.setAttribute("aria-hidden", "false");
    _positionStepTooltip(tt, card);
}

function _hideStepTooltipSoon(delay = 120) {
    if (_stepTooltipHideTimer) clearTimeout(_stepTooltipHideTimer);
    _stepTooltipHideTimer = setTimeout(_hideStepTooltipNow, delay);
}

function _hideStepTooltipNow() {
    if (_stepTooltipHideTimer) {
        clearTimeout(_stepTooltipHideTimer);
        _stepTooltipHideTimer = null;
    }
    if (_stepTooltipEl) {
        _stepTooltipEl.classList.remove("visible");
        _stepTooltipEl.setAttribute("aria-hidden", "true");
    }
}

function attachStepTooltip(card, stepLabel) {
    card.addEventListener("mouseenter", () =>
        _showStepTooltip(card, stepLabel),
    );
    card.addEventListener("mouseleave", () => _hideStepTooltipSoon());
}

function selectStep(label) {
    state.selectedStep = label;
    $$(".step-card").forEach((c) =>
        c.classList.toggle("selected", c.dataset.step === label),
    );
    renderDetail();
}

// =====================================================================
// RENDER: detail pane
// =====================================================================

function renderDetail() {
    const pane = $("#detail-pane");
    // Preserve the pane-header (with toggle) and resizer mounted in setupResizablePanes().
    // pane.innerHTML = '' would otherwise blow them away on every step click.
    const KEEP = ["pane-header", "pane-resizer", "pane-toggle"];
    Array.from(pane.children).forEach((c) => {
        if (!c.classList || !KEEP.some((cls) => c.classList.contains(cls))) {
            c.remove();
        }
    });
    const step = state.selectedStep;
    if (!step) {
        pane.append(
            el("div", { class: "detail-placeholder" }, [
                el("div", {
                    class: "placeholder-icon",
                    html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="32" height="32"><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
                }),
                el("div", {
                    class: "placeholder-title",
                    text: "Select a value-chain step",
                }),
                el("div", {
                    class: "placeholder-sub",
                    text: "The detail panel shows the why, the levers, the data, and the proof points pulled from the demo workbook.",
                }),
            ]),
        );
        return;
    }

    const stepNo = STEPS.findIndex((s) => s.label === step) + 1;
    const stage = STEPS.find((s) => s.label === step)?.stage;
    const detail = STEP_DETAIL[step] || {};
    const tier = relevanceTier(relevanceScore(step));
    const tierMap = {
        high: "High relevance",
        med: "Medium relevance",
        low: "Lower relevance",
    };
    const tierChip = {
        high: "chip-accent",
        med: "chip-amber",
        low: "chip-grey",
    }[tier];

    pane.append(
        el("div", {
            class: "detail-eyebrow",
            html:
                iconHTML(STAGE_ICON[stage] || "grid", 12) +
                `<span>Step ${stepNo} · ${stage}</span>`,
        }),
    );
    pane.append(el("h2", { class: "detail-title", text: step }));

    pane.append(
        el("div", { class: "detail-row" }, [
            el("span", {
                class: `chip ${tierChip}`,
                html:
                    iconHTML(
                        tier === "high"
                            ? "target"
                            : tier === "med"
                              ? "flag"
                              : "info",
                        11,
                    ) + `<span>${tierMap[tier]}</span>`,
            }),
            el("span", {
                class: "chip",
                html:
                    iconHTML("layers", 11) + `<span>${state.archetype}</span>`,
            }),
            el("span", {
                class: "chip",
                html: iconHTML("user", 11) + `<span>${state.buyer}</span>`,
            }),
        ]),
    );

    // Why
    pane.append(
        makeSection(
            "Why this matters",
            "target",
            el("p", {
                text:
                    detail.why_default ||
                    "Critical handoff that shapes downstream cost and service.",
            }),
        ),
    );

    // Challenges
    if (detail.challenges)
        pane.append(
            makeSection(
                "Typical business challenges",
                "alert",
                makeList(detail.challenges),
            ),
        );

    // Levers
    if (detail.levers)
        pane.append(
            makeSection("AI & data levers", "cpu", makeList(detail.levers)),
        );

    // KPIs
    if (detail.kpis)
        pane.append(
            makeSection("Relevant KPIs", "barChart", makeList(detail.kpis)),
        );

    // Data
    if (detail.data)
        pane.append(
            makeSection("Required data", "database", makeList(detail.data)),
        );

    // Proof points from Excel
    const rows = rowsForStep(step);
    const proofSection = el("div", { class: "detail-section" }, [
        el("h4", {
            html:
                iconHTML("award", 13) +
                `<span>Proof points · demos &amp; case studies</span>`,
        }),
    ]);
    if (rows.length === 0) {
        proofSection.append(
            el("p", {
                class: "muted-line",
                text: "No assets linked in the workbook for this step yet.",
                style: "font-style: italic;",
            }),
        );
    } else {
        rows.slice(0, 6).forEach((r) =>
            proofSection.append(renderAssetCard(r)),
        );
        if (rows.length > 6)
            proofSection.append(
                el("p", {
                    class: "muted-line",
                    text: `+ ${rows.length - 6} more in the workbook`,
                    style: "margin-top: 6px;",
                }),
            );
    }
    pane.append(proofSection);

    // Discovery questions
    if (detail.questions)
        pane.append(
            makeSection(
                "Discovery questions",
                "message",
                makeList(detail.questions),
            ),
        );
}

function makeSection(title, iconName, content) {
    return el("div", { class: "detail-section" }, [
        el("h4", {
            html:
                iconHTML(iconName || "chevronRight", 13) +
                `<span>${title}</span>`,
        }),
        content,
    ]);
}

function makeList(items) {
    const ul = el("ul");
    items.forEach((i) => ul.append(el("li", { text: i })));
    return ul;
}

function isPlaceholderLink(url) {
    if (!url || typeof url !== "string") return true;
    const u = url.trim().toLowerCase();
    if (!u) return true;
    if (u.includes("placeholder")) return true;
    if (u === "tbd" || u === "n/a") return true;
    if (!/^https?:\/\//.test(u)) return true;
    return false;
}

function assetTypeChip(type) {
    const t = (type || "").toLowerCase();
    if (t.includes("case")) return { cls: "chip-blue", label: "Case study" };
    if (t.includes("accelerator") && !t.includes("demo"))
        return { cls: "chip-purple", label: "Accelerator" };
    if (t.includes("demo")) return { cls: "chip-accent", label: "Demo" };
    return { cls: "chip-grey", label: type || "Asset" };
}

function renderAssetCard(row) {
    const link = row["Demo Hyperlink"];
    const placeholder = isPlaceholderLink(link);
    const at = assetTypeChip(row["Asset Type"]);
    const tags = (row["Horizontal Tags"] || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4);

    const atIcon =
        { Demo: "eye", "Case study": "award", Accelerator: "zap" }[at.label] ||
        "package";
    const card = el("div", { class: "asset-card" });
    card.append(
        el("div", { class: "asset-top" }, [
            el("div", {
                class: "asset-name",
                text: row["Demo or Case Asset"] || "Unnamed asset",
            }),
            el("span", {
                class: `chip ${at.cls}`,
                html: iconHTML(atIcon, 11) + `<span>${at.label}</span>`,
            }),
        ]),
    );

    if (row["Client Question / Pain Point"]) {
        card.append(
            el("div", {
                class: "asset-pain",
                text: row["Client Question / Pain Point"],
            }),
        );
    }
    if (row["Description / Sales Positioning"]) {
        card.append(
            el("div", {
                class: "asset-desc",
                text: row["Description / Sales Positioning"],
            }),
        );
    }

    const foot = el("div", { class: "asset-foot" });
    if (placeholder) {
        foot.append(
            el("span", {
                class: "asset-link is-placeholder",
                html: iconHTML("link", 11) + `<span>Link to be added</span>`,
            }),
        );
    } else {
        foot.append(
            el("a", {
                class: "asset-link",
                href: link,
                target: "_blank",
                rel: "noreferrer",
                html: iconHTML("externalLink", 11) + `<span>Open demo</span>`,
            }),
        );
    }
    if (row["Typical Benefit Range"]) {
        foot.append(
            el("span", {
                class: "chip chip-green",
                html:
                    iconHTML("trendUp", 11) +
                    `<span>${row["Typical Benefit Range"]}</span>`,
            }),
        );
    }
    tags.forEach((t) => foot.append(el("span", { class: "chip", text: t })));
    card.append(foot);

    return card;
}

// =====================================================================
// RENDER: opportunity strip on Tab 1
// =====================================================================

function renderOpportunityStrip() {
    const host = $("#opportunity-strip");
    host.innerHTML = "";
    const ranked = rankedInitiatives().slice(0, 5);

    $("#strip-meta").textContent = ranked.length
        ? `${ranked.length} initiatives shown · ranked by archetype, role, value, proof`
        : "No initiatives for this archetype yet";

    ranked.forEach((init, idx) => {
        const rev = state.calc.revenue;
        const low = rev * init.low_pct;
        const high = rev * init.high_pct;
        const proofChip = proofChipFor(init.proof);
        const linkRow = bestDemoRowForInitiative(init);
        const link = linkRow ? linkRow["Demo Hyperlink"] : null;
        const placeholder = isPlaceholderLink(link);

        const proofIcon =
            {
                demo: "eye",
                case: "award",
                accelerator: "zap",
                concept: "helpCircle",
            }[init.proof] || "eye";
        const card = el("div", { class: "init-card" }, [
            el("div", { class: "init-card-top" }, [
                el("div", {}, [
                    el("span", { class: "init-rank", text: `#${idx + 1}` }),
                ]),
                el("span", {
                    class: `chip ${proofChip.cls}`,
                    html:
                        iconHTML(proofIcon, 11) +
                        `<span>${proofChip.label}</span>`,
                }),
            ]),
            el("div", { class: "init-name", text: init.name }),
            el("div", {
                class: "init-step",
                html:
                    iconHTML(
                        STAGE_ICON[
                            STEPS.find((s) => s.label === init.vc_step)?.stage
                        ] || "chevronRight",
                        11,
                    ) + `<span>${init.vc_step} · ${init.pool}</span>`,
            }),
            el("div", { class: "init-value" }, [
                el("span", { class: "vrange-low", text: formatMoney(low) }),
                el("span", { class: "vrange-sep", text: "-" }),
                el("span", { class: "vrange-high", text: formatMoney(high) }),
            ]),
            el("div", { class: "init-tags" }, [
                el("span", {
                    class: "init-tag",
                    html:
                        iconHTML("activity", 10) +
                        `<span>Effort ${init.effort}</span>`,
                }),
                el("span", {
                    class: "init-tag",
                    html: iconHTML("calendar", 10) + `<span>${init.tts}</span>`,
                }),
            ]),
            el("div", { class: "init-foot" }, [
                placeholder
                    ? el("span", {
                          class: "init-link is-placeholder",
                          html:
                              iconHTML("link", 11) +
                              `<span>Link to be added</span>`,
                      })
                    : el("a", {
                          class: "init-link",
                          href: link,
                          target: "_blank",
                          rel: "noreferrer",
                          html:
                              iconHTML("externalLink", 11) +
                              `<span>Open proof</span>`,
                      }),
                el("span", { class: "init-tag", text: init.vc_step }),
            ]),
        ]);
        card.addEventListener("click", () => selectStep(init.vc_step));
        host.append(card);
    });
}

function proofChipFor(proof) {
    const map = {
        demo: { cls: "chip-accent", label: "Demo" },
        case: { cls: "chip-blue", label: "Case study" },
        accelerator: { cls: "chip-purple", label: "Accelerator" },
        concept: { cls: "chip-grey", label: "Concept" },
    };
    return map[proof] || map.demo;
}

function bestDemoRowForInitiative(init) {
    const candidates = rowsForStep(init.vc_step);
    if (!candidates.length) return null;
    // prefer rows whose Demo Asset name / tags match initiative tags
    const tags = (init.tags || []).map((t) => t.toLowerCase());
    const tagRow = candidates.find((r) => {
        const hay = (
            (r["Horizontal Tags"] || "") +
            " " +
            (r["Demo or Case Asset"] || "")
        ).toLowerCase();
        return tags.some((t) => hay.includes(t));
    });
    return tagRow || candidates[0];
}

function rankedInitiatives() {
    const list = INITIATIVES[state.archetype] || INITIATIVES["CPG / bottler"];
    const buyerBoosts = BUYER_STEP_BOOSTS[state.buyer] || {};
    return list
        .map((init) => {
            const proofRow = bestDemoRowForInitiative(init);
            const hasProof =
                proofRow && !isPlaceholderLink(proofRow["Demo Hyperlink"]);
            const archetypeFit = ARCHETYPE_HIGH_STEPS[
                state.archetype
            ]?.includes(init.vc_step)
                ? 1
                : 0.5;
            const buyerFit = (buyerBoosts[init.vc_step] || 0) * 5; // up to 0.7
            const valuePot = init.high_pct / 0.01; // 0..roughly 2
            const speed = { S: 1, M: 0.7, L: 0.45 }[init.effort] || 0.5;
            const dataReady =
                { Low: 0.4, Developing: 0.6, Medium: 0.8, High: 1.0 }[
                    state.maturity
                ] || 0.7;
            const proofStrength =
                ({ demo: 0.7, case: 1.0, accelerator: 0.8, concept: 0.3 }[
                    init.proof
                ] || 0.5) * (hasProof ? 1.1 : 0.9);
            const cross =
                init.tags?.includes("data") ||
                init.vc_step === "Data Foundation"
                    ? 1
                    : 0.6;

            const score =
                archetypeFit * 20 +
                buyerFit * 15 +
                (Math.min(1.5, valuePot) / 1.5) * 20 +
                speed * 10 +
                dataReady * 10 +
                proofStrength * 15 +
                cross * 10;

            return { ...init, _score: score };
        })
        .sort((a, b) => b._score - a._score);
}

// =====================================================================
// RENDER: Calculator
// =====================================================================

function renderCalculator() {
    // sync inputs
    $("#calc-company").value = state.calc.company;
    $("#calc-archetype").value = state.archetype;
    $("#calc-buyer").value = state.buyer;
    $("#calc-region").value = state.region;
    $("#calc-revenue").value = state.calc.revenue;
    $("#revenue-display").textContent = formatCompact(state.calc.revenue);
    $("#calc-sites").value = state.calc.sites;
    $("#calc-warehouses").value = state.calc.warehouses;
    $("#calc-shipments").value = state.calc.shipments;
    $("#calc-distribution").value = state.calc.distribution;
    $("#calc-maturity").value = state.maturity;
    $("#calc-objective").value = state.objective;
    $("#calc-confidence").value = state.calc.confidence;
    $("#calc-confidence-display").textContent = `${state.calc.confidence}%`;
    $("#adopt-low").value = state.calc.adoptLow;
    $("#adopt-high").value = state.calc.adoptHigh;
    $("#overlap-low").value = state.calc.overlapLow;
    $("#overlap-high").value = state.calc.overlapHigh;

    renderRevenueDriversTable();
    renderCostPoolsTable();
    renderInitiativeTable();
    renderKpis();
    renderRoadmap();
    renderFormulaResult();
}

function renderRevenueDriversTable() {
    const tbody = $("#revenue-table tbody");
    tbody.innerHTML = "";
    const drivers =
        REVENUE_DRIVERS[state.archetype] || REVENUE_DRIVERS["CPG / bottler"];
    drivers.forEach((d, i) => {
        const override = state.calc.revDriverOverrides[d[0]] || {};
        const exposure = override.exposure ?? d[1];
        const leverLow = override.leverLow ?? d[2];
        const leverHigh = override.leverHigh ?? d[3];
        const uplift =
            state.calc.revenue * exposure * ((leverLow + leverHigh) / 2);

        const tr = el("tr", { "data-driver": d[0] });
        tr.append(el("td", { text: d[0] }));
        tr.append(
            numTd(
                "exposure",
                exposure,
                0.01,
                (v) => updateRevDriver(d[0], "exposure", v),
                "%",
            ),
        );
        tr.append(
            numTd(
                "leverLow",
                leverLow,
                0.005,
                (v) => updateRevDriver(d[0], "leverLow", v),
                "%",
            ),
        );
        tr.append(
            numTd(
                "leverHigh",
                leverHigh,
                0.005,
                (v) => updateRevDriver(d[0], "leverHigh", v),
                "%",
            ),
        );
        tr.append(el("td", { class: "right num", text: formatMoney(uplift) }));
        tbody.append(tr);
    });
}

function numTd(key, value, step, onChange, suffix = "") {
    const display = suffix === "%" ? (value * 100).toFixed(1) : value;
    const td = el("td", { class: "right" });
    const inp = el("input", {
        class: "cell-input",
        type: "number",
        step: String(step),
        value: String(display),
    });
    inp.addEventListener("change", () => {
        let n = parseFloat(inp.value);
        if (!isFinite(n)) return;
        if (suffix === "%") n = n / 100;
        onChange(n);
    });
    td.append(inp);
    if (suffix) td.append(document.createTextNode(" %"));
    return td;
}

function updateRevDriver(name, key, val) {
    const o = state.calc.revDriverOverrides[name] || {};
    o[key] = val;
    state.calc.revDriverOverrides[name] = o;
    renderRevenueDriversTable();
}

function renderCostPoolsTable() {
    const tbody = $("#cost-table tbody");
    tbody.innerHTML = "";
    const pools = COST_POOLS[state.archetype] || COST_POOLS["CPG / bottler"];
    pools.forEach((p) => {
        const override = state.calc.costPoolOverrides[p[0]] || {};
        const poolLow = override.poolLow ?? p[1];
        const poolHigh = override.poolHigh ?? p[2];
        const addrLow = override.addrLow ?? p[3];
        const addrHigh = override.addrHigh ?? p[4];
        const impLow = override.impLow ?? p[5];
        const impHigh = override.impHigh ?? p[6];

        const baseLow = state.calc.revenue * poolLow * addrLow;
        const baseHigh = state.calc.revenue * poolHigh * addrHigh;

        const tr = el("tr");
        tr.append(el("td", { text: p[0] }));
        tr.append(rangeCellPair(p[0], "pool", poolLow, poolHigh));
        tr.append(rangeCellPair(p[0], "addr", addrLow, addrHigh));
        tr.append(rangeCellPair(p[0], "imp", impLow, impHigh));
        tr.append(
            el("td", {
                class: "right num",
                text: `${formatMoney(baseLow)} - ${formatMoney(baseHigh)}`,
            }),
        );
        tbody.append(tr);
    });
}

function rangeCellPair(poolName, key, lowVal, highVal) {
    const td = el("td", { class: "right" });
    const wrap = el("div", {
        style: "display:inline-flex; gap:4px; align-items:center;",
    });
    const mk = (kk, v) => {
        const i = el("input", {
            class: "cell-input",
            type: "number",
            step: "0.001",
            value: (v * 100).toFixed(1),
        });
        i.style.width = "4.5rem";
        i.addEventListener("change", () => {
            let n = parseFloat(i.value);
            if (!isFinite(n)) return;
            updateCostPool(poolName, kk, n / 100);
        });
        return i;
    };
    wrap.append(mk(`${key}Low`, lowVal));
    wrap.append(el("span", { class: "thin", text: "-" }));
    wrap.append(mk(`${key}High`, highVal));
    wrap.append(el("span", { class: "thin", text: "%" }));
    td.append(wrap);
    return td;
}

function updateCostPool(name, key, val) {
    const o = state.calc.costPoolOverrides[name] || {};
    o[key] = val;
    state.calc.costPoolOverrides[name] = o;
    renderCostPoolsTable();
    renderInitiativeTable();
    renderKpis();
    renderRoadmap();
    renderFormulaResult();
}

// ---- Initiative computation ----

function confidenceRange() {
    const map = {
        Low: [0.5, 0.65],
        Developing: [0.55, 0.75],
        Medium: [0.7, 0.85],
        High: [0.85, 0.95],
    };
    return map[state.maturity] || map.Medium;
}

function computeInitiative(init) {
    const enabled = state.calc.initiativeEnabled[init.id] !== false;
    const override = state.calc.initiativeOverrides[init.id] || {};
    const low_pct = override.low_pct ?? init.low_pct;
    const high_pct = override.high_pct ?? init.high_pct;

    const rawLow = state.calc.revenue * low_pct;
    const rawHigh = state.calc.revenue * high_pct;

    const adoptLow = state.calc.adoptLow;
    const adoptHigh = state.calc.adoptHigh;
    const [confLow, confHigh] = confidenceRange();
    // Proof adjustments
    const proofAdj =
        { demo: 0.03, case: 0.05, accelerator: 0.03, concept: -0.05 }[
            init.proof
        ] || 0;

    const cLow = Math.max(0.1, Math.min(1, confLow + proofAdj));
    const cHigh = Math.max(0.1, Math.min(1, confHigh + proofAdj));

    const adjustedLow = rawLow * adoptLow * cLow;
    const adjustedHigh = rawHigh * adoptHigh * cHigh;

    // Confidence factor blended for user-supplied confidence slider
    const userConfFactor = state.calc.confidence / 100;
    const finalLow = adjustedLow * (0.6 + 0.4 * userConfFactor);
    const finalHigh = adjustedHigh * (0.6 + 0.4 * userConfFactor);

    return {
        enabled,
        init,
        low_pct,
        high_pct,
        rawLow,
        rawHigh,
        adjustedLow,
        adjustedHigh,
        finalLow,
        finalHigh,
        confLow: cLow,
        confHigh: cHigh,
        adoptLow,
        adoptHigh,
    };
}

function renderInitiativeTable() {
    const tbody = $("#initiative-table tbody");
    tbody.innerHTML = "";
    const list = rankedInitiatives();

    let sumLow = 0,
        sumHigh = 0;
    list.forEach((init) => {
        const c = computeInitiative(init);
        const tr = el("tr", { class: c.enabled ? "" : "tr-disabled" });
        // toggle
        const toggle = el("input", { class: "row-toggle", type: "checkbox" });
        toggle.checked = c.enabled;
        toggle.addEventListener("change", () => {
            state.calc.initiativeEnabled[init.id] = toggle.checked;
            renderInitiativeTable();
            renderKpis();
            renderRoadmap();
            renderFormulaResult();
        });
        tr.append(el("td", {}, [toggle]));
        tr.append(el("td", { text: init.name }));
        tr.append(el("td", { text: init.vc_step }));
        tr.append(el("td", { text: init.pool }));
        tr.append(el("td", { class: "mech-text", text: init.mechanism }));

        // low/high pct editable
        const mkPct = (key, val) => {
            const i = el("input", {
                class: "cell-input",
                type: "number",
                step: "0.001",
                value: (val * 100).toFixed(3),
            });
            i.addEventListener("change", () => {
                const n = parseFloat(i.value);
                if (!isFinite(n)) return;
                const o = state.calc.initiativeOverrides[init.id] || {};
                o[key] = n / 100;
                state.calc.initiativeOverrides[init.id] = o;
                renderInitiativeTable();
                renderKpis();
                renderRoadmap();
                renderFormulaResult();
            });
            return i;
        };
        const lt = el("td", { class: "right" }, [mkPct("low_pct", c.low_pct)]);
        const ht = el("td", { class: "right" }, [
            mkPct("high_pct", c.high_pct),
        ]);
        tr.append(lt);
        tr.append(ht);

        tr.append(
            el("td", { class: "right num", text: formatMoney(c.finalLow) }),
        );
        tr.append(
            el("td", { class: "right num", text: formatMoney(c.finalHigh) }),
        );
        tr.append(el("td", { text: init.effort }));
        tr.append(el("td", { text: init.tts }));
        tr.append(
            el("td", {}, [
                el("span", {
                    class: `chip ${proofChipFor(init.proof).cls}`,
                    text: proofChipFor(init.proof).label,
                }),
            ]),
        );

        // demo link
        const row = bestDemoRowForInitiative(init);
        const link = row?.["Demo Hyperlink"];
        const placeholder = isPlaceholderLink(link);
        tr.append(
            el("td", {}, [
                placeholder
                    ? el("span", {
                          class: "asset-link is-placeholder",
                          html:
                              iconHTML("link", 11) +
                              `<span>Link to be added</span>`,
                      })
                    : el("a", {
                          class: "asset-link",
                          href: link,
                          target: "_blank",
                          rel: "noreferrer",
                          html:
                              iconHTML("externalLink", 11) +
                              `<span>Open</span>`,
                      }),
            ]),
        );

        if (c.enabled) {
            sumLow += c.finalLow;
            sumHigh += c.finalHigh;
        }
        tbody.append(tr);
    });

    // totals row
    const olLow = state.calc.overlapLow / 100;
    const olHigh = state.calc.overlapHigh / 100;
    const totLow = sumLow * (1 - olLow);
    const totHigh = sumHigh * (1 - olHigh);
    const tr = el("tr", { class: "totals-row" });
    tr.append(el("td", {}));
    tr.append(el("td", { text: "Raw portfolio sum" }));
    tr.append(el("td"));
    tr.append(el("td"));
    tr.append(el("td"));
    tr.append(el("td"));
    tr.append(el("td"));
    tr.append(el("td", { class: "right num", text: formatMoney(sumLow) }));
    tr.append(el("td", { class: "right num", text: formatMoney(sumHigh) }));
    tr.append(el("td"));
    tr.append(el("td"));
    tr.append(el("td"));
    tr.append(el("td"));
    tbody.append(tr);

    const tr2 = el("tr", { class: "totals-row" });
    tr2.append(el("td"));
    tr2.append(
        el("td", {
            text: `Overlap-adjusted (${state.calc.overlapLow}-${state.calc.overlapHigh}%)`,
        }),
    );
    tr2.append(el("td"));
    tr2.append(el("td"));
    tr2.append(el("td"));
    tr2.append(el("td"));
    tr2.append(el("td"));
    tr2.append(el("td", { class: "right num", text: formatMoney(totLow) }));
    tr2.append(el("td", { class: "right num", text: formatMoney(totHigh) }));
    tr2.append(el("td"));
    tr2.append(el("td"));
    tr2.append(el("td"));
    tr2.append(el("td"));
    tbody.append(tr2);
}

function renderKpis() {
    const host = $("#kpi-grid");
    host.innerHTML = "";
    const list = rankedInitiatives();
    const computed = list.map(computeInitiative).filter((c) => c.enabled);
    const sumLow = computed.reduce((s, c) => s + c.finalLow, 0);
    const sumHigh = computed.reduce((s, c) => s + c.finalHigh, 0);
    const olLow = state.calc.overlapLow / 100;
    const olHigh = state.calc.overlapHigh / 100;
    const adjLow = sumLow * (1 - olLow);
    const adjHigh = sumHigh * (1 - olHigh);

    const quickWins = list.filter((i) => i.effort === "S").length;
    const pilots = computed.filter((c) => c.init.effort !== "L").length;
    const confPct = Math.round(state.calc.confidence);

    const cards = [
        {
            cls: "kpi-hero",
            icon: "trendUp",
            label: "Estimated AI opportunity (annualized)",
            val: `${formatMoney(adjLow)} - ${formatMoney(adjHigh)}`,
            sub: `Raw sum ${formatMoney(sumLow)} - ${formatMoney(sumHigh)} · overlap-adjusted`,
        },
        {
            icon: "list",
            label: "Initiatives mapped",
            val: String(computed.length),
            sub: `of ${list.length} candidates`,
        },
        {
            icon: "zap",
            label: "Quick wins",
            val: String(quickWins),
            sub: "effort = S",
        },
        {
            icon: "rocket",
            label: "Pilots recommended",
            val: String(Math.min(5, pilots)),
            sub: "12-week horizon",
        },
        {
            icon: "shield",
            label: "Confidence",
            val: `${confPct}%`,
            sub: `${state.maturity} data maturity`,
        },
    ];
    cards.forEach((c) => {
        host.append(
            el("div", { class: `kpi-card ${c.cls || ""}` }, [
                el("div", {
                    class: "kpi-label",
                    html: iconHTML(c.icon, 13) + `<span>${c.label}</span>`,
                }),
                el("div", { class: "kpi-value", text: c.val }),
                el("div", { class: "kpi-sub", text: c.sub }),
            ]),
        );
    });
}

function renderRoadmap() {
    const host = $("#roadmap-grid");
    host.innerHTML = "";
    const list = rankedInitiatives()
        .map(computeInitiative)
        .filter((c) => c.enabled);

    const phases = [
        {
            name: "Phase 1 — Quick wins",
            range: "0-3 months",
            effort: ["S"],
            icon: "zap",
            data: "Single-source data products. Lightweight integration.",
            stakeholders: "Ops lead, data team, vendor SE",
        },
        {
            name: "Phase 2 — Operational levers",
            range: "3-9 months",
            effort: ["M"],
            icon: "tool",
            data: "Cleaned, joined operational tables. Workflow integration.",
            stakeholders: "Function lead, CIO/CDO, change manager",
        },
        {
            name: "Phase 3 — Scaled transformation",
            range: "9-24 months",
            effort: ["L"],
            icon: "rocket",
            data: "Enterprise lakehouse, governance, model ops.",
            stakeholders: "C-suite sponsor, transformation office",
        },
    ];

    phases.forEach((p) => {
        const inits = list.filter((c) => p.effort.includes(c.init.effort));
        const lo = inits.reduce((s, c) => s + c.finalLow, 0);
        const hi = inits.reduce((s, c) => s + c.finalHigh, 0);
        const card = el("div", { class: "phase-card" });
        card.append(
            el("div", { class: "phase-head" }, [
                el("span", {
                    class: "phase-name",
                    html: iconHTML(p.icon, 14) + `<span>${p.name}</span>`,
                }),
                el("span", { class: "phase-range", text: p.range }),
            ]),
        );
        card.append(
            el("div", {
                class: "phase-value",
                text: `${formatMoney(lo)} - ${formatMoney(hi)}`,
            }),
        );
        const ul = el("ul", { class: "phase-list" });
        if (!inits.length)
            ul.append(el("li", { text: "— No initiatives in this phase —" }));
        inits.forEach((c) =>
            ul.append(
                el("li", {
                    html:
                        iconHTML("checkCircle", 12, "phase-check") +
                        `<span>${c.init.name}</span>`,
                }),
            ),
        );
        card.append(ul);
        card.append(
            el("div", {
                class: "phase-stakeholders",
                html:
                    iconHTML("database", 12) +
                    `<b>&nbsp;Data readiness:</b> ${p.data}`,
            }),
        );
        card.append(
            el("div", {
                class: "phase-stakeholders",
                html:
                    iconHTML("users", 12) +
                    `<b>&nbsp;Stakeholders:</b> ${p.stakeholders}`,
            }),
        );
        host.append(card);
    });
}

function renderFormulaResult() {
    const host = $("#formula-result");
    host.innerHTML = "";
    const list = rankedInitiatives()
        .map(computeInitiative)
        .filter((c) => c.enabled);
    const sumLow = list.reduce((s, c) => s + c.finalLow, 0);
    const sumHigh = list.reduce((s, c) => s + c.finalHigh, 0);
    const olLow = state.calc.overlapLow / 100;
    const olHigh = state.calc.overlapHigh / 100;
    const adjLow = sumLow * (1 - olLow);
    const adjHigh = sumHigh * (1 - olHigh);
    const [cLow, cHigh] = confidenceRange();

    const grid = el("div", { class: "grid" });
    const rows = [
        ["Revenue base", formatMoney(state.calc.revenue)],
        [
            "Adoption",
            `${state.calc.adoptLow.toFixed(2)} - ${state.calc.adoptHigh.toFixed(2)}`,
        ],
        [
            "Confidence (data maturity)",
            `${(cLow * 100).toFixed(0)}% - ${(cHigh * 100).toFixed(0)}%`,
        ],
        ["User confidence factor", `${state.calc.confidence}%`],
        ["Initiatives enabled", String(list.length)],
        [
            "Raw portfolio sum",
            `${formatMoney(sumLow)} - ${formatMoney(sumHigh)}`,
        ],
        [
            "Overlap discount",
            `${state.calc.overlapLow}% - ${state.calc.overlapHigh}%`,
        ],
    ];
    rows.forEach(([k, v]) => {
        grid.append(el("span", { class: "k", text: k }));
        grid.append(el("span", { class: "v", text: v }));
    });
    host.append(grid);
    host.append(
        el("div", {
            class: "total",
            text: `Overlap-adjusted opportunity: ${formatMoney(adjLow)} - ${formatMoney(adjHigh)} annualized`,
        }),
    );
}

// =====================================================================
// EXPORTS
// =====================================================================

function downloadBlob(filename, content, type = "text/plain") {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
    }, 100);
}

function scenarioSummary() {
    const list = rankedInitiatives().map(computeInitiative);
    const enabled = list.filter((c) => c.enabled);
    const sumLow = enabled.reduce((s, c) => s + c.finalLow, 0);
    const sumHigh = enabled.reduce((s, c) => s + c.finalHigh, 0);
    const olLow = state.calc.overlapLow / 100;
    const olHigh = state.calc.overlapHigh / 100;
    return {
        company_name: state.calc.company,
        archetype: state.archetype,
        buyer_role: state.buyer,
        region: state.region,
        revenue_usd: state.calc.revenue,
        data_maturity: state.maturity,
        primary_objective: state.objective,
        distribution_model: state.calc.distribution,
        confidence_pct: state.calc.confidence,
        assumptions: state.inference?.assumptions || [],
        missing_inputs_to_confirm:
            state.inference?.missing_inputs_to_confirm || [],
        relevant_value_chain_steps: STEPS.map((s) => s.label).filter(
            (l) => relevanceTier(relevanceScore(l)) !== "low",
        ),
        initiatives: enabled.map((c) => ({
            name: c.init.name,
            value_chain_step: c.init.vc_step,
            cost_revenue_pool: c.init.pool,
            mechanism: c.init.mechanism,
            effort: c.init.effort,
            time_to_pilot: c.init.tts,
            proof: c.init.proof,
            low_value_usd: Math.round(c.finalLow),
            high_value_usd: Math.round(c.finalHigh),
            demo_link: (() => {
                const row = bestDemoRowForInitiative(c.init);
                return row && !isPlaceholderLink(row["Demo Hyperlink"])
                    ? row["Demo Hyperlink"]
                    : null;
            })(),
        })),
        raw_value_range_usd: [Math.round(sumLow), Math.round(sumHigh)],
        overlap_adjusted_value_range_usd: [
            Math.round(sumLow * (1 - olLow)),
            Math.round(sumHigh * (1 - olHigh)),
        ],
    };
}

function exportCsv() {
    const summary = scenarioSummary();
    const headers = [
        "Initiative",
        "Value chain step",
        "Pool",
        "Mechanism",
        "Effort",
        "Time to pilot",
        "Proof",
        "Low value USD",
        "High value USD",
        "Demo link",
    ];
    const lines = [headers.join(",")];
    summary.initiatives.forEach((i) => {
        const row = [
            i.name,
            i.value_chain_step,
            i.cost_revenue_pool,
            i.mechanism,
            i.effort,
            i.time_to_pilot,
            i.proof,
            i.low_value_usd,
            i.high_value_usd,
            i.demo_link || "",
        ];
        lines.push(
            row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","),
        );
    });
    downloadBlob(
        `scenario_${slug(summary.company_name)}.csv`,
        lines.join("\n"),
        "text/csv",
    );
}

function exportJson() {
    const s = scenarioSummary();
    downloadBlob(
        `scenario_${slug(s.company_name)}.json`,
        JSON.stringify(s, null, 2),
        "application/json",
    );
}

function exportMarkdown() {
    const s = scenarioSummary();
    const lines = [
        `# Scenario summary — ${s.company_name}`,
        "",
        `- **Archetype:** ${s.archetype}`,
        `- **Buyer role:** ${s.buyer_role}`,
        `- **Region:** ${s.region}`,
        `- **Revenue:** ${formatMoney(s.revenue_usd)}`,
        `- **Data maturity:** ${s.data_maturity}`,
        `- **Primary objective:** ${s.primary_objective}`,
        `- **Confidence:** ${s.confidence_pct}%`,
        "",
        `## Estimated AI opportunity`,
        `- Raw portfolio sum: ${formatMoney(s.raw_value_range_usd[0])} - ${formatMoney(s.raw_value_range_usd[1])}`,
        `- Overlap-adjusted: **${formatMoney(s.overlap_adjusted_value_range_usd[0])} - ${formatMoney(s.overlap_adjusted_value_range_usd[1])}** annualized`,
        "",
        `## Relevant value-chain steps`,
        ...s.relevant_value_chain_steps.map((x) => `- ${x}`),
        "",
        `## Recommended initiatives`,
        ...s.initiatives.map(
            (i) =>
                `- **${i.name}** (${i.value_chain_step}) — ${formatMoney(i.low_value_usd)} - ${formatMoney(i.high_value_usd)} · ${i.effort} effort · ${i.time_to_pilot} · ${i.proof}${i.demo_link ? ` · [demo](${i.demo_link})` : ""}`,
        ),
        "",
        s.assumptions.length ? `## Assumptions` : "",
        ...s.assumptions.map((a) => `- ${a}`),
        "",
        s.missing_inputs_to_confirm.length ? `## Confirm with client` : "",
        ...s.missing_inputs_to_confirm.map((a) => `- ${a}`),
        "",
        `_Estimates are assumption-driven, not guaranteed benefits. Source workbook: supply_chain_demo_mapping.xlsx_`,
    ].filter((l) => l !== null && l !== undefined);
    downloadBlob(
        `scenario_${slug(s.company_name)}.md`,
        lines.join("\n"),
        "text/markdown",
    );
}

function slug(s) {
    return (s || "scenario")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
}

// =====================================================================
// EVENT WIRING
// =====================================================================

function wireEvents() {
    // tabs
    $$(".tab").forEach((t) =>
        t.addEventListener("click", () => {
            $$(".tab").forEach((tt) => tt.classList.toggle("active", tt === t));
            const id = t.dataset.tab;
            $("#tab-map").classList.toggle("active", id === "map");
            $("#tab-calc").classList.toggle("active", id === "calc");
            $$(".tab").forEach((tt) =>
                tt.setAttribute("aria-selected", tt === t ? "true" : "false"),
            );
            if (id === "calc") renderCalculator();
        }),
    );

    // sidebar fields (tab 1)
    $("#archetype-select").addEventListener("change", (e) => {
        state.archetype = e.target.value;
        $("#calc-archetype").value = e.target.value;
        updateArchetypeHelper();
        renderEverything();
    });
    $("#buyer-select").addEventListener("change", (e) => {
        state.buyer = e.target.value;
        $("#calc-buyer").value = e.target.value;
        updateBuyerHelper();
        renderEverything();
    });
    $("#region-input").addEventListener("change", (e) => {
        state.region = e.target.value;
        $("#calc-region").value = e.target.value;
        renderEverything();
    });
    $("#objective-select").addEventListener("change", (e) => {
        state.objective = e.target.value;
        $("#calc-objective").value = e.target.value;
        renderEverything();
    });
    $("#maturity-select").addEventListener("change", (e) => {
        state.maturity = e.target.value;
        $("#calc-maturity").value = e.target.value;
        renderEverything();
    });
    $("#toggle-relevant").addEventListener("change", (e) => {
        state.showRelevantOnly = e.target.checked;
        renderMap();
    });
    $("#toggle-quickwins").addEventListener("change", (e) => {
        state.quickWinsOnly = e.target.checked;
        renderOpportunityStrip();
    });

    // analyse
    $("#analyze-btn").addEventListener("click", onAnalyze);
    $("#company-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") onAnalyze();
    });

    // calc inputs
    $("#calc-company").addEventListener("change", (e) => {
        state.calc.company = e.target.value;
        renderKpis();
    });
    $("#calc-archetype").addEventListener("change", (e) => {
        state.archetype = e.target.value;
        $("#archetype-select").value = e.target.value;
        updateArchetypeHelper();
        renderEverything();
    });
    $("#calc-buyer").addEventListener("change", (e) => {
        state.buyer = e.target.value;
        $("#buyer-select").value = e.target.value;
        updateBuyerHelper();
        renderEverything();
    });
    $("#calc-region").addEventListener("change", (e) => {
        state.region = e.target.value;
        $("#region-input").value = e.target.value;
        renderEverything();
    });
    $("#calc-revenue").addEventListener("input", (e) => {
        state.calc.revenue = parseFloat(e.target.value) || 0;
        $("#revenue-display").textContent = formatCompact(state.calc.revenue);
        renderRevenueDriversTable();
        renderCostPoolsTable();
        renderInitiativeTable();
        renderKpis();
        renderRoadmap();
        renderFormulaResult();
        renderOpportunityStrip();
    });
    $("#calc-sites").addEventListener("change", (e) => {
        state.calc.sites = +e.target.value;
    });
    $("#calc-warehouses").addEventListener("change", (e) => {
        state.calc.warehouses = +e.target.value;
    });
    $("#calc-shipments").addEventListener("change", (e) => {
        state.calc.shipments = +e.target.value;
    });
    $("#calc-distribution").addEventListener("change", (e) => {
        state.calc.distribution = e.target.value;
    });
    $("#calc-maturity").addEventListener("change", (e) => {
        state.maturity = e.target.value;
        $("#maturity-select").value = e.target.value;
        renderEverything();
    });
    $("#calc-objective").addEventListener("change", (e) => {
        state.objective = e.target.value;
        $("#objective-select").value = e.target.value;
    });
    $("#calc-confidence").addEventListener("input", (e) => {
        state.calc.confidence = +e.target.value;
        $("#calc-confidence-display").textContent = `${state.calc.confidence}%`;
        renderInitiativeTable();
        renderKpis();
        renderRoadmap();
        renderFormulaResult();
    });
    $("#adopt-low").addEventListener("change", (e) => {
        state.calc.adoptLow = parseFloat(e.target.value) || 0;
        renderInitiativeTable();
        renderKpis();
        renderRoadmap();
        renderFormulaResult();
    });
    $("#adopt-high").addEventListener("change", (e) => {
        state.calc.adoptHigh = parseFloat(e.target.value) || 0;
        renderInitiativeTable();
        renderKpis();
        renderRoadmap();
        renderFormulaResult();
    });
    $("#overlap-low").addEventListener("change", (e) => {
        state.calc.overlapLow = parseFloat(e.target.value) || 0;
        renderInitiativeTable();
        renderKpis();
        renderFormulaResult();
    });
    $("#overlap-high").addEventListener("change", (e) => {
        state.calc.overlapHigh = parseFloat(e.target.value) || 0;
        renderInitiativeTable();
        renderKpis();
        renderFormulaResult();
    });

    // exports
    $("#export-csv").addEventListener("click", exportCsv);
    $("#export-json").addEventListener("click", exportJson);
    $("#export-md").addEventListener("click", exportMarkdown);

    // reset buttons (both sidebars share the same reset handler)
    const resetIds = ["#reset-btn-map", "#reset-btn-calc"];
    resetIds.forEach((sel) => {
        const btn = $(sel);
        if (!btn) return;
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            resetScenario(btn);
        });
    });
}

// ---- Reset all editable scenario fields back to SCENARIO_DEFAULTS ---------
function resetScenario(triggerBtn) {
    const fresh = SCENARIO_DEFAULTS();
    Object.assign(state, fresh);
    // calc is a nested object — replace it wholesale so override dicts clear too
    state.calc = fresh.calc;

    // Sync DOM inputs that aren't auto-bound to state by renderers
    $("#company-input").value = state.company;
    $("#calc-company").value = state.calc.company;
    $("#region-input").value = state.region;
    $("#calc-region").value = state.region;
    $("#archetype-select").value = state.archetype;
    $("#calc-archetype").value = state.archetype;
    $("#buyer-select").value = state.buyer;
    $("#calc-buyer").value = state.buyer;
    $("#objective-select").value = state.objective;
    $("#calc-objective").value = state.objective;
    $("#maturity-select").value = state.maturity;
    $("#calc-maturity").value = state.maturity;
    $("#toggle-relevant").checked = state.showRelevantOnly;
    $("#toggle-quickwins").checked = state.quickWinsOnly;
    updateArchetypeHelper();
    updateBuyerHelper();

    renderEverything();
    showToast("Scenario reset to defaults.", "success", 2200);

    // Brief flash so the user sees the action took effect
    if (triggerBtn) {
        triggerBtn.classList.remove("btn-reset-flash");
        // force reflow so the animation restarts on repeated clicks
        void triggerBtn.offsetWidth;
        triggerBtn.classList.add("btn-reset-flash");
    }
}

function renderEverything() {
    renderMap();
    renderDetail();
    renderOpportunityStrip();
    renderInferenceCard();
    renderCalculator();
}

// =====================================================================
// LLM ANALYZE
// =====================================================================

async function onAnalyze() {
    const name = ($("#company-input").value || "").trim();
    if (!name) {
        showToast("Enter a company name first.", "info");
        $("#company-input").focus();
        return;
    }
    state.company = name;
    state.calc.company = name;
    $("#calc-company").value = name;

    if (!state.llmAvailable) {
        // manual mode: use seed if recognised, otherwise just set company
        const seed = manualSeed(name);
        if (seed) {
            applyInference({ ...seed, _manual: true });
            showToast("Manual mode: applied built-in seed.", "info");
        } else {
            applyInference({
                company_name: name,
                archetype: state.archetype,
                confidence: 0.5,
                summary:
                    "Manual mode active — pick an archetype to refine the map.",
                assumptions: [
                    "OpenAI key not set. Using manual archetype defaults.",
                ],
                missing_inputs_to_confirm: [
                    "Confirm archetype",
                    "Confirm region",
                    "Confirm revenue",
                    "Confirm data maturity",
                ],
                _manual: true,
            });
            showToast(
                "Manual mode. Adjust archetype to refine the map.",
                "info",
            );
        }
        return;
    }

    // LLM mode
    setStatus("loading", `Analyzing ${name}…`);
    $("#analyze-btn").disabled = true;
    $("#analyze-btn").textContent = "Analyzing…";
    try {
        const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_name: name }),
        });
        const json = await res.json();
        if (!json.ok) {
            showToast(
                `LLM error: ${json.error}. Manual mode preserved.`,
                "error",
                5000,
            );
            setStatus("ready", `Ready · LLM via ${json.model || "openai"}`);
        } else {
            applyInference(json.data);
            setStatus("ready", `Ready · LLM ${json.model || ""}`);
            showToast(
                `Inferred ${json.data.archetype || "profile"} for ${name}`,
                "success",
            );
        }
    } catch (e) {
        showToast(`Request failed: ${e.message}`, "error", 5000);
        setStatus("error", "LLM request failed");
    } finally {
        $("#analyze-btn").disabled = false;
        $("#analyze-btn").innerHTML =
            `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="7"/></svg>Analyze Company`;
    }
}

function applyInference(data) {
    // Validate / coerce
    const inf = { ...data };
    if (typeof inf.confidence !== "number") inf.confidence = 0.5;
    inf.confidence = Math.max(0, Math.min(1, inf.confidence));

    const arche = ARCHETYPES.find((a) => a.id === inf.archetype);
    if (!arche) {
        showToast(
            `Unrecognised archetype "${inf.archetype}". Defaulted to ${state.archetype}.`,
            "info",
        );
        inf.archetype = state.archetype;
    } else {
        state.archetype = inf.archetype;
    }
    $("#archetype-select").value = state.archetype;
    $("#calc-archetype").value = state.archetype;
    updateArchetypeHelper();

    // filter steps to known universe
    if (Array.isArray(inf.relevant_value_chain_steps)) {
        inf.relevant_value_chain_steps = inf.relevant_value_chain_steps.filter(
            (s) => STEPS.some((u) => u.label === s),
        );
    }

    state.inference = inf;
    if (inf.company_name) {
        state.company = inf.company_name;
        state.calc.company = inf.company_name;
        $("#company-input").value = inf.company_name;
        $("#calc-company").value = inf.company_name;
    }
    if (inf.region) {
        state.region = inf.region;
        $("#region-input").value = inf.region;
        $("#calc-region").value = inf.region;
    }
    state.calc.confidence = Math.round(inf.confidence * 100);

    renderEverything();
}

function manualSeed(name) {
    const lc = name.toLowerCase();
    if (lc.includes("swire") || lc.includes("coca")) {
        return {
            company_name: name,
            inferred_industry: "Consumer packaged goods / beverages",
            archetype: "CPG / bottler",
            operating_model: "Manufacturing + warehousing + distribution",
            region: "Asia Pacific",
            confidence: 0.84,
            summary:
                "CPG bottler with manufacturing and distribution operations.",
            relevant_value_chain_steps: [
                "Demand Sensing",
                "Demand & Supply Plan",
                "Inventory & Safety Stock",
                "Supplier Readiness",
                "Production Plan",
                "Line Execution",
                "Warehouse Receipt",
                "Inventory Visibility",
                "Load & Dispatch",
                "Route & Delivery Execution",
                "Pricing & Trade",
                "Revenue / Network Optimization",
                "Data Foundation",
            ],
            assumptions: [
                "Assumed distribution-heavy bottling model.",
                "Assumed mixed owned + partner distribution.",
            ],
            missing_inputs_to_confirm: [
                "Annual revenue",
                "Number of plants",
                "Warehouse count",
                "Owned vs outsourced fleet mix",
            ],
        };
    }
    if (lc.includes("dpd")) {
        return {
            company_name: name,
            inferred_industry: "Parcel logistics",
            archetype: "Parcel / last-mile carrier",
            operating_model: "Depot + linehaul + last-mile + service",
            region: "United Kingdom",
            confidence: 0.85,
            summary:
                "UK parcel carrier across depot, linehaul, last-mile and customer service.",
            relevant_value_chain_steps: [
                "Demand Sensing",
                "Demand & Supply Plan",
                "Warehouse Receipt",
                "Load & Dispatch",
                "Route & Delivery Execution",
                "Customer Order & Promise",
                "Customer Service & Claims",
                "Pricing & Trade",
                "Revenue / Network Optimization",
                "Data Foundation",
            ],
            assumptions: [
                "Assumed UK-centric network.",
                "Assumed owned last-mile fleet with contractor mix.",
            ],
            missing_inputs_to_confirm: [
                "Annual parcel volume",
                "Depot count",
                "B2B/B2C mix",
                "Failed delivery rate",
            ],
        };
    }
    if (lc.includes("dhl")) {
        return {
            company_name: name,
            archetype: "3PL / logistics provider",
            inferred_industry: "Contract logistics",
            operating_model: "Multi-client warehousing + transport",
            region: "Global",
            confidence: 0.8,
            summary:
                "Contract logistics provider with multi-client operations.",
            relevant_value_chain_steps:
                ARCHETYPE_HIGH_STEPS["3PL / logistics provider"],
            assumptions: ["Assumed multi-client warehousing footprint."],
            missing_inputs_to_confirm: [
                "Customer mix",
                "Owned vs leased fleet",
            ],
        };
    }
    if (
        lc.includes("novartis") ||
        lc.includes("j&j") ||
        lc.includes("stryker") ||
        lc.includes("medtech") ||
        lc.includes("pharma")
    ) {
        return {
            company_name: name,
            archetype: "Pharma / MedTech manufacturer",
            inferred_industry: "Pharma / MedTech",
            operating_model:
                "Regulated manufacturing + cold-chain distribution",
            region: "Global",
            confidence: 0.78,
            summary:
                "Regulated manufacturer with quality, compliance and cold-chain emphasis.",
            relevant_value_chain_steps:
                ARCHETYPE_HIGH_STEPS["Pharma / MedTech manufacturer"],
            assumptions: ["Assumed strict GxP environment."],
            missing_inputs_to_confirm: [
                "Therapy mix",
                "Cold-chain footprint",
                "Regulatory geographies",
            ],
        };
    }
    return null;
}

function setStatus(kind, text) {
    const pill = $("#status-pill");
    pill.classList.remove(
        "status-loading",
        "status-ready",
        "status-manual",
        "status-error",
    );
    pill.classList.add(`status-${kind}`);
    $("#status-text").textContent = text;
}

// =====================================================================
// BOOT
// =====================================================================

async function boot() {
    populateSelects();
    renderChallengeLegend();
    wireEvents();
    decorateStaticIcons();
    setupResizablePanes();
    setupThemeToggle();
    renderEverything();

    // pre-fill the seed
    $("#company-input").value = state.company;

    // Config
    try {
        const cfg = await fetch("/api/config").then((r) => r.json());
        state.llmAvailable = !!cfg.llm_available;
        if (state.llmAvailable) {
            setStatus("ready", `LLM ready · ${cfg.model || ""}`);
        } else {
            setStatus("manual", "Manual mode (no OPENAI_API_KEY)");
            showBanner(
                "info",
                "OpenAI API key not found. Running in manual mode — every input is still editable.",
            );
        }
    } catch {
        state.llmAvailable = false;
        setStatus("error", "Backend unreachable");
    }

    // Excel
    try {
        const mp = await fetch("/api/mapping");
        if (!mp.ok) {
            const err = await mp.json().catch(() => ({}));
            throw new Error(err.detail || `HTTP ${mp.status}`);
        }
        const data = await mp.json();
        state.excelRows = data.rows || [];
        state.hasExcel = true;
        showToast(
            `Loaded ${data.row_count} rows from ${data.source_file}`,
            "success",
            2500,
        );
    } catch (e) {
        state.hasExcel = false;
        showBanner(
            "error",
            `<b>Demo mapping file not found.</b> Please place <code>supply_chain_demo_mapping.xlsx</code> in the app folder or set <code>EXCEL_PATH</code> in <code>.env</code>. (${e.message})`,
        );
        setStatus("error", "Excel missing");
    }

    // Seed default inference (Swire) so the user sees a populated view immediately
    if (!state.inference) {
        applyInference({ ...manualSeed("Swire Coca-Cola"), _manual: true });
    } else {
        renderEverything();
    }
}

boot();
