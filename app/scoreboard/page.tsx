"use client";

import { useCallback, useEffect, useState } from "react";
import { currentMonth, formatLong, monthLabel, shiftMonth } from "@/lib/calendar";

type DayRecord = { date: string; dayType: "weekday" | "weekend_holiday" };

type Entry = {
  name: string;
  personnel_number: string;
  total: number;
  weekdays: number;
  weekendsHolidays: number;
  reservations: DayRecord[];
};

/* ─── Avatar ─────────────────────────────────────────────── */
const AVATAR_COLORS = [
  "#f87171", "#fb923c", "#fbbf24", "#4ade80",
  "#38bdf8", "#818cf8", "#c084fc", "#f472b6",
];

function nameHash(name: string) {
  return name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

function Avatar({ name, size = 46 }: { name: string; size?: number }) {
  const bg = AVATAR_COLORS[nameHash(name) % AVATAR_COLORS.length];
  const r = size / 2;
  const eyeY   = r * 0.78;
  const eyeXO  = r * 0.30;
  const eyeWR  = r * 0.155;
  const eyePR  = r * 0.085;
  const smX    = r * 0.34;
  const smY1   = r * 1.20;
  const smY2   = r * 1.52;
  const ckXO   = r * 0.56;
  const ckY    = r * 1.16;
  const ckR    = r * 0.19;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: "block" }}>
      {/* face */}
      <circle cx={r} cy={r} r={r} fill={bg} />
      {/* eye whites */}
      <circle cx={r - eyeXO} cy={eyeY} r={eyeWR} fill="white" opacity="0.92" />
      <circle cx={r + eyeXO} cy={eyeY} r={eyeWR} fill="white" opacity="0.92" />
      {/* pupils */}
      <circle cx={r - eyeXO} cy={eyeY + eyePR * 0.5} r={eyePR} fill="rgba(0,0,0,0.55)" />
      <circle cx={r + eyeXO} cy={eyeY + eyePR * 0.5} r={eyePR} fill="rgba(0,0,0,0.55)" />
      {/* eye shine */}
      <circle cx={r - eyeXO + eyeWR * 0.35} cy={eyeY - eyeWR * 0.35} r={eyePR * 0.5} fill="white" opacity="0.7" />
      <circle cx={r + eyeXO + eyeWR * 0.35} cy={eyeY - eyeWR * 0.35} r={eyePR * 0.5} fill="white" opacity="0.7" />
      {/* smile */}
      <path
        d={`M${r - smX} ${smY1} Q${r} ${smY2} ${r + smX} ${smY1}`}
        stroke="white" strokeWidth={r * 0.095} fill="none" strokeLinecap="round" opacity="0.9"
      />
      {/* rosy cheeks */}
      <circle cx={r - ckXO} cy={ckY} r={ckR} fill="white" opacity="0.14" />
      <circle cx={r + ckXO} cy={ckY} r={ckR} fill="white" opacity="0.14" />
    </svg>
  );
}

/* ─── Bar column ─────────────────────────────────────────── */
const MAX_BAR_H = 180;
const MIN_BAR_H = 6;
const MEDALS = ["🥇", "🥈", "🥉"];

