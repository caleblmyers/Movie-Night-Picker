import "next-auth";

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  token?: string;
}

declare module "next-auth" {
  interface Session {
    user: AuthUser;
    authToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    authToken?: string;
  }
}

