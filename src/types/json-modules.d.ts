declare module "*.json" {
  const value: {
    locale: string;
    countries: { [alpha2: string]: string };
  };
  export default value;
}