function BarCol({
  entry, rank, maxTotal, isActive, onToggle,
}: {
  entry: Entry; rank: number; maxTotal: number;
  isActive: boolean; onToggle: () => void;
}) {
  const barH = maxTotal > 0
    ? Math.max(MIN_BAR_H, Math.round((entry.total / maxTotal) * MAX_BAR_H))
    : MIN_BAR_H;
  const whH = entry.total > 0
    ? Math.round((entry.weekendsHolidays / entry.total) * barH)
    : 0;
  const wdH = barH - whH;
  const firstName = entry.name.split(" ")[0];

  return (
    <div
      className={`sb-col${isActive ? " active" : ""}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
      aria-expanded={isActive}
      title={entry.name}
    >
      {/* avatar sits on top of bar */}
      <div className="sb-avatar-wrap">
        {rank <= 3 && <span className="sb-medal">{MEDALS[rank - 1]}</span>}
        <Avatar name={entry.name} size={46} />
      </div>

      {/* stacked bar */}
      <div className="sb-bar" style={{ height: barH }}>
        {whH > 0 && <div className="sb-bar-seg wh" style={{ height: whH }} />}
        {wdH > 0 && <div className="sb-bar-seg wd" style={{ height: wdH }} />}
      </div>

      {/* labels */}
      <div className="sb-col-total">{entry.total}</div>
      <div className="sb-col-name">{firstName}</div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Scoreboard() {
  const [month, setMonth] = useState<string>("all");
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async (m: string) => {
    setEntries(null);
    setExpanded(null);
    const url = m === "all" ? "/api/scoreboard" : `/api/scoreboard?month=${m}`;
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      setEntries(json.entries ?? []);
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => { load(month); }, [month, load]);

  const cur = currentMonth();
  const expandedEntry = entries?.find((e) => e.personnel_number === expanded);

  return (
    <>
      <div className="page-intro">
        <h1>Scoreboard</h1>
        <p>Reservation history — weekdays and weekend/holidays tracked separately.</p>
      </div>

      <div className="card">

        {/* Month filter */}
        <div className="sb-filter">
          <button
            className="icon-btn"
            onClick={() => setMonth((m) => m === "all" ? cur : shiftMonth(m, -1))}
            aria-label="Previous"
          >‹</button>
          <div className="sb-filter-center">
            <div className="month-title">
              {month === "all" ? "All time" : monthLabel(month)}
            </div>
            <div className="sb-filter-pills">
              <button
                className={`sb-pill${month === "all" ? " active" : ""}`}
                onClick={() => setMonth("all")}
              >All time</button>
              <button
                className={`sb-pill${month === cur ? " active" : ""}`}
                onClick={() => setMonth(cur)}
              >This month</button>
            </div>
          </div>
          <button
            className="icon-btn"
            onClick={() => setMonth((m) => m === "all" ? cur : shiftMonth(m, 1))}
            aria-label="Next"
          >›</button>
        </div>

        {/* Chart */}
        {entries === null ? (
          <div className="spinner-line">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="empty-state">No reservations yet.</div>
        ) : (
          <>
            <div className="sb-chart-wrap">
              <div className="sb-chart">
                {entries.map((e, i) => (
                  <BarCol
                    key={e.personnel_number}
                    entry={e}
                    rank={i + 1}
                    maxTotal={entries[0].total}
                    isActive={expanded === e.personnel_number}
                    onToggle={() =>
                      setExpanded(expanded === e.personnel_number ? null : e.personnel_number)
                    }
                  />
                ))}
              </div>
              <div className="sb-baseline" />
            </div>

            {/* Legend */}
            <div className="sb-legend">
              <span className="sb-legend-item">
                <span className="sb-legend-dot wd" /> Weekdays
              </span>
              <span className="sb-legend-item">
                <span className="sb-legend-dot wh" /> Wknd / Holiday
              </span>
              <span className="sb-legend-item hint">Tap a bar to see dates</span>
            </div>

            {/* Expanded detail */}
            {expandedEntry && (
              <div className="sb-detail">
                <div className="sb-detail-header">
                  <Avatar name={expandedEntry.name} size={38} />
                  <div>
                    <div className="sb-detail-name">{expandedEntry.name}</div>
                    <div className="sb-detail-sub">
                      #{expandedEntry.personnel_number}&nbsp;&middot;&nbsp;
                      {expandedEntry.weekdays} weekday{expandedEntry.weekdays !== 1 ? "s" : ""},&nbsp;
                      {expandedEntry.weekendsHolidays} wknd/hol
                    </div>
                  </div>
                </div>
                <div className="sb-detail-dates">
                  {expandedEntry.reservations.map((r) => (
                    <span
                      key={r.date}
                      className={`sb-date-pill ${r.dayType === "weekday" ? "wd" : "wh"}`}
                    >
                      {formatLong(r.date)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
