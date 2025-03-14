// src/app/api/auth/options.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserRole, getAdminEmail } from "@/lib/userPermissions";
import { UserRole } from "@/lib/clientUserPermissions";
import { uploadImageFromUrl } from '@/lib/auth-image-handler';
import { client } from '@/clients/sanity/client';

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
    events: {
        async signIn({ user, account, profile }) {
            try {
                if (account?.provider === 'google' && user.email && user.image) {
                    console.log(`Checking if Sanity profile exists for: ${user.email}`);

                    // Check if user already exists in Sanity
                    const existingUser = await client.fetch(
                        `*[_type == "author" && email == $email][0]`,
                        { email: user.email }
                    );

                    // If user doesn't exist or doesn't have a profile image, upload the Google image
                    if (!existingUser || !existingUser.profileImage) {
                        console.log(`Storing Google profile image for: ${user.email}`);

                        // Upload the Google profile image to Sanity
                        const imageAsset = await uploadImageFromUrl(
                            user.image,
                            `google-profile-${user.id || user.email.replace(/[^a-zA-Z0-9]/g, '-')}`
                        );

                        if (imageAsset) {
                            if (existingUser) {
                                // Update existing user with profile image
                                await client.patch(existingUser._id)
                                    .set({ profileImage: imageAsset })
                                    .commit();
                                console.log(`Updated existing author with profile image: ${existingUser._id}`);
                            } else {
                                // Create new user with profile image
                                const displayName = user.name || user.email.split('@')[0];
                                const slug = displayName.toLowerCase().replace(/\s+/g, '-');

                                const newAuthor = await client.create({
                                    _type: 'author',
                                    name: displayName,
                                    email: user.email,
                                    slug: {
                                        current: slug
                                    },
                                    profileImage: imageAsset
                                });
                                console.log(`Created new author with profile image: ${newAuthor._id}`);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error handling user sign in image processing:', error);
                // Don't throw - we don't want to prevent sign in if this fails
            }
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development', // Enable debug in development
};