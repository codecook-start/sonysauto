"use client";
import { routes } from "@/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  return (
    <div
      className="absolute left-0 right-0 top-0 z-10 flex items-center py-4"
      style={{
        width: "calc(100% - 4rem)",
        marginInline: "auto",
      }}
    >
      {
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="header"
          style={{
            width: "12rem",
          }}
        />
      }
      <ul className="ml-40 hidden gap-8 text-xs font-semibold text-white lg:flex">
        {routes.map((route) => (
          <li key={route.route}>
            <Link
              href={route.route}
              className="line-clamp-1 cursor-pointer rounded-full border border-transparent px-4 py-2 transition-all hover:border-white/25 hover:shadow hover:backdrop-blur-md"
            >
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="ml-auto flex text-white lg:hidden"
        onClick={() => setShowMenu(!showMenu)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M20 7H4m16 5H4m16 5H4"
          ></path>
        </svg>
      </button>
      {showMenu && (
        <ul
          className="flex cursor-pointer flex-col gap-8 text-xs font-semibold text-white md:hidden"
          style={{
            position: "absolute",
            top: "5rem",
            right: "0",
            left: "0",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          {routes.map((route) => (
            <li
              key={route.route}
              className="cursor-pointer"
              onClick={() => {
                router.push(route.route);
                setShowMenu(false);
              }}
            >
              {route.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Header;
