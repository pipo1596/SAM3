import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { enableProdMode } from '@angular/core';
import { JsonService , HtmlService } from './utilities/json.service';
import { CanDeactivateGuard } from './utilities/confirmroute';
import { AppRoutingModule } from './app-routing.module';
import { PagerService } from './_services';

import { AppComponent }     from './app.component';
import { HeaderComponent }  from './header/header.component'; 
import { FooterComponent }  from './footer/footer.component';
import { LoginComponent }   from './login/login.component';
import { Login1Component }  from './login1/login1.component';
import { ForgotPasswordComponent }  from './forgotpassword/forgotpassword.component';
import { HomeComponent }    from './home/home.component';
import { UsersComponent }   from './users/users.component';
import { RolesComponent }   from './roles/roles.component';
import { Quote1Component }  from './quote1/quote1.component';
import { Quote2Component }  from './quote2/quote2.component';
import { GlobalFiltersComponent } from './globalfilters/globalfilters.component';
import { CovsequenceComponent } from './covsequence/covsequence.component';
import { UniversalfiltersComponent } from './universalfilters/universalfilters.component';
import { LienholdersComponent } from './lienholders/lienholders.component';
import { Lienholders2Component } from './lienholders2/lienholders2.component';
import { PaymentmethodsComponent } from './paymentmethods/paymentmethods.component';
import { PacksComponent } from './packs/packs.component';
import { ContracttypesComponent } from './contracttypes/contracttypes.component';
import { TaxrateComponent } from './taxrate/taxrate.component';
import { InvoicePaymentComponent } from './invoicepayment/invoicepayment.component';
import { DefaultsComponent } from './defaults/defaults.component';
import { ClaimsFormComponent } from './claimsform/claimsform.component';
import { Quote3Component } from './quote3/quote3.component';
import { ContractComponent } from './contract/contract.component';
import { DescoverrideComponent } from './descoverride/descoverride.component';
import { CovwarningsComponent } from './covwarnings/covwarnings.component';
import { SavedquotesComponent } from './savedquotes/savedquotes.component';
import { DealermasterComponent } from './dealermaster/dealermaster.component';
import { UnremittedComponent } from './unremitted/unremitted.component';
import { RemittedComponent } from './remitted/remitted.component';
import { ProcessedComponent } from './processed/processed.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { LegacyinvoicesComponent } from './legacyinvoices/legacyinvoices.component';
import { LegacycontractsComponent } from './legacycontracts/legacycontracts.component';
import { PaymentHistoryComponent } from './paymenthistory/paymenthistory.component';
import { MigrationComponent } from './migration/migration.component';
import { StatementComponent } from './statement/statement.component';
import { StaticPageComponent } from './staticpage/staticpage.component';
import { ProfitComponent } from './profit/profit.component';
import { ClaimsComponent } from './claims/claims.component';
import { RepairsComponent } from './repairs/repairs.component';
import { CancellationsComponent } from './cancellations/cancellations.component';
import {Safe} from './_services/pager.service';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ProduceranalysisComponent } from './produceranalysis/produceranalysis.component';


enableProdMode();
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    Login1Component,
    ForgotPasswordComponent,
    HomeComponent, 
    UsersComponent,
    RolesComponent,
    GlobalFiltersComponent,
    CovsequenceComponent,
    UniversalfiltersComponent,
    LienholdersComponent,
    PaymentmethodsComponent,
    Lienholders2Component,
    Quote1Component,
    Quote2Component,
    PacksComponent, 
    ContracttypesComponent,
    TaxrateComponent,
    InvoicePaymentComponent,
    DefaultsComponent,
    ClaimsFormComponent,
    Quote3Component,
    ContractComponent,
    DescoverrideComponent,
    CovwarningsComponent,
    SavedquotesComponent,
    UnremittedComponent,
    RemittedComponent,
    ProcessedComponent,
    InvoicesComponent,
    StatementComponent,
    LegacyinvoicesComponent,
    LegacycontractsComponent,
    PaymentHistoryComponent,
    MigrationComponent,
    StaticPageComponent,
    ProfitComponent,
    ClaimsComponent,
    RepairsComponent,
    CancellationsComponent,
    DealermasterComponent,
    Safe,
    ProduceranalysisComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TooltipModule,
    AppRoutingModule
  ],
  providers: [JsonService,
              HtmlService,
              CanDeactivateGuard,
              PagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
