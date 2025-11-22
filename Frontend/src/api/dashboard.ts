// Mock dashboard API
import { mockProducts, mockReceipts, mockDeliveryOrders, mockInternalTransfers } from "./mockData";
import type { DashboardKPIs } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardApi = {
  // Get dashboard KPIs
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    await delay(500);
    
    const totalProducts = mockProducts.length;
    const lowStockItems = mockProducts.filter(
      (p) => p.totalStock > 0 && p.reorderLevel && p.totalStock <= p.reorderLevel
    ).length;
    const outOfStockItems = mockProducts.filter((p) => p.totalStock === 0).length;
    const pendingReceipts = mockReceipts.filter((r) => r.status === "waiting" || r.status === "draft").length;
    const pendingDeliveries = mockDeliveryOrders.filter((d) => d.status === "waiting" || d.status === "draft").length;
    const scheduledTransfers = mockInternalTransfers.filter((t) => t.status === "waiting" || t.status === "ready").length;
    
    return {
      totalProducts,
      lowStockItems,
      outOfStockItems,
      pendingReceipts,
      pendingDeliveries,
      scheduledTransfers,
    };
  },
};
