"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground overflow-hidden">
      <header className="px-6 h-20 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">Productivity</div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
          
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
                Think clearly.
                <br />
                <span className="text-muted-foreground">Work beautifully.</span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              A premium, mobile-first workspace for your tasks and notes. 
              Designed for focus, speed, and seamless cross-device synchronization.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-border bg-surface px-8 py-4 text-base font-medium text-foreground hover:bg-surface-hover transition-colors">
                Log In
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-6 bg-surface border-y border-border">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Built for speed and focus.</h2>
                <ul className="space-y-6">
                  {[
                    "Responsive multi-column desktop layout",
                    "Thumb-friendly mobile bottom navigation",
                    "Premium animated interactions",
                    "Fully secure authentication",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                      <span className="text-lg text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl shadow-black/5 bg-gradient-to-br from-border/50 to-surface border border-border flex items-center justify-center">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/80 to-transparent z-10" />
                <div className="text-muted-foreground/40 font-medium text-xl">App Preview Appears Here</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border bg-background">
        <p>© 2026 Productivity. All rights reserved.</p>
      </footer>
    </div>
  );
}
