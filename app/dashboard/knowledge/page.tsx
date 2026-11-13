"use client";

import { useEffect, useRef, useState } from "react";
import { getWorkspace, addKnowledgeDoc, deleteKnowledgeDoc, newId, type Workspace } from "@/lib/store";

export default function KnowledgePage() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [url, setUrl] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setWs(getWorkspace()), []);

  if (!ws) return <p className="text-sm text-slate-500">Loading demo workspace…</p>;

  const refresh = (docs: Workspace["knowledgeDocs"]) => {
    setWs({ ...ws, knowledgeDocs: docs });
  };

  const addUrl = () => {
    if (!url.trim()) return;
    refresh(addKnowledgeDoc({
      id: newId("doc"), title: `Website — ${url.trim()}`, kind: "url",
      content: `Source: ${url.trim()} — (demo: page text is not fetched yet; paste the key facts as text below so the sandbox can answer from them.)`,
      createdAt: new Date().toISOString().slice(0, 10),
    }));
    setUrl(""); setNotice("✓ Website URL saved as a reference doc. Paste its key facts as text so the AI can answer from them.");
  };

  const addText = () => {
    if (!textBody.trim()) return;
    refresh(addKnowledgeDoc({
      id: newId("doc"), title: textTitle.trim() || "Pasted notes", kind: "text",
      content: textBody.trim(), createdAt: new Date().toISOString().slice(0, 10),
    }));
    setTextTitle(""); setTextBody(""); setNotice("✓ Notes saved to the knowledge base.");
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.name.toLowerCase().endsWith(".pdf")) {
      setNotice("PDF parsing needs the Supabase Storage step — text (.txt / .md) files work in this demo.");
      return;
    }
    const content = await file.text();
    refresh(addKnowledgeDoc({
      id: newId("doc"), title: file.name, kind: "file",
      content, createdAt: new Date().toISOString().slice(0, 10),
    }));
    setNotice(`✓ “${file.name}” imported (${content.length.toLocaleString()} characters).`);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-demo">Demo workspace — demo data</span>
        <h1 className="h-display mt-3 text-3xl">Knowledge Base</h1>
        <p className="lead mt-2 text-base">
          Train the AI on your business. The sandbox answers from these docs plus your
          services and hours — try it after adding something here.
        </p>
      </div>

      {notice && <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{notice}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Paste a website URL</h2>
          <p className="mt-1 text-sm text-slate-500">Saved as a reference. Full page fetching arrives with the Supabase step.</p>
          <input className="input mt-4" placeholder="https://yourbusiness.example.com/services" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="button" className="btn-primary mt-3 w-full !py-2.5 text-sm" onClick={addUrl}>Save URL</button>
        </div>

        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Paste services / FAQs</h2>
          <p className="mt-1 text-sm text-slate-500">Prices, policies, answers — plain text works best.</p>
          <input className="input mt-4" placeholder="Title (optional)" value={textTitle} onChange={(e) => setTextTitle(e.target.value)} />
          <textarea className="input mt-2 min-h-24" placeholder="Paste your service list or FAQs here…" value={textBody} onChange={(e) => setTextBody(e.target.value)} />
          <button type="button" className="btn-primary mt-3 w-full !py-2.5 text-sm" onClick={addText}>Save text</button>
        </div>

        <div className="card card-pad">
          <h2 className="font-display text-lg font-bold text-ink-950">Upload a file</h2>
          <p className="mt-1 text-sm text-slate-500">.txt / .md files are read in your browser and stored locally. PDFs need the Supabase Storage step.</p>
          <input
            ref={fileRef} type="file" accept=".txt,.md,.pdf" className="input mt-4"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          <p className="mt-3 text-xs text-slate-400">Files stay in this browser (demo). Nothing is uploaded to a server.</p>
        </div>
      </div>

      <div className="card card-pad">
        <h2 className="font-display text-lg font-bold text-ink-950">Your documents ({ws.knowledgeDocs.length})</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {ws.knowledgeDocs.map((d) => (
            <li key={d.id} className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-950">
                  {d.title}
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">{d.kind}</span>
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{d.content}</p>
                <p className="mt-1 text-xs text-slate-400">Added {d.createdAt} · {d.content.length.toLocaleString()} characters</p>
              </div>
              <button
                type="button" className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
                onClick={() => refresh(deleteKnowledgeDoc(d.id))}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {ws.knowledgeDocs.length === 0 && <p className="mt-4 text-sm text-slate-500">No documents yet — add one above.</p>}
      </div>
    </div>
  );
}
