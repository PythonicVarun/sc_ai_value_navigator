document.addEventListener("DOMContentLoaded", () => {
    // -- Theme toggle (mirrors the admin page behaviour) --
    (function setupThemeToggle() {
        const btn = document.getElementById("theme-toggle");
        if (!btn) return;
        const ICONS = {
            sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>',
            moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
        };
        function iconHTML(name, size = 14) {
            const inner = ICONS[name] || "";
            return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
        }
        const paint = () => {
            const isDark =
                document.documentElement.getAttribute("data-theme") === "dark";
            btn.innerHTML = iconHTML(isDark ? "sun" : "moon", 15);
            btn.title = isDark
                ? "Switch to light theme"
                : "Switch to dark theme";
            btn.setAttribute("aria-label", btn.title);
        };
        btn.addEventListener("click", () => {
            const cur =
                document.documentElement.getAttribute("data-theme") || "light";
            const next = cur === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            try {
                localStorage.setItem("theme.v1", next);
            } catch (_) {
                /* ignore */
            }
            paint();
        });
        paint();
    })();

    Promise.all([
        fetch("/api/config").then((res) => res.json()),
        fetch("/api/mapping").then((res) => res.json()),
    ])
        .then(([config, mapping]) => {
            initApp(config, mapping.rows);
        })
        .catch((err) => {
            console.error("Failed to load configuration or mapping data:", err);
        });
});

let catalogData = [];
let activeStage = null;
let activeStep = null;

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

let selectedArchetype = "Pharma / MedTech manufacturer";
let selectedIndustry = "Healthcare & Life Sciences";
let selectedBuyer = "COO / Operations Head";
let selectedObjective = "Cost to serve reduction";
let selectedMaturity = "Medium";

let archetypeStageMapping = {};

