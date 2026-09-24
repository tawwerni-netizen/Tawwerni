import "./load-env";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { COMMUNITY_300 } from "../src/content/community-300";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL مش موجود. حطّه في .env.local الأول.");
  process.exit(1);
}

const tunedUrl =
  url + (url.includes("?") ? "&" : "?") +
  "connectionLimit=5&connectTimeout=15000&acquireTimeout=30000";

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(tunedUrl) });

async function main() {
  console.log(`Starting to seed ${COMMUNITY_300.length} community members and testimonials...`);

  // First ensure a system seed user exists to associate with the testimonials
  const seedUserEmail = "community-seed@tawwerni.com";
  let seedUser = await prisma.user.findUnique({ where: { email: seedUserEmail } });

  if (!seedUser) {
    seedUser = await prisma.user.create({
      data: {
        email: seedUserEmail,
        name: "مجتمع طوّرني",
        isAdmin: false,
      },
    });
    console.log("Created seed community user:", seedUser.id);
  }

  // Count existing
  const existingCount = await prisma.testimonial.count();
  console.log(`Current testimonials in DB: ${existingCount}`);

  let createdCount = 0;
  for (const member of COMMUNITY_300) {
    const existing = await prisma.testimonial.findFirst({
      where: { holderName: member.name },
    });

    if (!existing) {
      await prisma.testimonial.create({
        data: {
          userId: seedUser.id,
          holderName: member.name,
          rating: Math.round(member.rating),
          quote: member.quoteAr,
          status: "approved",
          featured: member.featured,
        },
      });
      createdCount++;
    }
  }

  console.log(`Successfully processed testimonials. Added: ${createdCount}. Total in DB: ${existingCount + createdCount}`);
}

main()
  .catch((e) => {
    console.error("Error seeding community testimonials:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
