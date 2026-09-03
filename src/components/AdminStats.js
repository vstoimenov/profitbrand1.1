import { useEffect } from "react";
import { RefreshCw, Eye, Users, Mail, Percent } from "lucide-react";

const css = `
.st-head { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin:6px 0 16px; }
.st-range { display:flex; gap:6px; }
.st-range button { background:var(--b3); border:1px solid rgba(255,255,255,.08); color:var(--g2); padding:7px 12px; border-radius:8px; font-family:'Outfit'; font-size:12px; font-weight:600; cursor:pointer; }
.st-range button.act { background:var(--y); color:var(--b); border-color:var(--y); }
.st-tiles { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:18px; }
.st-tile { background:var(--b3); border:1px solid rgba(255,214,0,.12); border-radius:14px; padding:18px 18px 14px; }
.st-tile .l { font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--g); font-weight:700; display:flex; align-items:center; gap:6px; }
.st-tile .l svg { color:var(--y); }
.st-tile .n { font-family:'Unbounded'; font-size:30px; font-weight:900; color:var(--y); margin:6px 0 2px; }
.st-tile .s { font-size:11px; color:var(--g2); }
.st-card { background:var(--b3); border:1px solid rgba(255,255,255,.05); border-radius:14px; padding:18px; margin-bottom:14px; }
.st-card h4 { font-family:'Unbounded'; font-size:11px; font-weight:800; color:var(--g2); margin-bottom:12px; letter-spacing:.5px; }
.st-chart { display:flex; align-items:flex-end; gap:3px; height:140px; }
.st-bar { flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; height:100%; position:relative; min-width:6px; }
.st-bar i { display:block; width:100%; background:rgba(255,214,0,.35); border-radius:3px 3px 0 0; min-height:1px; }
.st-bar i.s { background:var(--y); }
.st-bar b { position:absolute; top:-2px; width:6px; height:6px; border-radius:50%; background:#FF4455; }
.st-bar:hover::after { content:attr(data-tip); position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); background:#000; color:#fff; font-size:10px; padding:5px 8px; border-radius:6px; white-space:nowrap; z-index:5; }
.st-axis { display:flex; justify-content:space-between; font-size:10px; color:var(--g); margin-top:6px; }
.st-legend { display:flex; gap:14px; font-size:10px; color:var(--g2); margin-top:8px; }
.st-legend i { display:inline-block; width:10px; height:10px; border-radius:3px; margin-right:4px; vertical-align:-1px; }
.st-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.st-list { list-style:none; }
.st-list li { display:flex; justify-content:space-between; gap:10px; font-size:12px; color:var(--g2); padding:6px 0; border-top:1px solid rgba(255,255,255,.05); }
.st-list li:first-child { border-top:none; }
.st-list li span:first-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.st-list li b { color:var(--w); font-weight:700; flex-shrink:0; }
.st-table { width:100%; border-collapse:collapse; font-size:12px; }
.st-table th { text-align:left; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:var(--g); padding:6px 8px; border-bottom:1px solid rgba(255,255,255,.08); }
.st-table td { padding:8px; border-bottom:1px solid rgba(255,255,255,.04); color:var(--g2); vertical-align:top; }
.st-table td a { color:var(--y); text-decoration:none; }
.st-table td.nm { color:var(--w); font-weight:600; }
.st-table .v { padding:2px 8px; border-radius:10px; font-size:10px; font-weight:700; background:rgba(255,214,0,.12); color:var(--y); white-space:nowrap; }
.st-table .v.no { background:rgba(255,68,85,.12); color:#FF6B78; }
.st-wrap { overflow-x:auto; }
.st-empty { color:var(--g); font-size:12px; padding:8px 0; }
.st-msg { padding:30px; text-align:center; color:var(--g2); font-size:13px; }
.st-msg.err { color:#FF6B78; }
@media (max-width:900px) { .st-tiles { grid-template-columns:repeat(2,1fr); } .st-grid { grid-template-columns:1fr; } }
`;

