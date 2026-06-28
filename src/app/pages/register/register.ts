import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterModel } from '../../models/register.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,
  RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
environment = environment;
registerData: RegisterModel = {

  name: '',

  email: '',

  password: '',

  phone: '',

  address: ''

};

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onRegister() {

    this.authService
      .register(this.registerData)
      .subscribe({

        next: () => {

          this.toastr.success('Registration Successful');

          this.router.navigate(
            ['/login']
          );
        },

        error: (err) => {
  console.log(err);
  console.log(err.error);

  alert(JSON.stringify(err.error));

  this.toastr.error('Registration Failed');
}
      });
  }
}