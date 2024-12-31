import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateUsers() {
  try {
    const result = await prisma.user.updateMany({
      where: {
        hasInventoryAccess: false,
      },
      data: {
        hasInventoryAccess: false,
      },
    });
  } catch (error) {
    console.error("Error updating users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsers();
