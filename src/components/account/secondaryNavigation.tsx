"use client";

import React from "react";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SecondaryNavigationItem } from "@/types/customer/types";
import { signOut } from "next-auth/react";
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SecondaryNavigationProps {
  navigationItems: SecondaryNavigationItem[];
}

const SecondaryNavigation: React.FC<SecondaryNavigationProps> = ({
  navigationItems,
}) => {
  return (
    <>
      <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul
            role="list"
            className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
          >
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                    "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm/6 font-semibold",
                  )}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    aria-hidden="true"
                    className={classNames(
                      item.current
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-indigo-600",
                      "size-6 shrink-0 pt-1",
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            ))}
            <li
              key="logout"
              className={`hover:bg-gray-50 rounded-md hover:text-indigo-600`}
            >
              <button
                onClick={() => signOut()}
                className="text-gray-700 hover:text-indigo-600 group flex gap-x-3 py-2 pl-2 pr-3 text-sm/6 font-semibold"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className={`text-gray-400 size-6 shrink-0 group-hover:text-indigo-600 pt-1`}
                />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SecondaryNavigation;
