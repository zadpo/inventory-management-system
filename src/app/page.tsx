import AppBar from "@/components/AppBar";
import AuthDesign from "@/components/AuthDesign";
import { auth } from "../../auth";
import { db } from "@/lib/db";
import ClientComp from "@/components/ClientComp";
import { redirect } from "next/navigation";
import { CartProvider } from "@/components/lib/cart-context";

export default async function Home() {
  const session = await auth();
  if (session) {
    const user = await db.user.findUnique({
      where: { email: session?.user?.email! },
      include: { inventory: true },
    });

    if (user && !user?.isAdmin) {
      return (
        <CartProvider>
          <AppBar />
          <ClientComp user={user} />
        </CartProvider>
      );
    } else if (user && user?.isAdmin) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="">
      <AppBar />
      <AuthDesign />
    </div>
  );
}
