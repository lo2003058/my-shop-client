import { SecondaryNavigationItem } from "@/types/customer/types";
import {
  faAddressBook,
  faBox,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const secondaryNavigation: SecondaryNavigationItem[] = [
  {
    name: "General",
    href: "/account",
    icon: faUser,
  },
  // {
  //   name: "Order",
  //   href: "/order",
  //   icon: faBox,
  // },
  {
    name: "Address",
    href: "/account/address",
    icon: faAddressBook,
  },
  {
    name: "Wishlist",
    href: "/account/wishlist",
    icon: faHeart,
  },
];

export const secondaryNavigationRoute = secondaryNavigation;
