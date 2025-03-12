// src/app/api/auth/options.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserRole, getAdminEmail } from "@/lib/userPermissions";
import { UserRole } from "@/lib/clientUserPermissions";

// NextAuth configuration
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // When sign in happens or when session is updated
            if (trigger === 'signIn' || trigger === 'update') {
                if (token.email) {
                    try {
                        // First check if this is the admin email
                        const adminEmail = await getAdminEmail();
                        if (adminEmail && token.email === adminEmail) {
                            console.log(`Admin login detected: ${token.email}`);
                            token.role = UserRole.ADMIN;
                        } else {
                            // Regular user, get role from Redis
                            const role = await getUserRole(token.email);
                            token.role = role;
                            console.log(`User login with role: ${role} for ${token.email}`);
                        }
                    } catch (error) {
                        console.error("Error getting user role for JWT:", error);
                        token.role = UserRole.VISITOR;
                    }
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // Add role to session
                (session.user as any).role = token.role;

                // Log session
                console.log(`Session updated: ${session.user.email} with role ${token.role}`);
            }

            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Enable debug to see more info in logs
};