import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { authenticatedApiRequest } from "@/lib/auth";

// Order type definition
interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  status: "pending" | "verified" | "ordered";
  createdAt: string;
  updatedAt: string;
  // Add more fields as needed
}

export default function OrdersManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  // Fetch all orders
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/pending"],
    queryFn: async () => {
      const response = await authenticatedApiRequest("GET", "http://31.97.41.27:5000/api/orders/pending");
      return await response.json();
    },
  });

  // Mutation to update order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await authenticatedApiRequest(
        "PATCH",
        `http://31.97.41.27:5000/api/orders/pending/${id}`,
        { status }
      );
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated.",
      });
      setSelectedOrder(null);
      setNewStatus("");
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update order",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (order: Order, status: string) => {
    setSelectedOrder(order);
    setNewStatus(status);
  };

  const handleUpdate = () => {
    if (selectedOrder && newStatus && selectedOrder.status === "pending") {
      updateOrderStatus.mutate({ id: selectedOrder.id, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Orders Management</CardTitle>
          <p className="text-muted-foreground text-sm">
            Update order status from <b>pending</b> to <b>verified</b> or <b>ordered</b>. Once changed, it cannot be changed again.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading orders...</p>
          ) : !orders || orders.length === 0 ? (
            <p className="text-muted-foreground">No orders found.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(-10).reverse().map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium">Order #{order.orderNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.customerName} &middot; {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Change update-products status color to blue for ordered, yellow for pending, green for verified */}
                    <span className={`text-xs font-bold ${order.status === "pending" ? "text-yellow-500" : order.status === "verified" ? "text-green-500" : "text-blue-500"}`}>
                      {order.status.toUpperCase()}
                    </span>
                    {order.status === "pending" ? (
                      <Select
                        value={selectedOrder?.id === order.id ? newStatus : ""}
                        onValueChange={(value) => handleStatusChange(order, value)}
                      >
                        <SelectTrigger className="bg-input border-border focus:border-primary w-32">
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="ordered">Ordered</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs text-gray-400">Locked</span>
                    )}
                    {selectedOrder?.id === order.id && newStatus && order.status === "pending" && (
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={handleUpdate}
                        disabled={updateOrderStatus.isPending}
                      >
                        {updateOrderStatus.isPending ? "Updating..." : "Update"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
