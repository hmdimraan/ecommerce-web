export interface OrderItem {
  productID: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderID: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  orderDetails: OrderItem[];
}