"use server";

import { Prisma, PrismaClient } from "@prisma/client";
import { auth, signIn } from "../../auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Initialize PrismaClient
const prisma = new PrismaClient();

export const loginSignup = async (formData: FormData, isLogin: boolean) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { isAdmin: true },
  });

  const res = await signIn("credentials", {
    name,
    email,
    password,
    isLogin,
    redirect: true,
    callbackUrl: "/",
  })
    .then(() => {
      redirect("/");
    })
    .catch((err) => {
      if (err?.toString() == "Error: NEXT_REDIRECT") {
        user?.isAdmin ? redirect("/dashboard") : redirect("/");
      } else return { error: err?.type };
    });

  if (!isLogin && res?.error) {
    return { error: "credentials already exists" };
  } else {
    return { error: "wrong credentials" };
  }
};

export const updateUser = async (id: string, userId: string, isAdmin: boolean) => {
  let inventory;
  try {
    inventory = await prisma.inventory.update({
      where: { id },
      data: { userId },
    });

    if (!inventory) {
      return { error: "failed to transfer" };
    }
  } catch (error) {
    return { error: "failed to transfer" };
  }

  revalidatePath(`${isAdmin ? "/dashboard" : "/"}`);
  return inventory;
};

export const updateUserRole = async (formData: FormData, isAdmin: boolean, data: any) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }
  const checkEmail = await prisma.user.findUnique({ where: { email } });
  if (!checkEmail) return { error: "User not found" };

  let user;
  try {
    user = await prisma.user.update({
      where: { id: data?.id },
      data: { name, email, password, isAdmin },
    });
    if (!user) {
      return { error: "User not updated" };
    }
  } catch (error) {
    return { error: "User not updated" };
  }

  revalidatePath(`/dashboard/clients`);
  return user;
};

export const addUpdateInventory = async (formData: FormData, data: any) => {
  const session = await auth();

  const itemName = formData.get("itemName") as string;
  const quantityInput = formData.get("quantity") as string;
  const costPerUnit = parseFloat(formData.get("costPerUnit") as string);
  const supplierBrand = formData.get("supplierBrand") as string;
  const reorderLevelInput = formData.get("reorderLevel") as string;
  const expirationDate = formData.get("expirationDate") as string;

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  if (!itemName || !quantityInput || isNaN(costPerUnit) || !supplierBrand) {
    return { error: "All fields are required except Expiration Date" };
  }

  let inventory;
  try {
    const inventoryData = {
      itemName,
      quantity: quantityInput,
      costPerUnit,
      supplierBrand,
      reorderLevel: reorderLevelInput,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      userId: user?.id || undefined,
    };

    if (data?.id) {
      inventory = await prisma.inventory.update({
        where: { id: data?.id },
        data: inventoryData,
      });
    } else {
      inventory = await prisma.inventory.create({
        data: inventoryData,
      });
    }
    if (!inventory) {
      return { error: "Failed to create/update inventory" };
    }
  } catch (error) {
    console.error("Error creating/updating inventory:", error);
    return { error: "Failed to create/update inventory" };
  }

  revalidatePath(`/dashboard`);
  return inventory;
};

export const deleteInventory = async (id: string) => {
  try {
    const result = await prisma.inventory.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    if (!result) {
      return { error: "Inventory not deleted" };
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return { error: "Inventory not deleted" };
  }
};

export const makeUserAdmin = async (userId: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: true },
    });
  } catch (error) {
    console.error("Error updating user to admin:", error);
  }
};

export const assignInventoryAccessToUser = async (userId: string, hasAccess: boolean) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        hasInventoryAccess: hasAccess,
      },
    });

    if (!updatedUser) {
      return { error: "Failed to update user access" };
    }

    revalidatePath(`/dashboard`);
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user access:", error);
    return { error: "Failed to update user access" };
  }
};

export const getAssignedInventory = async (userId: string) => {
  try {
    const inventory = await prisma.inventory.findMany({
      where: { userId: userId },
    });
    return inventory;
  } catch (error) {
    console.error("Error fetching assigned inventory:", error);
    return [];
  }
};

export const assignInventoryToUser = async (inventoryId: string, userId: string) => {
  try {
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: { userId },
    });

    return { success: true, inventory: updatedInventory };
  } catch (error) {
    console.error("Error assigning inventory to user:", error);
    return { error: "Failed to assign inventory" };
  }
};
