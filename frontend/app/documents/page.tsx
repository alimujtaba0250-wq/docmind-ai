"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { documentsApi, type Document } from "@/lib/api";

export default function DocumentsPage() {
  const router = useRouter();
  const { token, isLoading, logout } = useAuth();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !token) router.push("/login");
  }, [isLoading, token, router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    documentsApi
      .listAll(token)
      .then(setDocs)
      .catch((err: unknown) => {
        const status = err instanceof Error ? (err as Error & { status?: number }).status : undefined;
        if (status === 401) {
          logout();
          router.push("/login");
          return;
        }
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [token, logout, router]);

  if (isLoading || !token) return null;

  return (
    <div className="text-[#e3e0f1] min-h-screen">
      <Sidebar />

      <main className="ml-64 min-h-screen p-6 max-w-[1280px] mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-bold">Documents</h2>
          <p className="text-[#c7c4d7] text-base mt-1">
            All files uploaded across your sessions.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#c0c1ff]/30 border-t-[#c0c1ff] rounded-full animate-spin" />
          </div>
        ) : docs.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center">
            <span className="material-symbols-outlined text-[#c0c1ff] text-6xl mb-4 block">folder_open</span>
            <p className="text-xl font-semibold mb-2">No documents yet</p>
            <p className="text-[#c7c4d7] mb-6">Upload a file from the dashboard or chat page.</p>
            <Link
              href="/dashboard"
              className="gradient-button text-[#1000a9] text-sm font-semibold px-6 py-3 rounded-full inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-[#343440]/20 transition-all"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      doc.filename.endsWith(".pdf")
                        ? "bg-[#93000a]/30 text-[#ffb4ab]"
                        : "bg-[#03b5d3]/30 text-[#4cd7f6]"
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {doc.filename.endsWith(".pdf") ? "picture_as_pdf" : "description"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold truncate">{doc.filename}</p>
                    <p className="text-sm text-[#c7c4d7] truncate">
                      Session: {doc.session_title ?? `#${doc.session_id}`}
                    </p>
                    {doc.created_at && (
                      <p className="text-xs text-[#908fa0] mt-1">
                        {new Date(doc.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                {doc.session_id && (
                  <Link
                    href={`/chat?session=${doc.session_id}`}
                    className="px-6 py-2 rounded-lg border border-[#908fa0] hover:border-[#4cd7f6] hover:text-[#4cd7f6] text-sm font-semibold transition-all flex items-center gap-2 flex-shrink-0"
                  >
                    Open session
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
