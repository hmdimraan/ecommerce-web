import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  environment = environment;
  api = environment.apiUrl;

  totalUsers = 0;
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;

  topProducts: any[] = [];

  chart: Chart | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadDashboard();

  }

  loadDashboard(): void {

    this.http
      .get<any[]>(`${this.api}/admin/top-products`)
      .subscribe({

        next: (res) => {

          this.topProducts = res;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

        }

      });

    this.http
      .get<any>(`${this.api}/admin/stats`)
      .subscribe({

        next: (res) => {

          this.totalUsers = res.totalUsers;
          this.totalProducts = res.totalProducts;
          this.totalOrders = res.totalOrders;
          this.totalRevenue = res.totalRevenue;

          this.cdr.detectChanges();

          setTimeout(() => {

            this.createChart();

          });

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  createChart(): void {

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('revenueChart', {

      type: 'bar',

      data: {

        labels: [
          'Users',
          'Products',
          'Orders'
        ],

        datasets: [
          {
            label: 'System Statistics',

            data: [
              this.totalUsers,
              this.totalProducts,
              this.totalOrders
            ]
          }
        ]

      }

    });

  }

}