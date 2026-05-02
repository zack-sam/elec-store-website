import { Link } from "@tanstack/react-router";
import { Cpu, ShieldCheck, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function SiteHeader() {
  const { user, isStaff, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Cpu className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            VOLT<span className="text-gradient">RIG</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} className="text-muted-foreground hover:text-foreground transition-smooth" activeProps={{ className: "text-foreground" }}>Home</Link>
          <Link to="/products" className="text-muted-foreground hover:text-foreground transition-smooth" activeProps={{ className: "text-foreground" }}>Shop</Link>
          <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-smooth" activeProps={{ className: "text-foreground" }}>Categories</Link>
        </nav>

        <div className="flex items-center gap-2">
          {isStaff && (
            <Button asChild variant="glow" size="sm">
              <Link to="/admin"><LayoutDashboard className="h-4 w-4" />Admin</Link>
            </Button>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />Sign out
            </Button>
          ) : (
            <Button asChild variant="hero" size="sm">
              <Link to="/auth"><LogIn className="h-4 w-4" />Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>VOLTRIG · Premium PC components · Authorized retailer</span>
        </div>
        <div>© {new Date().getFullYear()} VOLTRIG. All rights reserved.</div>
      </div>
    </footer>
  );
}
