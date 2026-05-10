"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { Show, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
// import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.png"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>

      <nav className="flex gap-2">
        <Show when="signed-in">
          <UserButton />

          <Sheet>
            <SheetTrigger>
              <Image
                src="/assets/icons/menu.svg"
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64 bg-[#111319] border-l border-white/10 text-white z-1000">
              <>
                <Image
                  src="/assets/images/logo-text.png"
                  alt="logo"
                  width={152}
                  height={23}
                />

                <ul className="header-nav_elements">
                  {navLinks.slice(0, 6).map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li
                        key={link.route}
                        className={cn(
                          "flex w-full whitespace-nowrap rounded-xl transition-all duration-200 hover:bg-white/5",
                          isActive
                            ? "bg-[#868CFF] text-[#111319]"
                            : "text-white/70",
                        )}
                      >
                        <SheetClose asChild>
                          <Link
                            className="sidebar-link cursor-pointer w-full"
                            href={link.route}
                          >
                            <Image
                              src={link.icon}
                              alt="logo"
                              width={24}
                              height={24}
                              className={cn(
                                !isActive && "brightness-200 invert opacity-70",
                              )}
                            />
                            {link.label}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
                <ul className="header-nav_elements border-t border-white/10 pt-4 mt-4">
                  {navLinks.slice(6).map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li
                        key={link.route}
                        className={cn(
                          "flex w-full whitespace-nowrap rounded-xl transition-all duration-200 hover:bg-white/5",
                          isActive
                            ? "bg-[#868CFF] text-[#111319]"
                            : "text-white/70",
                        )}
                      >
                        <SheetClose asChild>
                          <Link
                            className="sidebar-link cursor-pointer w-full"
                            href={link.route}
                          >
                            <Image
                              src={link.icon}
                              alt="logo"
                              width={24}
                              height={24}
                              className={cn(
                                !isActive && "brightness-200 invert opacity-70",
                              )}
                            />
                            {link.label}
                          </Link>
                        </SheetClose>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </Show>

        <Show when="signed-out">
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/sign-in">Login</Link>
          </Button>
        </Show>
      </nav>
    </header>
  );
};

export default MobileNav;
