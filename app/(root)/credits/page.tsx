import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FlaskConical, Zap, Diamond, Check, X, Lock } from "lucide-react";

import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import Checkout from "@/components/shared/Checkout";
import { Show } from "@clerk/nextjs";

const Credits = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  const IconMap = {
    FlaskConical: FlaskConical,
    Zap: Zap,
    Diamond: Diamond,
  };

  return (
    <>
      <Header
        title="Supercharge Your Workflow"
        subtitle="Purchase credits to unlock high-speed generations, advanced models, and commercial usage rights."
      />

      <section className="mt-10">
        <ul className="credits-list">
          {plans.map((plan, index) => {
            const Icon = IconMap[plan.icon as keyof typeof IconMap];

            return (
              <li
                key={plan.name}
                className={`credits-item relative p-8 rounded-[24px] border border-white/5 bg-[#0f1115]  transition-all  group ${
                  plan.name === "Pro"
                    ? "border-purple-500/50 ring-1 ring-purple-500/20"
                    : ""
                }`}
              >
                {plan.name === "Pro" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-1.5 rounded-full text-white text-[10px] font-bold tracking-widest uppercase shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-purple-500/30 transition-colors">
                    <Icon className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-400 text-sm">
                        / {plan.duration}
                      </span>
                    </div>
                    <p className="text-[#a1a1aa] text-sm mt-2 font-medium uppercase tracking-wider">
                      {plan.subTitle}
                    </p>
                  </div>

                  {/* Inclusions */}
                  <ul className="flex flex-col gap-4 py-4 border-t border-white/5">
                    {plan.inclusions.map((inclusion) => (
                      <li
                        key={plan.name + inclusion.label}
                        className="flex items-center gap-3"
                      >
                        {inclusion.isIncluded ? (
                          <Check className="w-4 h-4 text-purple-400" />
                        ) : (
                          <X className="w-4 h-4 text-gray-600" />
                        )}
                        <p
                          className={`text-sm ${inclusion.isIncluded ? "text-gray-300" : "text-gray-600"}`}
                        >
                          {inclusion.label}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {plan.name === "Starter" ? (
                      <Button
                        variant="outline"
                        className="w-full py-6 rounded-xl border border-white/5 bg-[#0f1115] text-white transition-all"
                      >
                        Current Plan
                      </Button>
                    ) : (
                      <Show when="signed-in">
                        <Checkout
                          plan={plan.name}
                          amount={plan.price}
                          credits={plan.credits}
                          buyerId={user._id}
                        />
                      </Show>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 flex items-center justify-center gap-2 text-[#71717a] text-sm font-mono tracking-tight">
          <Lock className="w-3 h-3" />
          <span>Secure payment powered by Stripe</span>
        </div>
      </section>
    </>
  );
};

export default Credits;
