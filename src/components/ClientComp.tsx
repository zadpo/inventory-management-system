import { db } from "@/lib/db";
import ClientInventory from "./ClientInventory";
import { User, Inventory } from "@prisma/client";

interface ClientCompProps {
  user: User;
}

interface InventoryWithClients extends Inventory {
  clients: { id: string; name: string; email: string }[];
}

const ClientComp = async ({ user }: ClientCompProps) => {
  let assignedInventory: Inventory[] = [];

  if (user.hasInventoryAccess) {
    assignedInventory = await db.inventory.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  const clients = await db.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      isAdmin: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const inventoryWithClients: InventoryWithClients[] = assignedInventory.map((item) => ({
    ...item,
    clients,
  }));

  return <ClientInventory data={inventoryWithClients} />;
};

export default ClientComp;
