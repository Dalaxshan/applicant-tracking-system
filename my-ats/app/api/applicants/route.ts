// app/api/applicants/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const sort = searchParams.get("sort");

  let applicants = await prisma.applicant.findMany();

  // Client-side-like filtering (fine for take-home)
  if (search) {
    applicants = applicants.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.skills.toLowerCase().includes(search)
    );
  }

  if (sort === "experience") {
    applicants.sort((a, b) => b.experience - a.experience);
  }

  return NextResponse.json(applicants);
}

export async function POST(request: Request) {
  const body = await request.json();
  const applicant = await prisma.applicant.create({
    data: {
      name: body.name,
      email: body.email,
      skills: body.skills,
      experience: Number(body.experience),
      notes: body.notes || null,
      status: body.status || "New",
    },
  });
  return NextResponse.json(applicant, { status: 201 });
}
