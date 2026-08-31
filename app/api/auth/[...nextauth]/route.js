import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbGetUserByEmail, dbGetUserById, dbUpsertUser, dbUpdateUserLastLogin } from "@/lib/db";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials || {};
        
        if (!email || !password || !email.includes("@")) {
          return null;
        }

        const normalizedEmail = email.trim().toLowerCase();
        
        // 1. Check existing user in SQLite relational database
        let user = dbGetUserByEmail(normalizedEmail);

        if (user) {
          // If account is suspended by administrator, immediately deny authentication
          if (user.status === "Suspendu") {
            console.warn(`[NextAuth] Authentication blocked for suspended user: ${normalizedEmail}`);
            return null;
          }

          // If a password is set, verify match (supports plain text dev and custom passwords)
          if (user.password && password && user.password !== password) {
            console.warn(`[NextAuth] Invalid password for: ${normalizedEmail}`);
            return null;
          }

          // Update last login timestamp in SQLite DB
          dbUpdateUserLastLogin(user.id);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            jwt_token: `jwt-token-${user.id}`,
            role: user.role,
            plan: user.plan || 'Essentiel'
          };
        }

        // 2. If user does not exist in DB yet, create & persist them into the SQLite database
        const userName = normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const userRole = normalizedEmail.includes("admin@dona.com") ? "Super-Admin" : "USER";

        const createdUser = dbUpsertUser({
          name: userName,
          email: normalizedEmail,
          password: password || 'dona2026',
          role: userRole,
          status: 'Actif',
          plan: 'Essentiel'
        });

        if (createdUser) {
          dbUpdateUserLastLogin(createdUser.id);
          return {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            jwt_token: `jwt-token-${createdUser.id}`,
            role: createdUser.role,
            plan: createdUser.plan || 'Essentiel'
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.jwt_token = user.jwt_token;
        token.id = user.id;
        token.plan = user.plan;
      }

      // Synchronize latest active role directly from SQLite DB on every session check
      if (token?.id || token?.email) {
        const liveUser = (token.id ? dbGetUserById(token.id) : null) || (token.email ? dbGetUserByEmail(token.email) : null);
        if (liveUser) {
          token.role = liveUser.role;
          token.status = liveUser.status;
          token.plan = liveUser.plan || token.plan || 'Essentiel';
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.jwt_token = token.jwt_token;
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.status = token.status;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "dona-magazine-super-secret-key-987654321",
};

const handler = NextAuth(authOptions);

export { authOptions, handler as GET, handler as POST };

