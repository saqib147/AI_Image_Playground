import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

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

  return (
    <>
      <Header
        title="Buy Credits"
        subtitle="Choose a credit package that suits your needs!"
      />

      <section>
        <ul className="credits-list">
          {plans.map((plan, index) => (
            <li
              key={plan.name}
              className={`credits-item relative stagger-${index + 1} ${
                plan.name === "Pro Package"
                  ? "border-purple-400/40 ring-2 ring-purple-400/20"
                  : ""
              }`}
            >
              {plan.name === "Pro Package" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-gradient bg-cover px-4 py-1 rounded-full text-white text-xs font-semibold shadow-md shadow-purple-400/30">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="p-20-semibold mt-2 text-purple-500">
                  {plan.name}
                </p>
                <p className="h1-semibold text-dark-600">${plan.price}</p>
                <p className="p-16-regular">{plan.credits} Credits</p>
              </div>

              {/* Inclusions */}
              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li
                    key={plan.name + inclusion.label}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="p-16-regular">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button variant="outline" className="credits-btn">
                  Free Consumable
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
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Credits;
