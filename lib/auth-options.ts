import prisma from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",  // Use 'jwt' if you want JWT tokens; otherwise, use 'database' if using sessions
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        // Check if the user already exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // Only create a new user if they don't exist
        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              provider: "Google",
            },
          });
          user.id = newUser.id;
        }
        user.id = existingUser?.id || "";
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        // console.log(session);
      }
      return session;
    },
  },
};
