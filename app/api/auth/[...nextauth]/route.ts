import prisma from "@/app/lib/db";
import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
      })
    ],
    callbacks: {
      async signIn(params){
        if(!params.user.email){
          return false;
        }
        try{
          await prisma.user.create({
            data: {
              email: params.user.email,
              provider: "Google"
            }
          });
        } catch(error){

        }return true;
      },
      async jwt({ token, user }: { token: JWT, user: User}){
        if(user){
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
        }
        return token;
      },
      async session({ token, session }: {token: JWT, session: Session}){
        if(session.user){
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name
        }
        return session;
      }
    }
});

export { handler as GET, handler as POST }