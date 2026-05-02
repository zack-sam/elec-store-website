import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const search = z.object({ category: z.string().optional() });

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  validateSearch: search,
  head: () => ({ meta: [{ title: "Shop — VOLTRIG" }, { name: "description", content: "Browse all PC components and gaming peripherals." }] }),
});

function ProductsPage() {
  const { category } = Route.useSearch();
  const [products, setProducts] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => setCats(data ?? []));
  }, []);

  useEffect(() => {
    let q = supabase.from("products").select("*, categories!inner(slug,name)").order("created_at", { ascending: false });
    if (category) q = q.eq("categories.slug", category);
    q.then(({ data }) => setProducts(data ?? []));
  }, [category]);

  const activeCat = cats.find((c) => c.slug === category);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container mx-auto px-4 py-10 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold">{activeCat ? activeCat.name : "All products"}</h1>
        <p className="text-muted-foreground mt-2">{activeCat?.description ?? "Hand-picked components from leading brands"}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/products" className={cn("rounded-full border px-3 py-1.5 text-sm transition-smooth",
            !category ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
            All
          </Link>
          {cats.map((c) => (
            <Link key={c.id} to="/products" search={{ category: c.slug }}
              className={cn("rounded-full border px-3 py-1.5 text-sm transition-smooth",
                category === c.slug ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        {products.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No products found.</div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
