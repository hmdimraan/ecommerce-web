import { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),

    provideAnimations(),

    provideToastr({

  positionClass: 'toast-top-right',

  timeOut: 10000,

  closeButton: true,

  progressBar: true,

  progressAnimation: 'increasing',

  tapToDismiss: true,

  newestOnTop: true,

  preventDuplicates: false,

  easeTime: 300,

  extendedTimeOut: 1000
})// ✅ REQUIRED FOR TOASTR SERVICE
  ]
};