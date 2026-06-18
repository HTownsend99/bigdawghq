import { useState, useEffect, useCallback } from "react";

const THEMES = {
  "Today":       {bg:"#fff9e6",accent:"#b8860b",border:"#e6d68a",text:"#8b6508",sub:"#b89030"},
  "Upcoming":    {bg:"#e8f4fd",accent:"#2471a3",border:"#a3c8e0",text:"#1a5276",sub:"#2e86c1"},
  "Admin":       {bg:"#f3eafa",accent:"#7d3c98",border:"#c9a3e0",text:"#6c3483",sub:"#8e44ad"},
  "Financial":   {bg:"#e8f8ef",accent:"#1e8449",border:"#a3d9b1",text:"#196f3d",sub:"#27ae60"},
  "Future Buys": {bg:"#fce8f0",accent:"#c0305e",border:"#e0a3b8",text:"#922b52",sub:"#d4477a"},
  "Shopping":    {bg:"#fef3e2",accent:"#b87300",border:"#e0c98a",text:"#935d00",sub:"#d4890a"},
  "Concepts":    {bg:"#e2f7f5",accent:"#148f88",border:"#8ed4cf",text:"#0e6b66",sub:"#17a89f"},
  "Long Term":   {bg:"#eeebf7",accent:"#5b48a2",border:"#b3a8d8",text:"#4a3b8f",sub:"#6e5fc2"},
  "Job / Career":{bg:"#fef5e6",accent:"#b87d00",border:"#e0c98a",text:"#8b6000",sub:"#d49a10"},
  "Health":      {bg:"#e8f5e8",accent:"#2d8a30",border:"#a3d4a5",text:"#236b25",sub:"#38a63a"},
  "Socialising": {bg:"#f7e8fa",accent:"#9b30b0",border:"#d0a3e0",text:"#7b2591",sub:"#b84cc8"},
  "Events":      {bg:"#fde8eb",accent:"#c0392b",border:"#e0a3a3",text:"#96281b",sub:"#e04a3b"},
  "Bills":       {bg:"#fef8e6",accent:"#9a7800",border:"#d8c878",text:"#7a6000",sub:"#b89500"},
};