function initApp(config, rows) {
    const ARCHETYPES = config.supported_archetypes || [];
    const INDUSTRIES = config.supported_industries || [];
    const OBJECTIVES = config.supported_objectives || [];
    archetypeStageMapping = config.archetype_stage_mapping || {};
    // Populate archetype select
    const archetypeSelect = document.getElementById("archetype-select");
    if (archetypeSelect) {
        ARCHETYPES.forEach((a) => {
            const opt = document.createElement("option");
            opt.value = a;
            opt.textContent = a;
            archetypeSelect.appendChild(opt);
        });
        archetypeSelect.value = selectedArchetype;

        archetypeSelect.addEventListener("change", (e) => {
            selectedArchetype = e.target.value;
            if (activeStage) {
                openStage(activeStage);
            }
            renderTimeline();
        });
    }

    const industrySelect = document.getElementById("industry-select");
    if (industrySelect) {
        INDUSTRIES.forEach((ind) => {
            const opt = document.createElement("option");
            opt.value = ind;
            opt.textContent = ind;
            industrySelect.appendChild(opt);
        });
        industrySelect.value = selectedIndustry;

        industrySelect.addEventListener("change", (e) => {
            selectedIndustry = e.target.value;
        });
    }

    const buyerSelect = document.getElementById("buyer-select");
    const buyerHelper = document.getElementById("buyer-helper");
    if (buyerSelect) {
        BUYERS.forEach((b) => {
            const opt = document.createElement("option");
            opt.value = b.id;
            opt.textContent = b.id;
            buyerSelect.appendChild(opt);
        });
        buyerSelect.value = selectedBuyer;
        if (buyerHelper) {
            const b = BUYERS.find((x) => x.id === selectedBuyer);
            buyerHelper.textContent = b ? `Focus: ${b.focus}` : "";
        }

        buyerSelect.addEventListener("change", (e) => {
            selectedBuyer = e.target.value;
            if (buyerHelper) {
                const b = BUYERS.find((x) => x.id === selectedBuyer);
                buyerHelper.textContent = b ? `Focus: ${b.focus}` : "";
            }
        });
    }

    const objectiveSelect = document.getElementById("objective-select");
    if (objectiveSelect) {
        OBJECTIVES.forEach((o) => {
            const opt = document.createElement("option");
            opt.value = o;
            opt.textContent = o;
            objectiveSelect.appendChild(opt);
        });
        objectiveSelect.value = selectedObjective;

        objectiveSelect.addEventListener("change", (e) => {
            selectedObjective = e.target.value;
        });
    }

    const maturitySelect = document.getElementById("maturity-select");
    if (maturitySelect) {
        maturitySelect.value = selectedMaturity;
        maturitySelect.addEventListener("change", (e) => {
            selectedMaturity = e.target.value;
        });
    }

    // Process the flat rows from /api/mapping into the grouped structure
    const stagesDict = {};
    const stageOrder = [];

    // Pre-populate with all universal steps from config to ensure they always exist in the timeline in order
    const universalSteps = config.universal_steps || [];
    universalSteps.forEach((stageName) => {
        stagesDict[stageName] = {
            name: stageName,
            steps: [],
            demos: [],
        };
        stageOrder.push(stageName);
    });

    rows.forEach((row) => {
        const stageName = row["Value Chain Stage"];
        const stepName = row["Value Chain Step"];

        if (!stageName) return;

        if (!stagesDict[stageName]) {
            stagesDict[stageName] = {
                name: stageName,
                steps: [],
                demos: [],
            };
            stageOrder.push(stageName);
        }

        const stage = stagesDict[stageName];

        if (stepName && !stage.steps.find((s) => s.name === stepName)) {
            stage.steps.push({ name: stepName, desc: "" });
        }

        if (row["Demo or Case Asset"]) {
            const previewVal = row["Demo Preview"] || "";
            const previewUrl = (previewVal && previewVal !== "nan" && previewVal.trim() !== "") ? previewVal.trim() : "";
            stage.demos.push({
                step: stepName,
                pain_point: row["Client Question / Pain Point"],
                asset_name: row["Demo or Case Asset"],
                asset_type: row["Asset Type"],
                tags: row["Horizontal Tags"] || "",
                fit: row["Archetype Fit"] || "",
                pool: row["Cost / Revenue Pool"],
                benefit: row["Typical Benefit Range"],
                desc: row["Description / Sales Positioning"],
                conversation: row["Best-fit Client Conversation"],
                link: row["Demo Hyperlink"],
                preview: previewUrl,
            });
        }
    });

    catalogData = stageOrder.map((name) => stagesDict[name]);

    const firstRelevant = catalogData.find((stage) => {
        if (!selectedArchetype || selectedArchetype === "All") return true;
        const mappedStages = archetypeStageMapping[selectedArchetype] || [];
        return mappedStages.includes(stage.name);
    });
    if (firstRelevant) {
        activeStage = firstRelevant;
    }

    renderTimeline();

    if (firstRelevant) {
        openStage(firstRelevant);
    }

    document.getElementById("close-stage-btn").addEventListener("click", () => {
        document.getElementById("stage-detail-panel").style.display = "none";
        activeStage = null;
        activeStep = null;
        renderTimeline();
    });

    // Demo cards scroll arrows
    const scrollLeftBtn = document.getElementById("scroll-left-btn");
    const scrollRightBtn = document.getElementById("scroll-right-btn");
    const demoCards = document.getElementById("demo-cards");

    if (scrollLeftBtn && scrollRightBtn && demoCards) {
        scrollLeftBtn.addEventListener("click", () => {
            demoCards.scrollBy({ left: -320, behavior: "smooth" });
        });
        scrollRightBtn.addEventListener("click", () => {
            demoCards.scrollBy({ left: 320, behavior: "smooth" });
        });

        // Hide arrows if no scrolling needed
        const updateArrows = () => {
            const maxScroll = demoCards.scrollWidth - demoCards.clientWidth;
            scrollLeftBtn.style.visibility =
                demoCards.scrollLeft > 0 ? "visible" : "hidden";
            scrollRightBtn.style.visibility =
                demoCards.scrollLeft < maxScroll - 5 ? "visible" : "hidden";
        };
        demoCards.addEventListener("scroll", updateArrows);
        window.addEventListener("resize", updateArrows);
        // Call it after render
        setTimeout(updateArrows, 100);
    }

    // Sidebar resizing and collapse
    const sidebar = document.getElementById("sidebar");
    const resizer = document.getElementById("sidebar-resizer");
    const container = document.getElementById("app-container");
    const sidebarToggle = document.getElementById("sidebar-toggle");

    if (sidebar && resizer && container) {
        let isResizing = false;
        const tooltipText = container.querySelector(".tooltip-text");
        const tooltipShortcut = container.querySelector(".tooltip-shortcut");

        // Format keyboard shortcut helper based on platform (Mac uses Cmd/⌘, PC uses Ctrl)
        if (tooltipShortcut) {
            const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
            tooltipShortcut.innerHTML = isMac
                ? "<kbd>⌘</kbd>+<kbd>B</kbd>"
                : "<kbd>Ctrl</kbd>+<kbd>B</kbd>";
        }

        // Initialize saved width from localStorage if present
        try {
            const w = localStorage.getItem("sidebarWidth.v1");
            if (w) {
                const parsed = parseInt(w, 10);
                if (parsed > 200 && parsed < 600) {
                    sidebar.style.width = parsed + "px";
                    document.documentElement.style.setProperty(
                        "--sidebar-width",
                        parsed + "px",
                    );
                }
            }
        } catch (_) {}

        // Initialize saved collapsed state
        try {
            const collapsed =
                localStorage.getItem("sidebarCollapsed.v1") === "true";
            if (collapsed) {
                container.classList.add("sidebar-collapsed");
                if (tooltipText) {
                    tooltipText.textContent = "Expand Sidebar";
                }
            } else {
                container.classList.remove("sidebar-collapsed");
                if (tooltipText) {
                    tooltipText.textContent = "Collapse Sidebar";
                }
            }
        } catch (_) {}

        resizer.addEventListener("mousedown", (e) => {
            isResizing = true;
            resizer.classList.add("is-resizing");
            container.classList.add("resizing");
            document.body.style.cursor = "col-resize";
            e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
            if (!isResizing) return;
            const newWidth = e.clientX;
            if (newWidth > 200 && newWidth < 600) {
                sidebar.style.width = newWidth + "px";
                document.documentElement.style.setProperty(
                    "--sidebar-width",
                    newWidth + "px",
                );
                try {
                    localStorage.setItem("sidebarWidth.v1", newWidth);
                } catch (_) {}
            }
        });

        document.addEventListener("mouseup", () => {
            if (isResizing) {
                isResizing = false;
                resizer.classList.remove("is-resizing");
                container.classList.remove("resizing");
                document.body.style.cursor = "default";
            }
        });
    }

    if (sidebarToggle && container) {
        const tooltipText = container.querySelector(".tooltip-text");

        sidebarToggle.addEventListener("click", () => {
            const isCollapsed = container.classList.toggle("sidebar-collapsed");
            try {
                localStorage.setItem("sidebarCollapsed.v1", isCollapsed);
            } catch (_) {}
            if (tooltipText) {
                tooltipText.textContent = isCollapsed
                    ? "Expand Sidebar"
                    : "Collapse Sidebar";
            }

            // Dispatch window resize event during and after the 300ms transition
            // to ensure layout-dependent elements (like scroll arrows) adjust correctly.
            let count = 0;
            const interval = setInterval(() => {
                window.dispatchEvent(new Event("resize"));
                count++;
                if (count >= 15) clearInterval(interval);
            }, 20);
        });

        // Keydown handler for shortcut key (Ctrl+B / Cmd+B)
        document.addEventListener("keydown", (e) => {
            const isCmdOrCtrl =
                e.ctrlKey ||
                (navigator.platform.toUpperCase().indexOf("MAC") >= 0 &&
                    e.metaKey);
            if (isCmdOrCtrl && e.key.toLowerCase() === "b") {
                e.preventDefault();
                sidebarToggle.click();
            }
        });
    }

    document.getElementById("close-panel-btn").addEventListener("click", () => {
        document.getElementById("right-panel").style.display = "none";
    });

    const searchInput = document.getElementById("demo-search-input");
    const searchDropdown = document.getElementById("search-results-dropdown");
    const clearSearchBtn = document.getElementById("clear-search-btn");

    if (searchInput && searchDropdown) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                searchDropdown.style.display = "none";
                if (clearSearchBtn) clearSearchBtn.style.display = "none";
                return;
            }

            if (clearSearchBtn) clearSearchBtn.style.display = "block";

            // Search all demos
            const allDemos = catalogData.flatMap((s) => s.demos);
            const matchedDemos = allDemos.filter(
                (d) =>
                    (d.asset_name &&
                        d.asset_name.toLowerCase().includes(query)) ||
                    (d.desc && d.desc.toLowerCase().includes(query)) ||
                    (d.tags && d.tags.toLowerCase().includes(query)),
            );

            if (matchedDemos.length === 0) {
                searchDropdown.innerHTML =
                    '<div style="padding: 1rem; color: #6b7280; font-size: 0.875rem;">No results found.</div>';
            } else {
                searchDropdown.innerHTML = "";
                matchedDemos.forEach((d) => {
                    const a = document.createElement("a");
                    a.className = "search-result-item";
                    const link =
                        d.link &&
                        d.link !== "TBD / internal app" &&
                        d.link !== "nan"
                            ? d.link
                            : "#";
                    a.href = link;
                    if (link !== "#") a.target = "_blank";

                    let imageHtml = "";
                    if (d.preview) {
                        const proxiedUrl = `https://proxy.pythonicvarun.me/${d.preview}`;
                        imageHtml = `<img src="${proxiedUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" alt="preview" />`;
                    } else {
                        imageHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
                    }

                    a.innerHTML = `
                        <div class="search-result-image">
                            ${imageHtml}
                        </div>
                        <div class="search-result-content">
                            <div class="search-result-title">${d.asset_name}</div>
                            <div class="search-result-desc">${d.desc || "No description available."}</div>
                        </div>
                    `;
                    searchDropdown.appendChild(a);
                });
            }
            searchDropdown.style.display = "block";
        });

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener("click", () => {
                searchInput.value = "";
                searchDropdown.style.display = "none";
                clearSearchBtn.style.display = "none";
                searchInput.focus();
            });
        }
    }

    document.addEventListener("click", (e) => {
        if (searchInput && searchDropdown) {
            if (
                !searchInput.contains(e.target) &&
                !searchDropdown.contains(e.target)
            ) {
                searchDropdown.style.display = "none";
            }
        }
    });

    // LLM Analysis binding
    const analyzeBtn = document.getElementById("analyze-company-btn");
    if (analyzeBtn) {
        analyzeBtn.addEventListener("click", async () => {
            const input = document.getElementById("company-name-input");
            const companyName = input.value.trim();
            if (!companyName) return;

            analyzeBtn.textContent = "...";
            analyzeBtn.disabled = true;

            try {
                const res = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ company_name: companyName }),
                });
                const data = await res.json();

                if (data.ok && data.data) {
                    const profile = data.data;
                    const archetypeSelect =
                        document.getElementById("archetype-select");
                    if (archetypeSelect && profile.archetype) {
                        const match = ARCHETYPES.find(
                            (a) =>
                                a.toLowerCase() ===
                                profile.archetype.toLowerCase(),
                        );
                        if (match) {
                            selectedArchetype = match;
                            archetypeSelect.value = match;
                        } else {
                            const headMatch = ARCHETYPES.find((a) =>
                                a
                                    .toLowerCase()
                                    .includes(
                                        profile.archetype
                                            .split("/")[0]
                                            .trim()
                                            .toLowerCase(),
                                    ),
                            );
                            if (headMatch) {
                                selectedArchetype = headMatch;
                                archetypeSelect.value = headMatch;
                            }
                        }
                    }
                    const industrySelect =
                        document.getElementById("industry-select");
                    if (industrySelect && profile.inferred_industry) {
                        const match = INDUSTRIES.find(
                            (i) =>
                                i.toLowerCase() ===
                                profile.inferred_industry.toLowerCase(),
                        );
                        if (match) {
                            selectedIndustry = match;
                            industrySelect.value = match;
                        } else {
                            const opt = document.createElement("option");
                            opt.value = profile.inferred_industry;
                            opt.textContent = profile.inferred_industry;
                            industrySelect.appendChild(opt);
                            industrySelect.value = profile.inferred_industry;
                            selectedIndustry = profile.inferred_industry;
                        }
                    }
                    // Find the first stage that has matching demos for the inferred archetype
                    // Find the first stage that is mapped to the inferred archetype
                    const firstRel = catalogData.find((stage) => {
                        if (!selectedArchetype || selectedArchetype === "All")
                            return true;

                        const mappedStages =
                            archetypeStageMapping[selectedArchetype] || [];
                        return mappedStages.includes(stage.name);
                    });
                    if (firstRel) {
                        activeStage = firstRel;
                    }
                    renderTimeline(); // Re-render to show highlights based on archetype

                    if (firstRel) {
                        openStage(firstRel);
                    } else if (activeStage) {
                        openStage(activeStage);
                    }
                } else {
                    alert(
                        data.error ||
                            data.detail ||
                            "Failed to analyze company.",
                    );
                }
            } catch (err) {
                console.error(err);
                alert("An error occurred during analysis.");
            } finally {
                analyzeBtn.textContent = "Analyze";
                analyzeBtn.disabled = false;
            }
        });
    }
}

