import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // FUTURE WORDPRESS HEADLESS API FETCH INTEGRATION:
        /*
        try {
          const res = await fetch("http://localhost/wp-json/jwt-auth/v1/token", {
            method: "POST",
            body: JSON.stringify({
              username: credentials.email, // WP accepts email as username if set up
              password: credentials.password
            }),
            headers: { "Content-Type": "application/json" }
          });
          const user = await res.json();
          if (res.ok && user.token) {
            // Fetch additional user details to check their role
            const roleRes = await fetch("http://localhost/wp-json/wp/v2/users/me", {
              headers: { "Authorization": `Bearer ${user.token}` }
            });
            const me = await roleRes.json();
            
            // Map roles
            let role = "FREE_USER";
            if (me.roles.includes("administrator")) {
              role = "Super-Admin";
            } else if (me.roles.includes("editor")) {
              role = "Éditeur";
            }

            return {
              id: me.id,
              name: me.name,
              email: me.email,
              jwt_token: user.token,
              role: role
            };
          }
        } catch (error) {
          console.error("WordPress login fetch error:", error);
        }
        */

        // MOCK AUTHENTICATION LOGIC FOR ADMIN TEAM
        const { email, password } = credentials;
        
        // Simple test password for auditing
        if (password !== "dona123") {
          return null;
        }

        const mockUsers = [
          { id: "u-1", name: "Elena Moretti", email: "elena@donamagazine.com", role: "Super-Admin", active: true },
          { id: "u-2", name: "Marc Dubois", email: "marc@donamagazine.com", role: "Éditeur", active: true },
          { id: "u-3", name: "Sophie Laurent", email: "sophie@donamagazine.com", role: "Journaliste", active: true },
          { id: "u-4", name: "Ahmed Al-Farsi", email: "ahmed@donamagazine.com", role: "Traducteur", active: true },
          { id: "u-5", name: "Thomas Bernard", email: "thomas@donamagazine.com", role: "Journaliste", active: false },
          { id: "usr-admin-1", name: "Nora Patrius", email: "admin@dona.com", role: "Super-Admin", active: true }
        ];

        const matchedUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (matchedUser && matchedUser.active) {
          return {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            jwt_token: `mock-jwt-token-${matchedUser.id}`,
            role: matchedUser.role
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.jwt_token = token.jwt_token;
        session.user.id = token.id;
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

export { handler as GET, handler as POST };
