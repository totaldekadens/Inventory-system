import { IconX } from "@tabler/icons-react";
import SearchBar from "./searchbars/SearchBarTransactionHistory";
import TableHistory from "./tables/TableHistory";
import { Dispatch, SetStateAction } from "react";
import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";

interface Props {
  history: {
    setFilteredObjectList: Dispatch<
      SetStateAction<TransactionHistoryDocument[]>
    >;
    listOfObjects: TransactionHistoryDocument[];
    history: TransactionHistoryDocument[];
  };
  setState: Dispatch<SetStateAction<boolean>>;
}

const OverviewHistory = ({ history, setState }: Props) => {
  return (
    <div className="p-6">
      <div className=" w-full flex justify-between items-center mb-6 md:mb-4">
        <h3 className="text-3xl font-normal leading-6 text-custom-300 ">
          Transaktionshistorik
        </h3>
        <div className="flex md:hidden justify-end">
          <IconX
            className="cursor-pointer"
            width={32}
            height={32}
            onClick={() => {
              setState(false);
            }}
          />
        </div>
      </div>
      {/* Searchbars and filter */}
      <SearchBar
        setFilteredObjectList={history.setFilteredObjectList}
        listOfObjects={history.listOfObjects}
        history={history.history}
      />
      <TableHistory history={history.listOfObjects} />
    </div>
  );
};

export default OverviewHistory;
