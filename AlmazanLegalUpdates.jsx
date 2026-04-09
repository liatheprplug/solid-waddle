// Almazan Law — Monthly Florida Legal Market Updates
// April 2026 | Embed across all practice area packages

const BRAND = {
  black: "#0A0A0A",
  cream: "#F7F4EF",
  gold: "#C9A84C",
  goldMuted: "#E8D5A3",
  mid: "#6B6459",
  dark: "#0F0E0B",
  border: "#1E1C18",
};

export const APRIL_2026_UPDATES = {
  month: "April 2026",
  practiceAreas: [
    {
      id: "insurance-defense",
      label: "Insurance Defense & Liability",
      updates: [
        {
          headline: "HB 527 — AI Claim Denial Review Mandate",
          detail:
            "Advancing legislation would require human review of all AI-generated claim denials, effective July 1, 2026 if passed. Insurers may use AI to assist, but decisions to deny must be made by qualified human professionals.",
          source: "Chambers and Partners",
          tag: "Legislation",
        },
        {
          headline: "Florida Tort Reforms Delivering Results",
          detail:
            "Lawsuits against insurers fell 25% in 2025 vs. 2024. OIR Commissioner confirmed: \"The success of Florida's tort reforms is becoming constant.\" New claims down 80% from Sept 2024–Sept 2025; pending litigation down 47%.",
          source: "WFXG / Insurance Journal",
          tag: "Market Trend",
        },
        {
          headline: "Market Stabilization — 17 New Carriers, Citizens at 14-Year Low",
          detail:
            "Seventeen new carriers entered the Florida market following HB 837. Citizens policies dropped 50% from the prior year to 336,410 — a 14-year low. Premium increases averaged less than 1% in 2025; 10 carriers saw residential premiums fall outright.",
          source: "Oltraining / Insurance Journal",
          tag: "Market Data",
        },
        {
          headline: "HB 459 — Disputed Claims Resolution Process",
          detail:
            "New formal administrative path for disputed property insurance claims before escalation to court. Insurers must notify policyholders when the process applies; either party may file with the Division of Administrative Hearings for an ALJ ruling within a defined timeframe.",
          source: "Florida Legislature",
          tag: "Legislation",
        },
        {
          headline: "Wildfire Emerging as New Insurance Exposure",
          detail:
            "Florida is experiencing its most severe drought in 25 years. Hundreds of wildfires have broken out since January 1, 2026 — including in suburban, coastal, and urban areas not historically considered wildfire-prone. Standard homeowners policies cover fire damage, but underwriting risk is shifting.",
          source: "Florida Realtors / WUSF",
          tag: "Risk Alert",
        },
      ],
    },
    {
      id: "workers-comp",
      label: "Workers' Compensation Defense",
      updates: [
        {
          headline: "'Two Clocks' Ruling — Estes v. Palm Beach County School District",
          detail:
            "Florida's 1st DCA (March 23, 2026) overturned 32 years of precedent on the workers' comp statute of limitations. The court held the two-year clock can restart one year after the last medical treatment or indemnity payment — meaning the clocks run independently, not sequentially. Hundreds of pending claims are now governed by this new interpretation. Defense strategy must be reassessed for open files.",
          source: "Insurance Journal / Claims Journal",
          tag: "Case Law",
        },
        {
          headline: "Workers' Comp Rates Down 6.9% for 2026",
          detail:
            "Florida employer premiums decreased an average of 6.9% for calendar year 2026 — the ninth consecutive year of rate reductions. Declines are driven by falling lost-time claim frequency. Lower rates do not alter injured workers' substantive rights.",
          source: "Miami Times / Brandon J. Broderick",
          tag: "Market Data",
        },
      ],
    },
    {
      id: "real-estate",
      label: "Real Estate",
      updates: [
        {
          headline: "Property Tax Reform — Stalled, Special Session Possible",
          detail:
            "HJR 203 passed the Florida House 80–30 but died in Senate committee on March 13, 2026. No constitutional amendment reached the 2026 ballot. A special session beginning April 20 remains the last possible path; property tax handling in current real estate transactions is unchanged.",
          source: "Barnes Walker / Florida Realtors",
          tag: "Legislation",
        },
        {
          headline: "2026 Housing Reforms — Live Local Act, Zoning Mandates, Rural Funding",
          detail:
            "The 2026 legislative session passed aggressive housing reforms: updates to the Live Local Act, new zoning mandates to address affordability, and increased rural funding. These changes directly affect permitting timelines, density calculations, and municipal review processes.",
          source: "HousingWire / Florida Realtors",
          tag: "Legislative Update",
        },
        {
          headline: "FREC & FREAB Preserved — HB 607 Fails Again",
          detail:
            "For the second consecutive year, Florida Realtors successfully blocked legislation that would have abolished the Florida Real Estate Commission and Florida Real Estate Appraisal Board, preserving existing regulatory protections for licensees and consumers.",
          source: "Florida Realtors",
          tag: "Regulatory",
        },
        {
          headline: "Property Tax Disclosure Rule Change",
          detail:
            "Platforms and listing websites may now either link to the property appraiser's tax estimator or provide an estimate using current millage rates or a countywide average. Licensees and information providers are held harmless for accuracy of the provided estimate.",
          source: "Florida Legislature",
          tag: "Compliance",
        },
        {
          headline: "Wildfire Risk Expanding to Non-Traditional Markets",
          detail:
            "Florida's 25-year drought high is pushing wildfire risk into suburban and coastal real estate markets not historically priced for fire exposure. Real estate professionals and buyers should factor emerging wildfire risk into due diligence and insurance review.",
          source: "Florida Realtors / WGCU",
          tag: "Risk Alert",
        },
      ],
    },
    {
      id: "construction-defect",
      label: "Construction Defect & General Liability",
      updates: [
        {
          headline: "Mandatory 1-Year Builder Warranty — Section 553.837",
          detail:
            "Effective July 1, 2026, Florida law requires builders of newly constructed homes to provide a mandatory 1-year warranty against material construction defects under Section 553.837, Florida Statutes. This creates a statutory obligation that exists regardless of any contractual limitation.",
          source: "Florida Legislature",
          tag: "New Law",
        },
        {
          headline: "CGL Coverage Gap — Builder Warranty vs. Policy Obligations",
          detail:
            "Standard commercial general liability (CGL) policies do not cover most warranty repair obligations — CGL covers resulting property damage, not the defect itself. The new statutory warranty creates builder liability that CGL insurers are not contractually required to fund, leaving a material exposure gap for contractors and their carriers.",
          source: "Phelps / Porter Wright",
          tag: "Risk Alert",
        },
        {
          headline: "7-Year Statute of Repose in Force",
          detail:
            "SB 360 (2023) reduced the statute of repose for construction defect claims from 10 years to 7 years, running from the earliest of: issuance of a TCO, CO, or certificate of completion, or abandonment of construction. Defense teams should audit open files for exposure windows.",
          source: "WSHB Law / Bilzin Sumberg",
          tag: "Case Law",
        },
      ],
    },
    {
      id: "commercial-litigation",
      label: "Commercial Litigation",
      updates: [
        {
          headline: "Protected Series LLCs — Effective July 1, 2026",
          detail:
            "Florida will allow formation of protected series LLCs beginning July 1, 2026. A single Florida LLC may establish multiple protected series, each with its own members, managers, assets, and liabilities. Horizontal liability shields prevent creditors of one series from reaching assets of another — a significant new tool for business structuring and dispute insulation.",
          source: "Business Law Section, Florida Bar",
          tag: "New Law",
        },
        {
          headline: "Non-Compete Enforcement Shifting",
          detail:
            "Florida's enforcement posture on non-compete agreements has tightened, alongside removal of sales tax from commercial leases and loosened restrictions on trust decanting. Commercial litigators should audit client agreements for updated enforceability risk.",
          source: "Matthew Fornaro / Stinson LLP",
          tag: "Legislative Update",
        },
        {
          headline: "Special Session April 20 — Watch for Business Law Riders",
          detail:
            "Governor DeSantis called a special session beginning April 20 to address congressional redistricting and potentially property tax reform. Watch for late-session riders affecting commercial real estate, business entity rules, or liability exposure.",
          source: "Florida Politics / Holland & Knight",
          tag: "Legislative Watch",
        },
        {
          headline: "Partnership Disputes — Top Commercial Litigation Risk",
          detail:
            "Partnership disputes remain the most disruptive and frequently litigated challenge for Florida business owners entering 2026. Minor disagreements over ownership terms or exit provisions rapidly escalate to costly litigation when partnership agreements lack specificity.",
          source: "Fornaro Legal",
          tag: "Litigation Trend",
        },
      ],
    },
  ],
};

