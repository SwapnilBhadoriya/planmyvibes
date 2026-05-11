import { DefaultSession } from "next-auth"

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: string
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      role?: string
    } & DefaultSession["user"]
  }
}
