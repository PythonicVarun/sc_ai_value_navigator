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

const VISUAL_NODES = [
    { n: 1, label: "Demand Signals", steps: ["Demand Sensing", "Demand & Supply Plan"], icon: "activity", challenge: "planning" },
    { n: 2, label: "Supplier & Materials", steps: ["Supplier Readiness"], icon: "briefcase", challenge: "data" },
    { n: 3, label: "Inbound Logistics", steps: ["Inbound Receipt & Quality"], icon: "truck", challenge: "exec" },
    { n: 4, label: "Production Plan", steps: ["Production Plan"], icon: "calendar", challenge: "planning" },
    { n: 5, label: "Line Execution & Quality", steps: ["Line Execution"], icon: "tool", challenge: "exec" },
    { n: 6, label: "Warehouse Operations", steps: ["Warehouse Receipt", "Allocate & Pick"], icon: "warehouse", challenge: "exec" },
    { n: 7, label: "Inventory Visibility", steps: ["Inventory Visibility", "Inventory & Safety Stock"], icon: "eye", challenge: "data" },
    { n: 8, label: "Load & Dispatch", steps: ["Load & Dispatch"], icon: "package", challenge: "exec" },
    { n: 9, label: "Transport Execution", steps: ["Route & Delivery Execution"], icon: "map", challenge: "exec" },
    { n: 10, label: "Customer Handoff", steps: ["Customer Order & Promise"], icon: "user", challenge: "comm" },
    { n: 11, label: "Returns & Claims", steps: ["Customer Service & Claims"], icon: "refresh", challenge: "comp" },
    { n: 12, label: "Command Center", steps: ["Revenue / Network Optimization", "Pricing & Trade"], icon: "cpu", challenge: "comm" },
    { n: 13, label: "Data Foundation", steps: ["Data Foundation"], icon: "database", challenge: "foundation" }
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
    data: { label: "Data / Visibility Gaps", cls: "cat-data" },
    planning: { label: "Planning Disconnects", cls: "cat-planning" },
    exec: { label: "Execution Coordination", cls: "cat-exec" },
    comm: { label: "Commercial Decision Support", cls: "cat-comm" },
    comp: { label: "Compliance / Leakage", cls: "cat-comp" },
    foundation: { label: "Data Foundation", cls: "cat-foundation" },
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
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
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
        defaultCollapsed: true,
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
    header.className = `pane-header pane-header-${side} ${side === "left" ? "hidden" : ""}`;

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
    if (!host) return;
    host.innerHTML = "";
    for (const [k, v] of Object.entries(CHALLENGE_LABELS)) {
        const li = el("li", {}, [
            el("span", { class: `legend-dot ${v.cls}` }),
            document.createTextNode(v.label)
        ]);
        host.append(li);
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

function getStepIllustration(stepLabel) {
    const map = {
        "Demand Sensing": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Storefront base building -->
                <path d="M 40,55 L 60,65 V 45 L 40,35 Z" fill="#475569"/>
                <path d="M 60,65 L 80,55 V 35 L 60,45 Z" fill="#64748b"/>
                <!-- Awning / Canopy -->
                <path d="M 38,39 L 60,50 L 60,45 L 38,34 Z" fill="#f97316"/>
                <path d="M 60,50 L 82,39 L 82,34 L 60,45 Z" fill="#ffffff"/>
                <path d="M 44,42 L 60,50 L 60,45 L 44,37 Z" fill="#ffffff"/>
                <path d="M 60,50 L 76,42 L 76,37 L 60,45 Z" fill="#f97316"/>
                <!-- Doorway -->
                <path d="M 46,58 V 49 L 52,52 V 61 Z" fill="#0f172a"/>
                <!-- Floating wireless/radar sensing waves -->
                <path d="M 52,24 A 8 8 0 0 1 68,24" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" fill="none" class="radar-ring-1"/>
                <path d="M 46,18 A 14 14 0 0 1 74,18" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 3" fill="none" class="radar-ring-2"/>
                <path d="M 40,12 A 20 20 0 0 1 80,12" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" fill="none" class="radar-ring-3"/>
            </svg>
        `,
        "Demand & Supply Plan": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Clipboard backing -->
                <path d="M 45,28 L 75,43 L 65,70 L 35,55 Z" fill="#78350f"/>
                <!-- Paper -->
                <path d="M 48,32 L 72,44 L 64,66 L 40,54 Z" fill="#ffffff"/>
                <!-- Metallic Clip -->
                <path d="M 56,26 L 64,30 L 61,35 L 53,31 Z" fill="#94a3b8"/>
                <!-- Trend line projecting out in 3D -->
                <path d="M 35,62 L 50,47 L 65,52 L 85,32" stroke="#f97316" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="trend-line"/>
                <circle cx="85" cy="32" r="4.5" fill="#f97316" class="signal-pulse-1"/>
            </svg>
        `,
        "Inventory & Safety Stock": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Stacked inventory boxes -->
                <!-- Box 1 (Left) -->
                <path d="M 35,52 L 48,45.5 L 61,52 L 48,58.5 Z" fill="#fed7aa"/>
                <path d="M 35,52 L 48,58.5 V 68.5 L 35,62 Z" fill="#f97316"/>
                <path d="M 48,58.5 L 61,52 V 62 L 48,68.5 Z" fill="#ea580c"/>
                <!-- Box 2 (Right) -->
                <path d="M 55,57 L 68,50.5 L 81,57 L 68,63.5 Z" fill="#fed7aa"/>
                <path d="M 55,57 L 68,63.5 V 73.5 L 55,67 Z" fill="#f97316"/>
                <path d="M 68,63.5 L 81,57 V 67 L 68,73.5 Z" fill="#ea580c"/>
                <!-- Protecting Shield overlay -->
                <path d="M 60,18 C 70,22 78,22 82,25 C 82,38 74,48 60,55 C 46,48 38,38 38,25 C 42,22 50,22 60,18 Z" fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round" class="shield-float"/>
                <path d="M 52,36 L 57,41 L 68,30" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="shield-float"/>
            </svg>
        `,
        "Supplier Readiness": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Factory base/building -->
                <path d="M 35,55 L 60,67.5 V 47.5 L 35,35 Z" fill="#1e3a8a"/>
                <path d="M 60,67.5 L 85,55 V 35 L 60,47.5 Z" fill="#3b82f6"/>
                <!-- Sawtooth roofs -->
                <path d="M 35,35 L 47.5,22.5 L 47.5,30 Z" fill="#1e3a8a"/>
                <path d="M 47.5,22.5 L 72.5,10 L 72.5,17.5 L 47.5,30 Z" fill="#93c5fd"/>
                <path d="M 47.5,30 L 60,17.5 L 60,25 Z" fill="#1e3a8a"/>
                <path d="M 60,17.5 L 85,5 L 85,12.5 L 60,25 Z" fill="#93c5fd"/>
                <!-- Windows/details -->
                <path d="M 65,42.5 L 72,39 V 45 L 65,48.5 Z" fill="#ffffff" opacity="0.7"/>
                <path d="M 74,38 L 81,34.5 V 40.5 L 74,44 Z" fill="#ffffff" opacity="0.7"/>
            </svg>
        `,
        "Inbound Receipt & Quality": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Large 3D Container Box -->
                <path d="M 40,48 L 60,38 L 80,48 L 60,58 Z" fill="#ffedd5"/>
                <path d="M 40,48 L 60,58 V 70 L 40,60 Z" fill="#f97316"/>
                <path d="M 60,58 L 80,48 V 60 L 60,70 Z" fill="#ea580c"/>
                <!-- Flaps open -->
                <path d="M 40,48 L 30,40 L 50,30 L 60,38 Z" fill="#fed7aa" opacity="0.9"/>
                <path d="M 80,48 L 90,40 L 70,30 L 60,38 Z" fill="#fed7aa" opacity="0.9"/>
                <!-- Quality Check circle/badge -->
                <circle cx="82" cy="30" r="12" fill="#ffffff" stroke="#10b981" stroke-width="2.5" class="signal-pulse-2"/>
                <path d="M 77,30 L 80,33 L 87,26" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `,
        "Production Plan": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Factory building -->
                <path d="M 32,54 L 52,64 V 48 L 32,38 Z" fill="#475569"/>
                <path d="M 52,64 L 72,54 V 38 L 52,48 Z" fill="#64748b"/>
                <path d="M 32,38 L 52,28 L 72,38 L 52,48 Z" fill="#94a3b8"/>
                <!-- Standalone 3D rotating gear -->
                <circle cx="80" cy="35" r="14" fill="none" stroke="#3b82f6" stroke-width="3" stroke-dasharray="4 4" class="gear"/>
                <circle cx="80" cy="35" r="5" fill="#3b82f6"/>
                <!-- Wires connecting them -->
                <path d="M 52,48 C 65,48 70,35 80,35" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 3"/>
            </svg>
        `,
        "Line Execution": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Conveyor Belt -->
                <path d="M 25,60 L 85,30 L 95,35 L 35,65 Z" fill="#334155"/>
                <path d="M 25,60 L 35,65 V 68 L 25,63 Z" fill="#1e293b"/>
                <!-- Items on Belt -->
                <path d="M 40,51 L 46,48 L 52,51 L 46,54 Z" fill="#ffd7aa"/>
                <path d="M 40,51 L 46,54 V 58 L 40,55 Z" fill="#f97316"/>
                <path d="M 46,54 L 52,51 V 55 L 46,58 Z" fill="#ea580c"/>
                <!-- Robotic arm assembly -->
                <path d="M 72,40 V 22 L 56,18 L 48,32" fill="none" stroke="#475569" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="robot-arm"/>
                <circle cx="72" cy="40" r="3.5" fill="#334155"/>
                <circle cx="56" cy="18" r="3" fill="#334155"/>
                <!-- Laser scanner glow -->
                <polygon points="48,32 40,50 52,48" fill="rgba(239, 68, 68, 0.25)" class="laser-glow"/>
                <circle cx="48" cy="32" r="2" fill="#ef4444"/>
            </svg>
        `,
        "Warehouse Receipt": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Warehouse structure -->
                <path d="M 32,54 L 57,66.5 V 46.5 L 32,34 Z" fill="#cbd5e1"/>
                <path d="M 57,66.5 L 82,54 V 34 L 57,46.5 Z" fill="#94a3b8"/>
                <!-- Blue roof slopes -->
                <path d="M 32,34 L 57,21.5 L 82,9 L 57,21.5 Z" fill="#1e3a8a" opacity="0.2"/>
                <path d="M 32,34 L 57,21.5 L 82,14 L 57,26.5 Z" fill="#1e3a8a" opacity="0.3"/>
                <path d="M 32,34 L 57,21.5 L 82,9 Z" fill="#1e3a8a" opacity="0.2"/>
                <!-- Corrected roof geometry -->
                <path d="M 32,34 L 57,21.5 L 82,9 Z" fill="none"/>
                <!-- Solid roof faces -->
                <path d="M 32,34 L 57,21.5 L 82,34 L 57,46.5 Z" fill="#1e3a8a"/>
                <path d="M 57,21.5 L 82,9 L 107,21.5 L 82,34 Z" fill="#3b82f6"/>
                <!-- Loading bay door -->
                <path d="M 40,50 L 50,55 V 66.5 L 40,61.5 Z" fill="#1e293b"/>
            </svg>
        `,
        "Inventory Visibility": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Stacked pallets/boxes -->
                <path d="M 35,50 L 45,45 L 55,50 L 45,55 Z" fill="#ffd7aa"/>
                <path d="M 35,50 L 45,55 V 63 L 35,58 Z" fill="#f97316"/>
                <path d="M 45,55 L 55,50 V 58 L 45,63 Z" fill="#ea580c"/>
                <!-- Tablet / Screen overlay showing inventory count -->
                <path d="M 55,25 L 85,40 L 75,60 L 45,45 Z" fill="#1e293b" class="shield-float"/>
                <path d="M 58,28 L 82,40 L 73,57 L 49,45 Z" fill="#0f172a" class="shield-float"/>
                <!-- Chart on screen -->
                <path d="M 52,41 L 62,36 L 70,42 L 78,35" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shield-float"/>
            </svg>
        `,
        "Allocate & Pick": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Warehouse racks -->
                <path d="M 35,32 H 40 V 62 H 35 Z" fill="#64748b"/>
                <path d="M 65,47 H 70 V 77 H 65 Z" fill="#64748b"/>
                <!-- Shelves -->
                <path d="M 35,42 L 65,57 L 70,54.5 L 40,39.5 Z" fill="#94a3b8"/>
                <path d="M 35,52 L 65,67 L 70,64.5 L 40,49.5 Z" fill="#94a3b8"/>
                <!-- Boxes on shelves -->
                <path d="M 42,38 L 48,41 V 46 L 42,43 Z" fill="#f97316"/>
                <path d="M 52,43 L 58,46 V 51 L 52,48 Z" fill="#f97316"/>
                <path d="M 45,48 L 51,51 V 56 L 45,53 Z" fill="#3b82f6"/>
            </svg>
        `,
        "Load & Dispatch": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Loading bay wall -->
                <path d="M 25,25 L 55,40 V 68 L 25,53 Z" fill="#475569"/>
                <path d="M 32,36 L 48,44 V 68 L 32,60 Z" fill="#0f172a"/>
                <!-- Rear of trailer loading in -->
                <path d="M 48,44 L 58,39 V 59 L 48,64 Z" fill="#cbd5e1"/>
                <path d="M 58,39 L 85,25.5 V 45.5 L 58,59 Z" fill="#94a3b8"/>
                <!-- Red brake lights -->
                <circle cx="50" cy="61" r="1.5" fill="#ef4444"/>
                <circle cx="56" cy="58" r="1.5" fill="#ef4444"/>
            </svg>
        `,
        "Route & Delivery Execution": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Winding road segment -->
                <path d="M 20,62 Q 50,47 80,62 L 85,57 Q 50,42 15,57 Z" fill="#475569"/>
                <!-- Truck driving on it -->
                <!-- Cab -->
                <path d="M 56,43 L 64,39 L 70,42 L 62,46 Z" fill="#93c5fd"/>
                <path d="M 56,43 L 62,46 V 53 L 56,50 Z" fill="#1e3a8a"/>
                <path d="M 62,46 L 70,42 V 49 L 62,53 Z" fill="#3b82f6"/>
                <!-- Trailer -->
                <path d="M 34,36 L 46,30 L 58,36 L 46,42 Z" fill="#ffffff"/>
                <path d="M 34,36 L 46,42 V 49 L 34,43 Z" fill="#cbd5e1"/>
                <path d="M 46,42 L 58,36 V 43 L 46,49 Z" fill="#94a3b8"/>
            </svg>
        `,
        "Customer Order & Promise": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Storefront -->
                <path d="M 35,53 L 55,63 V 44 L 35,34 Z" fill="#e2e8f0"/>
                <path d="M 55,63 L 75,53 V 34 L 55,44 Z" fill="#cbd5e1"/>
                <path d="M 35,34 L 55,24 L 75,34 L 55,44 Z" fill="#94a3b8"/>
                <!-- Green Striped Awning -->
                <path d="M 33,39 L 55,50 L 55,45 L 33,34 Z" fill="#10b981"/>
                <path d="M 55,50 L 77,39 L 77,34 L 55,45 Z" fill="#ffffff"/>
                <!-- Shopping cart floating overlay -->
                <path d="M 62,28 H 72 L 78,46 H 65 Z" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shield-float"/>
                <circle cx="67" cy="50" r="2.5" fill="#f97316" class="shield-float"/>
                <circle cx="76" cy="50" r="2.5" fill="#f97316" class="shield-float"/>
            </svg>
        `,
        "Customer Service & Claims": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Speech/chat bubbles floating -->
                <path d="M 35,25 H 65 V 45 H 50 L 42,52 V 45 H 35 Z" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round" class="shield-float"/>
                <path d="M 50,38 H 80 V 58 H 65 L 57,65 V 58 H 50 Z" fill="#1e3a8a" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round" class="shield-float-delayed"/>
                <!-- Checkmark on front bubble -->
                <path d="M 60,46 L 64,50 L 72,42" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shield-float-delayed"/>
            </svg>
        `,
        "Pricing & Trade": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Slanted golden price tag -->
                <path d="M 40,22 L 75,22 L 92,39 L 75,56 L 40,56 Z" fill="#fbbf24" class="shield-float"/>
                <circle cx="50" cy="39" r="4.5" fill="#ffffff" class="shield-float"/>
                <text x="62" y="47" font-family="var(--font-heading)" font-size="24" font-weight="900" fill="#78350f" class="shield-float">$</text>
            </svg>
        `,
        "Revenue / Network Optimization": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Isometric platform floor -->
                <path d="M 30,60 L 60,75 L 90,60 L 60,45 Z" fill="#cbd5e1" opacity="0.4"/>
                <!-- Connected network nodes in 3D -->
                <!-- Central Hub -->
                <circle cx="60" cy="35" r="8" fill="#ea580c" stroke="#ffffff" stroke-width="2" class="network-node"/>
                <!-- Outer Hubs -->
                <circle cx="35" cy="45" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" class="network-node"/>
                <circle cx="85" cy="45" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" class="network-node"/>
                <circle cx="60" cy="18" r="5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" class="network-node"/>
                <!-- Connector lines -->
                <line x1="35" y1="45" x2="60" y2="35" stroke="#3b82f6" stroke-width="2"/>
                <line x1="85" y1="45" x2="60" y2="35" stroke="#3b82f6" stroke-width="2"/>
                <line x1="60" y1="18" x2="60" y2="35" stroke="#3b82f6" stroke-width="2"/>
                <path d="M 35,45 Q 60,60 85,45" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="2 2" fill="none"/>
            </svg>
        `,
        "Data Foundation": `
            <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
                <!-- Stacked database cylinders (isometric 3D) -->
                <!-- Cylinder 3 (Bottom) -->
                <ellipse cx="60" cy="55" rx="25" ry="7.5" fill="#60a5fa" stroke="#3b82f6" stroke-width="1.5"/>
                <path d="M 35,55 V 65 C 35,72 85,72 85,65 V 55 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
                <ellipse cx="60" cy="55" rx="25" ry="7.5" fill="#3b82f6"/>
                <!-- Cylinder 2 (Middle) -->
                <ellipse cx="60" cy="42" rx="25" ry="7.5" fill="#60a5fa" stroke="#3b82f6" stroke-width="1.5"/>
                <path d="M 35,42 V 52 C 35,49 85,49 85,52 V 42 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
                <ellipse cx="60" cy="42" rx="25" ry="7.5" fill="#3b82f6"/>
                <!-- Cylinder 1 (Top) -->
                <ellipse cx="60" cy="29" rx="25" ry="7.5" fill="#60a5fa" stroke="#3b82f6" stroke-width="1.5"/>
                <path d="M 35,29 V 39 C 35,36 85,36 85,39 V 29 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
                <ellipse cx="60" cy="29" rx="25" ry="7.5" fill="#60a5fa"/>
                <!-- Side guidelines -->
                <line x1="35" y1="29" x2="35" y2="65" stroke="#93c5fd" stroke-width="1" stroke-dasharray="2 2"/>
                <line x1="85" y1="29" x2="85" y2="65" stroke="#93c5fd" stroke-width="1" stroke-dasharray="2 2"/>
            </svg>
        `
    };
    return map[stepLabel] || `
        <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="step-svg">
            <circle cx="60" cy="45" r="15" stroke="var(--border-strong)" stroke-width="2"/>
            <line x1="60" y1="30" x2="60" y2="60" stroke="var(--border-strong)" stroke-width="2"/>
            <line x1="45" y1="45" x2="75" y2="45" stroke="var(--border-strong)" stroke-width="2"/>
        </svg>
    `;
}

// =====================================================================
// RENDER: Value-chain map
// =================================================
// Visual Node Helpers & Winding Layout Rendering
// =================================================

function rowsForVisualNode(node) {
    let allRows = [];
    for (const step of node.steps) {
        allRows.push(...rowsForStep(step));
    }
    return [...new Set(allRows)];
}

function _buildNodeTooltipContent(node) {
    const rows = rowsForVisualNode(node);

    // Horizontal Tags - de-duped
    const tagSet = new Set();
    rows.forEach((r) => {
        (r["Horizontal Tags"] || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((t) => tagSet.add(t));
    });

    // Group by demo asset
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
    wrap.append(el("div", { class: "tt-title", text: node.label }));

    if (tagSet.size) {
        wrap.append(
            el("div", { class: "tt-section" }, [
                el("div", {
                    class: "tt-head",
                    html: iconHTML("tag", 11) + `<span>Horizontal tags</span>`,
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
            html: iconHTML("eye", 11) + `<span>Demo link${totalLinks === 1 ? "" : "s"}</span>`,
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
                        html: iconHTML("externalLink", 11) + `<span>${label}</span>`,
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

function _showNodeTooltip(card, node) {
    if (_stepTooltipHideTimer) {
        clearTimeout(_stepTooltipHideTimer);
        _stepTooltipHideTimer = null;
    }
    const tt = _ensureStepTooltip();
    const content = _buildNodeTooltipContent(node);
    if (!content) return;
    tt.innerHTML = "";
    tt.appendChild(content);
    tt.classList.add("visible");
    tt.setAttribute("aria-hidden", "false");
    _positionStepTooltip(tt, card);
}

function attachNodeTooltip(card, node) {
    card.addEventListener("mouseenter", () => _showNodeTooltip(card, node));
    card.addEventListener("mouseleave", () => _hideStepTooltipSoon());
}

function renderMap() {
    const canvas = $("#map-canvas");
    canvas.innerHTML = "";

    // Append absolute-positioned winding path connector SVG at the back
    const pathSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    pathSvg.setAttribute("viewBox", "0 0 1000 400");
    pathSvg.setAttribute("preserveAspectRatio", "none");
    pathSvg.setAttribute("class", "map-path-overlay");
    pathSvg.style.position = "absolute";
    pathSvg.style.top = "0";
    pathSvg.style.left = "0";
    pathSvg.style.width = "100%";
    pathSvg.style.height = "100%";
    pathSvg.style.pointerEvents = "none";
    pathSvg.style.zIndex = "0";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // Connect coordinates:
    // Row 1 centers (1 to 7): spaced evenly across 1000px: 71, 214, 357, 500, 643, 786, 928 (at y=100)
    // Row 2 centers (8 to 12) align vertically: 71, 214, 357, (blank under col 4), 643, 786 (at y=280)
    path.setAttribute("d", "M 71,100 L 928,100 C 990,100 990,190 500,190 C 10,190 10,280 71,280 L 786,280");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "var(--border-strong)");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-dasharray", "6 6");
    pathSvg.appendChild(path);

    // Draw the theme-aware flow block chevrons along the path
    const drawChevron = (x, y, isLong = false) => {
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const w = isLong ? 40 : 16;
        const d = `M ${x - w/2},${y - 6} L ${x + w/2 - 4},${y - 6} L ${x + w/2 - 4},${y - 12} L ${x + w/2 + 6},${y} L ${x + w/2 - 4},${y + 12} L ${x + w/2 - 4},${y + 6} L ${x - w/2},${y + 6} Z`;
        arrow.setAttribute("d", d);
        arrow.setAttribute("fill", "var(--surface)");
        arrow.setAttribute("stroke", "var(--border-strong)");
        arrow.setAttribute("stroke-width", "1.5");
        pathSvg.appendChild(arrow);
    };

    // Row 1 chevrons
    drawChevron(142.5, 100);
    drawChevron(285.5, 100);
    drawChevron(428.5, 100);
    drawChevron(571.5, 100);
    drawChevron(714.5, 100);
    drawChevron(857.0, 100);

    // Row 2 chevrons
    drawChevron(142.5, 280);
    drawChevron(285.5, 280);
    drawChevron(500.0, 280, true); // spans gap under col 4
    drawChevron(714.5, 280);

    canvas.appendChild(pathSvg);

    for (const node of VISUAL_NODES) {
        // Calculate max relevance score among its steps
        let maxScore = 0.3;
        let hasRelevantStep = false;
        for (const stepName of node.steps) {
            const score = relevanceScore(stepName);
            if (score > maxScore) maxScore = score;
            if (relevanceTier(score) !== "low") {
                hasRelevantStep = true;
            }
        }

        const tier = relevanceTier(maxScore);
        const stars = (1.0 + maxScore * 4.0).toFixed(1);
        const isSelected = node.steps.includes(state.selectedStep);
        const isFaded = state.showRelevantOnly && !hasRelevantStep;

        if (node.n === 13) {
            // Data Foundation card (spans all columns)
            const nodeCard = el("div", {
                class: `step-card node-container node-13 r-${tier}${isSelected ? " selected" : ""}${isFaded ? " faded" : ""}`,
                "data-step": node.steps[0],
                "data-node": "13"
            }, [
                el("div", { class: "foundation-sub-column left-sub" }, [
                    el("div", { class: "sub-node", html: iconHTML("download", 12) + "<span>Data Ingestion</span>" }),
                    el("div", { class: "sub-node", html: iconHTML("layers", 12) + "<span>Master Data</span>" }),
                    el("div", { class: "sub-node", html: iconHTML("checkSquare", 12) + "<span>Data Quality</span>" })
                ]),
                el("div", { class: "foundation-center" }, [
                    el("div", { class: "node-num-badge cat-foundation", text: "13" }),
                    el("div", { class: "foundation-center-text" }, [
                        el("div", { class: "foundation-title", text: "Data Foundation" }),
                        el("div", { class: "foundation-subtitle", text: "Trusted · Connected · Governed" })
                    ])
                ]),
                el("div", { class: "foundation-sub-column right-sub" }, [
                    el("div", { class: "sub-node", html: iconHTML("shield", 12) + "<span>Data Governance</span>" }),
                    el("div", { class: "sub-node", html: iconHTML("cpu", 12) + "<span>AI/ML Platform</span>" }),
                    el("div", { class: "sub-node", html: iconHTML("gitBranch", 12) + "<span>APIs & Integration</span>" })
                ])
            ]);

            nodeCard.addEventListener("click", () => {
                const wasSelected = node.steps.includes(state.selectedStep);
                if (wasSelected) {
                    clearSelectedStep();
                } else {
                    selectStep("Data Foundation");
                }
            });
            attachNodeTooltip(nodeCard, node);
            canvas.append(nodeCard);
        } else {
            // Normal 1 to 12 node card
            const nodeCard = el("div", {
                class: `step-card node-container node-${node.n} r-${tier}${isSelected ? " selected" : ""}${isFaded ? " faded" : ""}`,
                "data-step": node.steps[0],
                "data-node": String(node.n)
            }, [
                el("span", { class: `node-num-badge cat-${node.challenge}`, text: String(node.n) }),
                el("div", { class: "node-platform" }, [
                    el("div", { class: "node-illustration", html: getStepIllustration(node.steps[0]) })
                ]),
                el("div", { class: "node-card" }, [
                    el("div", { class: "node-title", text: node.label }),
                    el("div", { class: "node-stars-row" }, [
                        el("span", { class: "node-stars", text: `★ ${stars}` })
                    ])
                ])
            ]);

            nodeCard.addEventListener("click", () => {
                const wasSelected = node.steps.includes(state.selectedStep);
                if (wasSelected) {
                    clearSelectedStep();
                } else {
                    selectStep(node.steps[0]);
                }
            });
            attachNodeTooltip(nodeCard, node);
            canvas.append(nodeCard);
        }
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

function clearSelectedStep() {
    state.selectedStep = null;
    $$(".step-card").forEach((c) => c.classList.remove("selected"));
    renderDetail();

    const detailPane = $("#detail-pane");
    if (detailPane && !detailPane.classList.contains("pane-collapsed")) {
        const toggleBtn = detailPane.querySelector(".pane-toggle");
        if (toggleBtn) {
            toggleBtn.click();
        }
    }
}

function selectStep(label) {
    const detailPane = $("#detail-pane");
    const wasAlreadySelected = state.selectedStep === label;
    const shouldCollapse = wasAlreadySelected && detailPane && !detailPane.classList.contains("pane-collapsed");

    state.selectedStep = wasAlreadySelected ? null : label;
    $$(".step-card").forEach((c) =>
        c.classList.toggle("selected", c.dataset.step === state.selectedStep),
    );
    renderDetail();

    if (!detailPane) return;

    const toggleBtn = detailPane.querySelector(".pane-toggle");
    if (!toggleBtn) return;

    if (shouldCollapse) {
        toggleBtn.click();
    } else if (!wasAlreadySelected) {
        if (detailPane.classList.contains("pane-collapsed")) {
            toggleBtn.click();
        }
    }
}

function wireDetailPaneCollapseSync() {
    const detailPane = $("#detail-pane");
    const toggleBtn = detailPane?.querySelector(".pane-toggle");
    if (!detailPane || !toggleBtn || toggleBtn.dataset.selectionSyncBound === "1") return;

    toggleBtn.dataset.selectionSyncBound = "1";
    toggleBtn.addEventListener("click", () => {
        if (detailPane.classList.contains("pane-collapsed") && state.selectedStep) {
            clearSelectedStep();
        }
    });
}

// =====================================================================
// RENDER: detail pane
// =====================================================================

const NODE_IMPACT_METRICS = {
    1: [
        { val: "10-20%", label: "WAPE Reduction" },
        { val: "15-30%", label: "Bias Improvement" },
        { val: "2-5%", label: "Inventory Reduction" },
        { val: "1-3%", label: "Revenue Capture" }
    ],
    2: [
        { val: "15-25%", label: "Lead Time Variance" },
        { val: "8-15%", label: "Stockout Reduction" },
        { val: "5-10%", label: "Material Cost" },
        { val: "95%+", label: "Supplier OTIF" }
    ],
    3: [
        { val: "10-18%", label: "Demurrage Savings" },
        { val: "12-20%", label: "Dwell Time" },
        { val: "5-10%", label: "Freight Cost" },
        { val: "8-15%", label: "Inspection Speed" }
    ],
    4: [
        { val: "10-15%", label: "Schedule Adherence" },
        { val: "8-12%", label: "Capacity Production" },
        { val: "15-25%", label: "Setup Time" },
        { val: "5-10%", label: "Scrap Reduction" }
    ],
    5: [
        { val: "15-30%", label: "Defect Reduction" },
        { val: "5-12%", label: "OEE Improvement" },
        { val: "10-20%", label: "Downtime Reduction" },
        { val: "8-15%", label: "Yield Increase" }
    ],
    6: [
        { val: "15-25%", label: "Labor Productivity" },
        { val: "18-20%", label: "Order Cycle Time" },
        { val: "8-15%", label: "Inventory Accuracy" },
        { val: "5-12%", label: "Cost Reduction" }
    ],
    7: [
        { val: "10-20%", label: "Safety Stock Red." },
        { val: "15-30%", label: "Write-offs Red." },
        { val: "98%+", label: "Stock Accuracy" },
        { val: "5-10%", label: "Working Capital" }
    ],
    8: [
        { val: "8-15%", label: "Cube Utilization" },
        { val: "10-20%", label: "Turnaround Time" },
        { val: "5-12%", label: "Labor Cost" },
        { val: "99%+", label: "Dispatch Accuracy" }
    ],
    9: [
        { val: "10-18%", label: "Mileage Reduction" },
        { val: "15-25%", label: "Route Efficiency" },
        { val: "8-12%", label: "Fuel Savings" },
        { val: "95%+", label: "Delivery OTIF" }
    ],
    10: [
        { val: "20-30%", label: "Order Inquiries Red." },
        { val: "5-10%", label: "Retention Increase" },
        { val: "98%+", label: "Order Accuracy" },
        { val: "2-4 days", label: "Cycle Time" }
    ],
    11: [
        { val: "15-25%", label: "Processing Cost Red." },
        { val: "20-35%", label: "Cycle Time Red." },
        { val: "10-15%", label: "Fraud Leakage Red." },
        { val: "30%+", label: "Customer Sat." }
    ],
    12: [
        { val: "25-40%", label: "Resolution Speed" },
        { val: "15-20%", label: "Cross-functional Coor." },
        { val: "5-10%", label: "Revenue Capture" },
        { val: "100%", label: "Real-time Visibility" }
    ],
    13: [
        { val: "50-80%", label: "Data Prep Time Red." },
        { val: "99%+", label: "Master Data Quality" },
        { val: "30-50%", label: "API Integration Cost" },
        { val: "100%", label: "Governance Auditable" }
    ]
};

function renderDetail() {
    const pane = $("#detail-pane");
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

    const visualNode = VISUAL_NODES.find((n) => n.steps.includes(step));
    if (!visualNode) return;

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

    // Detail Pane Header Row
    const headerRow = el("div", { class: "detail-header-row" }, [
        el("div", { class: "detail-header-left" }, [
            el("span", { class: `detail-num-badge cat-${visualNode.challenge}`, text: String(visualNode.n) }),
            el("h2", { class: "detail-title", text: visualNode.label })
        ]),
        el("button", {
            class: "detail-close-btn",
            html: iconHTML("x", 12),
            title: "Clear selection"
        })
    ]);
    headerRow.querySelector(".detail-close-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        clearSelectedStep();
    });
    pane.append(headerRow);

    // Metadata Chips Row
    pane.append(
        el("div", { class: "detail-row" }, [
            el("span", {
                class: `chip ${tierChip}`,
                html: iconHTML(tier === "high" ? "target" : tier === "med" ? "flag" : "info", 11) + `<span>${tierMap[tier]}</span>`,
            }),
            el("span", {
                class: "chip",
                html: iconHTML("layers", 11) + `<span>${state.archetype}</span>`,
            }),
            el("span", {
                class: "chip",
                html: iconHTML("user", 11) + `<span>${state.buyer}</span>`,
            }),
        ]),
    );

    // Isometric Illustration Container
    const illustrationContainer = el("div", { class: "detail-illustration-container" }, [
        el("div", { class: "detail-illustration", html: getStepIllustration(visualNode.steps[0]) })
    ]);
    pane.append(illustrationContainer);

    // Aggregate Step Details
    let challenges = [];
    let levers = [];
    let kpis = [];
    let dataList = [];
    let questions = [];
    let whyText = "";

    visualNode.steps.forEach((s) => {
        const d = STEP_DETAIL[s] || {};
        if (!whyText) whyText = d.why_default;
        if (d.challenges) challenges.push(...d.challenges);
        if (d.levers) levers.push(...d.levers);
        if (d.kpis) kpis.push(...d.kpis);
        if (d.data) dataList.push(...d.data);
        if (d.questions) questions.push(...d.questions);
    });

    challenges = [...new Set(challenges)].slice(0, 5);
    levers = [...new Set(levers)].slice(0, 5);
    kpis = [...new Set(kpis)].slice(0, 5);
    dataList = [...new Set(dataList)].slice(0, 5);
    questions = [...new Set(questions)].slice(0, 5);

    // Why matters
    pane.append(
        makeSection(
            "Why this matters",
            "target",
            el("p", {
                text: whyText || "Critical stage that shapes downstream cost and service.",
            }),
        ),
    );

    // Business Challenges
    if (challenges.length) {
        pane.append(makeSection("Business Challenges", "alert", makeList(challenges)));
    }

    // AI Levers
    if (levers.length) {
        pane.append(makeSection("AI Levers", "cpu", makeList(levers)));
    }

    // Impact Metrics
    const metrics = NODE_IMPACT_METRICS[visualNode.n] || [];
    if (metrics.length) {
        const metricsGrid = el("div", { class: "detail-metrics-grid" },
            metrics.map(m => el("div", { class: "metric-card" }, [
                el("div", { class: "metric-val", text: m.val }),
                el("div", { class: "metric-label", text: m.label })
            ]))
        );
        pane.append(makeSection("Impact Metrics", "trendUp", metricsGrid));
    }

    // Proof points & Demos / Cases
    const allRows = rowsForVisualNode(visualNode);
    const proofSection = el("div", { class: "detail-section" }, [
        el("h4", {
            html: iconHTML("award", 13) + `<span>Proof points · demos &amp; case studies</span>`,
        }),
    ]);

    // Gather client brand names
    const clients = [];
    allRows.forEach(r => {
        const asset = (r["Demo or Case Asset"] || "").toLowerCase();
        const conver = (r["Best-fit Client Conversation"] || "").toLowerCase();
        if (asset.includes("walmart") || conver.includes("walmart")) clients.push("Walmart");
        if (asset.includes("dhl") || conver.includes("dhl")) clients.push("DHL");
        if (asset.includes("gxo") || conver.includes("gxo")) clients.push("GXO");
        if (asset.includes("maersk") || conver.includes("maersk")) clients.push("Maersk");
        if (asset.includes("swire") || conver.includes("swire") || asset.includes("coca") || conver.includes("coca")) clients.push("Swire Coca-Cola");
        if (asset.includes("kuehne") || conver.includes("kuehne") || asset.includes("nagel")) clients.push("Kuehne+Nagel");
        if (asset.includes("novartis") || conver.includes("novartis")) clients.push("Novartis");
        if (asset.includes("stryker") || conver.includes("stryker")) clients.push("Stryker");
        if (asset.includes("evri") || conver.includes("evri")) clients.push("Evri");
        if (asset.includes("fedex") || conver.includes("fedex")) clients.push("FedEx");
        if (asset.includes("johnson") || conver.includes("johnson") || asset.includes("j&j")) clients.push("J&J MedTech");
    });
    if (clients.length === 0) {
        allRows.forEach(r => {
            const name = r["Demo or Case Asset"] || "";
            if (name && name.length > 3) {
                const firstWord = name.split(" ")[0].replace(/[^a-zA-Z]/g, "");
                if (firstWord && firstWord.length > 2) clients.push(firstWord);
            }
        });
    }
    const uniqueClients = [...new Set(clients)].slice(0, 4);
    if (uniqueClients.length === 0) {
        uniqueClients.push("Walmart", "DHL", "GXO", "Maersk");
    }

    const brandContainer = el("div", { class: "detail-brands-strip" },
        uniqueClients.map(c => el("span", { class: "brand-logo-chip", text: c }))
    );
    proofSection.append(brandContainer);

    if (allRows.length === 0) {
        proofSection.append(
            el("p", {
                class: "muted-line",
                text: "No assets linked in the workbook for this step yet.",
                style: "font-style: italic; margin-top: 10px;",
            }),
        );
    } else {
        const cardContainer = el("div", { class: "detail-asset-cards" });
        allRows.slice(0, 4).forEach((r) => cardContainer.append(renderAssetCard(r)));
        proofSection.append(cardContainer);

        if (allRows.length > 4) {
            proofSection.append(
                el("p", {
                    class: "muted-line",
                    text: `+ ${allRows.length - 4} more in the workbook`,
                    style: "margin-top: 8px; font-size: 11px;",
                }),
            );
        }
    }
    pane.append(proofSection);

    // Discovery questions
    if (questions.length) {
        pane.append(makeSection("Discovery questions", "message", makeList(questions)));
    }

    // Playbook Button
    const playbookBtn = el("button", {
        class: "btn btn-primary playbook-btn",
        text: "View Detailed Playbook →",
        style: "width: 100%; margin-top: 24px; margin-bottom: 12px;"
    });
    playbookBtn.addEventListener("click", () => {
        showToast("Opening detailed playbook for " + visualNode.label + "...", "success");
        setTimeout(() => {
            window.open('/supply_chain_demo_mapping.xlsx', '_blank');
        }, 600);
    });
    pane.append(playbookBtn);
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

function getInitiativeIconSvg(name) {
    const n = name.toLowerCase();
    if (n.includes("route") || n.includes("dispatch") || n.includes("transport") || n.includes("delivery")) {
        return `
            <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="init-svg">
                <!-- Winding road segment -->
                <path d="M 20,45 Q 60,30 100,45 L 105,40 Q 60,25 15,40 Z" fill="#475569"/>
                <!-- Isometric Truck -->
                <path d="M 66,33 L 74,29 L 80,32 L 72,36 Z" fill="#93c5fd"/>
                <path d="M 56,33 L 62,36 V 43 L 56,40 Z" fill="#1e3a8a"/>
                <path d="M 62,36 L 70,32 V 39 L 62,43 Z" fill="#3b82f6"/>
                <path d="M 34,26 L 46,20 L 58,26 L 46,32 Z" fill="#ffffff"/>
                <path d="M 34,26 L 46,32 V 39 L 34,33 Z" fill="#cbd5e1"/>
                <path d="M 46,32 L 58,26 V 33 L 46,39 Z" fill="#94a3b8"/>
            </svg>
        `;
    }
    if (n.includes("demand") || n.includes("sensing") || n.includes("forecast") || n.includes("plan")) {
        return `
            <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="init-svg">
                <!-- Slanted clipboard backing -->
                <path d="M 45,18 L 75,33 L 65,60 L 35,45 Z" fill="#78350f"/>
                <path d="M 48,22 L 72,34 L 64,56 L 40,44 Z" fill="#ffffff"/>
                <!-- 3D trend line projecting -->
                <path d="M 30,52 L 48,34 L 66,39 L 88,15" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="trend-line"/>
                <circle cx="88" cy="15" r="3.5" fill="#f97316"/>
            </svg>
        `;
    }
    if (n.includes("warehouse") || n.includes("productivity") || n.includes("slotting") || n.includes("labor")) {
        return `
            <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="init-svg">
                <!-- Isometric warehouse loading dock -->
                <path d="M 30,22 L 60,37 V 65 L 30,50 Z" fill="#cbd5e1"/>
                <path d="M 60,37 L 90,22 V 50 L 60,65 Z" fill="#94a3b8"/>
                <path d="M 30,22 L 60,9 L 90,22 Z" fill="#1e3a8a"/>
                <path d="M 38,32 L 52,39 V 65 L 38,58 Z" fill="#1e293b"/>
            </svg>
        `;
    }
    if (n.includes("pricing") || n.includes("trade") || n.includes("margin") || n.includes("revenue")) {
        return `
            <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="init-svg">
                <!-- Isometric Golden tag -->
                <path d="M 38,20 L 73,20 L 90,37 L 73,54 L 38,54 Z" fill="#fbbf24"/>
                <circle cx="48" cy="37" r="4" fill="#ffffff"/>
                <text x="60" y="45" font-family="var(--font-heading)" font-size="22" font-weight="900" fill="#78350f">$</text>
            </svg>
        `;
    }
    return `
        <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="init-svg">
            <!-- Isometric database stack -->
            <ellipse cx="60" cy="48" rx="20" ry="6" fill="#60a5fa" stroke="#3b82f6" stroke-width="1"/>
            <path d="M 40,48 V 56 C 40,62 80,62 80,56 V 48 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="1"/>
            <ellipse cx="60" cy="48" rx="20" ry="6" fill="#3b82f6"/>

            <ellipse cx="60" cy="36" rx="20" ry="6" fill="#60a5fa" stroke="#3b82f6" stroke-width="1"/>
            <path d="M 40,36 V 44 C 40,40 80,40 80,44 V 36 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="1"/>
            <ellipse cx="60" cy="36" rx="20" ry="6" fill="#3b82f6"/>

            <ellipse cx="60" cy="24" rx="20" ry="6" fill="#60a5fa" stroke="#3b82f6" stroke-width="1"/>
            <path d="M 40,24 V 32 C 40,28 80,28 80,32 V 24 Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="1"/>
            <ellipse cx="60" cy="24" rx="20" ry="6" fill="#60a5fa"/>
        </svg>
    `;
}

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
        const linkRow = bestDemoRowForInitiative(init);
        const link = linkRow ? linkRow["Demo Hyperlink"] : null;
        const placeholder = isPlaceholderLink(link);

        const iconHtml = getInitiativeIconSvg(init.name);
        const impactRating = init.high_pct > 0.005 ? "High" : (init.high_pct > 0.002 ? "Medium" : "Low");
        const valueDollars = init.high_pct > 0.005 ? "$$$" : (init.high_pct > 0.002 ? "$$" : "$");

        const card = el("div", {
            class: `init-card-new init-card-rank-${idx + 1}`
        }, [
            // Top: badge & name
            el("div", { class: "init-header-block" }, [
                el("span", { class: "init-number-badge", text: String(idx + 1) }),
                el("div", { class: "init-name-new", text: init.name })
            ]),
            // Middle: Icon/Illustration container
            el("div", { class: "init-icon-wrapper", html: iconHtml }),
            // Middle-bottom: Description
            el("div", { class: "init-desc-new", text: init.mechanism || "AI-driven capability optimization across value chain." }),
            // Bottom: Impact & Value
            el("div", { class: "init-footer-block" }, [
                el("div", { class: "init-impact-col" }, [
                    el("span", { class: "init-impact-label", text: "Impact " }),
                    el("span", { class: `init-impact-val val-${impactRating.toLowerCase()}`, text: impactRating })
                ]),
                el("div", { class: "init-value-dollars", text: `${valueDollars} VALUE` })
            ])
        ]);

        if (link && !placeholder) {
            const linkIcon = el("a", {
                class: "init-direct-link",
                href: link,
                target: "_blank",
                rel: "noreferrer",
                title: "Open proof study directly",
                html: iconHTML("externalLink", 12)
            });
            linkIcon.addEventListener("click", (e) => e.stopPropagation());
            card.appendChild(linkIcon);
        }

        card.addEventListener("click", () => {
            selectStep(init.vc_step);
        });
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
    wireDetailPaneCollapseSync();
    setupThemeToggle();
    renderEverything();

    // Global keyboard shortcut CTRL+B to toggle left sidebar
    window.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
            // Only toggle if not focused in input/select fields to avoid typing conflict
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
            if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
                return;
            }
            e.preventDefault();
            const activePanel = document.querySelector(".tab-panel.active") || document.querySelector("main.active");
            if (activePanel) {
                const sidebar = activePanel.querySelector(".sidebar");
                if (sidebar) {
                    const toggleBtn = sidebar.querySelector(".pane-toggle");
                    if (toggleBtn) {
                        toggleBtn.click();
                    }
                }
            }
        }
    });

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
