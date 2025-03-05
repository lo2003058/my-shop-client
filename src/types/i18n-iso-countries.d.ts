declare module 'i18n-iso-countries' {
  export interface I18nCountriesLocale {
    locale: string;
    countries: { [alpha2: string]: string };
  }

  export function getAlpha2Code(name: string, lang: string): string | undefined;
  export function registerLocale(locale: I18nCountriesLocale): void;
}
