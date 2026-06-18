import { useState, useEffect, useCallback } from "react";

/* ────────── THEME CONFIG ────────── */
const THEMES = {
  "Today":       { bg:"#fff9e6", bg2:"#fff3cc", accent:"#b8860b", border:"#dfc44a", text:"#7a5a00", sub:"#a07800", card:"#fffdf5", check:"#b8860b", glow:"rgba(184,134,11,0.08)" },
  "Upcoming":    { bg:"#e8f4fd", bg2:"#d0e8fa", accent:"#1a6fa0", border:"#7cb8db", text:"#0f4c75", sub:"#2180b0", card:"#f3faff", check:"#1a6fa0", glow:"rgba(26,111,160,0.08)" },
  "Admin":       { bg:"#f3eafa", bg2:"#e6d5f7", accent:"#7d3c98", border:"#b580d0", text:"#5b2d73", sub:"#8e44ad", card:"#faf6fe", check:"#7d3c98", glow:"rgba(125,60,152,0.08)" },
  "Financial":   { bg:"#e8f8ef", bg2:"#d0f0dc", accent:"#1a7a40", border:"#7ec8a0", text:"#145a30", sub:"#22944e", card:"#f4fcf7", check:"#1a7a40", glow:"rgba(26,122,64,0.08)" },
  "Future Buys": { bg:"#fce8fa", bg2:"#f5ccf2", accent:"#c020a0", border:"#e080d0", text:"#8a1878", sub:"#d030a8", card:"#fef4fd", check:"#c020a0", glow:"rgba(192,32,160,0.08)" },
  "Shopping":    { bg:"#fef3e2", bg2:"#fde5c0", accent:"#a06800", border:"#deb060", text:"#7a5000", sub:"#c07800", card:"#fffbf2", check:"#a06800", glow:"rgba(160,104,0,0.08)" },
  "Concepts":    { bg:"#e2f7f5", bg2:"#c8f0ec", accent:"#107870", border:"#70c8c0", text:"#0a5a54", sub:"#149088", card:"#f0fcfa", check:"#107870", glow:"rgba(16,120,112,0.08)" },
  "Long Term":   { bg:"#eeebf7", bg2:"#ddd6f2", accent:"#5040a0", border:"#9888d0", text:"#3a3080", sub:"#6858b8", card:"#f8f6fe", check:"#5040a0", glow:"rgba(80,64,160,0.08)" },
  "Job / Career":{ bg:"#fef5e6", bg2:"#fdeacc", accent:"#a07000", border:"#d8b050", text:"#785400", sub:"#c08a00", card:"#fffbf0", check:"#a07000", glow:"rgba(160,112,0,0.08)" },
  "Health":      { bg:"#e8f5e8", bg2:"#d0ecd0", accent:"#268028", border:"#80c882", text:"#1a6020", sub:"#30a034", card:"#f2fbf2", check:"#268028", glow:"rgba(38,128,40,0.08)" },
  "Socialising": { bg:"#f7e8fa", bg2:"#f0d0f8", accent:"#8828a8", border:"#c080d8", text:"#6a2088", sub:"#a838c0", card:"#fdf4ff", check:"#8828a8", glow:"rgba(136,40,168,0.08)" },
  "Events":      { bg:"#fde8eb", bg2:"#fad0d6", accent:"#b82830", border:"#e08088", text:"#8a1e24", sub:"#d03840", card:"#fef4f5", check:"#b82830", glow:"rgba(184,40,48,0.08)" },
  "Bills":       { bg:"#fef8e6", bg2:"#fdf0c8", accent:"#907000", border:"#c8a840", text:"#6a5200", sub:"#a88800", card:"#fffcf0", check:"#907000", glow:"rgba(144,112,0,0.08)" },
};

const CATS = ["Today","Upcoming","Admin","Financial","Future Buys","Shopping","Concepts","Long Term","Job / Career","Health","Socialising","Events","Bills"];
const DEF_PRI = { "Today":"high","Upcoming":"high","Admin":"medium","Financial":"high","Future Buys":"low","Shopping":"low","Concepts":"medium","Long Term":"low","Job / Career":"high","Health":"medium","Socialising":"low","Events":"high","Bills":"high" };

