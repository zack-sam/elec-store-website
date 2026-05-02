import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Package, Tag, ArrowLeft, Plus, Pencil, Trash2, Boxes, DollarSign, AlertCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
  head: () => ({ meta: [{ title: "Staff Panel — VOLTRIG" }] }),
});

function AdminPanel() {
  const { user, isStaff, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return null;

  if (!isStaff) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/15 grid place-items-center">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Staff access only</h1>
          <p className="text-muted-foreground">
            Your account doesn't have staff permissions. Ask an administrator to grant the
            <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">staff</code>
            or
            <code className="mx-1 px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">admin</code>
            role.
          </p>
          <p className="text-xs text-muted-foreground break-all">Your user ID: {user.id}</p>
          <Button asChild variant="glow"><Link to="/">Back to store</Link></Button>
        </div>
      </div>
    );
  }

  return <StaffDashboard />;
}

function StaffDashboard() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">Staff Panel</div>
              <div className="font-bold leading-tight">VOLTRIG Admin</div>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="h-4 w-4" /> Storefront</Link></Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard"><LayoutDashboard className="h-4 w-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="products"><Package className="h-4 w-4" />Products</TabsTrigger>
            <TabsTrigger value="categories"><Tag className="h-4 w-4" />Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6"><DashboardTab /></TabsContent>
          <TabsContent value="products" className="mt-6"><ProductsTab /></TabsContent>
          <TabsContent value="categories" className="mt-6"><CategoriesTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-gradient-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center text-primary"><Icon className="h-4 w-4" /></div>
      </div>
      <div className="text-2xl font-bold mt-3">{value}</div>
    </div>
  );
}

function DashboardTab() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => { supabase.from("products").select("*").then(({ data }) => setProducts(data ?? [])); }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((s, p) => s + (p.stock ?? 0), 0);
    const inventoryValue = products.reduce((s, p) => s + Number(p.price) * (p.stock ?? 0), 0);
    const lowStock = products.filter((p) => p.stock < 10).length;
    const featured = products.filter((p) => p.featured).length;
    return { totalProducts, totalStock, inventoryValue, lowStock, featured };
  }, [products]);

  const lowStockItems = useMemo(() => products.filter((p) => p.stock < 15).slice(0, 8), [products]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Products" value={stats.totalProducts.toString()} />
        <StatCard icon={Boxes} label="Total stock units" value={stats.totalStock.toString()} />
        <StatCard icon={DollarSign} label="Inventory value" value={formatPrice(stats.inventoryValue)} />
        <StatCard icon={Star} label="Featured" value={stats.featured.toString()} />
      </div>

      <div className="rounded-xl border border-border/60 bg-card/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Low stock alerts</h3>
          <Badge variant="destructive">{stats.lowStock} items</Badge>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Brand</TableHead><TableHead className="text-right">Stock</TableHead><TableHead className="text-right">Price</TableHead></TableRow></TableHeader>
          <TableBody>
            {lowStockItems.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.brand}</TableCell>
                <TableCell className="text-right">
                  <span className={p.stock < 10 ? "text-destructive font-semibold" : ""}>{p.stock}</span>
                </TableCell>
                <TableCell className="text-right">{formatPrice(Number(p.price))}</TableCell>
              </TableRow>
            ))}
            {lowStockItems.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">All stocked up 🎉</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const load = () => supabase.from("products").select("*, categories(name,slug)").order("created_at", { ascending: false })
    .then(({ data }) => setProducts(data ?? []));
  useEffect(() => { load(); supabase.from("categories").select("*").then(({ data }) => setCats(data ?? [])); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => { setEditing(null); setOpen(true); }}>
              <Plus className="h-4 w-4" /> New product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
            <ProductForm product={editing} categories={cats} onDone={() => { setOpen(false); setEditing(null); load(); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/60 overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Product</TableHead><TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead><TableHead className="text-right">Stock</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {p.image_url && <img src={p.image_url} alt="" className="h-10 w-10 rounded object-cover" />}
                    <div><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.brand}</div></div>
                  </div>
                </TableCell>
                <TableCell>{p.categories?.name ?? "—"}</TableCell>
                <TableCell className="text-right">{formatPrice(Number(p.price))}</TableCell>
                <TableCell className="text-right">{p.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ProductForm({ product, categories, onDone }: { product: any; categories: any[]; onDone: () => void }) {
  const [f, setF] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    brand: product?.brand ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "0",
    stock: product?.stock?.toString() ?? "0",
    image_url: product?.image_url ?? "",
    category_id: product?.category_id ?? "",
    featured: product?.featured ?? false,
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      name: f.name, slug: f.slug || slugify(f.name), brand: f.brand,
      description: f.description, price: Number(f.price), stock: Number(f.stock),
      image_url: f.image_url || null, category_id: f.category_id || null, featured: f.featured,
    };
    const res = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    setBusy(false);
    if (res.error) toast.error(res.error.message);
    else { toast.success(product ? "Updated" : "Created"); onDone(); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2 col-span-2"><Label>Name</Label>
          <Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) })} /></div>
        <div className="space-y-2"><Label>Slug</Label><Input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></div>
        <div className="space-y-2"><Label>Brand</Label><Input value={f.brand} onChange={(e) => setF({ ...f, brand: e.target.value })} /></div>
        <div className="space-y-2"><Label>Price (USD)</Label><Input type="number" step="0.01" required value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></div>
        <div className="space-y-2"><Label>Stock</Label><Input type="number" required value={f.stock} onChange={(e) => setF({ ...f, stock: e.target.value })} /></div>
        <div className="space-y-2 col-span-2"><Label>Image URL</Label><Input value={f.image_url} onChange={(e) => setF({ ...f, image_url: e.target.value })} /></div>
        <div className="space-y-2 col-span-2"><Label>Category</Label>
          <Select value={f.category_id} onValueChange={(v) => setF({ ...f, category_id: v })}>
            <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2 col-span-2"><Label>Description</Label>
          <Textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="flex items-center gap-3 col-span-2">
          <Switch checked={f.featured} onCheckedChange={(v) => setF({ ...f, featured: v })} />
          <Label>Featured on homepage</Label>
        </div>
      </div>
      <Button type="submit" variant="hero" className="w-full" disabled={busy}>
        {product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}

function CategoriesTab() {
  const [cats, setCats] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const load = () => supabase.from("categories").select("*").order("name").then(({ data }) => setCats(data ?? []));
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("categories").insert({ name, slug: slugify(name), description: desc, icon: "Cpu" });
    if (error) toast.error(error.message); else { setName(""); setDesc(""); toast.success("Added"); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form onSubmit={add} className="rounded-xl border border-border/60 bg-card/60 p-5 space-y-3">
        <h3 className="font-semibold">New category</h3>
        <div className="space-y-2"><Label>Name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
        <Button type="submit" variant="hero" className="w-full"><Plus className="h-4 w-4" />Add</Button>
      </form>
      <div className="md:col-span-2 rounded-xl border border-border/60 bg-card/60 overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {cats.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
