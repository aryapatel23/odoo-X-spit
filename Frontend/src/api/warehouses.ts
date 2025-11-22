// Mock warehouses API
import { mockWarehouses } from "./mockData";
import type { Warehouse } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let warehouses = [...mockWarehouses];

export const warehousesApi = {
  // Get all warehouses
  async getWarehouses(filters?: { isActive?: boolean }): Promise<Warehouse[]> {
    await delay(400);
    
    let filtered = [...warehouses];
    
    if (filters?.isActive !== undefined) {
      filtered = filtered.filter((w) => w.isActive === filters.isActive);
    }
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  },

  // Get warehouse by ID
  async getWarehouse(id: string): Promise<Warehouse> {
    await delay(300);
    
    const warehouse = warehouses.find((w) => w.id === id);
    if (!warehouse) {
      throw new Error("Warehouse not found");
    }
    
    return warehouse;
  },

  // Create warehouse
  async createWarehouse(data: Omit<Warehouse, "id" | "createdAt">): Promise<Warehouse> {
    await delay(600);
    
    const newWarehouse: Warehouse = {
      ...data,
      id: `wh-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    warehouses.push(newWarehouse);
    return newWarehouse;
  },

  // Update warehouse
  async updateWarehouse(id: string, data: Partial<Warehouse>): Promise<Warehouse> {
    await delay(500);
    
    const index = warehouses.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error("Warehouse not found");
    }
    
    warehouses[index] = {
      ...warehouses[index],
      ...data,
    };
    
    return warehouses[index];
  },

  // Delete warehouse
  async deleteWarehouse(id: string): Promise<void> {
    await delay(400);
    
    const index = warehouses.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error("Warehouse not found");
    }
    
    warehouses.splice(index, 1);
  },

  // Archive warehouse (soft delete)
  async archiveWarehouse(id: string): Promise<Warehouse> {
    return this.updateWarehouse(id, { isActive: false });
  },
};
