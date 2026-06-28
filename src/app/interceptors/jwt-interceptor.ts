import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
export const jwtInterceptor: HttpInterceptorFn =
  (req, next) => {

    const token = localStorage.getItem('token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next(req);
  };