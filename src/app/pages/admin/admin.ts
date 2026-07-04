import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  api = environment.apiUrl;

  orders: any[] = [];

  // Filter dropdown
  selectedStatus = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadOrders();

  }

  loadOrders(): void {

    this.http
      .get<any[]>(`${this.api}/orders/all`)
      .subscribe({

        next: (res) => {

          this.orders = res.map(order => ({

            ...order,

           
            selectedStatus: ''

          }));

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.log(err);

          this.toastr.error('Failed To Load Orders');

        }

      });

  }

  updateStatus(
    id: number,
    status: string
  ): void {

    if (!status) {

      this.toastr.warning('Please Select A Status');

      return;

    }

    this.http
      .put(
        `${this.api}/orders/${id}/status?status=${status}`,
        {}
      )
      .subscribe({

        next: () => {

          this.toastr.success('Status Updated Successfully');

          this.loadOrders();

        },

        error: (err) => {

          console.log(err);

          this.toastr.error('Failed To Update Status');

        }

      });

  }

  get filteredOrders() {

    if (!this.selectedStatus) {

      return this.orders;

    }

    return this.orders.filter(

      order => order.status === this.selectedStatus

    );

  }

}