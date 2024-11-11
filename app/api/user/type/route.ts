import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/prisma/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userType } = body

    if (!['SUPPLIER', 'SEEKER'].includes(userType)) {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { userType }
    })

    return NextResponse.json({
      message: 'User type updated successfully',
      userType: updatedUser.userType
    })
  } catch (error) {
    console.error('Error updating user type:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
