import { AppComponent } from './app/app.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { provideHttpClient } from '@angular/common/http';
import { ROUTES } from './app/routes';
import { bootstrapApplication } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, importProvidersFrom } from '@angular/core';
import { ItemTotalPipe } from './app/shared/item-total.pipe';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(ROUTES),
    importProvidersFrom(TabsModule.forRoot()),
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'USD' },
    ItemTotalPipe,
  ],
}).catch((err) => console.error(err));
