import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products" className="text-primary mt-3 inline-block">Back to shop</Link></div>
    </div>
  ),
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const [p, setP] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("products").select("*, categories(name,slug)").eq("slug", slug).maybeSingle()
      .then(({ data }) => { setP(data); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!p) return <div className="min-h-screen flex items-center justify-center">Not found</div>;

  const specs = (p.specs ?? {}) as Record<string, string>;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
        <div className="mt-6 grid md:grid-cols-2 gap-10">
          <div className="rounded-2xl border border-border/60 overflow-hidden bg-gradient-card aspect-square">
            {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
          </div>
          <div className="space-y-5">
            {p.categories && <div className="text-xs uppercase tracking-wider text-primary">{p.categories.name}</div>}
            <h1 className="text-3xl md:text-4xl font-bold">{p.name}</h1>
            <div className="text-sm text-muted-foreground">{p.brand}</div>
            <div className="text-4xl font-bold text-gradient">{formatPrice(Number(p.price))}</div>
            <div>
              {p.stock > 0 ? <Badge className="bg-success/15 text-success border-success/30">In stock · {p.stock} available</Badge>
                : <Badge variant="destructive">Out of stock</Badge>}
            </div>
            <p className="text-muted-foreground leading-relaxed">{p.description}</p>
            <Button variant="hero" size="lg" disabled={p.stock === 0} onClick={() => toast.info("Cart coming soon")}>
              <ShoppingCart /> Add to cart
            </Button>
            {Object.keys(specs).length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card/50 p-5 mt-4">
                <h3 className="font-semibold mb-3">Specifications</h3>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
