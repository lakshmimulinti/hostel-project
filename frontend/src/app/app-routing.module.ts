import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from './components/login-form/login-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListingsComponent } from './components/listings/listings.component';

import { PaymentPageComponent } from './components/payment-page/payment-page.component';
import { FaqPageComponent } from './components/faq-page/faq-page.component';

const routes: Routes = [
  {
    path:'',
    component:LoginFormComponent
  },
  {
    path:'dashboard',
    component:DashboardComponent
  },
  { 
    path: 'listings', 
    component: ListingsComponent 
  },
  {
    path: 'payment',
    component: PaymentPageComponent
  },
  {
    path: 'faqs',
    component: FaqPageComponent
  },
  {
    path:'**',
    redirectTo:''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }