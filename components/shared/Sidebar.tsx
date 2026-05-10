"use client";
import { navLinks } from "@/constants";
import { Show, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <Link href="/" className="sidebar-logo">
          <Image
            src="/assets/images/logo-text.png"
            width={250}
            height={22}
            alt="logo"
          />
        </Link>

        <nav className="sidebar-nav">
          <Show when="signed-in">
            <ul className="sidebar-nav_elements">
              {navLinks.slice(0, 6).map((link, index) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={cn(
                      "sidebar-nav_element group animate-slide-up",
                      `stagger-${index + 1}`,
                      isActive
                        ? "bg-[#868CFF] text-[#111319]"
                        : "text-white/70",
                    )}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt={link.label}
                        width={20}
                        height={20}
                        className={cn(
                          !isActive && "brightness-200 invert opacity-70",
                        )}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="sidebar-nav_elements border-t border-white/10 pt-4 mt-4">
              {navLinks.slice(6).map((link, index) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={cn(
                      "sidebar-nav_element group animate-slide-up",
                      `stagger-${index + 1}`,
                      isActive
                        ? "bg-[#868CFF] text-[#111319]"
                        : "text-white/70",
                    )}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt={link.label}
                        width={20}
                        height={20}
                        className={cn(
                          !isActive && "brightness-200 invert opacity-70",
                        )}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton showName={true} />
              </li>
            </ul>
          </Show>

          <Show when="signed-out">
            <Button asChild className="button bg-purple-gradient bg-cover ">
              <Link href="/sign-in">Login</Link>
            </Button>
          </Show>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
