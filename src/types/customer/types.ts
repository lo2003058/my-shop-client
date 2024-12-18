import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface SecondaryNavigationItem {
  name: string;
  href: string;
  current: boolean;
  icon: IconDefinition;
}
