import { DEMO_REVENUE, DEMO_TENANTS } from "@/lib/demo-workspace";
import { PLANS } from "@/lib/site";

export default function RevenuePage() {
  const maxRev = Math.max(...DEMO_REVENUE.map((m) => m.demoRevenue), 1);
  // Demo "potential" MRR: list prices of active demo tenants (no money moves).
  const potentialMrr = DEMO_TENANTS.filter((t) => t.status === "Active").reduce((sum, t) => {
    const plan = PLANS.find((p) => p.name === t.plan);
    const price = plan ? parseInt(plan.price.replace(/[^0-9]/g, ""), 10) || 0 : 0;
    return sum + price;
  }, 0);

  const cards = [
    { label: "Real revenue (all time)", value: "$0", note: "No billing connected — demo only" },
    { label: "Demo list-price MRR", value: `$${potentialMrr}`, note: "Sum of active tenants' list prices — $0 actually collected" },
    { label: "Demo workspaces", value: String(DEMO_TENANTS.length), note: "Fictional tenants" },
    { label: "Paying customers", value: "0", note: "Billing arrives after the first sale" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo data — $0 real revenue</span>
        <h1 className="h-display mt-3 text-3xl">Revenue</h1>
        <p className="lead mt-2 text-base">
          Nothing here is real money. Every figure is $0 because no payment or subscription
          integration exists in this sprint.
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

      <div className="card card-pad">
        <h2 className="font-display text-lg font-bold text-ink-950">Monthly revenue — demo ($0 every month)</h2>
        <p className="mt-1 text-xs text-slate-500">
          Bars show real collected revenue (zero). The workspace count line shows demo growth.
        </p>
        <div className="mt-6 flex h-40 items-end gap-2">
          {DEMO_REVENUE.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5" title={`${m.month}: $${m.demoRevenue} real revenue, ${m.workspaces} workspaces`}>
              <span className="text-[10px] font-semibold text-slate-500">${m.demoRevenue}</span>
              <div className="flex h-28 w-full items-end justify-center rounded-t-md bg-slate-100">
                <div className="w-2/3 rounded-t-md bg-brand-500" style={{ height: `${Math.max(4, (m.workspaces / 6) * 100)}%` }} title={`${m.workspaces} demo workspaces`} />
              </div>
              <span className="text-[10px] text-slate-400">{m.month}</span>
              <span className="text-[10px] font-semibold text-slate-500">{m.workspaces} ws</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">
          The shaded bar height tracks demo workspace count, not money — because collected
          revenue is $0 in every month. Real revenue tracking starts when billing lands.
        </p>
      </div>
    </div>
  );
}
