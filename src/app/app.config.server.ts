import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { IMAGE_CONFIG } from '@angular/common';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
     { provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
