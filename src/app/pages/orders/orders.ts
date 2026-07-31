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

  // ==========================================
  // COLORS
  // ==========================================

const primary: [number, number, number] = [37, 99, 235];
const dark: [number, number, number] = [30, 41, 59];
const gray: [number, number, number] = [100, 116, 139];
const light: [number, number, number] = [248, 250, 252];
const green: [number, number, number] = [22, 163, 74];

  // ==========================================
  // HEADER
  // ==========================================

  doc.setFillColor(
    primary[0],
    primary[1],
    primary[2]
  );

doc.rect(
0,
0,
210,
46,
"F"
);

  doc.setTextColor(255,255,255);

  doc.setFont("helvetica","bold");

  doc.setFontSize(26);

  doc.text(
    "SHOPSPHERE",
    14,
    16
  );

  doc.setFontSize(11);

  doc.setFont("helvetica","normal");

  doc.text(
    "Premium Online Shopping Platform",
    14,
    24
  );

  doc.text(
    "GSTIN : 33ABCDE1234F1Z5",
    14,
    30
  );

  doc.text(
    "support@shopsphere.com",
    14,
    35
  );

  doc.text(
    "www.shopsphere.com",
    14,
    40
  );

  // ==========================================
  // INVOICE DETAILS
  // ==========================================

  doc.setFont("helvetica","bold");

  doc.setFontSize(22);

 doc.text("INVOICE", 150, 16);

  doc.setFontSize(11);

  doc.setFont("helvetica","normal");

 doc.text(`Invoice No : INV-${order.orderID}`,140,24);

  doc.text(`Order ID : ${order.orderID}`,140,30);

  doc.text(
    `Date : ${new Date(order.orderDate).toLocaleDateString()}`,
    140,
    36
  );

  // ==========================================
  // BILL TO BOX
  // ==========================================

  doc.setDrawColor(220);

doc.roundedRect(14,50,88,32,3,3);

  doc.setFont("helvetica","bold");

  doc.setFontSize(12);

  doc.setTextColor(
    dark[0],
    dark[1],
    dark[2]
  );

  doc.text(
    "Bill To",
    18,
    58
  );

  doc.setFont("helvetica","normal");

  doc.setFontSize(11);

  doc.text(
    order.customerName || "Customer",
    18,
    66
  );

  doc.text(
    order.customerEmail || "",
    18,
    73
  );

  doc.text(
    "India",
    18,
    80
  );

  // ==========================================
  // SHIPPING ADDRESS
  // ==========================================

  doc.roundedRect(108,50,88,32,3,3);

  doc.setFont("helvetica","bold");

  doc.text(
    "Shipping Address",
    112,
    58
  );

  doc.setFont("helvetica","normal");

  doc.text(
    order.customerName || "Customer",
    112,
    66
  );

  doc.text(
    order.customerEmail || "",
    112,
    73
  );

  doc.text(
    "India",
    112,
    80
  );

  // ==========================================
  // PRODUCT TABLE
  // ==========================================

  const rows = order.orderDetails.map(
    (item:any)=>[

      item.productName,

      item.quantity,

      `Rs. ${item.price}`,

      "18%",

      `Rs. ${item.quantity * item.price}`

    ]
  );

  autoTable(doc,{

    startY:90,

    head:[[
      "Product",
      "Qty",
      "Unit Price",
      "GST",
      "Total"
    ]],

    body:rows,

    theme:"grid",

    styles:{
      fontSize:10,
      halign:"center",
      valign:"middle"
    },

    headStyles:{
      fillColor: [37, 99, 235],
      textColor:255,
      fontStyle:"bold"
    },

    alternateRowStyles:{
      fillColor: [248, 250, 252],
    },
    columnStyles: {

  0: {
    halign: "left"
  },

  1: {
    halign: "center"
  },

  2: {
    halign: "center"
  },

  3: {
    halign: "center"
  },

  4: {
    halign: "center"
  }

},
  });

  // ==========================================
  // SUMMARY VALUES
  // ==========================================

  const finalY =
    (doc as any).lastAutoTable.finalY + 15;

  const subtotal = order.totalAmount;

  const discount = 0;

  const gst = +(subtotal * 0.18).toFixed(2);

  const shipping = 0;

  const grandTotal =
    subtotal -
    discount +
    gst +
    shipping;
      // ==========================================
  // SUMMARY BOX
  // ==========================================

  doc.setDrawColor(220);

doc.roundedRect(
118,
finalY,
78,
60,
3,
3
);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(13);

  doc.setTextColor(
    dark[0],
    dark[1],
    dark[2]
  );

 doc.text(
"SUMMARY",
157,
finalY+8,
{
align:"center"
}
);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(11);

  doc.text(
    `Subtotal`,
    123,
    finalY + 18
  );

  doc.text(
    `Rs. ${subtotal.toFixed(2)}`,
    193,
    finalY + 18,
    { align: "right" }
  );

  doc.text(
    `Discount`,
    123,
    finalY + 26
  );

  doc.text(
    `Rs. ${discount.toFixed(2)}`,
    193,
    finalY + 26,
    { align: "right" }
  );

  doc.text(
    `GST (18%)`,
    123,
    finalY + 34
  );

  doc.text(
    `Rs. ${gst.toFixed(2)}`,
    193,
    finalY + 34,
    { align: "right" }
  );

  doc.text(
    `Shipping`,
    123,
    finalY + 42
  );

  doc.text(
    "FREE",
    193,
    finalY + 42,
    { align: "right" }
  );

  doc.setDrawColor(180);

  doc.line(
    124,
    finalY + 46,
    192,
    finalY + 46
  );

  doc.setFont("helvetica", "bold");

  doc.setFontSize(12);

  doc.text(
    "Grand Total",
    123,
    finalY + 56
  );

  doc.text(
    `Rs. ${grandTotal.toFixed(2)}`,
    193,
    finalY + 56,
    { align: "right" }
  );

  // ==========================================
  // PAID BADGE
  // ==========================================

  doc.setFillColor(
    green[0],
    green[1],
    green[2]
  );

 doc.roundedRect(
140,
finalY+66,
28,
9,
3,
3,
"F"
);

  doc.setTextColor(255,255,255);

  doc.setFont("helvetica","bold");

  doc.setFontSize(11);

doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.setTextColor(255, 255, 255);

doc.text(
  "PAID",
  154,
  finalY + 72,
  {
    align: "center"
  }
);

  // ==========================================
  // FOOTER
  // ==========================================

  doc.setTextColor(
    gray[0],
    gray[1],
    gray[2]
  );

  doc.setFont("helvetica","normal");

  doc.setFontSize(10);

  doc.line(
    14,
    245,
    196,
    245
  );

doc.setFont("helvetica", "normal");
doc.setFontSize(10);

const pageWidth = doc.internal.pageSize.getWidth();

doc.text(
  "Thank you for shopping with ShopSphere",
  pageWidth / 2,
  262,
  { align: "center" }
);

doc.text(
  "support@shopsphere.com",
  pageWidth / 2,
  270,
  { align: "center" }
);

doc.text(
  "www.shopsphere.com",
  pageWidth / 2,
  277,
  { align: "center" }
);

  

  doc.save(
    `Invoice_${order.orderID}.pdf`
  );

}
}