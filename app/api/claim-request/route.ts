import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/prisma/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== 'SUPPLIER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const claimRequests = await prisma.claimRequest.findMany({
      where: {
        dish: {
          supplierId: session.user.id
        },
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        dish: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(claimRequests)
  } catch (error) {
    console.error('Error fetching claim requests:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
