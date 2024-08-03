import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { tokenInterceptor } from './cartapp/pages/auth/token.interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimations(), MessageService, provideHttpClient(
    withInterceptors([tokenInterceptor])
  )]
};
