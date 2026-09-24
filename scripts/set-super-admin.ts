import "./load-env";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = "hhifzy@gmail.com";
  console.log(`Checking user with email: ${email}`);
  
  let user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });

  if (!user) {
    // Try case-insensitive search or any variant
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, isAdmin: true },
    });
    console.log("All existing users:", allUsers);
    
    user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) as any;
  }

  if (user) {
    console.log(`Found user: ${user.email} (id: ${user.id}, current isAdmin: ${user.isAdmin})`);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        isAdmin: true,
      },
    });
    console.log(`Updated user ${updated.email} to isAdmin: true!`);
  } else {
    console.log(`User ${email} does not exist yet. Creating new admin user placeholder...`);
    const created = await prisma.user.create({
      data: {
        email: email,
        name: "Hifzy (Super Admin)",
        isAdmin: true,
      },
    });
    console.log(`Created admin user: ${created.email} (id: ${created.id}, isAdmin: true)`);
  }

  // Also check if there is an exact case HHifzy@gmail.com
  const users = await prisma.user.findMany({
    where: { isAdmin: true },
    select: { id: true, email: true, name: true, isAdmin: true },
  });
  console.log("Current admin users in database:", users);
}

main()
  .catch((err) => {
    console.error("Error setting admin:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
