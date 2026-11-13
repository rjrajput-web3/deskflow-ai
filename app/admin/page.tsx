import Link from "next/link";
import { DEMO_TENANTS } from "@/lib/demo-workspace";
import { PLANS } from "@/lib/site";

export default function AdminOverview() {
  const totalReplies = DEMO_TENANTS.reduce((s, t) => s + t.repliesUsed, 0);
  const totalLimit = DEMO_TENANTS.reduce((s, t) => s + t.repliesLimit, 0);
  const active = DEMO_TENANTS.filter((t) => t.status === "Active").length;
  const planCounts = PLANS.map((p) => ({
    name: p.name,
    count: DEMO_TENANTS.filter((t) => t.plan === p.name).length,
  }));

  const cards = [
    { label: "Demo tenants", value: String(DEMO_TENANTS.length), note: "Fictional workspaces" },
    { label: "Active tenants", value: String(active), note: `${DEMO_TENANTS.length - active} trial / suspended` },
    { label: "AI replies used", value: totalReplies.toLocaleString(), note: `of ${totalLimit.toLocaleString()} plan capacity` },
    { label: "Real revenue", value: "$0", note: "Demo data — no billing yet" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo data — $0 real revenue</span>
        <h1 className="h-display mt-3 text-3xl">Super Admin</h1>
        <p className="lead mt-2 text-base">
          Every workspace, plan and dollar below is fictional demo data. Billing arrives
          after the first sale.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card card-pad !p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</p>
            <p className="font-display mt-2 text-3xl font-bold text-ink-950">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Plan distribution</h2>
          <ul className="mt-4 space-y-3">
            {planCounts.map((p) => (
              <li key={p.name}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-ink-950">{p.name}</span>
                  <span className="text-slate-500">{p.count} tenant{p.count === 1 ? "" : "s"}</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-ink-950" style={{ width: `${(p.count / Math.max(DEMO_TENANTS.length, 1)) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Usage vs limits</h2>
          <ul className="mt-4 space-y-3">
            {DEMO_TENANTS.map((t) => (
              <li key={t.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-ink-950">{t.business}</span>
                  <span className="text-slate-500">{t.repliesUsed.toLocaleString()} / {t.repliesLimit.toLocaleString()} ({t.plan})</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${t.repliesUsed / t.repliesLimit > 0.9 ? "bg-red-500" : "bg-brand-500"}`}
                    style={{ width: `${Math.min(100, (t.repliesUsed / t.repliesLimit) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Limits come from the plan caps in lib/site.ts (Starter 500, Growth 2,500, Pro 10,000).
          </p>
        </div>
      </div>

      <div className="card card-pad">
        <h2 className="font-display text-lg font-bold text-ink-950">Revenue overview — demo</h2>
        <p className="mt-2 text-sm text-slate-600">
          $0 real revenue. In this demo every plan is shown at its list price, but no payments
          are taken and no billing is connected. See the <Link href="/admin/revenue" className="font-semibold text-brand-700 hover:underline">Revenue page</Link> for the monthly demo chart.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/tenants" className="btn-primary !px-5 !py-2.5 text-sm">View tenants →</Link>
          <Link href="/admin/plans" className="btn-ghost !px-5 !py-2.5 text-sm">Plans &amp; limits</Link>
          <Link href="/admin/logs" className="btn-ghost !px-5 !py-2.5 text-sm">System logs</Link>
        </div>
      </div>
    </div>
  );
}
