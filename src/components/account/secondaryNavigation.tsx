"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SecondaryNavigationItem } from "@/types/customer/types";
import { signOut } from "next-auth/react";
import Swal from "sweetalert2";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SecondaryNavigationProps {
  navigationItems: SecondaryNavigationItem[];
  setCurrent: Dispatch<SetStateAction<string>>;
}

const SecondaryNavigation: React.FC<SecondaryNavigationProps> = ({
  navigationItems,
  setCurrent,
}) => {
  const [currentRoute, setCurrentRoute] = useState<string>("General");

  return (
    <>
      <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul
            role="list"
            className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col select-none"
          >
            {navigationItems.map((item) => (
              <li key={item.name}>
                <div
                  onClick={() => {
                    setCurrentRoute(item.name);
                    setCurrent(item.name);
                  }}
                  className={classNames(
                    currentRoute === item.name
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                    "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm/6 font-semibold",
                  )}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    aria-hidden="true"
                    className={classNames(
                      currentRoute === item.name
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-indigo-600",
                      "size-6 shrink-0 pt-1",
                    )}
                  />
                  {item.name}
                </div>
              </li>
            ))}
            <li
              key="logout"
              className={`hover:bg-gray-50 rounded-md hover:text-indigo-600 select-none`}
            >
              <div
                onClick={async () =>
                  await Swal.fire({
                    title: "Sign Out",
                    text: "Are you sure you want to sign out?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sign Out",
                    confirmButtonColor: "#DC2626",
                    cancelButtonText: "Cancel",
                    cancelButtonColor: "#374151",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      signOut();
                    }
                  })
                }
                className="text-gray-700 hover:text-indigo-600 group flex gap-x-3 py-2 pl-2 pr-3 text-sm/6 font-semibold"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className={`text-gray-400 size-6 shrink-0 group-hover:text-indigo-600 pt-1`}
                />
                Sign Out
              </div>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SecondaryNavigation;