function renderTimeline() {
    const container = document.getElementById("timeline-steps");
    container.innerHTML = "";

    const stageIcons = {
        "Plan & Simulate":
            '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
        "Source & Procure":
            '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
        "Make & Package":
            '<path d="M22 12V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9"></path><path d="M12 22v-9"></path><path d="M8 22v-9"></path><path d="M16 22v-9"></path><path d="M2 12h20"></path>',
        "Store & Fulfill":
            '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
        "Deliver & Transport":
            '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',
        "Trade, Compliance & Documents":
            '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
        "Control Tower & Governance":
            '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
    };

    catalogData.forEach((stage, idx) => {
        const filteredDemos = stage.demos.filter((d) => {
            if (!selectedArchetype || selectedArchetype === "All") return true;
            const fit = (d.fit || "").toLowerCase();
            if (fit.includes(selectedArchetype.toLowerCase())) return true;
            const head = selectedArchetype.split("/")[0].trim().toLowerCase();
            if (fit.includes(head)) return true;
            return false;
        });

        const filteredSteps = stage.steps.filter((step) => {
            return filteredDemos.some((d) => d.step === step.name);
        });

        const numDemos = filteredDemos.length;

        const iconSvg =
            stageIcons[stage.name] ||
            '<circle cx="12" cy="12" r="10"></circle>';

        const el = document.createElement("div");
        const activeIdx = catalogData.indexOf(activeStage);
        let className = "timeline-step";
        if (activeStage === stage) className += " active";
        if (idx === activeIdx - 1) className += " pre-active";
        el.className = className;

        // Determine if stage is relevant to the selected archetype based on backend mapping
        let isRelevant = true;
        if (selectedArchetype && selectedArchetype !== "All") {
            const mappedStages = archetypeStageMapping[selectedArchetype] || [];
            isRelevant = mappedStages.includes(stage.name);
        }
        const hasAnyRelevant = selectedArchetype && selectedArchetype !== "All";

        const relevanceDotClass = isRelevant ? "high" : "med";
        const relevanceText = isRelevant
            ? "High relevance"
            : "Medium relevance";

        const metaHtml =
            numDemos > 0
                ? `<div class="step-meta">${numDemos} ${numDemos === 1 ? "case study/accelerator" : "case studies/accelerators"}</div>`
                : `<div class="step-meta" style="display: none;"></div>`;

        el.innerHTML = `
            <div class="step-icon-wrapper">
                <div class="step-icon ${activeStage === stage ? "active" : ""}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
                        ${iconSvg}
                    </svg>
                </div>
            </div>
            <div class="step-title">${idx + 1}. ${stage.name}</div>
            <div class="step-desc">${filteredSteps.length > 0 ? filteredSteps[0].name : ""}</div>
            ${metaHtml}
            <div class="step-relevance"><span class="dot ${relevanceDotClass}"></span> ${relevanceText}</div>
            <div class="active-line"></div>
        `;

        if (hasAnyRelevant && !isRelevant && activeStage !== stage) {
            el.style.opacity = "0.35";
            el.style.filter = "grayscale(100%)";
        }

        el.addEventListener("click", () => {
            document
                .querySelectorAll(".timeline-step")
                .forEach((e) => e.classList.remove("active"));
            document
                .querySelectorAll(".step-icon")
                .forEach((e) => e.classList.remove("active"));

            activeStage = stage;
            renderTimeline(); // Re-render to update opacity and active classes
            openStage(stage);
        });

        container.appendChild(el);
    });
}