const DEFAULT_TASKS = [
  {id:1,cat:"Upcoming",name:"Arrange jumper pickup/dropoff from Alfie",done:false,priority:"medium",due:null},
  {id:2,cat:"Upcoming",name:"Review pet insurance / consider new policy",done:false,priority:"medium",due:null},
  {id:3,cat:"Upcoming",name:"Send Brooke bylaws and redirect water invoice",done:false,priority:"high",due:null},
  {id:4,cat:"Upcoming",name:"Check saved folder from other computer",done:false,priority:"low",due:null},
  {id:5,cat:"Upcoming",name:"Forward BC details to QS",done:false,priority:"high",due:null},
  {id:6,cat:"Admin",name:"Clear out photos",done:false,priority:"low",due:null},
  {id:7,cat:"Admin",name:"Respond to messages",done:false,priority:"high",due:null},
  {id:8,cat:"Admin",name:"Clear out emails",done:false,priority:"medium",due:null},
  {id:9,cat:"Admin",name:"Coordinate shipping with Paddy",done:false,priority:"medium",due:null},
  {id:10,cat:"Admin",name:"Go through saved photos",done:false,priority:"low",due:null},
  {id:11,cat:"Financial",name:"Prepare tax documents",done:false,priority:"high",due:null},
  {id:12,cat:"Financial",name:"Create spending review",done:false,priority:"medium",due:null},
  {id:13,cat:"Financial",name:"Create budget plan",done:false,priority:"medium",due:null},
  {id:14,cat:"Financial",name:"Create recurring expenses summary",done:false,priority:"medium",due:null},
  {id:15,cat:"Future Buys",name:"Rug",done:false,priority:"low",due:null},
  {id:16,cat:"Future Buys",name:"Genetic testing",done:false,priority:"low",due:null},
  {id:17,cat:"Future Buys",name:"Film Camera",done:false,priority:"low",due:null},
  {id:18,cat:"Shopping",name:"Fix Watches",done:false,priority:"medium",due:null},
  {id:19,cat:"Concepts",name:"Power process",done:false,priority:"medium",due:null},
  {id:20,cat:"Concepts",name:"HALT (AA)",done:false,priority:"medium",due:null},
  {id:21,cat:"Concepts",name:"The Shadow",done:false,priority:"medium",due:null},
  {id:22,cat:"Long Term",name:"Barrister",done:false,priority:"low",due:null},
  {id:23,cat:"Long Term",name:"Doctorate",done:false,priority:"high",due:null},
  {id:24,cat:"Long Term",name:"AI OnlyFans",done:false,priority:"low",due:null},
  {id:25,cat:"Long Term",name:"Brag sheet",done:false,priority:"medium",due:null},
  {id:26,cat:"Long Term",name:"Brainstorm business ideas",done:false,priority:"medium",due:null},
  {id:27,cat:"Job / Career",name:"Update resume",done:false,priority:"high",due:null},
  {id:28,cat:"Job / Career",name:"Contact recruiters",done:false,priority:"high",due:null},
  {id:29,cat:"Job / Career",name:"Apply for positions",done:false,priority:"high",due:null},
  {id:30,cat:"Job / Career",name:"Apply for GAMSAT",done:false,priority:"high",due:{type:"custom",date:"2026-06-30"},urgent:true},
  {id:31,cat:"Job / Career",name:"Draft career plan",done:false,priority:"medium",due:null},
  {id:32,cat:"Health",name:"Prepare gym program",done:false,priority:"medium",due:null},
  {id:33,cat:"Health",name:"Prepare meal plan and track calories",done:false,priority:"medium",due:null},
  {id:34,cat:"Health",name:"Write goals for 2026",done:false,priority:"high",due:null},
  {id:35,cat:"Health",name:"Prepare journal questions",done:false,priority:"medium",due:null},
  {id:36,cat:"Health",name:"Create list of habits and daily routine",done:false,priority:"medium",due:null},
  {id:37,cat:"Socialising",name:"Sign up to social netball",done:false,priority:"medium",due:null},
  {id:38,cat:"Socialising",name:"Enquire about rowing",done:false,priority:"medium",due:null},
  {id:39,cat:"Socialising",name:"Post on Instagram",done:false,priority:"low",due:null},
];