// Tag color mapping for UI rendering
export const TAG_COLORS = {
  Legislation: "#3B5998",
  "Legislative Update": "#3B5998",
  "Legislative Watch": "#6B4C9A",
  "Market Trend": "#2E7D4F",
  "Market Data": "#2E7D4F",
  "Risk Alert": "#B34700",
  "Case Law": "#7A2828",
  Regulatory: "#4A6741",
  Compliance: "#4A6741",
  "New Law": "#1A5276",
};

export default function AlmazenLegalUpdates({ practiceAreaId }) {
  const areas = practiceAreaId
    ? APRIL_2026_UPDATES.practiceAreas.filter((a) => a.id === practiceAreaId)
    : APRIL_2026_UPDATES.practiceAreas;

  return (
    <div
      style={{
        background: BRAND.black,
        color: BRAND.cream,
        fontFamily: "Georgia, serif",
        padding: "48px 32px",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Josefin+Sans:wght@300;400;600&display=swap');
        .pf{font-family:'Playfair Display',Georgia,serif}
        .cg{font-family:'Cormorant Garamond',Georgia,serif}
        .js{font-family:'Josefin Sans',sans-serif}
        .update-card{border:1px solid #1E1C18;border-left:3px solid #C9A84C;padding:20px 24px;margin-bottom:12px;transition:background .15s}
        .update-card:hover{background:#0F0E0B}
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BRAND.border}`, paddingBottom: 28, marginBottom: 40 }}>
        <div className="js" style={{ fontSize: 9, letterSpacing: "0.3em", color: BRAND.gold, textTransform: "uppercase", marginBottom: 12 }}>
          Almazan Law · Florida Market Intelligence
        </div>
        <div className="pf" style={{ fontSize: 34, lineHeight: 1.15, marginBottom: 8 }}>
          {APRIL_2026_UPDATES.month} Legal Updates
        </div>
        <div className="cg" style={{ fontSize: 17, color: BRAND.mid, fontStyle: "italic" }}>
          Legislative, regulatory, and case law developments across all practice areas.
        </div>
      </div>

      {/* Practice Areas */}
      {areas.map((area) => (
        <div key={area.id} style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ height: 1, width: 24, background: BRAND.gold, flexShrink: 0 }} />
            <div className="js" style={{ fontSize: 10, letterSpacing: "0.2em", color: BRAND.goldMuted, textTransform: "uppercase" }}>
              {area.label}
            </div>
          </div>

          {area.updates.map((update, i) => (
            <div key={i} className="update-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12 }}>
                <div className="js" style={{ fontSize: 11, letterSpacing: "0.08em", color: BRAND.cream, fontWeight: 600, lineHeight: 1.4 }}>
                  {update.headline}
                </div>
                <div
                  className="js"
                  style={{
                    fontSize: 8,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: TAG_COLORS[update.tag] || BRAND.gold,
                    border: `1px solid ${TAG_COLORS[update.tag] || BRAND.gold}`,
                    padding: "3px 8px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    opacity: 0.85,
                  }}
                >
                  {update.tag}
                </div>
              </div>
              <div className="cg" style={{ fontSize: 15, color: BRAND.mid, lineHeight: 1.65, marginBottom: 8 }}>
                {update.detail}
              </div>
              <div className="js" style={{ fontSize: 8, letterSpacing: "0.15em", color: "#3A3530", textTransform: "uppercase" }}>
                Source: {update.source}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${BRAND.border}`, paddingTop: 24, marginTop: 8 }}>
        <div className="cg" style={{ fontSize: 13, color: "#3A3530", fontStyle: "italic", lineHeight: 1.6 }}>
          This update is provided for informational purposes only and does not constitute legal advice.
          Contact Almazan Law for guidance on how these developments apply to your specific matter.
        </div>
      </div>
    </div>
  );
}
