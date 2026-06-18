import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

type Category =
  | "Today" | "Upcoming" | "Admin" | "Financial" | "Future Buys" | "Shopping"
  | "Concepts" | "Long Term" | "Job / Career" | "Health" | "Socialising" | "Events" | "Bills";

type Priority = "high" | "medium" | "low";
type Due = null | { type: "today" | "tomorrow" | "week" | "month" } | { type: "custom"; date: string };

type Task = {
  id: number;
  user_id?: string;
  cat: Category;
  name: string;
  done: boolean;
  priority: Priority;
  due: Due;
  urgent: boolean;
};

type Bill = {
  id: number;
  user_id?: string;
  name: string;
  amount: number;
  freq: "Monthly" | "Weekly";
  day: number;
};

const THEMES: Record<Category, { bg: string; accent: string; border: string; text: string; sub: string }> = {
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

const CATS: Category[] = ["Today","Upcoming","Admin","Financial","Future Buys","Shopping","Concepts","Long Term","Job / Career","Health","Socialising","Events","Bills"];
const DEF_PRI: Record<Category, Priority> = {"Today":"high","Upcoming":"high","Admin":"medium","Financial":"high","Future Buys":"low","Shopping":"low","Concepts":"medium","Long Term":"low","Job / Career":"high","Health":"medium","Socialising":"low","Events":"high","Bills":"high"};

const DEFAULT_TASKS: Omit<Task, "id" | "user_id">[] = [
  {cat:"Upcoming",name:"Arrange jumper pickup/dropoff from Alfie",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Upcoming",name:"Review pet insurance / consider new policy",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Upcoming",name:"Send Brooke bylaws and redirect water invoice",done:false,priority:"high",due:null,urgent:false},
  {cat:"Upcoming",name:"Check saved folder from other computer",done:false,priority:"low",due:null,urgent:false},
  {cat:"Upcoming",name:"Forward BC details to QS",done:false,priority:"high",due:null,urgent:false},
  {cat:"Admin",name:"Clear out photos",done:false,priority:"low",due:null,urgent:false},
  {cat:"Admin",name:"Respond to messages",done:false,priority:"high",due:null,urgent:false},
  {cat:"Admin",name:"Clear out emails",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Admin",name:"Coordinate shipping with Paddy",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Admin",name:"Go through saved photos",done:false,priority:"low",due:null,urgent:false},
  {cat:"Financial",name:"Prepare tax documents",done:false,priority:"high",due:null,urgent:false},
  {cat:"Financial",name:"Create spending review",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Financial",name:"Create budget plan",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Financial",name:"Create recurring expenses summary",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Future Buys",name:"Rug",done:false,priority:"low",due:null,urgent:false},
  {cat:"Future Buys",name:"Genetic testing",done:false,priority:"low",due:null,urgent:false},
  {cat:"Future Buys",name:"Film Camera",done:false,priority:"low",due:null,urgent:false},
  {cat:"Shopping",name:"Fix Watches",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Concepts",name:"Power process",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Concepts",name:"HALT (AA)",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Concepts",name:"The Shadow",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Long Term",name:"Barrister",done:false,priority:"low",due:null,urgent:false},
  {cat:"Long Term",name:"Doctorate",done:false,priority:"high",due:null,urgent:false},
  {cat:"Long Term",name:"AI OnlyFans",done:false,priority:"low",due:null,urgent:false},
  {cat:"Long Term",name:"Brag sheet",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Long Term",name:"Brainstorm business ideas",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Job / Career",name:"Update resume",done:false,priority:"high",due:null,urgent:false},
  {cat:"Job / Career",name:"Contact recruiters",done:false,priority:"high",due:null,urgent:false},
  {cat:"Job / Career",name:"Apply for positions",done:false,priority:"high",due:null,urgent:false},
  {cat:"Job / Career",name:"Apply for GAMSAT",done:false,priority:"high",due:{type:"custom",date:"2026-06-30"},urgent:true},
  {cat:"Job / Career",name:"Draft career plan",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Health",name:"Prepare gym program",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Health",name:"Prepare meal plan and track calories",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Health",name:"Write goals for 2026",done:false,priority:"high",due:null,urgent:false},
  {cat:"Health",name:"Prepare journal questions",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Health",name:"Create list of habits and daily routine",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Socialising",name:"Sign up to social netball",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Socialising",name:"Enquire about rowing",done:false,priority:"medium",due:null,urgent:false},
  {cat:"Socialising",name:"Post on Instagram",done:false,priority:"low",due:null,urgent:false},
];

const DEFAULT_BILLS: Omit<Bill, "id" | "user_id">[] = [
  {name:"Mortgage — Bendigo Bank",amount:3088,freq:"Monthly",day:16},
  {name:"Rent",amount:280,freq:"Weekly",day:4},
];

function getDueLabel(due: Due) {
  if (!due) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (due.type === "today") return { text: "Today", cls: "due-today" };
  if (due.type === "tomorrow") return { text: "Tomorrow", cls: "has-date" };
  if (due.type === "week") return { text: "This week", cls: "has-date" };
  if (due.type === "month") return { text: "This month", cls: "has-date" };
  const d = new Date(due.date + "T00:00:00");
  const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
  const label = d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
  if (diff < 0) return { text: "Overdue " + label, cls: "overdue" };
  if (diff === 0) return { text: "Today", cls: "due-today" };
  if (diff === 1) return { text: "Tomorrow", cls: "has-date" };
  return { text: label, cls: "has-date" };
}

function getBillDue(bill: Bill) {
  const now = new Date();
  if (bill.freq === "Monthly") {
    const d = bill.day - now.getDate();
    if (d < 0) return { label: `Overdue (${Math.abs(d)}d)`, cls: "due-overdue-bill" };
    if (d <= 5) return { label: `Due in ${d}d`, cls: "due-soon" };
    return { label: `Due in ${d}d`, cls: "due-ok" };
  }
  const d = (bill.day - now.getDay() + 7) % 7;
  if (d === 0) return { label: "Due today", cls: "due-soon" };
  if (d === 1) return { label: "Tomorrow", cls: "due-soon" };
  return { label: `Due in ${d}d`, cls: "due-ok" };
}

function AuthBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setMessage("");
    const res = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (res.error) setMessage(res.error.message);
    else setMessage(mode === "signup" ? "Account created. Check email confirmation if Supabase requires it." : "Signed in.");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Big Dawg HQ</h1>
        <p>Sign in to sync your tasks and bills across the live hosted domain.</p>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button disabled={busy || !email || !password} onClick={submit}>{busy ? "Working..." : mode === "login" ? "Sign in" : "Create account"}</button>
        <button className="link-btn" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Need an account? Create one" : "Already have an account? Sign in"}</button>
        {message && <div className="auth-message">{message}</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeTab, setActiveTab] = useState<Category | "All">("All");
  const [loading, setLoading] = useState(true);
  const [dueModal, setDueModal] = useState<number | null>(null);
  const [moveModal, setMoveModal] = useState<number | null>(null);
  const [addBillModal, setAddBillModal] = useState(false);
  const [newBill, setNewBill] = useState({ name: "", amount: "", freq: "Monthly" as Bill["freq"], day: 1 });
  const [addInput, setAddInput] = useState("");
  const [addCat, setAddCat] = useState<Category>("Today");
  const [customDate, setCustomDate] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, current) => setSession(current));
    return () => sub.subscription.unsubscribe();
  }, []);

  const seedDefaults = useCallback(async (userId: string) => {
    const taskRows = DEFAULT_TASKS.map(t => ({ ...t, user_id: userId }));
    const billRows = DEFAULT_BILLS.map(b => ({ ...b, user_id: userId }));
    const { error: taskError } = await supabase.from("tasks").insert(taskRows);
    if (taskError) throw taskError;
    const { error: billError } = await supabase.from("bills").insert(billRows);
    if (billError) throw billError;
  }, []);

  const loadData = useCallback(async () => {
    if (!session?.user.id) return;
    setLoading(true);
    setError("");
    try {
      const [{ data: taskData, error: taskError }, { data: billData, error: billError }] = await Promise.all([
        supabase.from("tasks").select("*").order("id", { ascending: true }),
        supabase.from("bills").select("*").order("id", { ascending: true })
      ]);
      if (taskError) throw taskError;
      if (billError) throw billError;

      if ((!taskData || taskData.length === 0) && (!billData || billData.length === 0)) {
        await seedDefaults(session.user.id);
        const [{ data: seededTasks }, { data: seededBills }] = await Promise.all([
          supabase.from("tasks").select("*").order("id", { ascending: true }),
          supabase.from("bills").select("*").order("id", { ascending: true })
        ]);
        setTasks((seededTasks || []) as Task[]);
        setBills((seededBills || []) as Bill[]);
      } else {
        setTasks((taskData || []) as Task[]);
        setBills((billData || []) as Bill[]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load data.");
    } finally {
      setLoading(false);
    }
  }, [session?.user.id, seedDefaults]);

  useEffect(() => { void loadData(); }, [loadData]);

  async function updateTask(id: number, patch: Partial<Task>) {
    const previous = tasks;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    const { error: err } = await supabase.from("tasks").update(patch).eq("id", id);
    if (err) { setTasks(previous); setError(err.message); }
  }

  async function addTask() {
    if (!session?.user.id || !addInput.trim()) return;
    const row = { user_id: session.user.id, cat: addCat, name: addInput.trim(), done: false, priority: DEF_PRI[addCat], due: null, urgent: false };
    const { data, error: err } = await supabase.from("tasks").insert(row).select("*").single();
    if (err) return setError(err.message);
    setTasks(prev => [...prev, data as Task]);
    setAddInput("");
    setActiveTab(addCat);
  }

  async function deleteTask(id: number) {
    const previous = tasks;
    setTasks(prev => prev.filter(t => t.id !== id));
    const { error: err } = await supabase.from("tasks").delete().eq("id", id);
    if (err) { setTasks(previous); setError(err.message); }
  }

  async function addBill() {
    if (!session?.user.id || !newBill.name.trim() || !newBill.amount) return;
    const row = { user_id: session.user.id, name: newBill.name.trim(), amount: Number(newBill.amount), freq: newBill.freq, day: Number(newBill.day) };
    const { data, error: err } = await supabase.from("bills").insert(row).select("*").single();
    if (err) return setError(err.message);
    setBills(prev => [...prev, data as Bill]);
    setNewBill({ name: "", amount: "", freq: "Monthly", day: 1 });
    setAddBillModal(false);
  }

  async function deleteBill(id: number) {
    const previous = bills;
    setBills(prev => prev.filter(b => b.id !== id));
    const { error: err } = await supabase.from("bills").delete().eq("id", id);
    if (err) { setBills(previous); setError(err.message); }
  }

  const counts = useMemo(() => ({
    open: tasks.filter(t => !t.done).length,
    high: tasks.filter(t => t.priority === "high" && !t.done).length,
    urgent: tasks.filter(t => t.urgent && !t.done).length,
    done: tasks.filter(t => t.done).length,
  }), [tasks]);

  if (!session) return <AuthBox />;
  if (loading) return <div className="loading">Loading your tasks...</div>;

  const dateStr = new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const TaskCard = ({ t }: { t: Task }) => {
    const dl = getDueLabel(t.due);
    return (
      <div className={`task-card ${t.done ? "done-card" : ""}`}>
        <button onClick={() => updateTask(t.id, { done: !t.done })} className={`task-check ${t.done ? "checked" : ""}`}>
          {t.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>}
        </button>
        <span className="task-name">{t.name}</span>
        <div className="task-right">
          <div className="task-right-row">
            {t.urgent && <span className="urgent-tag">URGENT</span>}
            <button onClick={() => updateTask(t.id, { priority: { high: "medium", medium: "low", low: "high" }[t.priority] as Priority })} className={`priority-badge p-${t.priority}`}>{t.priority}</button>
          </div>
          <div className="task-right-row">
            <button onClick={() => { setDueModal(t.id); setCustomDate(t.due?.type === "custom" ? t.due.date : ""); }} className={`due-badge ${dl?.cls || ""}`}>{dl ? dl.text : "+ Date"}</button>
            <button onClick={() => setMoveModal(t.id)} className="move-btn">↗</button>
            <button onClick={() => setDeleteConfirm(t.id)} className="move-btn danger">✕</button>
          </div>
        </div>
      </div>
    );
  };

  const HeadingBlock = ({ cat }: { cat: Category }) => {
    const th = THEMES[cat];
    const catTasks = tasks.filter(t => t.cat === cat);
    const active = catTasks.filter(t => !t.done);
    const done = catTasks.filter(t => t.done);
    const high = active.filter(t => t.priority === "high" || t.urgent);
    const rest = active.filter(t => t.priority !== "high" && !t.urgent);
    return (
      <div className="heading-block" style={{ borderColor: th.border, background: th.bg }}>
        <div className="heading-banner">
          <div className="heading-title" style={{ color: th.text }}>{cat}</div>
          <div className="heading-subtitle" style={{ color: th.sub }}>{active.length} open{high.length > 0 && ` · ${high.length} high priority`}</div>
        </div>
        <div className="heading-body">
          {[...high, ...rest].map(t => <TaskCard key={t.id} t={t} />)}
          {!active.length && !done.length && <div className="empty">No tasks yet</div>}
          {done.length > 0 && <><div className="completed-divider">Completed ({done.length})</div>{done.map(t => <TaskCard key={t.id} t={t} />)}</>}
        </div>
      </div>
    );
  };

  const BillBlock = () => {
    const th = THEMES.Bills;
    return (
      <div className="heading-block" style={{ borderColor: th.border, background: th.bg }}>
        <div className="heading-banner bill-heading">
          <div><div className="heading-title" style={{ color: th.text }}>Bills</div><div className="heading-subtitle" style={{ color: th.sub }}>{bills.length} tracked</div></div>
          <button onClick={() => setAddBillModal(true)} className="small-outline">+ Add bill</button>
        </div>
        <div className="heading-body">
          {bills.map(b => {
            const s = getBillDue(b);
            return <div key={b.id} className="bill-card"><div className="bill-row"><span className="bill-name">{b.name}</span><span className="bill-amount" style={{ color: th.accent }}>${b.amount.toLocaleString()}</span></div><div className="bill-row detail"><span>{b.freq} — {b.freq === "Monthly" ? `${b.day}th of each month` : `Day ${b.day} weekly`}</span><span className={s.cls}>{s.label} <button onClick={() => deleteBill(b.id)} className="bill-x">✕</button></span></div></div>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="header">
        <div className="header-top"><span className="app-title">Big Dawg HQ</span><span className="header-date">{dateStr}</span></div>
        <div className="tabs">{["All", ...CATS].map(t => { const th = t === "All" ? {accent:"#b8860b"} : THEMES[t as Category]; const active = activeTab === t; return <button key={t} onClick={() => { setActiveTab(t as Category | "All"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="tab" style={active ? { background: th.accent, color: "#fff", borderColor: th.accent, fontWeight: 700 } : {}}>{t}</button>; })}</div>
      </div>

      {error && <div className="error">{error}<button onClick={() => setError("")}>Dismiss</button></div>}

      {activeTab === "All" && <div className="summary-strip">
        <div className="stat-pill"><div className="stat-num gold">{counts.open}</div><div className="stat-label">Open</div></div>
        <div className="stat-pill"><div className="stat-num red">{counts.high}</div><div className="stat-label">High</div></div>
        <div className="stat-pill"><div className="stat-num danger-text">{counts.urgent}</div><div className="stat-label">Urgent</div></div>
        <div className="stat-pill"><div className="stat-num green">{counts.done}</div><div className="stat-label">Done</div></div>
      </div>}

      <div className="content">{activeTab === "All" ? CATS.map(c => c === "Bills" ? <BillBlock key={c} /> : <HeadingBlock key={c} cat={c} />) : activeTab === "Bills" ? <BillBlock /> : <HeadingBlock cat={activeTab} />}</div>

      <div className="add-bar"><div className="add-row"><input value={addInput} onChange={e => setAddInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add task..." className="add-input" /><select value={addCat} onChange={e => setAddCat(e.target.value as Category)} className="add-select">{CATS.filter(c => c !== "Bills").map(c => <option key={c} value={c}>{c}</option>)}</select><button onClick={addTask} className="add-btn">+</button></div></div>

      {dueModal !== null && <div className="modal-overlay show" onClick={e => { if (e.target === e.currentTarget) setDueModal(null); }}><div className="modal-panel"><h3>{tasks.find(t => t.id === dueModal)?.name || "Set due date"}</h3>{(["today","tomorrow","week","month"] as const).map(p => <button key={p} onClick={() => { updateTask(dueModal, { due: { type: p } }); setDueModal(null); }} className="modal-option">Due {p === "week" ? "this week" : p === "month" ? "this month" : p}</button>)}<div className="due-custom-row"><input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} className="due-date-input"/><button onClick={() => { if (customDate) { updateTask(dueModal, { due: { type: "custom", date: customDate } }); setDueModal(null); } }} className="due-set-btn">Set</button></div><button onClick={() => { updateTask(dueModal, { due: null }); setDueModal(null); }} className="due-clear">Clear date</button><button onClick={() => setDueModal(null)} className="modal-cancel">Cancel</button></div></div>}

      {moveModal !== null && <div className="modal-overlay show" onClick={e => { if (e.target === e.currentTarget) setMoveModal(null); }}><div className="modal-panel"><h3>Move: {tasks.find(t => t.id === moveModal)?.name}</h3>{CATS.filter(c => c !== "Bills" && c !== tasks.find(t => t.id === moveModal)?.cat).map(c => <button key={c} onClick={() => { updateTask(moveModal, { cat: c, priority: DEF_PRI[c] }); setMoveModal(null); }} className="modal-option" style={{ borderLeft: `4px solid ${THEMES[c].accent}` }}>{c}</button>)}<button onClick={() => setMoveModal(null)} className="modal-cancel">Cancel</button></div></div>}

      {deleteConfirm !== null && <div className="modal-overlay show" onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}><div className="modal-panel"><h3>Delete task?</h3><p className="confirm-text">{tasks.find(t => t.id === deleteConfirm)?.name}</p><div className="confirm-row"><button onClick={() => setDeleteConfirm(null)} className="modal-option">Cancel</button><button onClick={() => { deleteTask(deleteConfirm); setDeleteConfirm(null); }} className="delete-btn">Delete</button></div></div></div>}

      {addBillModal && <div className="modal-overlay show" onClick={e => { if (e.target === e.currentTarget) setAddBillModal(false); }}><div className="modal-panel"><h3>Add bill</h3><input value={newBill.name} onChange={e => setNewBill({ ...newBill, name: e.target.value })} placeholder="Bill name" className="due-date-input full"/><input value={newBill.amount} onChange={e => setNewBill({ ...newBill, amount: e.target.value })} placeholder="Amount ($)" type="number" className="due-date-input full"/><select value={newBill.freq} onChange={e => setNewBill({ ...newBill, freq: e.target.value as Bill["freq"] })} className="due-date-input full"><option value="Monthly">Monthly</option><option value="Weekly">Weekly</option></select><input value={newBill.day} onChange={e => setNewBill({ ...newBill, day: Number(e.target.value) })} type="number" className="due-date-input full"/><div className="confirm-row"><button onClick={() => setAddBillModal(false)} className="modal-option">Cancel</button><button onClick={addBill} className="due-set-btn">Add</button></div></div></div>}
    </div>
  );
}
