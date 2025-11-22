import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { stockAdjustmentsApi } from "@/api/operations";
import type { StockAdjustment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Calendar, MapPin, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

export default function AdjustmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [adjustment, setAdjustment] = useState<StockAdjustment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAdjustment = async () => {
      try {
        const data = await stockAdjustmentsApi.getStockAdjustments();
        const foundAdjustment = data.find((a) => a.id === id);
        setAdjustment(foundAdjustment || null);
      } catch (error) {
        console.error("Failed to load adjustment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadAdjustment();
    }
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (!adjustment) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Adjustment Not Found</h2>
          <p className="text-muted-foreground mb-4">The stock adjustment you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/operations/adjustments")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Adjustments
          </Button>
        </div>
      </AppLayout>
    );
  }

  const isIncrease = adjustment.difference > 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/operations/adjustments")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{adjustment.referenceNo}</h1>
              <p className="text-muted-foreground">Stock Adjustment Details</p>
            </div>
          </div>
          <StatusBadge status={adjustment.status} />
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="text-lg font-semibold">{adjustment.productName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-lg font-semibold">{adjustment.warehouseName}</p>
                  <p className="text-xs text-muted-foreground">{adjustment.locationName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adjustment Date</p>
                  <p className="text-lg font-semibold">
                    {format(new Date(adjustment.date), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={isIncrease ? "border-green-500/20" : "border-red-500/20"}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${isIncrease ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  {isIncrease ? (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Difference</p>
                  <p className={`text-2xl font-bold ${isIncrease ? "text-green-600" : "text-red-600"}`}>
                    {adjustment.difference > 0 ? "+" : ""}{adjustment.difference}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Stock Count Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">System Quantity</p>
                <p className="text-3xl font-bold">{adjustment.systemQuantity}</p>
                <p className="text-xs text-muted-foreground">Expected stock level</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Counted Quantity</p>
                <p className="text-3xl font-bold">{adjustment.countedQuantity}</p>
                <p className="text-xs text-muted-foreground">Actual stock level</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Difference</p>
                <p className={`text-3xl font-bold ${isIncrease ? "text-green-600" : "text-red-600"}`}>
                  {adjustment.difference > 0 ? "+" : ""}{adjustment.difference}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isIncrease ? "Stock increased" : "Stock decreased"}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Adjustment Type:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isIncrease 
                    ? "bg-green-500/10 text-green-700" 
                    : "bg-red-500/10 text-red-700"
                }`}>
                  {isIncrease ? "Stock Increase" : "Stock Decrease"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Reason:</span>
                <span className="text-sm font-semibold">{adjustment.reason}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid gap-4 md:grid-cols-2">
          {adjustment.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{adjustment.notes}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created At:</span>
                <span className="font-medium">
                  {format(new Date(adjustment.createdAt), "MMM dd, yyyy HH:mm")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                  {format(new Date(adjustment.updatedAt), "MMM dd, yyyy HH:mm")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Document ID:</span>
                <span className="font-mono text-sm">{adjustment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warehouse ID:</span>
                <span className="font-mono text-sm">{adjustment.warehouseId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location ID:</span>
                <span className="font-mono text-sm">{adjustment.locationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product ID:</span>
                <span className="font-mono text-sm">{adjustment.productId}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
