import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/prisma/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== 'SUPPLIER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dishes = await prisma.dish.findMany({
      where: {
        supplierId: session.user.id
      }
    })

    return NextResponse.json(dishes)
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
