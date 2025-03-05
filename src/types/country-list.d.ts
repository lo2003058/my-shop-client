declare module "country-list" {
  /**
   * Returns the ISO 3166-1 alpha-2 country code for a given country name.
   *
   * @param name - The country name (e.g., "United States", "Canada")
   * @returns The corresponding ISO 3166-1 alpha-2 code, or undefined if not found.
   */
  export function getCode(name: string): string | undefined;

  /**
   * Returns the country name for a given ISO 3166-1 alpha-2 code.
   *
   * @param code - The ISO 3166-1 alpha-2 code.
   * @returns The country name, or undefined if not found.
   */
  export function getName(code: string): string | undefined;
}
