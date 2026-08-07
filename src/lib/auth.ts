import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { loginSchema } from "@/modules/auth/schemas"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email, deletedAt: null },
          include: {
            memberships: {
              orderBy: { createdAt: "asc" },
              take: 1,
            },
          },
        })

        if (!user) return null

        const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!passwordMatches) return null

        const membership = user.memberships[0]
        if (!membership) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          organizationId: membership.organizationId,
          role: membership.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.organizationId = user.organizationId
        token.role = user.role
      }
      return token
    },
    session: ({ session, token }) => {
      session.user.id = token.sub as string
      session.user.organizationId = token.organizationId as string
      session.user.role = token.role as "ADMIN" | "MEMBER"
      return session
    },
  },
})
