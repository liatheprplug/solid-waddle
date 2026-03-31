import { useState, useEffect, useRef } from "react";

const BRAND = {
  black: "#0A0A0A",
  cream: "#F7F4EF",
  gold: "#C9A84C",
  goldMuted: "#E8D5A3",
  mid: "#6B6459",
};

const STEPS = [
  { id: "identity", label: "Identity", title: "Who are you?", sub: "Let's start with the foundation." },
  { id: "brand", label: "Brand", title: "Where does your brand stand?", sub: "Be honest — this is where the work begins." },
  { id: "goals", label: "Goals", title: "What does success look like?", sub: "Not vague. Specific. What changes in 6 months?" },
  { id: "gaps", label: "Gaps", title: "What's leaking?", sub: "Every brand has fractures. Let's name them." },
  { id: "readiness", label: "Readiness", title: "Are you ready to build?", sub: "Infrastructure takes commitment. Let's make sure you're aligned." },
];

const INITIAL_DATA = {
  name: "", title: "", company: "", industry: "", website: "", linkedin: "",
  brandStage: "", brandDesc: "", audienceDesc: "", currentMarketing: [],
  primaryGoal: "", timeline: "", successMetric: "", revenueGoal: "",
  biggestGap: [], messagingClarity: "", contentConsistency: "", visibilityScore: "",
  budget: "", decisionMaker: "", urgency: "", referral: "", additionalContext: "",
};

const MARKETING_OPTS = ["Social media (organic)", "Email newsletter", "Paid ads", "PR / Media outreach", "Speaking engagements", "Podcast", "Referrals only", "Nothing consistent"];
const GAP_OPTS = ["No clear brand messaging", "Inconsistent content", "No media presence", "Weak digital footprint", "No lead generation system", "Undefined audience", "Poor executive visibility", "Outdated website/assets"];

