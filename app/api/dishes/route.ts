import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/prisma/prisma';
import { authOptions } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const showNonVeg = searchParams.get('showNonVeg') === 'true';

  try {
    const dishes = await prisma.dish.findMany({
      where: {
        claimed: false,
        ...(showNonVeg ? {} : { type: 'VEG' }),
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        claimRequests: {
          select: {
            id: true,
            status: true,
            userId: true,
          },
        },
      },
    });
    return NextResponse.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.userType !== 'SUPPLIER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const servings = parseInt(formData.get('servings') as string);
    const type = formData.get('type') as 'VEG' | 'NON_VEG';
    const description = formData.get('description') as string;
    const pickupAddress = formData.get('pickupAddress') as string;
    const supplierId = session.user.id;
    const image = formData.get('image') as File | null;

    let imageUrl = null;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream((error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });
      imageUrl = (result as any).secure_url;
    }

    const dish = await prisma.dish.create({
      data: {
        name,
        servings,
        type,
        description,
        imageUrl,
        pickupAddress,
        supplierId,
      },
    });

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
