// Mock operations API
import {
  mockReceipts,
  mockDeliveryOrders,
  mockInternalTransfers,
  mockStockAdjustments,
  mockStockMovements,
} from "./mockData";
import type {
  Receipt,
  DeliveryOrder,
  InternalTransfer,
  StockAdjustment,
  StockMovement,
  DocumentStatus,
} from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let receipts = [...mockReceipts];
let deliveryOrders = [...mockDeliveryOrders];
let internalTransfers = [...mockInternalTransfers];
let stockAdjustments = [...mockStockAdjustments];
let stockMovements = [...mockStockMovements];

// Generate reference number
const generateRefNo = (prefix: string): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${year}-${random}`;
};

// RECEIPTS
export const receiptsApi = {
  async getReceipts(filters?: { status?: DocumentStatus; warehouseId?: string }): Promise<Receipt[]> {
    await delay(400);
    let filtered = [...receipts];
    
    if (filters?.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }
    if (filters?.warehouseId) {
      filtered = filtered.filter((r) => r.warehouseId === filters.warehouseId);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getReceipt(id: string): Promise<Receipt> {
    await delay(300);
    const receipt = receipts.find((r) => r.id === id);
    if (!receipt) throw new Error("Receipt not found");
    return receipt;
  },

  async createReceipt(data: Omit<Receipt, "id" | "referenceNo" | "createdAt" | "updatedAt">): Promise<Receipt> {
    await delay(600);
    const newReceipt: Receipt = {
      ...data,
      id: `rec-${Date.now()}`,
      referenceNo: generateRefNo("REC"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    receipts.push(newReceipt);
    return newReceipt;
  },

  async updateReceipt(id: string, data: Partial<Receipt>): Promise<Receipt> {
    await delay(500);
    const index = receipts.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Receipt not found");
    
    receipts[index] = { ...receipts[index], ...data, updatedAt: new Date().toISOString() };
    return receipts[index];
  },

  async deleteReceipt(id: string): Promise<void> {
    await delay(400);
    const index = receipts.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Receipt not found");
    receipts.splice(index, 1);
  },
};

// DELIVERY ORDERS
export const deliveryOrdersApi = {
  async getDeliveryOrders(filters?: { status?: DocumentStatus; warehouseId?: string }): Promise<DeliveryOrder[]> {
    await delay(400);
    let filtered = [...deliveryOrders];
    
    if (filters?.status) {
      filtered = filtered.filter((d) => d.status === filters.status);
    }
    if (filters?.warehouseId) {
      filtered = filtered.filter((d) => d.warehouseId === filters.warehouseId);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getDeliveryOrder(id: string): Promise<DeliveryOrder> {
    await delay(300);
    const order = deliveryOrders.find((d) => d.id === id);
    if (!order) throw new Error("Delivery order not found");
    return order;
  },

  async createDeliveryOrder(data: Omit<DeliveryOrder, "id" | "referenceNo" | "createdAt" | "updatedAt">): Promise<DeliveryOrder> {
    await delay(600);
    const newOrder: DeliveryOrder = {
      ...data,
      id: `del-${Date.now()}`,
      referenceNo: generateRefNo("DEL"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    deliveryOrders.push(newOrder);
    return newOrder;
  },

  async updateDeliveryOrder(id: string, data: Partial<DeliveryOrder>): Promise<DeliveryOrder> {
    await delay(500);
    const index = deliveryOrders.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Delivery order not found");
    
    deliveryOrders[index] = { ...deliveryOrders[index], ...data, updatedAt: new Date().toISOString() };
    return deliveryOrders[index];
  },

  async deleteDeliveryOrder(id: string): Promise<void> {
    await delay(400);
    const index = deliveryOrders.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Delivery order not found");
    deliveryOrders.splice(index, 1);
  },
};

// INTERNAL TRANSFERS
export const internalTransfersApi = {
  async getInternalTransfers(filters?: { status?: DocumentStatus }): Promise<InternalTransfer[]> {
    await delay(400);
    let filtered = [...internalTransfers];
    
    if (filters?.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getInternalTransfer(id: string): Promise<InternalTransfer> {
    await delay(300);
    const transfer = internalTransfers.find((t) => t.id === id);
    if (!transfer) throw new Error("Transfer not found");
    return transfer;
  },

  async createInternalTransfer(data: Omit<InternalTransfer, "id" | "referenceNo" | "createdAt" | "updatedAt">): Promise<InternalTransfer> {
    await delay(600);
    const newTransfer: InternalTransfer = {
      ...data,
      id: `trf-${Date.now()}`,
      referenceNo: generateRefNo("TRF"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    internalTransfers.push(newTransfer);
    return newTransfer;
  },

  async updateInternalTransfer(id: string, data: Partial<InternalTransfer>): Promise<InternalTransfer> {
    await delay(500);
    const index = internalTransfers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Transfer not found");
    
    internalTransfers[index] = { ...internalTransfers[index], ...data, updatedAt: new Date().toISOString() };
    return internalTransfers[index];
  },

  async deleteInternalTransfer(id: string): Promise<void> {
    await delay(400);
    const index = internalTransfers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Transfer not found");
    internalTransfers.splice(index, 1);
  },
};

// STOCK ADJUSTMENTS
export const stockAdjustmentsApi = {
  async getStockAdjustments(filters?: { status?: DocumentStatus; warehouseId?: string }): Promise<StockAdjustment[]> {
    await delay(400);
    let filtered = [...stockAdjustments];
    
    if (filters?.status) {
      filtered = filtered.filter((a) => a.status === filters.status);
    }
    if (filters?.warehouseId) {
      filtered = filtered.filter((a) => a.warehouseId === filters.warehouseId);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getStockAdjustment(id: string): Promise<StockAdjustment> {
    await delay(300);
    const adjustment = stockAdjustments.find((a) => a.id === id);
    if (!adjustment) throw new Error("Adjustment not found");
    return adjustment;
  },

  async createStockAdjustment(data: Omit<StockAdjustment, "id" | "referenceNo" | "createdAt" | "updatedAt">): Promise<StockAdjustment> {
    await delay(600);
    const newAdjustment: StockAdjustment = {
      ...data,
      id: `adj-${Date.now()}`,
      referenceNo: generateRefNo("ADJ"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stockAdjustments.push(newAdjustment);
    return newAdjustment;
  },

  async updateStockAdjustment(id: string, data: Partial<StockAdjustment>): Promise<StockAdjustment> {
    await delay(500);
    const index = stockAdjustments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Adjustment not found");
    
    stockAdjustments[index] = { ...stockAdjustments[index], ...data, updatedAt: new Date().toISOString() };
    return stockAdjustments[index];
  },

  async deleteStockAdjustment(id: string): Promise<void> {
    await delay(400);
    const index = stockAdjustments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Adjustment not found");
    stockAdjustments.splice(index, 1);
  },
};

// STOCK MOVEMENTS (LEDGER)
export const stockMovementsApi = {
  async getStockMovements(filters?: {
    productId?: string;
    warehouseId?: string;
    movementType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<StockMovement[]> {
    await delay(400);
    let filtered = [...stockMovements];
    
    if (filters?.productId) {
      filtered = filtered.filter((m) => m.productId === filters.productId);
    }
    if (filters?.warehouseId) {
      filtered = filtered.filter((m) => m.warehouseId === filters.warehouseId);
    }
    if (filters?.movementType) {
      filtered = filtered.filter((m) => m.movementType === filters.movementType);
    }
    if (filters?.startDate) {
      filtered = filtered.filter((m) => new Date(m.timestamp) >= new Date(filters.startDate!));
    }
    if (filters?.endDate) {
      filtered = filtered.filter((m) => new Date(m.timestamp) <= new Date(filters.endDate!));
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
};
