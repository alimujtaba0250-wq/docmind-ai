"use client";

import { FormEvent, useState } from "react";
import { authApi } from "@/lib/api";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await authApi.subscribeNewsletter(email.trim());
      setMessage(res.message);
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Subscription failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <p className="text-sm font-semibold text-[#e3e0f1] mb-2">Newsletter</p>
      <p className="text-xs text-[#c7c4d7] mb-3">Product updates and document-AI tips.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@email.com"
          className="flex-1 min-w-0 bg-[#1b1a26] border border-[#464554]/40 rounded-lg px-3 py-2 text-sm text-[#e3e0f1] outline-none focus:border-[#4cd7f6]"
        />
        <button
          type="submit"
          disabled={loading}
          className="gradient-button text-[#1000a9] text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "…" : "Subscribe"}
        </button>
      </form>
      {message && <p className="text-xs text-[#4edea3] mt-2">{message}</p>}
      {error && <p className="text-xs text-[#ffb4ab] mt-2">{error}</p>}
    </div>
  );
}