const CATS = ["Today","Upcoming","Admin","Financial","Future Buys","Shopping","Concepts","Long Term","Job / Career","Health","Socialising","Events","Bills"];
const DEF_PRI = {"Today":"high","Upcoming":"high","Admin":"medium","Financial":"high","Future Buys":"low","Shopping":"low","Concepts":"medium","Long Term":"low","Job / Career":"high","Health":"medium","Socialising":"low","Events":"high","Bills":"high"};

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
  {id:1,name:"Mortgage — Bendigo Bank",amount:3088,freq:"Monthly",day:16},
  {id:2,name:"Rent",amount:280,freq:"Weekly",day:4},
];

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
    if (d < 0) return { label: `Overdue (${Math.abs(d)}d)`, cls: "text-red-600" };
    if (d <= 5) return { label: `Due in ${d}d`, cls: "text-amber-600" };
    return { label: `Due in ${d}d`, cls: "text-green-600" };
  }
  if (bill.freq === "Weekly") {
    const d = (bill.day - now.getDay() + 7) % 7 || 7;
    if (d <= 1) return { label: d === 0 ? "Due today" : "Tomorrow", cls: "text-amber-600" };
    return { label: `Due in ${d}d`, cls: "text-green-600" };
  }
  return { label: "", cls: "" };
}

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
          const parsed = JSON.parse(res.value);
          setTasks(parsed.tasks || DEFAULT_TASKS);
          setBills(parsed.bills || DEFAULT_BILLS);
        } else {
          setTasks(DEFAULT_TASKS);
          setBills(DEFAULT_BILLS);
        }
      } catch {
        setTasks(DEFAULT_TASKS);
        setBills(DEFAULT_BILLS);
      }
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (newTasks, newBills) => {
    try {
      await window.storage.set("bdq-all-data", JSON.stringify({ tasks: newTasks, bills: newBills }));
    } catch (e) { console.error("Save failed", e); }
  }, []);

  const updateTasks = (fn) => {
    setTasks(prev => {
      const next = fn(prev);
      persist(next, bills);
      return next;
    });
  };

  const updateBills = (fn) => {
    setBills(prev => {
      const next = fn(prev);
      persist(tasks, next);
      return next;
    });
  };

  const toggleDone = (id) => updateTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const cyclePriority = (id) => updateTasks(t => t.map(x => x.id === id ? { ...x, priority: { high: "medium", medium: "low", low: "high" }[x.priority] } : x));
  const setDue = (id, due) => updateTasks(t => t.map(x => x.id === id ? { ...x, due } : x));
  const moveTask = (id, cat) => updateTasks(t => t.map(x => x.id === id ? { ...x, cat, priority: DEF_PRI[cat] || "medium" } : x));
  const deleteTask = (id) => updateTasks(t => t.filter(x => x.id !== id));

  const addTask = () => {
    if (!addInput.trim()) return;
    const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    updateTasks(t => [...t, { id: newId, cat: addCat, name: addInput.trim(), done: false, priority: DEF_PRI[addCat] || "medium", due: null }]);
    setAddInput("");
    setActiveTab(addCat);
  };

  const addBill = () => {
    if (!newBill.name.trim() || !newBill.amount) return;
    const newId = bills.length ? Math.max(...bills.map(b => b.id)) + 1 : 1;
    updateBills(b => [...b, { id: newId, name: newBill.name.trim(), amount: parseFloat(newBill.amount), freq: newBill.freq, day: parseInt(newBill.day) }]);
    setNewBill({ name: "", amount: "", freq: "Monthly", day: 1 });
    setAddBillModal(false);
  };

  const deleteBill = (id) => updateBills(b => b.filter(x => x.id !== id));

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading your tasks...</div>;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const openCount = tasks.filter(t => !t.done).length;
  const highCount = tasks.filter(t => t.priority === "high" && !t.done).length;
  const urgentCount = tasks.filter(t => t.urgent && !t.done).length;
  const doneCount = tasks.filter(t => t.done).length;

  const priClass = (p) => p === "high" ? "bg-red-50 text-red-700 border border-red-200" : p === "low" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-amber-50 text-amber-700 border border-amber-200";
  const dueClass = (dl) => !dl ? "border border-gray-200 text-gray-400" : dl.cls === "overdue" ? "border border-red-200 text-red-600 bg-red-50" : dl.cls === "due-today" ? "border border-amber-200 text-amber-600 bg-amber-50" : "border border-blue-200 text-blue-600 bg-blue-50";

  const TaskCard = ({ t }) => {
    const dl = getDueLabel(t.due);
    return (
      <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 mb-1.5 bg-white transition-opacity ${t.done ? "opacity-30" : ""}`}>
        <button onClick={() => toggleDone(t.id)} className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${t.done ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-gray-500"}`}>
          {t.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>}
        </button>
        <span className={`flex-1 text-sm leading-snug ${t.done ? "line-through text-gray-400" : "text-gray-900"}`}>{t.name}</span>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex gap-1 items-center">
            {t.urgent && <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-md font-bold animate-pulse">URGENT</span>}
            <button onClick={() => cyclePriority(t.id)} className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${priClass(t.priority)}`}>
              {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
            </button>
          </div>
          <div className="flex gap-1 items-center">
            <button onClick={() => { setDueModal(t.id); setCustomDate(t.due?.type === "custom" ? t.due.date : ""); }} className={`text-[9px] px-2 py-0.5 rounded-md ${dueClass(dl)}`}>
              {dl ? dl.text : "+ Date"}
            </button>
            <button onClick={() => setMoveModal(t.id)} className="text-[9px] px-1.5 py-0.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50" title="Move">↗</button>
            <button onClick={() => setDeleteConfirm(t.id)} className="text-[9px] px-1.5 py-0.5 rounded-md border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200" title="Delete">✕</button>
          </div>
        </div>
      </div>
    );
  };

  const HeadingBlock = ({ cat }) => {
    const th = THEMES[cat];
    const catTasks = tasks.filter(t => t.cat === cat);
    const active = catTasks.filter(t => !t.done);
    const done = catTasks.filter(t => t.done);
    const high = active.filter(t => t.priority === "high" || t.urgent);
    const rest = active.filter(t => t.priority !== "high" && !t.urgent);
    const hc = high.length;
    return (
      <div className="mx-4 mb-5 rounded-2xl overflow-hidden border" style={{ borderColor: th.border, background: th.bg }}>
        <div className="px-4 pt-4 pb-3">
          <div className="text-[26px] font-extrabold leading-none tracking-tight" style={{ color: th.text }}>{cat}</div>
          <div className="text-[11px] mt-1" style={{ color: th.sub }}>{active.length} open{hc > 0 && ` · ${hc} high priority`}</div>
        </div>
        <div className="px-2.5 pb-2.5">
          {high.map(t => <TaskCard key={t.id} t={t} />)}
          {rest.map(t => <TaskCard key={t.id} t={t} />)}
          {!active.length && !done.length && <div className="text-center py-5 text-gray-400 text-xs">No tasks yet</div>}
          {done.length > 0 && (
            <>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-2.5 pt-2 border-t border-gray-200 mb-1.5">Completed ({done.length})</div>
              {done.map(t => <TaskCard key={t.id} t={t} />)}
            </>
          )}
        </div>
      </div>
    );
  };

  const BillBlock = () => {
    const th = THEMES["Bills"];
    return (
      <div className="mx-4 mb-5 rounded-2xl overflow-hidden border" style={{ borderColor: th.border, background: th.bg }}>
        <div className="px-4 pt-4 pb-3 flex items-end justify-between">
          <div>
            <div className="text-[26px] font-extrabold leading-none tracking-tight" style={{ color: th.text }}>Bills</div>
            <div className="text-[11px] mt-1" style={{ color: th.sub }}>{bills.length} tracked</div>
          </div>
          <button onClick={() => setAddBillModal(true)} className="text-xs px-3 py-1.5 rounded-lg border font-semibold" style={{ borderColor: th.border, color: th.text }}>+ Add bill</button>
        </div>
        <div className="px-2.5 pb-2.5">
          {bills.map(b => {
            const s = getBillDue(b);
            return (
              <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-3 mb-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{b.name}</span>
                  <span className="text-base font-bold" style={{ color: th.accent }}>${b.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-gray-400">{b.freq} — {b.freq === "Monthly" ? `${b.day}th of each month` : "Every Thursday"}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold ${s.cls}`}>{s.label}</span>
                    <button onClick={() => deleteBill(b.id)} className="text-[9px] text-gray-300 hover:text-red-500">✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[520px] mx-auto pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-50 border-b border-gray-200 px-4 pt-5 pb-3">
        <div className="flex items-baseline justify-between mb-2.5">
          <span className="text-2xl font-bold tracking-tight" style={{ color: "#b8860b" }}>Big Dawg HQ</span>
          <span className="text-[11px] text-gray-400">{dateStr}</span>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {["All", ...CATS].map(t => {
            const th = THEMES[t] || { accent: "#b8860b" };
            const isActive = activeTab === t;
            return (
              <button key={t} onClick={() => { setActiveTab(t); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="flex-shrink-0 text-[10px] px-2 py-1 rounded-2xl border whitespace-nowrap transition-all"
                style={isActive ? { background: th.accent, color: "#fff", borderColor: th.accent, fontWeight: 600 } : { borderColor: "#ddd", color: "#888" }}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {activeTab === "All" && (
        <div className="flex gap-1.5 mx-4 mt-4 mb-2">
          {[{ n: openCount, l: "Open", c: "#b8860b" }, { n: highCount, l: "High", c: "#c0392b" }, { n: urgentCount, l: "Urgent", c: "#e74c3c" }, { n: doneCount, l: "Done", c: "#27ae60" }].map(s => (
            <div key={s.l} className="flex-1 bg-white border border-gray-200 rounded-xl p-2.5 text-center">
              <div className="text-xl font-extrabold" style={{ color: s.c }}>{s.n}</div>
              <div className="text-[9px] text-gray-400 uppercase tracking-wider mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="mt-3">
        {activeTab === "All" ? CATS.map(c => c === "Bills" ? <BillBlock key={c} /> : <HeadingBlock key={c} cat={c} />) :
         activeTab === "Bills" ? <BillBlock /> : <HeadingBlock cat={activeTab} />}
      </div>

      {/* Add bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[520px] px-4 py-2.5 bg-gray-50 border-t border-gray-200 z-50">
        <div className="flex gap-1.5">
          <input value={addInput} onChange={e => setAddInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()}
            placeholder="Add task..." className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-amber-600" />
          <select value={addCat} onChange={e => setAddCat(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-1.5 py-2 text-[10px] text-gray-500 max-w-[90px]">
            {CATS.filter(c => c !== "Bills").map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={addTask} className="bg-amber-600 text-white font-bold text-base rounded-xl px-3.5">+</button>
        </div>
      </div>

      {/* Due date modal */}
      {dueModal !== null && (
        <div className="fixed inset-0 z-[200] bg-black/30 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setDueModal(null); }}>
          <div className="bg-white rounded-2xl p-5 w-72 max-w-[90vw] shadow-xl">
            <h3 className="text-sm font-semibold mb-3 text-gray-900">{tasks.find(t => t.id === dueModal)?.name || "Set due date"}</h3>
            {["today", "tomorrow", "week", "month"].map(p => (
              <button key={p} onClick={() => { setDue(dueModal, { type: p }); setDueModal(null); }}
                className="block w-full text-left px-3 py-2.5 mb-1 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                Due {p === "week" ? "this week" : p === "month" ? "this month" : p}
              </button>
            ))}
            <div className="flex gap-2 mt-1.5">
              <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-sm" />
              <button onClick={() => { if (customDate) { setDue(dueModal, { type: "custom", date: customDate }); setDueModal(null); } }}
                className="bg-blue-600 text-white rounded-lg px-3 py-2 text-xs font-semibold">Set</button>
            </div>
            <button onClick={() => { setDue(dueModal, null); setDueModal(null); }} className="block w-full text-center pt-2.5 mt-2 text-xs text-red-500">Clear date</button>
            <button onClick={() => setDueModal(null)} className="block w-full text-center pt-1.5 text-xs text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {/* Move modal */}
      {moveModal !== null && (
        <div className="fixed inset-0 z-[200] bg-black/30 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setMoveModal(null); }}>
          <div className="bg-white rounded-2xl p-5 w-72 max-w-[90vw] shadow-xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Move: {tasks.find(t => t.id === moveModal)?.name}</h3>
            {CATS.filter(c => c !== "Bills" && c !== tasks.find(t => t.id === moveModal)?.cat).map(c => (
              <button key={c} onClick={() => { moveTask(moveModal, c); setMoveModal(null); }}
                className="block w-full text-left px-3 py-2.5 mb-1 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                style={{ borderLeft: `4px solid ${THEMES[c].accent}` }}>{c}</button>
            ))}
            <button onClick={() => setMoveModal(null)} className="block w-full text-center pt-2 text-xs text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-[200] bg-black/30 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div className="bg-white rounded-2xl p-5 w-72 shadow-xl text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">Delete task?</p>
            <p className="text-xs text-gray-500 mb-4">{tasks.find(t => t.id === deleteConfirm)?.name}</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">Cancel</button>
              <button onClick={() => { deleteTask(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add bill modal */}
      {addBillModal && (
        <div className="fixed inset-0 z-[200] bg-black/30 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setAddBillModal(false); }}>
          <div className="bg-white rounded-2xl p-5 w-72 shadow-xl">
            <h3 className="text-sm font-semibold mb-3 text-gray-900">Add bill</h3>
            <input value={newBill.name} onChange={e => setNewBill({ ...newBill, name: e.target.value })} placeholder="Bill name" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" />
            <input value={newBill.amount} onChange={e => setNewBill({ ...newBill, amount: e.target.value })} placeholder="Amount ($)" type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2" />
            <select value={newBill.freq} onChange={e => setNewBill({ ...newBill, freq: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2">
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
            <input value={newBill.day} onChange={e => setNewBill({ ...newBill, day: e.target.value })} placeholder={newBill.freq === "Monthly" ? "Day of month (1-31)" : "Day of week (0=Sun, 4=Thu)"} type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3" />
            <div className="flex gap-2">
              <button onClick={() => setAddBillModal(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">Cancel</button>
              <button onClick={addBill} className="flex-1 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
