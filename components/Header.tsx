"use client";

import { contact, routes, socials } from "@/data";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { MapPin, Phone, Search, User, Loader } from "react-feather";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useAtom } from "jotai";
import { useCars } from "@/hooks/useCars";
import { useQueryClient } from "react-query";
import useAuth from "@/hooks/useAuth";
import { useFilter } from "@/hooks/useFilter";
import { cn } from "@/lib/utils";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const queryClient = useQueryClient();
  const { isRefetching: isCarsRefetching, refetch } = useCars();
  const { resetAll } = useFilter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const handleSearch = async () => {
    await queryClient.invalidateQueries("cars");
    await refetch();
    setShowSearch(false);
  };

  const handleClick = () => {
    resetAll();
  };
  return (
    <nav className="flex flex-col">
      {/* upper */}
      <div className="border-b border-neutral-600 bg-neutral-800 p-4 text-xs text-neutral-300">
        {/* contact */}
        <ul className="container-md flex justify-end gap-2 lg:gap-8">
          {contact.map(
            ({ name, link, icon: Icon, address, timing, number }) => (
              <li
                key={name}
                className={address || timing ? "hidden lg:block" : ""}
              >
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                  onClick={handleClick}
                >
                  <Icon size={"1em"} />
                  {number && <span>{number}</span>}
                  {address && <span>{address}</span>}
                  {timing && <span>{timing}</span>}
                </a>
              </li>
            ),
          )}
          {/* login */}
          <li className="flex gap-4">
            {!isLoading && !isAuthenticated ? (
              <></>
            ) : (
              <>
                <Link
                  shallow
                  href={"/dashboard/create"}
                  className="flex items-center gap-2"
                  onClick={handleClick}
                >
                  <User size={"1em"} />
                  <span>Dashboard</span>
                </Link>
                {/* <Link
                  shallow
                  href={"/caurosal"}
                  className="flex items-center gap-2"
                >
                  <User size={"1em"} />
                  <span>Carousal</span>
                </Link> */}
                <button
                  onClick={logout}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <User size={"1em"} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </li>
        </ul>
      </div>
      {/* middle */}
      <div className="bg-black">
        <div className="container-md flex items-center justify-between py-2 text-white lg:py-4">
          {/* logo */}
          <Link shallow href={"/"} onClick={handleClick}>
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/logo.png" alt="header" className="w-32 lg:w-40" />
            }
          </Link>
          {/* address, phone, social */}
          <div className="hidden items-center gap-4 text-xs font-semibold lg:flex">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
              onClick={handleClick}
            >
              <div className="rounded-full border-2 border-blue-600 p-2">
                <MapPin size={"1em"} color="#2563eb" strokeWidth={4} />
              </div>
              <span>
                P O Box 844, George Town, Grand
                <br /> Cayman, Cayman Islands.
              </span>
            </a>
            <a
              href="tel:1234567890"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2"
              onClick={handleClick}
            >
              <div className="rounded-full border-2 border-blue-600 p-2">
                <Phone size={"1em"} color="#2563eb" strokeWidth={4} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-blue-500">Sales</span>
                <span className="text-sm">123-456-7890</span>
              </div>
            </a>
            <div className="flex h-min gap-2">
              {socials.map(({ name, link, icon: Icon }) => (
                <a
                  key={name}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-neutral-800 p-2 transition-colors hover:bg-neutral-600"
                  onClick={handleClick}
                >
                  <Icon size={"1em"} />
                </a>
              ))}
            </div>
          </div>
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
                top: "6rem",
                right: "0",
                left: "0",
                zIndex: 10,
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
      </div>
      {/* lower */}
      <div className="container-md-mx flex items-center justify-between text-xs font-semibold">
        <div className="hidden flex-1 items-center justify-between lg:flex">
          {/* tabs */}
          <ul className="flex gap-2">
            {routes.map(({ name, route }) => {
              const isActive = pathname === route;
              return (
                <li key={name}>
                  <Link
                    shallow
                    className={cn(
                      "my-2 flex whitespace-nowrap rounded px-4 py-3 hover:bg-black/50 hover:text-white",
                      isActive && "bg-blue-500 text-white hover:bg-blue-500",
                    )}
                    href={route}
                    onClick={handleClick}
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="right flex items-center gap-4">
            <Link
              shallow
              href={"/compare"}
              className="flex items-center px-4 py-3 hover:bg-gray-100"
              onClick={handleClick}
            >
              Compare
            </Link>
          </div>
        </div>
        {/* search */}
        {!showSearch ? (
          <Button
            onClick={() => setShowSearch(!showSearch)}
            variant={"ghost"}
            className="ml-auto hover:bg-transparent"
          >
            {pagination.search && isCarsRefetching ? (
              <Loader className="animate-spin text-gray-500" />
            ) : (
              <Search />
            )}
          </Button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-1 items-center"
          >
            <Input
              placeholder="Search"
              className="my-2 flex-1"
              value={pagination.search || ""}
              onChange={(e) =>
                setPagination({
                  ...pagination,
                  search: e.target.value,
                })
              }
            />
            <Button
              type="submit"
              variant={"ghost"}
              className="ml-auto hover:bg-transparent"
            >
              {pagination.search && isCarsRefetching ? (
                <Loader className="animate-spin text-gray-500" />
              ) : (
                <Search />
              )}
            </Button>
          </form>
        )}
      </div>
    </nav>
  );
};

export default Header;
