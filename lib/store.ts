// DeskFlow AI — localStorage-backed demo workspace store (Sprint 2).
// Open demo: no auth, no server DB yet. Everything lives in the browser's
// localStorage under one key, seeded from lib/demo-workspace.ts.
// ALL localStorage access is guarded with `typeof window` so pages can
// render on the server without crashing; client pages load the workspace
// in a useEffect and show the seed until then.

import {
  seedWorkspace,
  type Appointment,
  type Conversation,
  type ChatMessage,
  type KnowledgeDoc,
  type Lead,
  type LeadStatus,
  type Workspace,
} from "./demo-workspace";

export type { Workspace, Lead, LeadStatus, Appointment, Conversation, KnowledgeDoc, ChatMessage };

// v2: seed changed 2026-11-14 (canonical business names + hours, in-hours
// appointments) — a new key so older saved seeds are replaced, not kept.
// Reset rule lives in getWorkspace(): only a seedVersion mismatch resets;
// renames and hours edits are saved data, never a reset trigger.
const KEY = "deskflow-demo-workspace-v2";

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export function getWorkspace(): Workspace {
  if (typeof window === "undefined") return seedWorkspace();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seed = seedWorkspace();
      window.localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as Workspace;
    const seed = seedWorkspace();
    // FIX (audit #1): never reset on a rename or hours change. The old code
    // compared mutable fields (businessName / hours) against the seed and
    // wiped the whole saved workspace on any mismatch. Now only a seed
    // VERSION mismatch resets; anything else is backfilled key-by-key.
    // Saved workspaces written before seedVersion existed have no version
    // field — they came from the current seed, so backfill the version
    // instead of resetting them.
    if (typeof parsed.seedVersion === "number" && parsed.seedVersion !== seed.seedVersion) {
      window.localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    const merged: Workspace = { ...seed, ...parsed, seedVersion: seed.seedVersion };
    // Persist the backfill so later loads see a complete workspace.
    if (parsed.seedVersion !== seed.seedVersion) {
      window.localStorage.setItem(KEY, JSON.stringify(merged));
    }
    return merged;
  } catch {
    return seedWorkspace();
  }
}

export function saveWorkspace(ws: Workspace): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ws));
  } catch {
    // Storage full / unavailable — demo only, fail silently.
  }
}

export function resetWorkspace(): Workspace {
  const seed = seedWorkspace();
  saveWorkspace(seed);
  return seed;
}

export function getLeads(): Lead[] {
  return getWorkspace().leads;
}

export function addLead(lead: Lead): Lead[] {
  const ws = getWorkspace();
  ws.leads = [lead, ...ws.leads];
  saveWorkspace(ws);
  return ws.leads;
}

export function updateLead(id: string, patch: Partial<Lead>): Lead[] {
  const ws = getWorkspace();
  ws.leads = ws.leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
  saveWorkspace(ws);
  return ws.leads;
}

export function getAppointments(): Appointment[] {
  return getWorkspace().appointments;
}

export function addAppointment(appt: Appointment): Appointment[] {
  const ws = getWorkspace();
  ws.appointments = [...ws.appointments, appt].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
  );
  saveWorkspace(ws);
  return ws.appointments;
}

export function getConversations(): Conversation[] {
  return getWorkspace().conversations;
}

export function addMessage(conversationId: string, message: ChatMessage): Conversation[] {
  const ws = getWorkspace();
  ws.conversations = ws.conversations.map((c) => {
    if (c.id !== conversationId) return c;
    return {
      ...c,
      messages: [...c.messages, message],
      lastMessage: message.text,
      unread: message.from === "customer" ? c.unread + 1 : 0,
    };
  });
  saveWorkspace(ws);
  return ws.conversations;
}

export function updateConversation(id: string, patch: Partial<Conversation>): Conversation[] {
  const ws = getWorkspace();
  ws.conversations = ws.conversations.map((c) => (c.id === id ? { ...c, ...patch } : c));
  saveWorkspace(ws);
  return ws.conversations;
}

export function getKnowledgeDocs(): KnowledgeDoc[] {
  return getWorkspace().knowledgeDocs;
}

export function addKnowledgeDoc(doc: KnowledgeDoc): KnowledgeDoc[] {
  const ws = getWorkspace();
  ws.knowledgeDocs = [doc, ...ws.knowledgeDocs];
  saveWorkspace(ws);
  return ws.knowledgeDocs;
}

export function deleteKnowledgeDoc(id: string): KnowledgeDoc[] {
  const ws = getWorkspace();
  ws.knowledgeDocs = ws.knowledgeDocs.filter((d) => d.id !== id);
  saveWorkspace(ws);
  return ws.knowledgeDocs;
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function freshSeed(): Workspace {
  return clone(seedWorkspace());
}