function openStage(stage) {
    activeStage = stage;
    const panel = document.getElementById("stage-detail-panel");
    panel.style.display = "block";

    document.getElementById("stage-title").textContent = stage.name;
    document.getElementById("stage-desc").textContent =
        `Explore case studies across ${stage.name.toLowerCase()} capabilities.`;

    const tabsContainer = document.getElementById("stage-tabs");
    tabsContainer.innerHTML = "";

    const visibleSteps = stage.steps.filter((step) => {
        return stage.demos.some((d) => {
            if (d.step !== step.name) return false;
            if (!selectedArchetype || selectedArchetype === "All") return true;
            const fit = (d.fit || "").toLowerCase();
            if (fit.includes(selectedArchetype.toLowerCase())) return true;
            const head = selectedArchetype.split("/")[0].trim().toLowerCase();
            if (fit.includes(head)) return true;
            return false;
        });
    });

    visibleSteps.forEach((step, idx) => {
        const tab = document.createElement("div");
        tab.className = `stage-tab ${idx === 0 ? "active" : ""}`;
        tab.innerHTML = step.name;
        tab.addEventListener("click", () => {
            document
                .querySelectorAll(".stage-tab")
                .forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            renderDemosForStep(step);
        });
        tabsContainer.appendChild(tab);
    });

    if (visibleSteps.length > 0) {
        renderDemosForStep(visibleSteps[0]);
    } else {
        renderDemosForStep(null);
    }
}

