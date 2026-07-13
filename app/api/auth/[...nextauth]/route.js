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
              role = "ADMIN";
            } else if (me.roles.includes("subscriber")) {
              // Call ACF fields on user to verify active subscription status
              role = me.acf?.is_active_subscriber ? "VIP_SUBSCRIBER" : "FREE_USER";
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

        // MOCK AUTHENTICATION LOGIC
        const { email, password } = credentials;
        
        // Simple test password for auditing
        if (password !== "dona123") {
          return null;
        }

        if (email === "admin@dona.com") {
          return {
            id: "usr-admin-1",
            name: "Nora Patrius",
            email: "admin@dona.com",
            jwt_token: "mock-jwt-token-admin-12345",
            role: "ADMIN"
          };
        } else if (email === "vip@dona.com") {
          return {
            id: "usr-vip-2",
            name: "Hélène de Ségur",
            email: "vip@dona.com",
            jwt_token: "mock-jwt-token-vip-67890",
            role: "VIP_SUBSCRIBER"
          };
        } else if (email === "free@dona.com") {
          return {
            id: "usr-free-3",
            name: "Claire Martin",
            email: "free@dona.com",
            jwt_token: "mock-jwt-token-free-abcde",
            role: "FREE_USER"
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
