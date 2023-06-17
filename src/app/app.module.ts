import { BrowserModule } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VexModule } from '../@vex/vex.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomLayoutModule } from './layout/custom-layout/custom-layout.module';

import localePe from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';

// Register the localization
registerLocaleData(localePe, 'es-PE');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Vex
    VexModule,
    CustomLayoutModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-PE'
     },
     {
       provide: DEFAULT_CURRENCY_CODE,
       useValue: 'PEN'
     },
     {
       provide: HTTP_INTERCEPTORS,
       useClass: JwtInterceptor,
       multi: true
     }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
