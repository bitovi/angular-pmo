import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ItemTotalPipe } from './shared/item-total.pipe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    importProvidersFrom(TabsModule.forRoot()),
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'USD' },
    ItemTotalPipe,
  ],
};
