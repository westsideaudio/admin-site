import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login', // Custom sign-in page
    error: '/auth/error', // Redirect to this page on login failure
  },
  callbacks: {
    async signIn({ user }: { user: { email?: string | null } }) {
      const allowedEmails = process.env.ALLOWED_ADMIN_EMAILS?.split(',') || [];
      if (user.email && allowedEmails.includes(user.email)) {
        return true;
      } else {
        // Redirect to an error page or deny access
        return '/auth/error';
      }
    },
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows full callback URLs
      if (new URL(url).origin === baseUrl) return url
      // Redirect to admin panel on successful login
      return `${baseUrl}/admin`
    }
  }
};