const RANGES = [7, 30, 90];
const fmtDate = (iso) => {
  try { return new Date(iso).toLocaleString("bg-BG", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso; }
};
const shortDay = (d) => `${d.slice(8, 10)}.${d.slice(5, 7)}`;

export default function AdminStats({ stats, days, onDays, onRefresh, loading = false, error = "" }) {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("pb-st-styles")) return;
    const el = document.createElement("style");
    el.id = "pb-st-styles";
    el.textContent = css;
    document.head.appendChild(el);
  }, []);

  const t = stats?.totals || {};
  const conv = t.sessions ? ((t.leads / t.sessions) * 100).toFixed(1) : "0.0";
  const daily = stats?.daily || [];
  const maxViews = Math.max(1, ...daily.map((d) => d.views));

  return (
    <div>
      <div className="st-head">
        <div className="st-range">
          {RANGES.map((r) => (
            <button key={r} className={days === r ? "act" : ""} onClick={() => onDays(r)}>{r} дни</button>
          ))}
        </div>
        <button className="btn2 btnSm" onClick={onRefresh} disabled={loading}><RefreshCw size={12} /> Обнови</button>
      </div>

      {loading && !stats && <div className="st-msg">Зареждам статистиката…</div>}
      {error && <div className="st-msg err">Грешка: {error}</div>}

      {stats && (
        <>
          <div className="st-tiles">
            <div className="st-tile"><div className="l"><Eye size={13} /> Посещения</div><div className="n">{t.views ?? 0}</div><div className="s">днес: {t.views_today ?? 0} · лендинг: {t.landing_views ?? 0}</div></div>
            <div className="st-tile"><div className="l"><Users size={13} /> Уникални сесии</div><div className="n">{t.sessions ?? 0}</div><div className="s">днес: {t.sessions_today ?? 0} · лендинг: {t.landing_sessions ?? 0}</div></div>
            <div className="st-tile"><div className="l"><Mail size={13} /> Заявки</div><div className="n">{t.leads ?? 0}</div><div className="s">днес: {t.leads_today ?? 0} · общо: {t.leads_all_time ?? 0}</div></div>
            <div className="st-tile"><div className="l"><Percent size={13} /> Конверсия</div><div className="n">{conv}%</div><div className="s">заявки / уникални сесии</div></div>
          </div>

          <div className="st-card">
            <h4>ПО ДНИ — посещения, сесии и заявки</h4>
            {daily.length === 0 ? <div className="st-empty">Няма данни за периода.</div> : (
              <>
                <div className="st-chart">
                  {daily.map((d) => (
                    <div key={d.day} className="st-bar" data-tip={`${shortDay(d.day)}: ${d.views} посещ. · ${d.sessions} сесии · ${d.leads} заявки`}>
                      {d.leads > 0 && <b title={`${d.leads} заявки`} />}
                      <i style={{ height: `${Math.round((d.views / maxViews) * 100)}%` }} />
                      <i className="s" style={{ height: `${Math.round((d.sessions / maxViews) * 100)}%`, marginTop: -Math.round((d.sessions / maxViews) * 100) + "%" }} />
                    </div>
                  ))}
                </div>
                <div className="st-axis"><span>{shortDay(daily[0].day)}</span><span>{shortDay(daily[daily.length - 1].day)}</span></div>
                <div className="st-legend"><span><i style={{ background: "rgba(255,214,0,.35)" }} />посещения</span><span><i style={{ background: "var(--y)" }} />уникални сесии</span><span><i style={{ background: "#FF4455", borderRadius: "50%" }} />ден със заявка</span></div>
              </>
            )}
          </div>

          <div className="st-grid">
            <div className="st-card">
              <h4>СТРАНИЦИ</h4>
              <ul className="st-list">
                {(stats.paths || []).map((p) => <li key={p.path}><span>{p.path}</span><b>{p.views} · {p.sessions} сес.</b></li>)}
                {!(stats.paths || []).length && <li className="st-empty">Още няма посещения.</li>}
              </ul>
            </div>
            <div className="st-card">
              <h4>ОТКЪДЕ ИДВАТ</h4>
              <ul className="st-list">
                {(stats.sources || []).map((p) => <li key={`u-${p.source}`}><span>utm: {p.source}</span><b>{p.views}</b></li>)}
                {(stats.referrers || []).map((p) => <li key={`r-${p.referrer}`}><span>{p.referrer}</span><b>{p.views}</b></li>)}
                {!(stats.referrers || []).length && <li className="st-empty">Още няма данни.</li>}
              </ul>
            </div>
            <div className="st-card">
              <h4>УСТРОЙСТВА</h4>
              <ul className="st-list">
                {(stats.devices || []).map((p) => <li key={p.device}><span>{p.device}</span><b>{p.views}</b></li>)}
                {!(stats.devices || []).length && <li className="st-empty">Още няма данни.</li>}
              </ul>
            </div>
          </div>

          <div className="st-card">
            <h4>ЗАЯВКИ ОТ /chatgpt-ads (последни {Math.min(100, (stats.leads || []).length)})</h4>
            <div className="st-wrap">
              <table className="st-table">
                <thead><tr><th>Дата</th><th>Име</th><th>Контакт</th><th>Сайт</th><th>Какво продава</th><th>Бюджет</th><th>Клиент</th><th>Вердикт</th><th>Източник</th></tr></thead>
                <tbody>
                  {(stats.leads || []).map((l) => (
                    <tr key={l.id}>
                      <td>{fmtDate(l.created_at)}</td>
                      <td className="nm">{l.name}</td>
                      <td><a href={`mailto:${l.email}`}>{l.email}</a><br />{l.phone && <a href={`tel:${l.phone}`}>{l.phone}</a>}</td>
                      <td>{l.website}</td>
                      <td>{l.sells}</td>
                      <td>{l.budget}</td>
                      <td>{l.client_value}</td>
                      <td><span className={`v ${l.verdict === "не още" ? "no" : ""}`}>{l.verdict}</span></td>
                      <td>{l.source}</td>
                    </tr>
                  ))}
                  {!(stats.leads || []).length && <tr><td colSpan={9} className="st-empty">Още няма заявки.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
