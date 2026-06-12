import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text", placeholder: "phd_ninja" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch("http://127.0.0.1:1337/api/auth/local", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: credentials?.identifier,
              password: credentials?.password,
            }),
          });
          
          const data = await res.json();
          
          if (res.ok && data.jwt) {
            return {
              id: data.user.id.toString(),
              name: data.user.username,
              email: data.user.email,
              jwt: data.jwt,
              role: "Student", 
              isPro: data.user.isPro || false,
              proValidUntil: data.user.proValidUntil || null,
              proValidFrom: data.user.proValidFrom || null,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.jwt = user.jwt;
        token.isPro = user.isPro;
        token.proValidUntil = user.proValidUntil;
        token.proValidFrom = user.proValidFrom;
      }
      
      // Handle manual session updates
      if (trigger === "update" && session?.isPro !== undefined) {
        token.isPro = session.isPro;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role;
        session.user.isPro = token.isPro;
        session.user.proValidUntil = token.proValidUntil;
        session.user.proValidFrom = token.proValidFrom;
        session.jwt = token.jwt;
      }
      return session;
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