const DEFAULT_BILLS = [
  { id: 1, name: "Mortgage — Bendigo Bank", amount: 3088, freq: "Monthly", day: 16 },
  { id: 2, name: "Rent", amount: 280, freq: "Weekly", day: 4 },
];

/* ────────── HELPERS ────────── */
function getDueLabel(due) {
  if (!due) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (due.type === "today") return { text: "Today", cls: "due-today" };
  if (due.type === "tomorrow") return { text: "Tomorrow", cls: "has-date" };
  if (due.type === "week") return { text: "This week", cls: "has-date" };
  if (due.type === "month") return { text: "This month", cls: "has-date" };
  if (due.type === "custom" && due.date) {
    const d = new Date(due.date + "T00:00:00");
    const diff = Math.ceil((d - today) / 86400000);
    const label = d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
    if (diff < 0) return { text: "Overdue " + label, cls: "overdue" };
    if (diff === 0) return { text: "Today", cls: "due-today" };
    if (diff === 1) return { text: "Tomorrow", cls: "has-date" };
    return { text: label, cls: "has-date" };
  }
  return null;
}

function getBillDue(bill) {
  const now = new Date();
  if (bill.freq === "Monthly") {
    const d = bill.day - now.getDate();
    if (d < 0) return { label: `Overdue (${Math.abs(d)}d)`, cls: "text-red-600 font-bold" };
    if (d <= 5) return { label: `Due in ${d}d`, cls: "text-amber-600 font-semibold" };
    return { label: `Due in ${d}d`, cls: "text-emerald-600" };
  }
  if (bill.freq === "Weekly") {
    const d = (bill.day - now.getDay() + 7) % 7 || 7;
    if (d <= 1) return { label: d === 0 ? "Due today" : "Tomorrow", cls: "text-amber-600 font-semibold" };
    return { label: `Due in ${d}d`, cls: "text-emerald-600" };
  }
  return { label: "", cls: "" };
}

