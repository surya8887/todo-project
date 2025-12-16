import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { connectDB } from "@/app/lib/db"
import User from "@/app/models/User"
import bcrypt from "bcryptjs"

/**
 * NextAuth configuration
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        await connectDB()

        if (!credentials?.email || !credentials.password) return null

        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.password) return null

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isMatch) return null

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      await connectDB()

      if (account?.provider === "google") {
        const exists = await User.findOne({ email: user.email })

        if (!exists) {
          await User.create({
            name: user.name,
            email: user.email,
            provider: "google",
          })
        }
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
