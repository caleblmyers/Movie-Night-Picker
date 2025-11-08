"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AUTH_TOKEN_KEY } from "@/lib/config";

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
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Movie Night Picker
          </Link>

          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="h-9 w-20 animate-pulse bg-muted rounded-md" />
            ) : session ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

