"use client";

import { useState, useEffect, useRef, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import LogoLink from "../components/LogoLink";
import {
  sessionsApi,
  documentsApi,
  chatApi,
  type ChatSession,
  type Document,
  type ChatMessage,
} from "@/lib/api";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, userEmail, isLoading, logout } = useAuth();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !token) router.push("/login");
  }, [isLoading, token, router]);

  // Load sessions
  useEffect(() => {
    if (!token) return;
    sessionsApi.list(token).then((list) => {
      setSessions(list);
      const paramId = searchParams.get("session");
      if (paramId) {
        const found = list.find((s) => s.id === Number(paramId));
        if (found) setActiveSession(found);
      } else if (list.length > 0) {
        setActiveSession(list[0]);
      }
    });
  }, [token, searchParams]);

  // Load docs and chat history when session changes
  useEffect(() => {
    if (!token || !activeSession) return;
    setDocs([]);
    setMessages([]);
    Promise.all([
      documentsApi.listBySession(activeSession.id, token),
      chatApi.getMessages(activeSession.id, token),
    ])
      .then(([docList, history]) => {
        setDocs(docList);
        setMessages(
          history.map((m) => ({
            role: m.role as "user" | "ai",
            content: m.content,
            sources: m.sources ?? undefined,
          }))
        );
      })
      .catch(console.error);
  }, [token, activeSession]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeSession || !token) return;
    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setSending(true);
    try {
      const res = await chatApi.sendMessage(activeSession.id, question, token);
      setMessages((prev) => [...prev, { role: "ai", content: res.answer, sources: res.sources }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", content: msg }]);
    } finally {
      setSending(false);
    }
  }

  async function handleUpload(file: File) {
    if (!activeSession || !token) return;
    setUploading(true);
    try {
      await documentsApi.upload(activeSession.id, file, token);
      const updated = await documentsApi.listBySession(activeSession.id, token);
      setDocs(updated);
      setMessages((prev) => [...prev, {
        role: "ai",
        content: `✅ **${file.name}** has been uploaded and indexed. You can now ask questions about it.`,
      }]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || !token) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden dot-pattern text-[#e3e0f1]" style={{ backgroundColor: "#0F0F1A" }}>

      {/* LEFT: Sessions Sidebar */}
      <aside className="fixed left-0 top-0 h-full z-40 flex flex-col py-12 bg-[#12121d]/90 backdrop-blur-lg border-r border-[#464554]/20 w-72 shadow-xl">
        <div className="px-6 mb-8">
          <LogoLink variant="sidebar" className="block" />
          <p className="text-sm text-[#c7c4d7] mt-1 truncate">{userEmail}</p>
        </div>

        <div className="px-6 mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] text-lg">search</span>
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b1a26] border border-[#464554]/30 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-[#4cd7f6] outline-none transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredSessions.length === 0 ? (
            <p className="text-center text-[#908fa0] text-sm py-8">No sessions found</p>
          ) : (
            <div className="space-y-1 px-3">
              {filteredSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSession(s);
                    router.push(`/chat?session=${s.id}`, { scroll: false });
                  }}
                  className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg ${
                    activeSession?.id === s.id
                      ? "bg-[#8083ff]/20 text-[#4cd7f6] border-r-4 border-[#4cd7f6]"
                      : "text-[#c7c4d7] hover:bg-[#343440]/30 hover:translate-x-1"
                  }`}
                >
                  <span className="material-symbols-outlined flex-shrink-0">chat</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate">{s.title}</span>
                    <span className="text-xs text-[#c7c4d7]">Session #{s.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </nav>

        <div className="mt-auto px-6 pt-6 border-t border-[#464554]/10 space-y-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:text-[#e3e0f1] rounded-lg hover:bg-[#343440]/30 transition-all text-sm"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:text-[#ffb4ab] rounded-lg hover:bg-[#343440]/30 transition-all text-sm"
          >
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* CENTER: Chat */}
      <main className="flex-1 flex flex-col ml-72 mr-80 h-full">
        {activeSession ? (
          <>
            {/* Chat Header */}
            <header className="h-20 flex items-center justify-between px-6 glass-panel border-t-0 border-l-0 border-r-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                  <span className="material-symbols-outlined">article</span>
                </div>
                <div>
                  <h2 className="text-base font-bold">{activeSession.title}</h2>
                  <p className="text-xs text-[#c7c4d7]">{docs.length} document{docs.length !== 1 ? "s" : ""} · Session #{activeSession.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#464554]/50 hover:border-[#4cd7f6] hover:text-[#4cd7f6] text-[#c7c4d7] text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {uploading
                    ? <span className="w-4 h-4 border-2 border-[#4cd7f6]/30 border-t-[#4cd7f6] rounded-full animate-spin" />
                    : <span className="material-symbols-outlined text-lg">upload_file</span>
                  }
                  {uploading ? "Uploading…" : "Upload Doc"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }}
                />
              </div>
            </header>

            {/* Doc Pills */}
            {docs.length > 0 && (
              <div className="flex items-center gap-3 px-6 py-3 bg-[#0d0d18]/50 border-b border-[#464554]/10 flex-wrap">
                <span className="text-xs font-bold text-[#908fa0] uppercase tracking-wider">Context:</span>
                {docs.map((d) => (
                  <div key={d.id} className="flex items-center gap-2 bg-[#343440]/40 border border-[#464554]/20 rounded-full px-3 py-1 text-sm">
                    <span className="material-symbols-outlined text-sm text-[#4cd7f6]">description</span>
                    <span className="text-[#e3e0f1] max-w-[150px] truncate">{d.filename}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Messages */}
            <section className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-6xl mb-4">chat_bubble</span>
                  <p className="text-lg font-semibold">Start a conversation</p>
                  <p className="text-[#c7c4d7] text-sm mt-2">
                    {docs.length === 0
                      ? "Upload a document first, then ask questions about it."
                      : "Ask anything about the uploaded documents."}
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                msg.role === "user" ? (
                  <div key={i} className="flex justify-end gap-4 max-w-4xl ml-auto">
                    <div className="bg-[#8083ff] text-[#0d0096] p-4 rounded-2xl rounded-tr-none shadow-lg max-w-2xl">
                      <p className="text-base">{msg.content}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#292935] border border-[#464554] flex-shrink-0 flex items-center justify-center text-[#c0c1ff]">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-6 max-w-4xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c0c1ff] to-[#4cd7f6] flex-shrink-0 flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-[#1000a9] text-xl">psychology</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="ai-message-glass p-6 rounded-2xl rounded-tl-none">
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="flex items-center gap-2 px-1 flex-wrap">
                          <span className="text-xs font-bold text-[#908fa0] uppercase">Sources:</span>
                          {msg.sources.slice(0, 3).map((_, si) => (
                            <div key={si} className="flex items-center gap-1 bg-[#4cd7f6]/10 border border-[#4cd7f6]/20 rounded-full px-2 py-0.5 text-xs text-[#4cd7f6]">
                              <span className="material-symbols-outlined text-xs">link</span>
                              Excerpt {si + 1}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}

              {sending && (
                <div className="flex gap-6 max-w-4xl">
                  <div className="w-10 h-10 rounded-full bg-[#343440] border border-[#c0c1ff]/30 flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#c0c1ff] text-xl">bolt</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#4cd7f6] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#4cd7f6] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-[#4cd7f6] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    </div>
                    <span className="text-sm font-semibold text-[#c7c4d7] italic">DocMind is thinking…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </section>

            {/* Input */}
            <div className="p-6 pt-0">
              <form onSubmit={handleSend}>
                <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-2 flex items-end gap-2 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="p-3 rounded-xl hover:bg-[#343440] text-[#c7c4d7] transition-colors flex-shrink-0"
                    title="Upload document"
                  >
                    <span className="material-symbols-outlined">attach_file</span>
                  </button>
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e as unknown as FormEvent); } }}
                    placeholder={docs.length === 0 ? "Upload a document first…" : "Ask anything about these documents…"}
                    disabled={sending || docs.length === 0}
                    className="w-full bg-transparent border-none focus:ring-0 text-base py-3 custom-scrollbar resize-none h-12 max-h-40 overflow-y-auto outline-none text-[#e3e0f1] placeholder:text-[#908fa0] disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending || docs.length === 0}
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#c0c1ff] to-[#4cd7f6] text-[#1000a9] flex items-center justify-center flex-shrink-0 shadow-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </form>
              <p className="text-center text-xs text-[#c7c4d7] mt-3">DocMind AI runs locally (Ollama + on-device search). Verify important information.</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center opacity-50">
              <span className="material-symbols-outlined text-[#c0c1ff] text-6xl mb-4 block">chat_bubble</span>
              <p className="text-xl font-semibold">Select a session to start chatting</p>
              <button onClick={() => router.push("/dashboard")} className="mt-6 gradient-button text-[#1000a9] text-sm font-semibold px-6 py-3 rounded-full">
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      {/* RIGHT: Files & Insights */}
      <aside className="fixed right-0 top-0 h-full w-80 glass-panel border-y-0 border-r-0 z-40 flex flex-col">
        <div className="p-6 border-b border-[#464554]/10">
          <h3 className="text-xs font-bold text-[#c7c4d7] uppercase tracking-widest mb-4">Files in Session</h3>
          {docs.length === 0 ? (
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-[#c7c4d7] text-3xl mb-2 block">folder_open</span>
              <p className="text-sm text-[#c7c4d7]">No documents yet</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-3 text-xs text-[#4cd7f6] font-semibold hover:underline"
              >
                Upload a document
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {docs.map((d) => (
                <div key={d.id} className="bg-[#1f1e2a] p-3 rounded-xl border border-[#464554]/30 hover:border-[#4cd7f6] transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${d.filename.endsWith(".pdf") ? "bg-[#93000a]/30 text-[#ffb4ab]" : "bg-[#03b5d3]/30 text-[#4cd7f6]"}`}>
                      <span className="material-symbols-outlined">{d.filename.endsWith(".pdf") ? "picture_as_pdf" : "description"}</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold truncate">{d.filename}</p>
                      <p className="text-xs text-[#c7c4d7]">{d.created_at ? new Date(d.created_at).toLocaleDateString() : ""}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <h3 className="text-xs font-bold text-[#c7c4d7] uppercase tracking-widest mb-4">Session Info</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#292935] p-4 rounded-xl">
              <p className="text-xs text-[#908fa0] uppercase font-bold">Docs</p>
              <p className="text-2xl font-semibold text-[#c0c1ff]">{docs.length}</p>
            </div>
            <div className="bg-[#292935] p-4 rounded-xl">
              <p className="text-xs text-[#908fa0] uppercase font-bold">Messages</p>
              <p className="text-2xl font-semibold text-[#4cd7f6]">{messages.length}</p>
            </div>
          </div>

          {activeSession && (
            <div className="p-4 rounded-xl bg-[#1b1a26] border border-[#464554]/20">
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff] text-lg">info</span>
                How to use
              </h4>
              <ol className="text-xs text-[#c7c4d7] space-y-2 list-decimal list-inside">
                <li>Upload a PDF or DOCX document</li>
                <li>Wait for indexing to complete</li>
                <li>Ask questions in natural language</li>
                <li>DocMind searches for relevant excerpts</li>
              </ol>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#464554]/10">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-2 flex items-center justify-center gap-2 text-[#c7c4d7] hover:text-[#e3e0f1] transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0F0F1A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#c0c1ff]/30 border-t-[#c0c1ff] rounded-full animate-spin" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
