import { SYSTEM_LOGS } from "@/lib/demo-workspace";

const LEVEL_STYLE: Record<string, string> = {
  info: "bg-slate-100 text-slate-700",
  success: "bg-brand-100 text-brand-700",
  warning: "bg-red-100 text-red-700",
};

export default function LogsPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo data — seeded events</span>
        <h1 className="h-display mt-3 text-3xl">System Logs</h1>
        <p className="lead mt-2 text-base">
          Webhook receipts, bookings, AI replies and escalations across demo workspaces.
          Live log streaming arrives with the Supabase step.
        </p>
      </div>

      <div className="card card-pad">
        <ul className="divide-y divide-slate-100">
          {SYSTEM_LOGS.map((log) => (
            <li key={log.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
              <div>
                <p className="text-sm font-semibold text-ink-950">
                  {log.event}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${LEVEL_STYLE[log.level] ?? LEVEL_STYLE.info}`}>
                    {log.level}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-slate-500">{log.detail}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{log.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
