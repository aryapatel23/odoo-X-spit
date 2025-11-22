import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { dashboardApi } from "@/api/dashboard";
import { receiptsApi, deliveryOrdersApi, stockMovementsApi } from "@/api/operations";
import { productsApi } from "@/api/products";
import type { DashboardKPIs, Product, Receipt, DeliveryOrder, StockMovement } from "@/types";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [recentOperations, setRecentOperations] = useState<StockMovement[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [kpisData, movements, products] = await Promise.all([
          dashboardApi.getDashboardKPIs(),
          stockMovementsApi.getStockMovements(),
          productsApi.getProducts(),
        ]);

        setKpis(kpisData);
        setRecentOperations(movements.slice(0, 10));
        
        const lowStock = products.filter(
          (p) => p.totalStock > 0 && p.reorderLevel && p.totalStock <= p.reorderLevel
        );
        const outOfStock = products.filter((p) => p.totalStock === 0);
        setLowStockProducts([...outOfStock, ...lowStock]);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your inventory operations</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KPICard
            title="Total Products"
            value={kpis?.totalProducts || 0}
            icon={Package}
            onClick={() => navigate("/products")}
          />
          <KPICard
            title="Low Stock Items"
            value={kpis?.lowStockItems || 0}
            icon={AlertTriangle}
            onClick={() => navigate("/products")}
          />
          <KPICard
            title="Out of Stock"
            value={kpis?.outOfStockItems || 0}
            icon={AlertCircle}
            onClick={() => navigate("/products")}
          />
          <KPICard
            title="Pending Receipts"
            value={kpis?.pendingReceipts || 0}
            icon={ArrowDownToLine}
            onClick={() => navigate("/operations/receipts")}
          />
          <KPICard
            title="Pending Deliveries"
            value={kpis?.pendingDeliveries || 0}
            icon={ArrowUpFromLine}
            onClick={() => navigate("/operations/deliveries")}
          />
          <KPICard
            title="Scheduled Transfers"
            value={kpis?.scheduledTransfers || 0}
            icon={ArrowLeftRight}
            onClick={() => navigate("/operations/transfers")}
          />
        </div>

        {/* Recent Operations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOperations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent operations</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>From/To</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Warehouse</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOperations.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(movement.timestamp), "MMM dd, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{movement.movementType}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{movement.productName}</p>
                            <p className="text-xs text-muted-foreground">{movement.productSku}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {movement.fromLocation && (
                              <p className="text-muted-foreground">From: {movement.fromLocation}</p>
                            )}
                            {movement.toLocation && (
                              <p>To: {movement.toLocation}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={movement.quantityChange > 0 ? "text-success" : "text-destructive"}>
                            {movement.quantityChange > 0 ? "+" : ""}{movement.quantityChange}
                          </span>
                        </TableCell>
                        <TableCell>{movement.warehouseName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        {lowStockProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Items Needing Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Reorder Level</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">{product.totalStock}</TableCell>
                        <TableCell className="text-right">{product.reorderLevel || "-"}</TableCell>
                        <TableCell>
                          {product.totalStock === 0 ? (
                            <span className="inline-flex items-center gap-1 text-destructive">
                              <AlertCircle className="h-4 w-4" />
                              Out of Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-warning">
                              <AlertTriangle className="h-4 w-4" />
                              Low Stock
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
