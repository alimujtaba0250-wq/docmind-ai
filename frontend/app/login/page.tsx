"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/lib/api";
import LogoLink from "../components/LogoLink";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (tab === "login") {
        const data = await authApi.login(email, password);
        login(data.access_token, email);
        router.push("/dashboard");
      } else {
        await authApi.register(email, password);
        setSuccess("Account created! You can now sign in.");
        setTab("login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen" style={{ backgroundColor: "#0F0F1A" }}>
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[40vw] h-[40vw] bg-[#4cd7f6]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] bg-[#c0c1ff]/5 blur-[100px] rounded-full" />
      </div>

      {/* Left illustration panel */}
      <section className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0d0d18] via-[#12121d] to-[#12121d] items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #908fa0 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 w-full max-w-xl">
          <div className="mb-12">
            <LogoLink toHome />
          </div>
          <h1 className="text-5xl font-extrabold text-[#e3e0f1] mb-6 leading-tight">
            Chat with PDFs using the power of{" "}
            <span className="text-[#4cd7f6]">Artificial Intelligence</span>.
          </h1>
          <p className="text-lg text-[#c7c4d7] mb-12">
            Extract insights, summarize complex documents, and automate your research workflow in seconds.
          </p>
          <div className="relative h-[350px] w-full flex items-center justify-center">
            <div className="absolute w-64 h-64 bg-[#c0c1ff]/20 blur-[100px] rounded-full" />
            <div className="glass-panel floating-card absolute top-10 left-10 p-6 rounded-2xl w-56 -rotate-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-[#4cd7f6]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                <div className="h-2 w-24 bg-[#343440] rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-[#343440]/50 rounded" />
                <div className="h-1.5 w-3/4 bg-[#343440]/50 rounded" />
              </div>
            </div>
            <div className="glass-panel floating-card absolute bottom-20 right-0 p-6 rounded-2xl w-64 rotate-3" style={{ animationDelay: "-2s" }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-[#c0c1ff]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                <div className="h-2 w-32 bg-[#c0c1ff]/20 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-[#c0c1ff]/10 rounded" />
                <div className="h-1.5 w-5/6 bg-[#c0c1ff]/10 rounded" />
              </div>
            </div>
            <div className="glass-panel floating-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl" style={{ animationDelay: "-4s" }}>
              <span className="material-symbols-outlined text-[#4cd7f6] text-[48px]">auto_awesome</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right form panel */}
      <section className="w-full lg:w-1/2 flex flex-col justify-between p-8 md:p-12 bg-[#12121d]">
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#e3e0f1] mb-2">
                {tab === "login" ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-base text-[#c7c4d7]">
                {tab === "login" ? "Log in to your workspace to continue." : "Sign up and start chatting with your documents."}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-xl bg-[#1b1a26] p-1 mb-8">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-[#c0c1ff] text-[#1000a9]" : "text-[#c7c4d7] hover:text-[#e3e0f1]"}`}
                >
                  {t === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/30 text-[#ffb4ab] text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3] text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#c7c4d7] mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full bg-[#1b1a26] border border-[#464554]/30 rounded-xl px-4 py-3 text-[#e3e0f1] focus:ring-2 focus:ring-[#4cd7f6] focus:border-[#4cd7f6] outline-none transition-all placeholder:text-[#908fa0]/50"
                />
              </div>
              <div>
                {tab === "login" && (
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-[#c7c4d7]">Password</label>
                    <a href="#" className="text-sm font-semibold text-[#c0c1ff] hover:text-[#4cd7f6] transition-colors">Forgot password?</a>
                  </div>
                )}
                {tab === "register" && (
                  <label className="block text-sm font-semibold text-[#c7c4d7] mb-2">Password</label>
                )}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#1b1a26] border border-[#464554]/30 rounded-xl px-4 py-3 text-[#e3e0f1] focus:ring-2 focus:ring-[#4cd7f6] focus:border-[#4cd7f6] outline-none transition-all placeholder:text-[#908fa0]/50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-button py-4 rounded-xl text-sm font-bold text-[#1000a9] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 border-2 border-[#1000a9]/30 border-t-[#1000a9] rounded-full animate-spin" />}
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 text-center">
          <p className="text-base text-[#c7c4d7]">
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
              className="font-bold text-[#c0c1ff] hover:text-[#4cd7f6] transition-colors underline underline-offset-4 decoration-[#c0c1ff]/30"
            >
              {tab === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
