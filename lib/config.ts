export type StockFilter = "all" | "inStock" | "outOfStock";

export const stockOptions: {
  value: StockFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "Alla",
  },
  {
    value: "inStock",
    label: "Finns i lager",
  },
  {
    value: "outOfStock",
    label: "Finns inte i lager",
  },
];

export type SaleFilter = "all" | "forSale" | "notForSale";

export const saleOptions: {
  value: SaleFilter;
  label: string;
}[] = [
  { value: "all", label: "Alla" },
  { value: "forSale", label: "Till salu" },
  { value: "notForSale", label: "Eget bruk" },
];

export const scrapCauses = [
  { value: "repair", label: "Använd vid reparation" },
  { value: "diff", label: "Diff" },
  { value: "broken", label: "Kastad (trasig)" },
  { value: "surplus", label: "Kastad (överflödig)" },
  { value: "sold", label: "Såld" },
];
