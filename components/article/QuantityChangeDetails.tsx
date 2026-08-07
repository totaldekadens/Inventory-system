import { Dispatch, SetStateAction } from "react";

import Input from "../ui/Input";
import SelectSimple from "../ui/SelectSimple";
import QtyFromZeroNewLocation from "./QtyFromZeroNewLocationField";

import { scrapCauses } from "@/lib/config";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { PopulatedArticleDocument } from "../context/ArticleProvider";

interface Props {
  article: PopulatedArticleDocument;

  isDecrease: boolean;
  requiresNewLocation: boolean;

  selectedCause: string;
  setSelectedCause: Dispatch<SetStateAction<string>>;

  sellPrice: number | "";
  setSellPrice: (value: number | "") => void;
  sellPriceError?: string;

  comment: string;
  setComment: (value: string) => void;

  quantityChange: number;

  selectedLocation: InventoryLocationDocument | null;
  setSelectedLocation: Dispatch<
    SetStateAction<InventoryLocationDocument | null>
  >;

  setError: Dispatch<SetStateAction<string>>;
}

const QuantityChangeDetails = ({
  article,
  isDecrease,
  requiresNewLocation,
  selectedCause,
  setSelectedCause,
  sellPrice,
  setSellPrice,
  sellPriceError,
  comment,
  setComment,
  quantityChange,
  selectedLocation,
  setSelectedLocation,
  setError,
}: Props) => {
  return (
    <>
      {isDecrease && (
        <div className="mt-4">
          <div className="mb-2 font-bold">Anledning till uttag</div>

          <SelectSimple
            value={selectedCause}
            onChange={(value) => {
              setSelectedCause(value);
              setError("");
            }}
            options={scrapCauses}
          />

          {selectedCause === "sold" && (
            <>
              <Input
                id="sellPrice"
                name="sellPrice"
                label="Försäljningspris per enhet"
                type="number"
                min={0}
                value={sellPrice}
                onChange={(event) => {
                  const value = event.target.value;

                  setSellPrice(value === "" ? "" : Number(value));
                  setError("");
                }}
                error={sellPriceError}
                placeholder="Ange försäljningspris"
                suffix="kr/st (inkl. moms)"
                required
                containerClassName="mt-2"
              />

              <p className="mt-2 text-right text-sm">
                Totalt försäljningsvärde:{" "}
                <strong>
                  {Number(sellPrice || 0) * Math.abs(quantityChange)} kr
                </strong>
              </p>
            </>
          )}

          <Input
            id="transactionComment"
            name="transactionComment"
            label="Kommentar"
            type="text"
            value={comment}
            containerClassName="mt-2"
            onChange={(event) => {
              setComment(event.target.value);
            }}
            placeholder="Ange en kommentar till uttaget"
          />
        </div>
      )}

      {requiresNewLocation && (
        <QtyFromZeroNewLocation
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          article={article}
          setError={setError}
        />
      )}
    </>
  );
};

export default QuantityChangeDetails;
