"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AUTH_TOKEN_KEY, PASSWORD_MIN_LENGTH } from "@/lib/config";
import { graphqlRequest } from "@/lib/utils/graphql-client";
import { REGISTER } from "@/lib/graphql";
import { print } from "graphql";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      return;
    }

    setLoading(true);

    try {
      const response = await graphqlRequest<{
        register: { token: string; user: { id: string; email: string; name?: string | null } };
      }>({
        query: print(REGISTER),
        variables: { email, password },
      });

      if (response.errors || !response.data?.register) {
        setError(response.errors?.[0]?.message || "Registration failed");
      } else {
        // Auto-login after registration
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (!result?.error) {
          const sessionResponse = await fetch("/api/auth/session");
          const session = await sessionResponse.json();
          
          if (session?.authToken) {
            localStorage.setItem(AUTH_TOKEN_KEY, session.authToken);
          }
          
          router.push("/profile");
          router.refresh();
        } else {
          router.push("/login");
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex items-center justify-center px-4 py-16">
      <main className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Join the Show
          </h1>
          <p className="text-muted-foreground text-lg">
            Create your free account to save movies, rate favorites, and share reviews
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card/50 backdrop-blur-sm border rounded-lg p-6 shadow-lg">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

