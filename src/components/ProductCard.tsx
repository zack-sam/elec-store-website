import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  price: number;
  stock: number;
  image_url: string | null;
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: p.slug }}
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-card shadow-elegant transition-smooth hover:border-primary/60 hover:shadow-glow"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted/40">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</span>
          {p.stock > 0 ? (
            <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/15">In stock</Badge>
          ) : (
            <Badge variant="destructive">Out</Badge>
          )}
        </div>
        <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-smooth">{p.name}</h3>
        <div className="text-lg font-bold text-gradient">{formatPrice(p.price)}</div>
      </div>
    </Link>
  );
}
