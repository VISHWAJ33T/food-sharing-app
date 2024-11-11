import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/prisma/prisma'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })

        if (!user || user.password !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType
        }
      }
    })
  ],
  callbacks: {
    async session({ session, user, token }: any) {
      if (token) {
        session.user = {
          id: token?.id,
          userType: token?.userType,
          address: token?.address
        }
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }: any) {
      //console.log('jwt', user, account, profile, isNewUser)
      if (user) {
        token.id = user.id
        token.userType = user.userType
      }
      return token
    }
  },
  pages: {
    signIn: '/login'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
