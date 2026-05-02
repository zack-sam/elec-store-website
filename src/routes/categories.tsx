import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cpu, MonitorPlay, MemoryStick, HardDrive, CircuitBoard, Plug, Snowflake, Keyboard, ArrowRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({ meta: [{ title: "Categories — VOLTRIG" }] }),
});

const iconMap: Record<string, any> = { Cpu, MonitorPlay, MemoryStick, HardDrive, CircuitBoard, Plug, Snowflake, Keyboard };

function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => { supabase.from("categories").select("*").order("name").then(({ data }) => setCats(data ?? [])); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-2">Find exactly what you need</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cats.map((c) => {
            const I = iconMap[c.icon] ?? Cpu;
            return (
              <Link key={c.id} to="/products" search={{ category: c.slug }}
                className="group rounded-xl border border-border/60 bg-gradient-card p-6 transition-smooth hover:border-primary/60 hover:shadow-glow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-smooth">
                  <I className="h-6 w-6" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{c.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{c.description}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-smooth" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
