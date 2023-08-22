import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, User, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./connect";

declare module "next-auth" {
    interface Session {
        user: User & {
            isAdmin: Boolean;
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
            isAdmin: Boolean
    }
}

export const authOptions:NextAuthOptions = {
    adapter: PrismaAdapter(prisma), // manejará la autenticación y agregará automáticamente nuevos usuarios, sesiones y cuentas a la base de datos.
    session:{
        strategy: "jwt"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    callbacks:{ // Una vez autenticado se generá un token que contiene solo userName, email e image,
                // se procede a introducir en token y session la prop isAdmin procedente de bd.
                
        async session({ token, session }){
            if(token){                                      // Si existe el token // 3º
                session.user.isAdmin = token.isAdmin        // añadimos a session.user.isAdmin la prop correspondiente del token
            }
            return session;
        },
        async jwt({ token }){
            
            const userInDb = await prisma.user.findUnique({ // usuario en bd                    //1º
                where:{
                    email: token.email!
                },
            });
            
            token.isAdmin = userInDb?.isAdmin!; // Añadimos la prop isAdmin de bd al token      // 2º    
            return token;
        }
    }
}

export const getAuthSession = () =>  getServerSession(authOptions);