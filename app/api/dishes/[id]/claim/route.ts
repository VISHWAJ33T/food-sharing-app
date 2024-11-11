import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/prisma/prisma'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
      include: { claimRequests: true }
    })

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
    }

    if (dish.claimed) {
      return NextResponse.json(
        { error: 'Dish already claimed' },
        { status: 400 }
      )
    }

    const existingRequest = dish.claimRequests.find(
      request =>
        request.userId === session.user.id && request.status === 'PENDING'
    )

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You have already requested this dish' },
        { status: 400 }
      )
    }

    const claimRequest = await prisma.claimRequest.create({
      data: {
        dishId: params.id,
        userId: session.user.id
      }
    })

    return NextResponse.json(claimRequest)
  } catch (error) {
    console.error('Error requesting dish:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== 'SUPPLIER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { requestId, status } = await request.json()

    const dish = await prisma.dish.findUnique({
      where: { id: params.id },
      include: { supplier: true }
    })

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
    }

    if (dish.supplierId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const claimRequest = await prisma.claimRequest.findUnique({
      where: { id: requestId }
    })

    if (!claimRequest || claimRequest.dishId !== params.id) {
      return NextResponse.json(
        { error: 'Claim request not found' },
        { status: 404 }
      )
    }

    const updatedClaimRequest = await prisma.claimRequest.update({
      where: { id: requestId },
      data: { status }
    })

    if (status === 'APPROVED') {
      await prisma.dish.update({
        where: { id: params.id },
        data: { claimed: true }
      })

      // Reject all other pending requests for this dish
      await prisma.claimRequest.updateMany({
        where: {
          dishId: params.id,
          status: 'PENDING',
          id: { not: requestId }
        },
        data: { status: 'REJECTED' }
      })
    }

    return NextResponse.json(updatedClaimRequest)
  } catch (error) {
    console.error('Error updating claim request:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
