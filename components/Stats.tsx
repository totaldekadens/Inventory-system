import {
  IconCurrencyKroneSwedish,
  IconPackages,
  IconServer2,
  type Icon,
} from "@tabler/icons-react";
import { useContext } from "react";
import { inventoryLocationContext } from "./context/InventoryLocationProvider";
import {
  articleContext,
  PopulatedArticleDocument,
} from "./context/ArticleProvider";

const formatCurrency = (value: number) => `${value.toLocaleString("sv-SE")} kr`;

const getArticleStats = (articles: PopulatedArticleDocument[]) => {
  return articles.reduce(
    (stats, article) => {
      const qty = Number(article.qty) || 0;
      const salesPrice = Number(article.price) || 0;
      const purchaseValue = Number(article.purchaseValue) || 0;

      return {
        totalQty: stats.totalQty + qty,
        totalSalesValue: stats.totalSalesValue + salesPrice * qty,
        totalPurchaseValue: stats.totalPurchaseValue + purchaseValue * qty,
      };
    },
    {
      totalQty: 0,
      totalSalesValue: 0,
      totalPurchaseValue: 0,
    },
  );
};

const getProductText = (qty: number) => {
  return `${qty} ${qty === 1 ? "produkt" : "produkter"}`;
};

const cardClassName =
  "flex flex-1 w-full sm:w-auto flex-col items-center justify-center gap-4 p-7 text-gray-800";

type StatCardProps = {
  icon: Icon;
  label: string;
  value: string;
};

const StatCard = ({ icon: IconComponent, label, value }: StatCardProps) => {
  return (
    <div className={cardClassName}>
      <IconComponent width={38} height={38} className="text-[#264133]" />
      <p className="text-center">{label}</p>
      <p className="text-center text-xl font-semibold">{value}</p>
    </div>
  );
};

const Stats = () => {
  const { inventoryLocations } = useContext(inventoryLocationContext);
  const { currentArticles, articles } = useContext(articleContext);

  const searchStats = getArticleStats(currentArticles);
  const inventoryStats = getArticleStats(articles);

  return (
    <div>
      {currentArticles.length > 0 && (
        <>
          <h3 className="mb-6 mt-20 text-2xl">Sökresultat i siffror</h3>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
            <StatCard
              icon={IconPackages}
              label="Antal artiklar i sökresultatet"
              value={getProductText(searchStats.totalQty)}
            />

            <StatCard
              icon={IconCurrencyKroneSwedish}
              label="Totalt inköpsvärde"
              value={formatCurrency(searchStats.totalPurchaseValue)}
            />

            <StatCard
              icon={IconCurrencyKroneSwedish}
              label="Totalt försäljningsvärde"
              value={formatCurrency(searchStats.totalSalesValue)}
            />
          </div>
        </>
      )}

      <h3 className="mb-6 mt-20 text-2xl">Lageröversikt</h3>

      <div className="mt-6 flex flex-col flex-wrap items-center gap-6 sm:flex-row">
        <StatCard
          icon={IconPackages}
          label="Totalt antal artiklar"
          value={getProductText(inventoryStats.totalQty)}
        />

        <StatCard
          icon={IconCurrencyKroneSwedish}
          label="Totalt inköpsvärde"
          value={formatCurrency(inventoryStats.totalPurchaseValue)}
        />

        <StatCard
          icon={IconCurrencyKroneSwedish}
          label="Totalt försäljningsvärde"
          value={formatCurrency(inventoryStats.totalSalesValue)}
        />

        <StatCard
          icon={IconServer2}
          label="Antal lagerplatser"
          value={`${inventoryLocations?.length ?? 0} lagerplatser`}
        />
      </div>
    </div>
  );
};

export default Stats;
