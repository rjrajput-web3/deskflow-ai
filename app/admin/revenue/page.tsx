import { DEMO_REVENUE, DEMO_TENANTS } from "@/lib/demo-workspace";
import { PLANS } from "@/lib/site";

export default function RevenuePage() {
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
          Real collected revenue is $0 in every month. Demo workspace count is a
          separate column — it is not money.
        </p>
        {/* Table, not a bar chart (audit #23): bars whose height tracked
            workspace count next to "$0" labels read as growing revenue. */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Real revenue collected</th>
                <th className="px-4 py-3">Demo workspaces</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_REVENUE.map((m) => (
                <tr key={m.month}>
                  <td className="px-4 py-3 font-semibold text-ink-950">{m.month}</td>
                  <td className="px-4 py-3 text-slate-600">${m.demoRevenue}</td>
                  <td className="px-4 py-3 text-slate-600">{m.workspaces}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Real revenue tracking starts when billing lands. The workspace count
          shows demo growth only.
        </p>
      </div>
    </div>
  );
}
