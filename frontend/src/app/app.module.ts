import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- Add this

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ListingsComponent } from './components/listings/listings.component';
import { PaymentPageComponent } from './components/payment-page/payment-page.component';
import { FaqPageComponent } from './components/faq-page/faq-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    DashboardComponent,
    ListingsComponent,
    PaymentPageComponent,
    FaqPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,   // <-- Add this
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,

    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 2000,
      closeButton: true,
      progressBar: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }