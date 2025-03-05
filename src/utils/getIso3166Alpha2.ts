import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

export const getIso3166Alpha2 = (country: string): string | undefined => {
  return countries.getAlpha2Code(country, 'en');
};
