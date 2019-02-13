import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent }  from './header/header.component'; 
import { FooterComponent }  from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


import { JsonService , HtmlService } from './.././utilities/json.service';
import { CanDeactivateGuard } from './.././utilities/confirmroute';
import { AppRoutingModule } from '.././app-routing.module';
import { PagerService } from './.././_services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    RouterModule
    
  ],
  providers: [JsonService,
    HtmlService,
    CanDeactivateGuard,
    PagerService
],
  declarations: [HeaderComponent,
    FooterComponent],
  exports:[HeaderComponent,FooterComponent]
})
export class HeadersModule { }
