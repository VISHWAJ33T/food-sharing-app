import { NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, username, email, phone, address, aadharNo, password } =
      body

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }, { aadharNo }]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        username,
        email,
        phone,
        address,
        aadharNo,
        password, // Storing password in plain text (not recommended for production)
        userType: 'SEEKER' // Default to SEEKER, can be changed later
      }
    })

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