/* ────────── INLINE STYLES (no Tailwind dep for portability) ────────── */
const S = {
  pri: (p) => {
    if (p === "high") return { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5", fontWeight: 700, fontSize: 10, padding: "2px 8px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", lineHeight: "18px" };
    if (p === "low") return { background: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd", fontWeight: 700, fontSize: 10, padding: "2px 8px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", lineHeight: "18px" };
    return { background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", fontWeight: 700, fontSize: 10, padding: "2px 8px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", lineHeight: "18px" };
  },
  dueBtn: (dl) => {
    const base = { fontSize: 10, padding: "2px 8px", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", lineHeight: "18px", fontWeight: 600, border: "1px solid #e5e7eb", color: "#9ca3af", background: "transparent" };
    if (!dl) return base;
    if (dl.cls === "overdue") return { ...base, border: "1px solid #fca5a5", color: "#dc2626", background: "#fef2f2" };
    if (dl.cls === "due-today") return { ...base, border: "1px solid #fcd34d", color: "#d97706", background: "#fffbeb" };
    return { ...base, border: "1px solid #93c5fd", color: "#2563eb", background: "#eff6ff" };
  },
  smallBtn: { fontSize: 11, padding: "2px 6px", borderRadius: 6, border: "1px solid #e5e7eb", color: "#9ca3af", cursor: "pointer", background: "transparent", lineHeight: "18px" },
};

/* ────────── MAIN APP ────────── */
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [bills, setBills] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [dueModal, setDueModal] = useState(null);
  const [moveModal, setMoveModal] = useState(null);
  const [addBillModal, setAddBillModal] = useState(false);
  const [newBill, setNewBill] = useState({ name: "", amount: "", freq: "Monthly", day: 1 });
  const [addInput, setAddInput] = useState("");
  const [addCat, setAddCat] = useState("Today");
  const [customDate, setCustomDate] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("bdq-all-data");
        if (res && res.value) {
          const p = JSON.parse(res.value);
          setTasks(p.tasks || DEFAULT_TASKS);
          setBills(p.bills || DEFAULT_BILLS);
        } else { setTasks(DEFAULT_TASKS); setBills(DEFAULT_BILLS); }
      } catch { setTasks(DEFAULT_TASKS); setBills(DEFAULT_BILLS); }
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (t, b) => {
    try { await window.storage.set("bdq-all-data", JSON.stringify({ tasks: t, bills: b })); } catch (e) { console.error("Save failed", e); }
  }, []);

  const updateTasks = (fn) => setTasks(prev => { const next = fn(prev); persist(next, bills); return next; });
  const updateBills = (fn) => setBills(prev => { const next = fn(prev); persist(tasks, next); return next; });

  const toggleDone = (id) => updateTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const cyclePriority = (id) => updateTasks(t => t.map(x => x.id === id ? { ...x, priority: { high: "medium", medium: "low", low: "high" }[x.priority] } : x));
  const setDue = (id, due) => updateTasks(t => t.map(x => x.id === id ? { ...x, due } : x));
  const moveTask = (id, cat) => updateTasks(t => t.map(x => x.id === id ? { ...x, cat, priority: DEF_PRI[cat] || "medium" } : x));
  const deleteTask = (id) => updateTasks(t => t.filter(x => x.id !== id));

  const addTask = () => {
    if (!addInput.trim()) return;
    const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    updateTasks(t => [...t, { id: newId, cat: addCat, name: addInput.trim(), done: false, priority: DEF_PRI[addCat] || "medium", due: null }]);
    setAddInput(""); setActiveTab(addCat);
  };

  const addBill = () => {
    if (!newBill.name.trim() || !newBill.amount) return;
    const newId = bills.length ? Math.max(...bills.map(b => b.id)) + 1 : 1;
    updateBills(b => [...b, { id: newId, name: newBill.name.trim(), amount: parseFloat(newBill.amount), freq: newBill.freq, day: parseInt(newBill.day) }]);
    setNewBill({ name: "", amount: "", freq: "Monthly", day: 1 }); setAddBillModal(false);
  };

  const deleteBill = (id) => updateBills(b => b.filter(x => x.id !== id));

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#888", fontFamily: "system-ui" }}>Loading...</div>;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const openCount = tasks.filter(t => !t.done).length;
  const highCount = tasks.filter(t => t.priority === "high" && !t.done).length;
  const urgentCount = tasks.filter(t => t.urgent && !t.done).length;
  const doneCount = tasks.filter(t => t.done).length;

  /* ── Task Card ── */
  const TaskCard = ({ t, theme }) => {
    const dl = getDueLabel(t.due);
    const isOverdue = dl && dl.cls === "overdue";
    const isBold = t.priority === "high" || t.urgent || isOverdue;
    const isItalic = t.priority === "low" && !t.urgent && !isOverdue;

    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 4,
        borderRadius: 10, border: `1px solid ${theme.border}40`, background: theme.card,
        opacity: t.done ? 0.35 : 1, borderLeft: `4px solid ${theme.accent}`,
        transition: "opacity 0.2s",
      }}>
        {/* Col 1: Checkbox + task name */}
        <button onClick={() => toggleDone(t.id)} style={{
          width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: "pointer",
          border: t.done ? "none" : `2.5px solid ${theme.accent}60`, display: "flex", alignItems: "center", justifyContent: "center",
          background: t.done ? "#22c55e" : "transparent", transition: "all 0.15s",
        }}>
          {t.done && <svg width="11" height="9" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
        </button>
        <span style={{
          flex: 1, fontSize: 16, lineHeight: 1.35, color: t.done ? "#aaa" : "#1a1a1a",
          fontWeight: isBold ? 700 : isItalic ? 400 : 500,
          fontStyle: isItalic ? "italic" : "normal",
          textDecoration: t.done ? "line-through" : "none", minWidth: 0,
        }}>{t.name}</span>

        {/* Col 2: Priority + urgent */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0 }}>
          <button onClick={() => cyclePriority(t.id)} style={S.pri(t.priority)}>
            {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
          </button>
          {t.urgent && <span style={{ fontSize: 9, background: "#ef4444", color: "#fff", padding: "1px 6px", borderRadius: 5, fontWeight: 800, animation: "pulse 1.5s infinite" }}>URGENT</span>}
        </div>

        {/* Col 3: Date + move + delete */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <button onClick={() => { setDueModal(t.id); setCustomDate(t.due?.type === "custom" ? t.due.date : ""); }} style={S.dueBtn(dl)}>
            {dl ? dl.text : "+ Date"}
          </button>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <button onClick={() => setMoveModal(t.id)} style={S.smallBtn} title="Move">↗</button>
            <button onClick={() => setDeleteConfirm(t.id)} style={{ ...S.smallBtn, fontSize: 10 }} title="Delete">✕</button>
          </div>
        </div>
      </div>
    );
  };

  /* ── Heading Block ── */
  const HeadingBlock = ({ cat }) => {
    const th = THEMES[cat];
    const catTasks = tasks.filter(t => t.cat === cat);
    const active = catTasks.filter(t => !t.done);
    const done = catTasks.filter(t => t.done);
    const high = active.filter(t => t.priority === "high" || t.urgent);
    const rest = active.filter(t => t.priority !== "high" && !t.urgent);
    const hc = high.length;

    return (
      <div style={{ margin: "0 12px 16px", borderRadius: 16, overflow: "hidden", border: `1.5px solid ${th.border}`, background: th.bg }}>
        {/* Banner */}
        <div style={{ padding: "16px 16px 12px", background: `linear-gradient(135deg, ${th.bg2}, ${th.bg})` }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.8, lineHeight: 1, color: th.text }}>{cat}</div>
          <div style={{ fontSize: 12, marginTop: 4, color: th.sub, fontWeight: 600 }}>
            {active.length} open{hc > 0 && ` · ${hc} high priority`}
          </div>
        </div>
        {/* Tasks */}
        <div style={{ padding: "4px 8px 8px" }}>
          {high.map(t => <TaskCard key={t.id} t={t} theme={th} />)}
          {rest.map(t => <TaskCard key={t.id} t={t} theme={th} />)}
          {!active.length && !done.length && <div style={{ textAlign: "center", padding: 16, color: "#aaa", fontSize: 13 }}>No tasks yet</div>}
          {done.length > 0 && (
            <>
              <div style={{ fontSize: 10, color: th.sub, textTransform: "uppercase", letterSpacing: 1, margin: "8px 0 4px", padding: "6px 0 0", borderTop: `1px solid ${th.border}60` }}>
                Completed ({done.length})
              </div>
              {done.map(t => <TaskCard key={t.id} t={t} theme={th} />)}
            </>
          )}
        </div>
      </div>
    );
  };

  /* ── Bill Block ── */
  const BillBlock = () => {
    const th = THEMES["Bills"];
    return (
      <div style={{ margin: "0 12px 16px", borderRadius: 16, overflow: "hidden", border: `1.5px solid ${th.border}`, background: th.bg }}>
        <div style={{ padding: "16px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", background: `linear-gradient(135deg, ${th.bg2}, ${th.bg})` }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.8, lineHeight: 1, color: th.text }}>Bills</div>
            <div style={{ fontSize: 12, marginTop: 4, color: th.sub, fontWeight: 600 }}>{bills.length} tracked</div>
          </div>
          <button onClick={() => setAddBillModal(true)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${th.border}`, color: th.text, fontWeight: 700, background: "transparent", cursor: "pointer" }}>+ Add bill</button>
        </div>
        <div style={{ padding: "4px 8px 8px" }}>
          {bills.map(b => {
            const s = getBillDue(b);
            return (
              <div key={b.id} style={{ background: th.card, border: `1px solid ${th.border}50`, borderRadius: 10, padding: "10px 12px", marginBottom: 4, borderLeft: `4px solid ${th.accent}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>{b.name}</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: th.accent }}>${b.amount.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{b.freq} — {b.freq === "Monthly" ? `${b.day}th of each month` : "Every Thursday"}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12 }} className={s.cls}>{s.label}</span>
                    <button onClick={() => deleteBill(b.id)} style={{ fontSize: 11, color: "#ccc", cursor: "pointer", background: "none", border: "none" }}>✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── Modal backdrop ── */
  const Overlay = ({ children, onClose }) => (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, width: 280, maxWidth: "90vw", boxShadow: "0 8px 30px rgba(0,0,0,0.15)", maxHeight: "80vh", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );

  const ModalBtn = ({ children, onClick, style: s }) => (
    <button onClick={onClick} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", marginBottom: 4, borderRadius: 8, border: "1px solid #e5e7eb", background: "transparent", color: "#1a1a1a", fontSize: 14, cursor: "pointer", fontFamily: "system-ui", ...s }}>{children}</button>
  );

  /* ────────── RENDER ────────── */
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 80, background: "#f0f0f0", minHeight: "100vh", fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" }}>
      {/* Pulse animation */}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#f0f0f0", borderBottom: "1px solid #ddd", padding: "16px 12px 10px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, color: "#b8860b" }}>Big Dawg HQ</span>
          <span style={{ fontSize: 12, color: "#999" }}>{dateStr}</span>
        </div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
          {["All", ...CATS].map(t => {
            const th = THEMES[t] || { accent: "#b8860b" };
            const isActive = activeTab === t;
            return (
              <button key={t} onClick={() => { setActiveTab(t); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{
                  flexShrink: 0, fontSize: 11, padding: "5px 10px", borderRadius: 16, whiteSpace: "nowrap", cursor: "pointer", fontWeight: isActive ? 700 : 400, fontFamily: "system-ui",
                  transition: "all 0.15s", border: `1px solid ${isActive ? th.accent : "#ddd"}`,
                  background: isActive ? th.accent : "transparent", color: isActive ? "#fff" : "#888",
                }}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary bar */}
      {activeTab === "All" && (
        <div style={{ display: "flex", gap: 6, margin: "12px 12px 8px" }}>
          {[{ n: openCount, l: "Open", c: "#b8860b" }, { n: highCount, l: "High", c: "#dc2626" }, { n: urgentCount, l: "Urgent", c: "#ef4444" }, { n: doneCount, l: "Done", c: "#22c55e" }].map(s => (
            <div key={s.l} style={{ flex: 1, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.n}</div>
              <div style={{ fontSize: 9, color: "#999", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ marginTop: 8 }}>
        {activeTab === "All" ? CATS.map(c => c === "Bills" ? <BillBlock key={c} /> : <HeadingBlock key={c} cat={c} />) :
         activeTab === "Bills" ? <BillBlock /> : <HeadingBlock cat={activeTab} />}
      </div>

      {/* Add bar */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 520, padding: "8px 12px", background: "#f0f0f0", borderTop: "1px solid #ddd", zIndex: 50 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <input value={addInput} onChange={e => setAddInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()}
            placeholder="Add task..." style={{ flex: 1, background: "#fff", border: "1px solid #ddd", borderRadius: 10, padding: "10px 12px", fontSize: 14, color: "#1a1a1a", outline: "none", fontFamily: "system-ui" }} />
          <select value={addCat} onChange={e => setAddCat(e.target.value)} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 10, padding: "8px 6px", fontSize: 11, color: "#666", maxWidth: 95, fontFamily: "system-ui" }}>
            {CATS.filter(c => c !== "Bills").map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={addTask} style={{ background: "#b8860b", border: "none", borderRadius: 10, padding: "10px 14px", fontSize: 18, fontWeight: 700, color: "#fff", cursor: "pointer" }}>+</button>
        </div>
      </div>

      {/* Due date modal */}
      {dueModal !== null && (
        <Overlay onClose={() => setDueModal(null)}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#1a1a1a" }}>{tasks.find(t => t.id === dueModal)?.name || "Set due date"}</h3>
          {[["today", "Due today"], ["tomorrow", "Due tomorrow"], ["week", "Due this week"], ["month", "Due this month"]].map(([k, label]) => (
            <ModalBtn key={k} onClick={() => { setDue(dueModal, { type: k }); setDueModal(null); }}>{label}</ModalBtn>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} style={{ flex: 1, background: "#f9f9f9", border: "1px solid #ddd", borderRadius: 8, padding: "8px 10px", fontSize: 13, fontFamily: "system-ui" }} />
            <button onClick={() => { if (customDate) { setDue(dueModal, { type: "custom", date: customDate }); setDueModal(null); } }}
              style={{ background: "#2563eb", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Set</button>
          </div>
          <button onClick={() => { setDue(dueModal, null); setDueModal(null); }} style={{ display: "block", width: "100%", textAlign: "center", padding: 8, marginTop: 8, border: "none", background: "transparent", color: "#dc2626", fontSize: 12, cursor: "pointer", fontFamily: "system-ui" }}>Clear date</button>
          <button onClick={() => setDueModal(null)} style={{ display: "block", width: "100%", textAlign: "center", padding: 6, border: "none", background: "transparent", color: "#999", fontSize: 12, cursor: "pointer", fontFamily: "system-ui" }}>Cancel</button>
        </Overlay>
      )}

      {/* Move modal */}
      {moveModal !== null && (
        <Overlay onClose={() => setMoveModal(null)}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#1a1a1a" }}>Move: {tasks.find(t => t.id === moveModal)?.name}</h3>
          {CATS.filter(c => c !== "Bills" && c !== tasks.find(t => t.id === moveModal)?.cat).map(c => (
            <ModalBtn key={c} onClick={() => { moveTask(moveModal, c); setMoveModal(null); }} style={{ borderLeft: `4px solid ${THEMES[c].accent}` }}>{c}</ModalBtn>
          ))}
          <button onClick={() => setMoveModal(null)} style={{ display: "block", width: "100%", textAlign: "center", padding: 8, marginTop: 4, border: "none", background: "transparent", color: "#999", fontSize: 12, cursor: "pointer", fontFamily: "system-ui" }}>Cancel</button>
        </Overlay>
      )}

      {/* Delete confirm */}
      {deleteConfirm !== null && (
        <Overlay onClose={() => setDeleteConfirm(null)}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Delete task?</p>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>{tasks.find(t => t.id === deleteConfirm)?.name}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid #ddd", background: "transparent", fontSize: 14, color: "#666", cursor: "pointer", fontFamily: "system-ui" }}>Cancel</button>
              <button onClick={() => { deleteTask(deleteConfirm); setDeleteConfirm(null); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: "#ef4444", fontSize: 14, color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "system-ui" }}>Delete</button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Add bill modal */}
      {addBillModal && (
        <Overlay onClose={() => setAddBillModal(false)}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "#1a1a1a" }}>Add bill</h3>
          {[
            { val: newBill.name, key: "name", ph: "Bill name", type: "text" },
            { val: newBill.amount, key: "amount", ph: "Amount ($)", type: "number" },
          ].map(f => (
            <input key={f.key} value={f.val} onChange={e => setNewBill({ ...newBill, [f.key]: e.target.value })} placeholder={f.ph} type={f.type}
              style={{ width: "100%", background: "#f9f9f9", border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 8, boxSizing: "border-box", fontFamily: "system-ui" }} />
          ))}
          <select value={newBill.freq} onChange={e => setNewBill({ ...newBill, freq: e.target.value })} style={{ width: "100%", background: "#f9f9f9", border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 8, fontFamily: "system-ui" }}>
            <option value="Monthly">Monthly</option><option value="Weekly">Weekly</option>
          </select>
          <input value={newBill.day} onChange={e => setNewBill({ ...newBill, day: e.target.value })} placeholder={newBill.freq === "Monthly" ? "Day of month (1-31)" : "Day of week (0=Sun, 4=Thu)"} type="number"
            style={{ width: "100%", background: "#f9f9f9", border: "1px solid #ddd", borderRadius: 8, padding: "10px 12px", fontSize: 14, marginBottom: 12, boxSizing: "border-box", fontFamily: "system-ui" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setAddBillModal(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid #ddd", background: "transparent", fontSize: 14, color: "#666", cursor: "pointer", fontFamily: "system-ui" }}>Cancel</button>
            <button onClick={addBill} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: "#b8860b", fontSize: 14, color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "system-ui" }}>Add</button>
          </div>
        </Overlay>
      )}
    </div>
  );
}
