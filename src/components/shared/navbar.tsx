"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AUTH_TOKEN_KEY } from "@/lib/config";
import { User, LogOut, LogIn, UserPlus, Folder } from "lucide-react";
import { MovieSearchBar } from "@/components/search/movie-search-bar";

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
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 shrink-0 text-2xl font-bold text-foreground transition-colors hover:text-primary"
          >
            <Image
              src="/icon.png"
              alt="Movie Night Picker"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              unoptimized
            />
            <span className="hidden sm:inline">Movie Night Picker</span>
          </Link>

          <div className="hidden md:block flex-1 max-w-md mx-4">
            <MovieSearchBar />
          </div>

          <div className="flex items-center gap-3 shrink-0">
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
                <Link href="/collections">
                  <Button variant="ghost" className="hidden sm:flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    Collections
                  </Button>
                </Link>
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
                  <Button className="flex items-center gap-2 bg-linear-to-r from-primary to-primary/80">
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