function renderDemosForStep(step) {
    activeStep = step;
    const container = document.getElementById("demo-cards");
    container.innerHTML = "";

    if (!activeStage) return;

    const demos = activeStage.demos
        .filter((d) => step && d.step === step.name)
        .filter((d) => {
            if (!selectedArchetype || selectedArchetype === "All") return true;
            const fit = (d.fit || "").toLowerCase();
            if (fit.includes(selectedArchetype.toLowerCase())) return true;
            const head = selectedArchetype.split("/")[0].trim().toLowerCase();
            if (fit.includes(head)) return true;
            return false;
        });

    demos.forEach((demo) => {
        const card = document.createElement("div");
        card.className = "demo-card";
        let cardImageHtml = "";
        if (demo.preview) {
            const proxiedUrl = `https://proxy.pythonicvarun.me/${demo.preview}`;
            cardImageHtml = `<div class="card-image" style="background-image: url('${proxiedUrl}'); background-size: cover; background-position: center;"></div>`;
        } else {
            cardImageHtml = `<div class="card-image bg-gray">Demo Preview</div>`;
        }

        card.innerHTML = `
            ${cardImageHtml}
            <div class="card-content">
                <h3>${demo.asset_name}</h3>
                <p>${demo.desc}</p>
                <div class="card-tags">
                    ${demo.tags
                        .split(";")
                        .filter((t) => t.trim())
                        .map((t) => `<span>${t.trim()}</span>`)
                        .slice(0, 5)
                        .join("")}
                </div>
                <div class="card-footer">
                    <div class="benefit">
                        <div class="benefit-label">Typical benefit</div>
                        <div class="benefit-val">${demo.benefit || "N/A"}</div>
                    </div>
                    <div class="launch-link text-red">View details &rarr;</div>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            openDemoPanel(demo);
        });

        const cardImage = card.querySelector(".card-image");
        if (cardImage) {
            if (
                demo.link &&
                demo.link !== "TBD / internal app" &&
                demo.link !== "nan"
            ) {
                cardImage.style.cursor = "pointer";
                cardImage.title = "Open demo in new tab";
                cardImage.addEventListener("click", (e) => {
                    e.stopPropagation();
                    window.open(demo.link, "_blank");
                });
            }
        }

        container.appendChild(card);
    });

    if (demos.length === 0) {
        container.innerHTML =
            '<p style="padding:20px; color:#6b7280;">No demos mapped directly to this step yet.</p>';
    }

    setTimeout(() => {
        container.dispatchEvent(new Event("scroll"));
    }, 50);
}

function openDemoPanel(demo) {
    const panel = document.getElementById("right-panel");
    panel.style.display = "block";

    document.getElementById("panel-title").textContent = demo.asset_name;
    document.getElementById("panel-pain-point").textContent =
        demo.pain_point || "N/A";
    document.getElementById("panel-desc").textContent = demo.desc || "N/A";
    document.getElementById("panel-benefit").textContent =
        demo.benefit || "N/A";

    if (
        demo.link &&
        demo.link !== "TBD / internal app" &&
        demo.link !== "nan"
    ) {
        document.getElementById("panel-launch-btn").href = demo.link;
        document.getElementById("panel-launch-btn").style.display =
            "inline-block";
    } else {
        document.getElementById("panel-launch-btn").style.display = "none";
    }

    const fitTags = document.getElementById("panel-fit-tags");
    fitTags.innerHTML = "";
    if (demo.fit && demo.fit !== "nan") {
        demo.fit.split(";").forEach((f) => {
            const span = document.createElement("span");
            span.textContent = f.trim();
            fitTags.appendChild(span);
        });
    }
}
