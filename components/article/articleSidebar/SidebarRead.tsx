import { IconEdit } from "@tabler/icons-react";
import { articleContext } from "../../context/ArticleProvider";
import { Dispatch, SetStateAction, useContext } from "react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/formatDate";

interface ItemInfoProps {
  name: string;
  value: string | number;
  className?: string;
}

const ItemInfo = ({ name, value }: ItemInfoProps) => (
  <div>
    <div className=" font-medium text-gray-900 mt-4 lg:mt-8  ">{name}</div>
    <div className="text-gray-900/80">{value}</div>
  </div>
);

const ItemInfoSmall = ({ name, value, className }: ItemInfoProps) => (
  <div className={clsx(`grid grid-cols-2`, className)}>
    <p className=" tracking-tight text-gray-900/80">{name}</p>
    <p> {value} </p>
  </div>
);

interface Props {
  className?: string;
  setEdit: Dispatch<SetStateAction<boolean>>;
}
const SidebarRead = ({ className, setEdit }: Props) => {
  const { currentArticle } = useContext(articleContext);
  if (!currentArticle) return;
  return (
    <aside className={className} style={{ maxWidth: "600px" }}>
      <div className="flex justify-end">
        <div>
          <Button
            onClick={() => setEdit(true)}
            variant="modest"
            className="flex gap-2 items-center"
          >
            <IconEdit className="cursor-pointer" />
            Redigera artikel
          </Button>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            {currentArticle.title}
          </h1>
          <p className="text-lg font-medium tracking-tight text-gray-900/70 ">
            {currentArticle.supplierArtno}
          </p>
        </div>
      </div>
      <div className="flex justify-between flex-wrap">
        <ItemInfo name="Skick" value={currentArticle.condition} />
        <ItemInfo name="Plats" value={currentArticle.inventoryLocation.name} />
        <ItemInfo name="Antal" value={currentArticle.qty} />
      </div>
      <ItemInfo
        name="Beskrivning"
        value={
          currentArticle.description
            ? currentArticle.description
            : "Ingen beskrivning"
        }
      />

      <div className="mt-4 lg:row-span-3 lg:mt-8">
        <div className="w-full flex justify-between">
          <div className=" font-medium text-gray-900 mt-2 ">
            Mer information
          </div>
        </div>
        <ItemInfoSmall name="Art.no" value={currentArticle.artno} />
        <ItemInfoSmall
          name="Lev. art. no: "
          value={
            currentArticle.supplierArtno ? currentArticle.supplierArtno : "-"
          }
        />
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">
            {currentArticle.vehicleModels?.length > 1
              ? "Fordonsmodeller: "
              : "Fordonsmodell: "}
          </p>
          <div>
            {currentArticle.vehicleModels?.map((model, i) => (
              <p key={i} className=" ">
                {model.name}
              </p>
            ))}
          </div>
        </div>
        <ItemInfoSmall
          name="Inköpspris:"
          value={
            currentArticle.purchaseValue
              ? currentArticle.purchaseValue + " kr/st (inkl. moms)"
              : "-"
          }
        />
        <ItemInfoSmall
          name="Försäljningspris:"
          value={
            currentArticle.price
              ? currentArticle.price + " kr/st (inkl. moms)"
              : "-"
          }
        />

        <ItemInfoSmall
          name="Övrig kommentar:"
          value={currentArticle.comment ? currentArticle.comment : "-"}
        />
        <ItemInfoSmall
          name="Senast uppdaterad:"
          value={formatDate(currentArticle.lastUpdated)}
        />

        {/* For sale */}
        <div>
          <div className=" font-medium text-gray-900 mt-4 lg:mt-8">Säljas?</div>
          <div className="text-gray-900/80">
            {currentArticle.forSale ? "Ja" : "Nej"}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarRead;
