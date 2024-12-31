"use client";

import React, { useState } from "react";
import { useCart } from "@/components/lib/cart-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { loadStripe } from "@stripe/stripe-js";
import { Cart } from "@/components/Cart";

// Make sure to replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function PlaceOrderDrawer() {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const totalAmount = cart.reduce((total, item) => total + item.quantity * item.costPerUnit, 0);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cart }),
    });

    const session = await response.json();

    const result = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // Handle any errors from Stripe
      console.error(result.error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Place Order</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Order</SheetTitle>
          <SheetDescription>Review your items and place your order.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <Cart />
          <Button className="w-full" onClick={handleCheckout}>
            Proceed to Checkout (${totalAmount.toFixed(2)})
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
