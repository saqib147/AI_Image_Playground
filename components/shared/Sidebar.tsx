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
            src="/assets/images/logo-text.svg"
            width={182}
            height={28}
            alt="logo"
          />
        </Link>

        <nav className="sidebar-nav">
          <Show when="signed-in">
            <ul className="sidebar-nav_elements">
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={cn(
                      "sidebar-nav_element group",
                      isActive
                        ? "bg-purple-gradient text-white"
                        : "text-gray-700",
                    )}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt={link.label}
                        width={24}
                        height={24}
                        className={cn(isActive && "brightness-200 invert")}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="sidebar-nav_elements">
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={cn(
                      "sidebar-nav_element group",
                      isActive
                        ? "bg-purple-gradient text-white"
                        : "text-gray-700",
                    )}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt={link.label}
                        width={24}
                        height={24}
                        className={cn(isActive && "brightness-200 invert")}
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
