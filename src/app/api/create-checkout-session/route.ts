import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const { items } = await req.json();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.itemName,
            },
            unit_amount: Math.round(item.costPerUnit * 100),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/canceled`,
      });

      return NextResponse.json({ id: session.id });
    } catch (err: any) {
      return NextResponse.json({ statusCode: 500, message: err.message });
    }
  } else {
    return NextResponse.json({ statusCode: 405, message: "Method Not Allowed" });
  }
}
