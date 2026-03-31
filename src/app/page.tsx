"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  LucideIcon, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Globe, 
  Zap, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { BrowserMockup } from "@/components/landing/BrowserMockup";
import { HeroDashboard } from "@/components/landing/HeroDashboard";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/20">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />

      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-50 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <header className="px-6 h-24 flex items-center justify-between border-b border-border/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Logo />
          
          <nav className="hidden lg:flex items-center gap-10">
            <Link href="#features" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">Features</Link>
            <Link href="#how-it-works" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">Workflow</Link>
            <Link href="#pricing" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">Pricing</Link>
          </nav>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-6 border-l border-border pl-6">
              <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-surface-hover px-4 py-2 rounded-xl transition-all">
                Login
              </Link>
              <Link href="/register">
                <Button size="sm" className="shadow-lg shadow-primary/15 font-black uppercase tracking-widest text-[10px]">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center space-y-16">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-sm"
              >
                <Sparkles size={14} className="animate-pulse" />
                The Developer Engine
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 sm:space-y-8"
              >
                <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] sm:leading-[0.8] text-foreground">
                  SHIP FASTER. <br className="hidden sm:block" />
                  <span className="text-primary italic font-serif">BUILD BETTER.</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium uppercase tracking-tight opacity-80 px-4">
                  The high-fidelity workspace for creators to track DSA mastery, architect logic-heavy notes, and crush deliverables.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
              >
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-12 text-lg font-black group rounded-2xl shadow-2xl shadow-primary/20 uppercase tracking-widest">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto h-16 px-12 text-lg border-border hover:bg-surface-hover rounded-2xl font-bold uppercase tracking-tight">
                    <Terminal size={20} className="mr-3 opacity-60" />
                    Open Demo
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* --- HERO SHOWCASE (Browser Mockup) --- */}
            <div className="pt-12 px-2 sm:px-4">
               <BrowserMockup>
                 <HeroDashboard />
               </BrowserMockup>
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <ScrollSection id="how-it-works" className="py-20 sm:py-32 px-6">
          <div className="max-w-5xl mx-auto text-center mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 tracking-tight">Three Steps to Peak Flow</h2>
            <p className="text-muted-foreground text-base sm:text-lg">We stripped away the noise so you can focus on what matters.</p>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 sm:gap-20 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
            
            {[
              { 
                step: "01", 
                title: "Injest Data", 
                desc: "Paste LeetCode links or raw markdown. Our system auto-labels and formats it instantly.",
                icon: Globe
              },
              { 
                step: "02", 
                title: "Architect Ideas", 
                desc: "Break down brute force to optimal solutions. Link your notes to specific code blocks.",
                icon: Cpu
              },
              { 
                step: "03", 
                title: "Master the Material", 
                desc: "Use our spaced-repetition logic to revisit hard problems at the perfect time.",
                icon: Zap
              }
            ].map((item, i) => (
              <div key={i} className="relative space-y-6 text-center">
                <div className="h-32 w-32 mx-auto rounded-3xl bg-surface border border-border flex items-center justify-center shadow-xl shadow-black/5 z-10 relative group hover:border-primary/50 transition-colors">
                  <item.icon size={48} className="text-primary group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-3 -right-3 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black italic shadow-lg border-4 border-background">
                    {item.step}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed px-4">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollSection>

        {/* --- PRICING SECTION --- */}
        <ScrollSection id="pricing" className="py-32 px-6 bg-primary/[0.02]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 max-w-xl">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-black tracking-tight italic">Free, Always.</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We believe productivity shouldn't be a luxury. The core BhulnaJaana experience will remain free forever for independent developers.
                </p>
              </div>
              <ul className="space-y-5">
                {[
                  "Unlimited DSA Tracking",
                  "Rich Markdown Note Editor",
                  "Cloud Synchronization",
                  "Community Roadmap Access",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg font-medium group">
                    <div className="h-6 w-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={16} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10" />
              <div className="bg-background border-2 border-primary rounded-[32px] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 lg:p-10 p-6">
                  <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">Base Plan</span>
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-4xl font-black mb-1">Developer</h3>
                    <p className="text-muted-foreground">For individuals mastery.</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black">$0</span>
                    <span className="text-muted-foreground font-medium">/month</span>
                  </div>
                  <Link href="/register" className="block">
                    <Button size="lg" className="w-full h-16 rounded-2xl text-lg font-bold group">
                      Claim Your Access
                      <ChevronRight size={20} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <p className="text-center text-sm text-muted-foreground italic">No credit card required.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollSection>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-16 sm:py-20 border-t border-border bg-surface/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start justify-between gap-12 sm:gap-16">
          <div className="space-y-6 max-w-xs">
            <Logo />
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed italic opacity-70">
              Crafted with precision for the next generation of software architects. Forget nothing, build everything.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 sm:gap-24">
            {/* Same Footer Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Workspace</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            {/* ... other items (Community, Legal) */}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-widest">
          <p>© 2026 BhulnaJaana</p>
          <div className="flex gap-1 items-center">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Systems fully operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ScrollSection({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}


function FeatureCard({ icon: Icon, title, desc }: { icon: LucideIcon, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[32px] border border-border bg-surface hover:bg-surface-hover shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{desc}</p>
      </div>
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={20} className="text-primary/40" />
      </div>
    </div>
  );
}
