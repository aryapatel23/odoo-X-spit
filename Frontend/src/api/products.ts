// Mock products API
import { mockProducts } from "./mockData";
import type { Product } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let products = [...mockProducts];

export const productsApi = {
  // Get all products
  async getProducts(filters?: {
    search?: string;
    category?: string;
    warehouseId?: string;
  }): Promise<Product[]> {
    await delay(500);
    
    let filtered = [...products];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search)
      );
    }
    
    if (filters?.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    
    if (filters?.warehouseId) {
      filtered = filtered.filter((p) =>
        p.stockByLocation.some((s) => s.warehouseId === filters.warehouseId)
      );
    }
    
    return filtered;
  },

  // Get product by ID
  async getProduct(id: string): Promise<Product> {
    await delay(300);
    
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    
    return product;
  },

  // Create product
  async createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt" | "totalStock" | "stockByLocation">): Promise<Product> {
    await delay(600);
    
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      totalStock: 0,
      stockByLocation: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    return newProduct;
  },

  // Update product
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    await delay(600);
    
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return products[index];
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    await delay(400);
    
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    products.splice(index, 1);
  },

  // Get categories
  async getCategories(): Promise<string[]> {
    await delay(200);
    
    const categories = Array.from(new Set(products.map((p) => p.category)));
    return categories.sort();
  },
};
