import { VehicleDocument } from "@/models/VehicleModel";
import { apiFetch } from "./apiFetch";

export interface CreateVehicleRequest {
  name: string;
}

export interface UpdateVehicleRequest {
  _id: string;
  name: string;
}

export const vehicleApi = {
  getAll: (): Promise<VehicleDocument[]> =>
    apiFetch<VehicleDocument[]>("/api/vehicle"),

  getById: (id: string): Promise<VehicleDocument> =>
    apiFetch<VehicleDocument>(`/api/vehicle/${id}`),

  create: (body: CreateVehicleRequest): Promise<string> =>
    apiFetch<string>("/api/vehicle", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (body: UpdateVehicleRequest): Promise<VehicleDocument> =>
    apiFetch<VehicleDocument>("/api/vehicle", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id: string): Promise<string> =>
    apiFetch<string>(`/api/vehicle/${id}`, {
      method: "DELETE",
    }),
};
