import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginModel } from '../../models/login.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  environment = environment;
  loginData: LoginModel = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

 onLogin() {

  this.authService.login(this.loginData).subscribe({

   next: (res) => {

  this.authService.saveToken(res.token);

  localStorage.setItem('role', res.role);

  this.toastr.success('Login Successful');

  if (res.role === 'Admin') {
    this.router.navigate(['/admin']);
  }
  else {
    this.router.navigate(['/products']);
  }
},
    error: (err) => {
      console.log(err);
      this.toastr.error('Invalid credentials');
    }

  });

}
}