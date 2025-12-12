// app/api/applicants/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const sort = searchParams.get('sort');

  try {
    let applicants = await prisma.applicant.findMany();

    // Filter & sort (server-side now – better!)
    if (search) {
      applicants = applicants.filter(
        a =>
          a.name.toLowerCase().includes(search) ||
          a.skills.toLowerCase().includes(search)
      );
    }

    if (sort === 'experience') {
      applicants.sort((a, b) => b.experience - a.experience);
    }

    return NextResponse.json(applicants);
  } catch (error) {
    console.error('Prisma error:', error);
    return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const applicant = await prisma.applicant.create({
      data: {
        name: body.name,
        email: body.email,
        skills: body.skills,
        experience: Number(body.experience),
        notes: body.notes || null,
        status: body.status || 'New',
      },
    });
    return NextResponse.json(applicant, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create applicant' }, { status: 500 });
  }
}