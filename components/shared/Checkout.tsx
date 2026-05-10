"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import { ShoppingCart } from "lucide-react";

import { toast } from "sonner";
import { checkoutCredits } from "@/lib/actions/transaction.actions";

import { Button } from "../ui/button";

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast.success("Order placed!", {
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
      });
    }

    if (query.get("canceled")) {
      toast.error("Order canceled!", {
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
        className: "error-toast",
      });
    }
  }, []);

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    await checkoutCredits(transaction);
  };

  return (
    <form action={onCheckout}>
      <section>
        <Button
          type="submit"
          role="link"
          className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Buy Credits
        </Button>
      </section>
    </form>
  );
};

export default Checkout;