export default function PRPlugIntake() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);
  const topRef = useRef(null);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [step]);

  const update = (f, v) => setData(p => ({ ...p, [f]: v }));
  const toggle = (f, v) => setData(p => ({ ...p, [f]: p[f].includes(v) ? p[f].filter(x => x !== v) : [...p[f], v] }));

  const canAdvance = () => {
    if (step === 0) return data.name && data.title && data.company && data.industry;
    if (step === 1) return data.brandStage && data.audienceDesc;
    if (step === 2) return data.primaryGoal && data.timeline;
    if (step === 3) return data.biggestGap.length > 0 && data.messagingClarity;
    if (step === 4) return data.budget && data.decisionMaker && data.urgency;
    return true;
  };

  const runDiagnosis = async () => {
    setLoading(true); setError(null);
    const prompt = `You are Lia, founder of The PR Plug Consulting Collective — a brand architect with 16 years in integrated communications. You install operating systems that make brands work. Zero fluff. Every observation must be backed by specific client data.

Use your I²OS diagnostic lens: information gaps, leadership messaging gaps, tool/systems issues, messaging infrastructure misalignment.

CLIENT DATA:
Name: ${data.name} | Title: ${data.title} | Company: ${data.company} | Industry: ${data.industry}
Website: ${data.website || "Not provided"} | Brand Stage: ${data.brandStage}
Brand Description: ${data.brandDesc || "Not provided"}
Audience: ${data.audienceDesc}
Current Marketing: ${data.currentMarketing.join(", ") || "None"}
Primary Goal: ${data.primaryGoal} | Timeline: ${data.timeline}
Success Metric: ${data.successMetric || "Not defined"} | Revenue Goal: ${data.revenueGoal || "Not provided"}
Gaps Identified: ${data.biggestGap.join(", ")}
Messaging Clarity: ${data.messagingClarity}/10 | Content Consistency: ${data.contentConsistency}/10 | Visibility: ${data.visibilityScore}/10
Budget: ${data.budget} | Decision Maker: ${data.decisionMaker} | Urgency: ${data.urgency}
Referral: ${data.referral || "Not specified"} | Additional: ${data.additionalContext || "None"}

Return ONLY valid JSON, no markdown fences:
{"signal":"One sentence — what the market actually hears from their brand right now.","pattern":"The systemic issue underneath all their surface symptoms.","gaps":[{"label":"Gap name 3-5 words","description":"One sharp sentence naming the fracture and the cost."},{"label":"Gap name","description":"One sharp sentence."},{"label":"Gap name","description":"One sharp sentence."}],"readiness":"hot | warm | cold","readinessNote":"One sentence on readiness based on budget + urgency + decision authority.","recommendation":"2-3 sentences on the precise next move, specific to their industry.","closer":"One memorable signature line crafted personally for this client."}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const result = await res.json();
      const text = result.content?.find(b => b.type === "text")?.text || "";
      setDiagnosis(JSON.parse(text.replace(/```json|```/g, "").trim()));
      setStep(5);
    } catch { setError("Diagnosis failed. Please try again."); }
    setLoading(false);
  };

  const rColor = r => r === "hot" ? BRAND.gold : r === "warm" ? BRAND.goldMuted : BRAND.mid;
  const rLabel = r => r === "hot" ? "HIGH PRIORITY" : r === "warm" ? "STRONG POTENTIAL" : "NURTURE TRACK";

  const RadioGroup = ({ field, options }) => options.map(([val, label]) => (
    <div key={val} onClick={() => update(field, val)} style={{
      border: `1px solid ${data[field] === val ? BRAND.gold : "#1E1C18"}`,
      padding: "12px 18px", marginBottom: 6, cursor: "pointer",
      background: data[field] === val ? "rgba(201,168,76,0.06)" : "transparent", transition: "all 0.15s",
    }}>
      <div className="cg" style={{ fontSize: 16, color: data[field] === val ? BRAND.goldMuted : BRAND.mid }}>{label}</div>
    </div>
  ));

  return (
    <div ref={topRef} style={{ minHeight: "100vh", background: BRAND.black, fontFamily: "Georgia, serif", color: BRAND.cream, paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Josefin+Sans:wght@300;400;600&display=swap');
        *{box-sizing:border-box} .pf{font-family:'Playfair Display',Georgia,serif} .cg{font-family:'Cormorant Garamond',Georgia,serif} .js{font-family:'Josefin Sans',sans-serif}
        input,textarea,select{background:transparent;border:none;border-bottom:1px solid #3A3530;color:#F7F4EF;font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;padding:10px 4px;width:100%;outline:none;transition:border-color .2s}
        input:focus,textarea:focus,select:focus{border-bottom-color:#C9A84C}
        input::placeholder,textarea::placeholder{color:#4A4540;font-style:italic}
        select option{background:#1A1814;color:#F7F4EF} textarea{resize:vertical;min-height:80px}
        .pill{display:inline-block;border:1px solid #3A3530;border-radius:2px;padding:8px 16px;cursor:pointer;transition:all .15s;font-family:'Josefin Sans',sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6B6459;margin:4px}
        .pill:hover{border-color:#C9A84C;color:#E8D5A3} .pill.on{border-color:#C9A84C;color:#C9A84C;background:rgba(201,168,76,.08)}
        .btn-p{background:#C9A84C;color:#0A0A0A;border:none;padding:14px 40px;font-family:'Josefin Sans',sans-serif;font-size:11px;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:all .2s;font-weight:600}
        .btn-p:hover:not(:disabled){background:#E8D5A3} .btn-p:disabled{opacity:.35;cursor:not-allowed}
        .btn-g{background:transparent;color:#6B6459;border:1px solid #3A3530;padding:14px 32px;font-family:'Josefin Sans',sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .2s}
        .btn-g:hover{color:#F7F4EF;border-color:#6B6459}
        .sc{width:38px;height:38px;border:1px solid #2A2820;background:transparent;color:#6B6459;cursor:pointer;font-family:'Josefin Sans',sans-serif;font-size:12px;transition:all .15s;display:inline-flex;align-items:center;justify-content:center}
        .sc:hover{border-color:#C9A84C;color:#C9A84C} .sc.on{border-color:#C9A84C;background:rgba(201,168,76,.1);color:#C9A84C}
        .fade{animation:fi .4s ease forwards} @keyframes fi{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .gc{border:1px solid #1E1C18;padding:20px 24px;margin-bottom:12px;border-left:2px solid #C9A84C}
        .sp{width:20px;height:20px;border:2px solid #3A3530;border-top-color:#C9A84C;border-radius:50%;animation:spin .8s linear infinite;display:inline-block;margin-right:10px;vertical-align:middle}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* HEADER */}
      <div style={{ borderBottom: "1px solid #1A1814", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="pf" style={{ fontSize: 20, letterSpacing: "0.05em" }}>The PR Plug</div>
          <div className="js" style={{ fontSize: 9, letterSpacing: "0.25em", color: BRAND.gold, marginTop: 3, textTransform: "uppercase" }}>
            Communications · Connection · Conversion
          </div>
        </div>
        {step < 5 && <div className="js" style={{ fontSize: 10, letterSpacing: "0.12em", color: BRAND.mid, textTransform: "uppercase" }}>{step + 1} / {STEPS.length}</div>}
      </div>

      {/* PROGRESS */}
      {step < 5 && (
        <div style={{ height: 2, background: "#1A1814" }}>
          <div style={{ height: "100%", background: BRAND.gold, width: `${((step + 1) / STEPS.length) * 100}%`, transition: "width .4s ease" }} />
        </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 28px" }}>

        {/* TABS */}
        {step < 5 && (
          <div style={{ display: "flex", marginTop: 40, marginBottom: 48, borderBottom: "1px solid #1A1814", overflowX: "auto" }}>
            {STEPS.map((s, i) => (
              <div key={s.id} className="js" onClick={() => i < step && setStep(i)} style={{
                fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 16px", whiteSpace: "nowrap",
                color: i === step ? BRAND.gold : i < step ? BRAND.goldMuted : "#3A3530",
                borderBottom: i === step ? `1px solid ${BRAND.gold}` : "1px solid transparent",
                marginBottom: -1, cursor: i < step ? "pointer" : "default",
              }}>{s.label}</div>
            ))}
          </div>
        )}

        {/* STEP HEADER */}
        {step < 5 && (
          <div className="fade">
            <div className="cg" style={{ fontSize: 13, letterSpacing: "0.2em", color: BRAND.gold, textTransform: "uppercase", marginBottom: 12 }}>
              Step {step + 1} — {STEPS[step].label}
            </div>
            <div className="pf" style={{ fontSize: 36, lineHeight: 1.15, marginBottom: 10 }}>{STEPS[step].title}</div>
            <div className="cg" style={{ fontSize: 18, color: BRAND.mid, fontStyle: "italic", marginBottom: 48 }}>{STEPS[step].sub}</div>
          </div>
        )}

        {/* S0 */}
        {step === 0 && (
          <div className="fade">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
              {[["name","Full Name","Your name"],["title","Title / Role","CEO, Founder, Partner…"],["company","Company / Brand","Organization name"],["industry","Industry","Law, Finance, Real Estate…"]].map(([f,l,p]) => (
                <div key={f} style={{ marginBottom: 32 }}>
                  <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
                  <input value={data[f]} onChange={e => update(f, e.target.value)} placeholder={p} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
              {[["website","Website (optional)","yoursite.com"],["linkedin","LinkedIn (optional)","linkedin.com/in/you"]].map(([f,l,p]) => (
                <div key={f} style={{ marginBottom: 32 }}>
                  <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
                  <input value={data[f]} onChange={e => update(f, e.target.value)} placeholder={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* S1 */}
        {step === 1 && (
          <div className="fade">
            <div style={{ marginBottom: 36 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 16 }}>Where is your brand right now?</div>
              <RadioGroup field="brandStage" options={[["new","Starting from scratch — no real brand yet"],["developing","Something exists but it's inconsistent"],["established","Established brand, needs a strategic refresh"],["scaling","Scaling — need infrastructure to support growth"]]} />
            </div>
            <div style={{ marginBottom: 36 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 8 }}>Describe your brand in your own words</div>
              <textarea value={data.brandDesc} onChange={e => update("brandDesc", e.target.value)} placeholder="What does your brand stand for? What makes you different?" />
            </div>
            <div style={{ marginBottom: 36 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 8 }}>Who is your audience?</div>
              <textarea value={data.audienceDesc} onChange={e => update("audienceDesc", e.target.value)} placeholder="Who needs to hear from you? Be specific." />
            </div>
            <div>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 12 }}>What marketing are you doing now?</div>
              {MARKETING_OPTS.map(o => <span key={o} onClick={() => toggle("currentMarketing", o)} className={`pill ${data.currentMarketing.includes(o) ? "on" : ""}`}>{o}</span>)}
            </div>
          </div>
        )}

        {/* S2 */}
        {step === 2 && (
          <div className="fade">
            <div style={{ marginBottom: 36 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 16 }}>Primary goal for this engagement</div>
              <RadioGroup field="primaryGoal" options={[["visibility","Increase visibility — more people need to know I exist"],["authority","Build authority — I need to be seen as the expert"],["leads","Generate qualified leads — the pipeline is dry"],["brand","Formalize the brand — we need infrastructure and identity"],["executive","Executive positioning — stepping into a public-facing role"],["growth","Scale marketing — we're growing and systems can't keep up"]]} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
              <div style={{ marginBottom: 32 }}>
                <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 8 }}>Timeline for results</div>
                <select value={data.timeline} onChange={e => update("timeline", e.target.value)}>
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate — we needed this yesterday</option>
                  <option value="3months">Within 3 months</option>
                  <option value="6months">6-month buildout</option>
                  <option value="12months">12-month transformation</option>
                </select>
              </div>
              <div style={{ marginBottom: 32 }}>
                <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 8 }}>Revenue goal (optional)</div>
                <input value={data.revenueGoal} onChange={e => update("revenueGoal", e.target.value)} placeholder="e.g. $500K ARR, 20 new clients" />
              </div>
            </div>
            <div>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 8 }}>How will you know it worked? Name one metric.</div>
              <input value={data.successMetric} onChange={e => update("successMetric", e.target.value)} placeholder="e.g. 3 inbound qualified leads/month" />
            </div>
          </div>
        )}

        {/* S3 */}
        {step === 3 && (
          <div className="fade">
            <div style={{ marginBottom: 40 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 12 }}>Where are the fractures?</div>
              {GAP_OPTS.map(o => <span key={o} onClick={() => toggle("biggestGap", o)} className={`pill ${data.biggestGap.includes(o) ? "on" : ""}`}>{o}</span>)}
            </div>
            {[["messagingClarity","How clear is your brand messaging right now?","1 = no one knows what you do · 10 = crystal clear"],["contentConsistency","How consistent is your content output?","1 = nothing posted in months · 10 = strategic and regular"],["visibilityScore","How visible are you in your market?","1 = invisible · 10 = go-to authority"]].map(([f,l,s]) => (
              <div key={f} style={{ marginBottom: 36 }}>
                <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                <div className="cg" style={{ fontSize: 13, color: "#4A4540", fontStyle: "italic", marginBottom: 12 }}>{s}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} onClick={() => update(f, String(n))} className={`sc ${data[f] === String(n) ? "on" : ""}`}>{n}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* S4 */}
        {step === 4 && (
          <div className="fade">
            <div style={{ marginBottom: 36 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 16 }}>Investment range you're working with</div>
              <RadioGroup field="budget" options={[["under3k","Under $3,000 / month"],["3to5k","$3,000 – $5,000 / month"],["5to10k","$5,000 – $10,000 / month"],["10kplus","$10,000+ / month"],["project","One-time project budget"]]} />
            </div>
            <div style={{ marginBottom: 36 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 16 }}>Who makes the final decision?</div>
              <RadioGroup field="decisionMaker" options={[["solo","Just me — I'm the decision maker"],["partner","Me + a business partner"],["executive","I need executive/board approval"],["pending","Still evaluating internally"]]} />
            </div>
            <div style={{ marginBottom: 36 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 16 }}>How urgent is this for you?</div>
              <RadioGroup field="urgency" options={[["now","We need to move now — this is priority"],["soon","Within the next 30-60 days"],["exploring","Exploring options, no immediate pressure"]]} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 8 }}>How did you find us? (optional)</div>
              <input value={data.referral} onChange={e => update("referral", e.target.value)} placeholder="Referral, LinkedIn, Instagram, Google…" />
            </div>
            <div>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 8 }}>Anything else we should know before the call?</div>
              <textarea value={data.additionalContext} onChange={e => update("additionalContext", e.target.value)} placeholder="Challenges, context, specific asks — be direct." style={{ minHeight: 100 }} />
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === 5 && diagnosis && (
          <div className="fade" style={{ paddingTop: 48 }}>
            <div className="js" style={{ fontSize: 9, letterSpacing: "0.25em", color: BRAND.gold, textTransform: "uppercase", marginBottom: 20 }}>Brand Diagnosis — {data.name}</div>
            <div className="pf" style={{ fontSize: 38, lineHeight: 1.1, marginBottom: 6 }}>The Pattern.</div>
            <div className="cg" style={{ fontSize: 20, color: BRAND.mid, fontStyle: "italic", marginBottom: 48 }}>What your brand is actually saying right now.</div>

            <div style={{ borderLeft: `3px solid ${BRAND.gold}`, paddingLeft: 24, marginBottom: 40 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.gold, textTransform: "uppercase", marginBottom: 8 }}>Brand Signal</div>
              <div className="cg" style={{ fontSize: 22, lineHeight: 1.5, color: BRAND.cream }}>"{diagnosis.signal}"</div>
            </div>

            <div style={{ background: "#0F0E0B", border: "1px solid #1E1C18", padding: 28, marginBottom: 40 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 12 }}>Core Pattern</div>
              <div className="cg" style={{ fontSize: 18, lineHeight: 1.65, color: BRAND.goldMuted }}>{diagnosis.pattern}</div>
            </div>

            <div style={{ marginBottom: 40 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 20 }}>Infrastructure Gaps</div>
              {diagnosis.gaps?.map((g, i) => (
                <div key={i} className="gc">
                  <div className="js" style={{ fontSize: 10, letterSpacing: "0.15em", color: BRAND.gold, textTransform: "uppercase", marginBottom: 6 }}>{g.label}</div>
                  <div className="cg" style={{ fontSize: 16, color: BRAND.mid, lineHeight: 1.5 }}>{g.description}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40, padding: "20px 24px", border: "1px solid #1E1C18" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: rColor(diagnosis.readiness), flexShrink: 0 }} />
              <div>
                <div className="js" style={{ fontSize: 10, letterSpacing: "0.2em", color: rColor(diagnosis.readiness), textTransform: "uppercase", marginBottom: 4 }}>{rLabel(diagnosis.readiness)}</div>
                <div className="cg" style={{ fontSize: 15, color: BRAND.mid, fontStyle: "italic" }}>{diagnosis.readinessNote}</div>
              </div>
            </div>

            <div style={{ marginBottom: 40 }}>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 16 }}>Recommended Next Move</div>
              <div className="cg" style={{ fontSize: 19, lineHeight: 1.7, color: BRAND.cream }}>{diagnosis.recommendation}</div>
            </div>

            <div style={{ height: 1, background: "#1E1C18", margin: "32px 0" }} />

            <div style={{ textAlign: "center", padding: "32px 20px 8px" }}>
              <div className="pf" style={{ fontSize: 22, color: BRAND.goldMuted, fontStyle: "italic", lineHeight: 1.5, marginBottom: 24 }}>"{diagnosis.closer}"</div>
              <div className="js" style={{ fontSize: 9, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase", marginBottom: 32 }}>— Lia, The PR Plug</div>
              <button className="btn-p" onClick={() => { setStep(0); setData(INITIAL_DATA); setDiagnosis(null); }}>New Intake</button>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="js" style={{ fontSize: 11, letterSpacing: "0.2em", color: BRAND.mid, textTransform: "uppercase" }}>
              <span className="sp" />Reading the pattern…
            </div>
          </div>
        )}

        {error && <div style={{ color: "#CC4444", fontFamily: "Josefin Sans", fontSize: 12, textAlign: "center", marginTop: 16 }}>{error}</div>}

        {step < 5 && !loading && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 56, paddingTop: 32, borderTop: "1px solid #1A1814" }}>
            {step > 0 ? <button className="btn-g" onClick={() => setStep(s => s - 1)}>← Back</button> : <div />}
            {step < 4
              ? <button className="btn-p" disabled={!canAdvance()} onClick={() => setStep(s => s + 1)}>Continue →</button>
              : <button className="btn-p" disabled={!canAdvance()} onClick={runDiagnosis}>Run Diagnosis</button>
            }
          </div>
        )}
      </div>
    </div>
  );
}
