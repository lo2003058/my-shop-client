import { getCode } from "country-list";

/**
 * Returns the ISO 3166-1 alpha-2 country code for a given country name.
 *
 * @param country - The country name (e.g., "United States", "Canada", "France")
 * @returns The corresponding ISO 3166-1 alpha-2 code or undefined if not found.
 */
export const getIso3166Alpha2 = (country: string): string | undefined => {
  return getCode(country);
};
