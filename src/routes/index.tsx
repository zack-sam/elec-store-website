import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Cpu, MonitorPlay, MemoryStick, HardDrive, CircuitBoard, Plug, Snowflake, Keyboard, Zap, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({ component: Index });

const iconMap: Record<string, any> = { Cpu, MonitorPlay, MemoryStick, HardDrive, CircuitBoard, Plug, Snowflake, Keyboard };

function Index() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").eq("featured", true).limit(4)
      .then(({ data }) => setFeatured(data ?? []));
    supabase.from("categories").select("*").order("name")
      .then(({ data }) => setCats(data ?? []));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Zap className="h-3.5 w-3.5" /> New gen hardware in stock
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Build the <span className="text-gradient">ultimate</span> gaming rig.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Curated GPUs, CPUs, memory and peripherals from the brands you trust. Performance, delivered.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/products">Shop now <ArrowRight /></Link>
              </Button>
              <Button asChild variant="glow" size="lg">
                <Link to="/categories">Browse categories</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-primary opacity-30 blur-3xl rounded-full" />
            <img src={heroImg} alt="Gaming PC with RGB lighting" width={1536} height={896}
              className="relative rounded-2xl border border-border/60 shadow-elegant" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Shop by category</h2>
            <p className="text-muted-foreground mt-1">Everything you need for your build</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cats.map((c) => {
            const Icon = iconMap[c.icon] ?? Cpu;
            return (
              <Link key={c.id} to="/products" search={{ category: c.slug }}
                className="group rounded-xl border border-border/60 bg-gradient-card p-5 transition-smooth hover:border-primary/60 hover:shadow-glow">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary mb-4 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-smooth">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{c.description}</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured products</h2>
          <Button asChild variant="ghost"><Link to="/products">View all <ArrowRight /></Link></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Truck, t: "Fast shipping", d: "Same-day dispatch on in-stock orders" },
            { icon: ShieldCheck, t: "Authorized retailer", d: "Genuine products with full warranty" },
            { icon: Zap, t: "Expert support", d: "Build advice from real PC enthusiasts" },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="rounded-xl border border-border/60 bg-gradient-card p-6">
              <I className="h-6 w-6 text-primary mb-3" />
              <div className="font-semibold">{t}</div>
              <div className="text-sm text-muted-foreground mt-1">{d}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
