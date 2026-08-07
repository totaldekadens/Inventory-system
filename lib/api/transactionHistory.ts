import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";
import { apiFetch } from "./apiFetch";

export interface CreateTransactionHistoryRequest {
  direction: "-" | "+" | "";
  cause?: TransactionHistoryDocument["cause"];
  article: TransactionHistoryDocument["article"];
  qty: number;
  fromLocation?: TransactionHistoryDocument["fromLocation"];
  toLocation?: TransactionHistoryDocument["toLocation"];
  pricePerUnit?: number;
  comment?: string;
  createdDate: Date;
}

export const transactionHistoryApi = {
  getAll: (): Promise<TransactionHistoryDocument[]> =>
    apiFetch<TransactionHistoryDocument[]>("/api/transactionhistory"),

  getByArticleNumber: (
    articleNumber: number,
  ): Promise<TransactionHistoryDocument[]> =>
    apiFetch<TransactionHistoryDocument[]>(
      `/api/transactionhistory/${articleNumber}`,
    ),

  create: (body: CreateTransactionHistoryRequest): Promise<string> =>
    apiFetch<string>("/api/transactionhistory", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
