// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { UserRole } from "@/lib/userPermissions";

declare module "next-auth" {
    interface Session {
        user: {
            role?: UserRole;
        } & DefaultSession["user"];
    }

    interface User {
        role?: UserRole;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: UserRole;
    }
}