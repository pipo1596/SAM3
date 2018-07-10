import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { enableProdMode } from '@angular/core';
import { JsonService } from './utilities/json.service';
import { CanDeactivateGuard } from './utilities/confirmroute';
import { AppRoutingModule } from './/app-routing.module';
import { PagerService } from './_services/index';

import { AppComponent }     from './app.component';
import { HeaderComponent }  from './header/header.component';
import { FooterComponent }  from './footer/footer.component';
import { LoginComponent }   from './login/login.component';
import { Login1Component }  from './login1/login1.component';
import { HomeComponent }    from './home/home.component';
import { UsersComponent }   from './users/users.component';
import { RolesComponent }   from './roles/roles.component';
import { Quote1Component }  from './quote1/quote1.component';
import { Quote2Component }  from './quote2/quote2.component';
import { GlobalFiltersComponent } from './globalfilters/globalfilters.component';
import { PacksComponent } from './packs/packs.component';
import { ContracttypesComponent } from './contracttypes/contracttypes.component';
import { TaxrateComponent } from './taxrate/taxrate.component';
import { Quote3Component } from './quote3/quote3.component';
import { ContractComponent } from './contract/contract.component';
import { DescoverrideComponent } from './descoverride/descoverride.component';
import { SavedquotesComponent } from './savedquotes/savedquotes.component';
import { DealermasterComponent } from './dealermaster/dealermaster.component';
import { UnremittedComponent } from './unremitted/unremitted.component';
import { RemittedComponent } from './remitted/remitted.component';
import { ProcessedComponent } from './processed/processed.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { StatementComponent } from './statement/statement.component';
import { ClaimsComponent } from './claims/claims.component';
import { RepairsComponent } from './repairs/repairs.component';
import { CancellationsComponent } from './cancellations/cancellations.component';


enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    Login1Component,
    HomeComponent,
    UsersComponent,
    RolesComponent,
    GlobalFiltersComponent,
    Quote1Component,
    Quote2Component,
    PacksComponent,
    ContracttypesComponent,
    TaxrateComponent,
    Quote3Component,
    ContractComponent,
    DescoverrideComponent,
    SavedquotesComponent,
    UnremittedComponent,
    RemittedComponent,
    ProcessedComponent,
    InvoicesComponent,
    StatementComponent,
    ClaimsComponent,
    RepairsComponent,
    CancellationsComponent,
    DealermasterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [JsonService,
              CanDeactivateGuard,
              PagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
