// app/api/applicants/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const applicant = await prisma.applicant.update({
    where: { id: Number(params.id) },
    data: { status: body.status },
  });
  return NextResponse.json(applicant);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.applicant.delete({
    where: { id: Number(params.id) },
  });
  return new NextResponse(null, { status: 204 });
}