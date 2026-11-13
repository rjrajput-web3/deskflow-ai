import { PLANS } from "@/lib/site";

export default function PlansPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo data — read-only</span>
        <h1 className="h-display mt-3 text-3xl">Plans &amp; Usage Limits</h1>
        <p className="lead mt-2 text-base">
          The four plans and their reply caps, exactly as defined in lib/site.ts. Changing
          limits needs the billing step — there is no payment integration in this sprint.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((p) => (
          <div key={p.name} className="card card-pad">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-bold text-ink-950">{p.name}</h2>
              <p className="font-display text-xl font-bold text-ink-950">
                {p.price}<span className="text-sm font-normal text-slate-500">{p.period}</span>
              </p>
            </div>
            <p className="mt-1 text-sm text-slate-500">{p.blurb}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• <strong className="text-ink-950">{p.replies}</strong></li>
              <li>• {p.channels}</li>
              {p.features.map((f) => <li key={f}>• {f}</li>)}
            </ul>
            <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
              Limit editing is disabled in this demo — caps are binding (never “unlimited”).
            </p>
          </div>
        ))}
      </div>

      <div className="card card-pad">
        <h2 className="font-display text-lg font-bold text-ink-950">How limits are enforced (later phase)</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          In the Supabase phase, every workspace gets a row in <code>subscriptions</code> and
          every AI reply a row in <code>usage_logs</code> (see docs/supabase-schema.sql). The
          API counts replies per workspace per month and stops at the plan cap. Until billing
          lands, no workspace is ever cut off — this demo has no enforcement and no payments.
        </p>
      </div>
    </div>
  );
}
