import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { apiFetch } from "./apiFetch";

export interface CreateInventoryLocationRequest {
  name: string;
  description?: string;
}

export interface UpdateInventoryLocationRequest {
  _id: string;
  name: string;
  description?: string;
}

export const inventoryLocationApi = {
  getAll: (): Promise<InventoryLocationDocument[]> =>
    apiFetch<InventoryLocationDocument[]>("/api/inventorylocation"),

  getById: (id: string): Promise<InventoryLocationDocument> =>
    apiFetch<InventoryLocationDocument>(`/api/inventorylocation/${id}`),

  create: (body: CreateInventoryLocationRequest) =>
    apiFetch<string>("/api/inventorylocation", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (body: UpdateInventoryLocationRequest) =>
    apiFetch<InventoryLocationDocument>("/api/inventorylocation", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id: string): Promise<string> =>
    apiFetch<string>(`/api/inventorylocation/${id}`, {
      method: "DELETE",
    }),
};
