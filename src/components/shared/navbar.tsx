"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AUTH_TOKEN_KEY } from "@/lib/config";
import { Film, User, LogOut, LogIn, UserPlus } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    // Clear token from localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold text-foreground hover:text-primary transition-colors"
          >
            <Film className="h-6 w-6 text-primary" />
            <span>Movie Night Picker</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/suggest">
              <Button variant="ghost" className="hidden sm:flex">
                Suggest
              </Button>
            </Link>
            <Link href="/shuffle">
              <Button variant="ghost" className="hidden sm:flex">
                Shuffle
              </Button>
            </Link>
            
            {status === "loading" ? (
              <div className="h-9 w-20 animate-pulse bg-muted rounded-md" />
            ) : session ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

