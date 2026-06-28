import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders
  implements OnInit, OnDestroy {
    environment = environment;
  orders: any[] = [];
  private refreshInterval: any;

constructor(
  private orderService: OrderService,
  private toastr: ToastrService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {

  this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => {

      if (this.router.url === '/orders') {

        this.loadOrders();

      }

    });

}

  ngOnInit(): void {

    const token =
      localStorage.getItem('token');

    if (token) {
      this.loadOrders();
    }
  }

 loadOrders(): void {

  this.orderService
    .getMyOrders()
    .subscribe({

      next: (res: any) => {

        console.log('Orders:', res);

        this.orders = [...res];
        this.cdr.detectChanges();

      },

      error: (err) => {

        console.log(err);

      }

    });

}

  cancelOrder(id: number): void {

    this.orderService
      .cancelOrder(id)
      .subscribe({

        next: () => {

          this.toastr.success(
            'Order cancelled successfully'
          );

          this.loadOrders();
        },

        error: (err) => {

          console.log(err);

          this.toastr.error(
            err.error
          );
        }
      });
  }

  ngOnDestroy(): void {

    if (this.refreshInterval) {
      clearInterval(
        this.refreshInterval
      );
    }
  }

 downloadInvoice(order: any): void {

  const doc = new jsPDF();

  // ==========================
  // HEADER
  // ==========================

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("SHOPSPHERE", 14, 18);

  doc.setFontSize(11);
  doc.text("Premium Online Shopping", 14, 27);

  // ==========================
  // INVOICE TITLE
  // ==========================

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(22);
  doc.text("INVOICE", 150, 18);

  doc.setFontSize(11);

  doc.text(
    `Invoice No : INV-${order.orderID}`,
    145,
    27
  );

  // ==========================
  // CUSTOMER DETAILS
  // ==========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text("Bill To", 14, 48);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(11);

  doc.text(
    order.customerName || "Customer",
    14,
    58
  );

  doc.text(
    order.customerEmail || "",
    14,
    66
  );

  // ==========================
  // ORDER DETAILS
  // ==========================

  doc.setFont("helvetica", "bold");

  doc.text("Order Details", 125, 48);

  doc.setFont("helvetica", "normal");

  doc.text(
    `Order ID : ${order.orderID}`,
    125,
    58
  );

  doc.text(
    `Order Date : ${new Date(order.orderDate).toLocaleDateString()}`,
    125,
    66
  );

  doc.text(
    `Status : ${order.status}`,
    125,
    74
  );

  doc.text(
    `Payment : Paid`,
    125,
    82
  );

  // ==========================
  // PRODUCT TABLE
  // ==========================

  const rows = order.orderDetails.map((item: any) => [

    item.productName,

    item.quantity,

    `Rs. ${item.price}`,

    `Rs. ${item.quantity * item.price}`

  ]);

  autoTable(doc, {

    startY: 95,

    head: [[

      "Product",

      "Quantity",

      "Unit Price",

      "Total"

    ]],

    body: rows,

    theme: "grid",

    headStyles: {

      fillColor: [37, 99, 235],

      textColor: 255,

      fontStyle: "bold",

      halign: "center"

    },

    bodyStyles: {

      halign: "center"

    },

    alternateRowStyles: {

      fillColor: [245, 247, 250]

    }

  });

  // ==========================
  // TOTALS
  // ==========================

  const finalY =
    (doc as any).lastAutoTable.finalY + 15;

  const subtotal = order.totalAmount;

  const gst = +(subtotal * 0.18).toFixed(2);

  const shipping = 0;

  const grandTotal = subtotal + gst + shipping;

  doc.setFont("helvetica", "bold");

  doc.text(
    `Subtotal : Rs. ${subtotal}`,
    135,
    finalY
  );

  doc.text(
   `GST (18%) : Rs. ${gst}`,
    135,
    finalY + 10
  );

  doc.text(
    `Shipping : FREE`,
    135,
    finalY + 20
  );

  doc.setDrawColor(180);

  doc.line(
    130,
    finalY + 24,
    196,
    finalY + 24
  );

  doc.setFontSize(14);

  doc.text(
   `Grand Total : Rs. ${grandTotal}`,
    130,
    finalY + 35
  );

  // ==========================
  // FOOTER
  // ==========================

  doc.setFontSize(10);

  doc.setTextColor(100);

  doc.text(

    "Thank you for shopping with ShopSphere.",

    14,

    275

  );

  doc.text(

    "For support contact: support@shopsphere.com",

    14,

    282

  );

  doc.text(

    "www.shopsphere.com",

    14,

    289

  );

  doc.save(
    `Invoice_${order.orderID}.pdf`
  );

}

}