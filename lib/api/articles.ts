// lib/api/articles.ts

import { PopulatedArticleDocument } from "@/components/context/ArticleProvider";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { apiFetch } from "./apiFetch";
import { Types } from "mongoose";

type UpdateMode = "set" | "add" | "remove";

interface UpdateQuantityRequest {
  articleId: string;
  updateMode: UpdateMode;
  enteredQty: number;
  newLocationId?: string;
  cause?: string;
  pricePerUnit?: number;
  comment?: string;
}

interface UpdateQuantityResult {
  articleId: string;
  previousQty: number;
  qty: number;
  quantityChange: number;
  direction: "+" | "-";
  price?: number;
  inventoryLocation: InventoryLocationDocument;
}

interface MoveArticleRequest {
  articleId: string;
  newLocationId: string;
}

interface DeleteArticleResult {
  message: string;
}

export interface UpdateArticleRequest {
  _id: string;
  supplierArtno?: string;
  vehicleModels: string[];
  title: string;
  description?: string;
  condition: string;
  purchaseValue?: number | "";
  forSale: boolean;
  price?: number | "";
  comment?: string;
  images: string[];
}

interface CreateArticleRequest {
  supplierArtno?: string;
  vehicleModels: string[];
  title: string;
  description?: string;
  qty: number;
  condition: string;
  forSale: boolean;
  price?: number;
  inventoryLocation: string;
  images: string[];
  purchaseValue?: number;
  comment?: string;
}
interface CreateArticleResult {
  articleId: string;
}

export const articleApi = {
  getAll: (): Promise<PopulatedArticleDocument[]> =>
    apiFetch<PopulatedArticleDocument[]>("/api/article"),

  getById: (id: string): Promise<PopulatedArticleDocument> =>
    apiFetch<PopulatedArticleDocument>(`/api/article/${id}`),

  update: (article: UpdateArticleRequest): Promise<PopulatedArticleDocument> =>
    apiFetch<PopulatedArticleDocument>("/api/article", {
      method: "PUT",
      body: JSON.stringify(article),
    }),

  updateQuantity: (
    body: UpdateQuantityRequest,
  ): Promise<UpdateQuantityResult> =>
    apiFetch<UpdateQuantityResult>("/api/article/quantity", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  move: (body: MoveArticleRequest): Promise<PopulatedArticleDocument> =>
    apiFetch<PopulatedArticleDocument>("/api/article/move", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: async (id: string): Promise<DeleteArticleResult> => {
    const message = await apiFetch<string>(`/api/article/${id}`, {
      method: "DELETE",
    });

    return { message };
  },
  create: async (body: CreateArticleRequest): Promise<CreateArticleResult> => {
    const articleId = await apiFetch<string>("/api/article", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return { articleId };
  },
};
