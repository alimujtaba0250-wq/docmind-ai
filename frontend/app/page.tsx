import Image from "next/image";
import Link from "next/link";
import NewsletterSignup from "./components/NewsletterSignup";
import LandingNavbar from "./components/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="bg-[#12121d] text-[#e3e0f1] overflow-x-hidden">
      <LandingNavbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center hero-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-[#12121d] via-transparent to-[#12121d] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 border border-[#c0c1ff]/20">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse" />
            <span className="text-sm font-semibold text-[#c7c4d7]">Powered by Gemini AI</span>
          </div>
          <h1 className="text-5xl md:text-[64px] font-extrabold mb-6 tracking-tight leading-tight">
            Chat With Any <br />
            <span className="gradient-text">Document Instantly</span>
          </h1>
          <p className="text-lg text-[#c7c4d7] max-w-2xl mx-auto mb-10">
            Unlock insights from PDFs, technical docs, and research papers in seconds. Our high-intelligence platform processes complex data while you focus on deep work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard" className="gradient-button text-[#1000a9] text-sm font-semibold px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:scale-105 transition-all">
              Start Processing Now
            </Link>
            <button className="glass text-[#e3e0f1] text-sm font-semibold px-8 py-4 rounded-xl hover:bg-[#383845]/50 transition-all flex items-center gap-2 justify-center">
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>

          {/* Mockup */}
          <div className="relative max-w-5xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#c0c1ff] to-[#4cd7f6] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
            <div className="relative glass rounded-2xl overflow-hidden border border-[#464554]/40 aspect-video">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEzyieU8Wq-ucNqxskye-x4f8vxEo47OQfMQpQnLLbZmtdMnO_Cg_ufNjdBlRfk8l62pPm3f5J-m9yJtxT3KDZMleRA_1yRZUy0EDY4Sa0d7CA4zwwq5EVulQu0TgQOfA_fqZ49LYNsUhYzbdY30_jLkmvq2QKkBe6D5VVld41nuCm29_3-Z4nNE1cmWQmk3Q3yIhezTXgYn5NJfwbcHx7Tuv5TuhTTX6JYlGkA9pq73PQP-_4VHlER2FiNhtzymI_eEf3PdPh720"
                alt="App Interface Mockup"
                fill
                priority
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </header>

      {/* Social Proof */}
      <section className="py-12 glass border-y border-[#464554]/10">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-center text-sm font-semibold text-[#c7c4d7] mb-8 opacity-60 uppercase tracking-widest">
            Trusted by teams at the forefront of knowledge
          </p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 opacity-40 grayscale contrast-125">
            {["SYNERGY", "NEXUS", "QUBIT", "VELOCITY", "APEX"].map((name) => (
              <div key={name} className="text-2xl font-bold">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="features" className="py-32 px-6 max-w-[1280px] mx-auto scroll-mt-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold mb-4">Simple Workflow</h2>
          <p className="text-lg text-[#c7c4d7]">From complex document to actionable insights in three steps.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "upload_file", color: "text-[#c0c1ff]", bg: "bg-[#c0c1ff]/10 group-hover:bg-[#c0c1ff]/20", title: "Upload Docs", desc: "Drop any PDF, text, or research paper. Our system indexes the entire context instantly.", border: "hover:border-[#c0c1ff]/50" },
            { icon: "psychology", color: "text-[#4cd7f6]", bg: "bg-[#4cd7f6]/10 group-hover:bg-[#4cd7f6]/20", title: "AI Analysis", desc: "The AI comprehends deep structures, cross-referencing citations and complex data points.", border: "hover:border-[#4cd7f6]/50" },
            { icon: "chat_bubble", color: "text-[#4edea3]", bg: "bg-[#4edea3]/10 group-hover:bg-[#4edea3]/20", title: "Chat & Extract", desc: "Ask natural questions and get precise answers with direct source citations.", border: "hover:border-[#4edea3]/50" },
          ].map((item) => (
            <div key={item.title} className={`glass p-10 rounded-2xl group ${item.border} transition-all duration-300`}>
              <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center mb-6 transition-colors`}>
                <span className={`material-symbols-outlined ${item.color} text-3xl`}>{item.icon}</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
              <p className="text-[#c7c4d7]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Features */}
      <section className="py-32 bg-[#1b1a26]/50">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid md:grid-cols-6 md:grid-rows-2 gap-4 md:h-[600px]">
            <div className="md:col-span-3 glass p-8 rounded-2xl flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <span className="material-symbols-outlined text-6xl text-[#c0c1ff]/20 group-hover:scale-110 transition-transform">memory</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Technical Comprehension</h3>
              <p className="text-[#c7c4d7]">Designed for developers and researchers who need deep technical understanding.</p>
            </div>
            <div className="md:col-span-3 glass p-8 rounded-2xl flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <span className="material-symbols-outlined text-6xl text-[#4cd7f6]/20 group-hover:scale-110 transition-transform">security</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-[#c7c4d7]">Your documents are encrypted and never used for training foundation models.</p>
            </div>
            {[
              { icon: "language", color: "text-[#c0c1ff]", title: "Multilingual", desc: "Process documents in over 50 languages seamlessly." },
              { icon: "groups", color: "text-[#4cd7f6]", title: "Team Sync", desc: "Share chats and insights across your entire organization." },
              { icon: "auto_awesome", color: "text-[#4edea3]", title: "Smart Summary", desc: "Generate executive summaries from 100+ page documents." },
            ].map((item) => (
              <div key={item.title} className="md:col-span-2 glass p-8 rounded-2xl flex flex-col justify-end relative overflow-hidden group">
                <span className={`material-symbols-outlined ${item.color} mb-4`}>{item.icon}</span>
                <h4 className="text-2xl font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-[#c7c4d7]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 max-w-[1280px] mx-auto scroll-mt-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold mb-4">Tailored for Every Workflow</h2>
          <p className="text-lg text-[#c7c4d7]">Choose the plan that fits your knowledge intensity.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free */}
          <div className="glass p-10 rounded-2xl flex flex-col hover:border-[#464554] transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-[#c7c4d7]">/mo</span>
              </div>
            </div>
            <ul className="flex-grow space-y-4 mb-10">
              {["10 Documents / Month", "50MB Max File Size", "Standard AI Processing"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[#c7c4d7]">
                  <span className="material-symbols-outlined text-[#4cd7f6]">check_circle</span>{f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-xl glass hover:bg-[#383845]/30 transition-all text-sm font-semibold">Get Started</button>
          </div>

          {/* Pro */}
          <div className="glass p-10 rounded-2xl flex flex-col border-[#c0c1ff]/50 relative md:scale-105 bg-[#1f1e2a] shadow-2xl">
            <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-[#c0c1ff] text-[#1000a9] rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-[#c7c4d7]">/mo</span>
              </div>
            </div>
            <ul className="flex-grow space-y-4 mb-10">
              {["Unlimited Documents", "2GB Max File Size", "Gemini Pro Intelligence", "Priority Queue Support"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#c0c1ff]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>{f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-xl gradient-button text-[#1000a9] text-sm font-semibold shadow-lg shadow-[#c0c1ff]/20">Upgrade Now</button>
          </div>

          {/* Team */}
          <div className="glass p-10 rounded-2xl flex flex-col hover:border-[#464554] transition-all">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-2">Team</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-[#c7c4d7]">/mo</span>
              </div>
            </div>
            <ul className="flex-grow space-y-4 mb-10">
              {["Everything in Pro", "Team Workspaces", "Admin Dashboard", "API Access (Beta)"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-[#c7c4d7]">
                  <span className="material-symbols-outlined text-[#4cd7f6]">check_circle</span>{f}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-xl glass hover:bg-[#383845]/30 transition-all text-sm font-semibold">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* About / Testimonials */}
      <section id="about" className="py-32 bg-[#0d0d18] scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-5xl font-extrabold text-center mb-16">Trusted by Experts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                color: "text-[#c0c1ff]",
                quote: "DocMind AI has cut my research time by nearly 60%. I can now 'interview' my papers to find exactly what I need without endless scrolling.",
                name: "Dr. Marcus Chen",
                role: "AI Ethics Researcher",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaJPVMyM9anNN0qSbNA2H6p16G-w08qPPlYIhzwGc-lEMkmpd711V09GmBbGBeoMIrVzHynrSUdbDXU2Z0NzAcS6844SQgetYbsenhg2sTnAm5pH3DhJ4Z7aD-hZIDB25DUxhz320nhyLGSqgJ28CLbe7RmzggFV20D1_-qeqWdIKDT14p1ht-9MeduYeYCwcPL-Dzn5yM5wmtQfKyoaoxC8GFiL_M0EYc3R948ODYsHGBqW4yGIAkEiYwDSybFJeAVgL_niYshiY",
              },
              {
                color: "text-[#4cd7f6]",
                quote: "The accuracy is staggering. It understands context, not just keywords. It's like having a PhD assistant for every project I manage.",
                name: "Sarah Jenkins",
                role: "CTO, Nexus Corp",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXpCgS7x2It7C1nonFfBopCd0Ik2f3z6eYI40Jrk7BvnrwybfTqb4MD1jSTMRVDqilhr8xtLiyCx0pbNUa1DxMz8b35ieUxA3ro8oRMNj6fv38LCMPWeWmnfjbEYsTfUAxqI_SEb-DPgkqtrqhj12wGXf_Vtl6Ckl85UbCZeWiKeViGU7aq2WE_fU_ZwBhurUa0LtjWOseXYMI9Jltp1C_kuYUVpEFSuxYWn61JyNFZgED2VJfFkdXz7SvEurgUbWMCCAkUvlY9hc",
              },
              {
                color: "text-[#4edea3]",
                quote: "The glassmorphism UI isn't just beautiful—it's functional. I can finally process hundreds of pages without feeling overwhelmed by data.",
                name: "Leo Thompson",
                role: "Legal Analyst",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXmYxWxTzdcnksAM7k1IqIQjBUZTsxxDAzGLXuJ3Hi2Ak4FvgIKjHPYw3OiWXE8oWk68vmQuBuVY502_1r_CiGwGg_TxC5R3M5yR1tsILUe2dWwpLQ9DjFH26fU845-6N_QEqoO4SCvnC5cmgjab6NF1zZPFBq6YiCMaiXB1jTk-tfsgWfUFCztSl8eNaYY_TJvhT-FVA3UGWjNe5cMnFJthbTv6hD6TiXe6cI-lyyzINyhPpXcWlPXMhwwUdPLJWVRP0NSLBuzzc",
              },
            ].map((t) => (
              <div key={t.name} className="glass p-8 rounded-2xl relative">
                <div className={`mb-6 ${t.color}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: "48px" }}>format_quote</span>
                </div>
                <p className="text-base mb-8 italic text-[#e3e0f1]">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#383845] relative flex-shrink-0">
                    <Image src={t.img} alt={t.name} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-sm text-[#c7c4d7]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold text-center mb-16">Common Questions</h2>
        <div className="space-y-4">
          {["Is my data secure?", "What file types are supported?", "Can I use it for research papers?", "How does the citation system work?"].map((q) => (
            <div key={q} className="glass rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-6 text-left hover:bg-[#383845]/20 transition-colors">
                <span className="text-sm font-semibold">{q}</span>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="px-6 py-20 scroll-mt-24">
        <div className="max-w-[1280px] mx-auto relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#c0c1ff]/30 to-[#4cd7f6]/30 backdrop-blur-3xl" />
          <div className="relative z-10 py-20 px-10 text-center flex flex-col items-center">
            <h2 className="text-5xl font-extrabold mb-6">Ready to Supercharge Your Reading?</h2>
            <p className="text-lg text-[#c7c4d7] max-w-2xl mb-10">
              Join 10,000+ researchers and professionals who are unlocking the future of document interaction today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="gradient-button text-[#1000a9] text-sm font-semibold px-10 py-4 rounded-xl shadow-xl hover:scale-105 transition-transform">
                Get Started Free
              </Link>
              <button className="bg-[#1f1e2a] text-[#e3e0f1] text-sm font-semibold px-10 py-4 rounded-xl border border-[#464554]/30 hover:bg-[#383845] transition-all">
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-12 flex flex-col lg:flex-row justify-between items-start gap-10 max-w-[1280px] mx-auto bg-[#0d0d18] border-t border-[#464554]/10">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="text-sm font-semibold text-[#e3e0f1] mb-2 hover:text-[#4cd7f6] transition-colors">
            DocMind AI
          </Link>
          <p className="text-sm text-[#c7c4d7]">© 2024 DocMind AI. Built for the future of knowledge work.</p>
        </div>
        <NewsletterSignup />
        <div className="flex flex-wrap justify-center gap-8">
          {["Privacy Policy", "Terms of Service", "Security", "Status"].map((l) => (
            <a key={l} href="#" className="text-sm text-[#c7c4d7] hover:text-[#4cd7f6] transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
