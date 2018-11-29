import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { Login1Component } from './login1/login1.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { Quote1Component } from './quote1/quote1.component';
import { Quote2Component } from './quote2/quote2.component';
import { Quote3Component } from './quote3/quote3.component';
import { ContractComponent } from './contract/contract.component';
import { PacksComponent } from './packs/packs.component';
import { ContracttypesComponent } from './contracttypes/contracttypes.component';
import { TaxrateComponent } from './taxrate/taxrate.component';
import { ClaimsFormComponent } from './claimsform/claimsform.component';
import { GlobalFiltersComponent } from './globalfilters/globalfilters.component';
import { UniversalfiltersComponent } from './universalfilters/universalfilters.component';
import { LienholdersComponent } from './lienholders/lienholders.component'; 
import { Lienholders2Component } from './lienholders2/lienholders2.component'; 
import { CanDeactivateGuard } from './utilities/confirmroute';
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
import { MigrationComponent } from './migration/migration.component';
import { StatementComponent } from './statement/statement.component';
import { StaticPageComponent } from './staticpage/staticpage.component'; 
import { ProfitComponent } from './profit/profit.component';
import { ClaimsComponent } from './claims/claims.component';
import { RepairsComponent } from './repairs/repairs.component';
import { CancellationsComponent } from './cancellations/cancellations.component';

const routes: Routes = [
  { path: 'app/Home', component: HomeComponent },
  { path: 'app/Users', canDeactivate: [CanDeactivateGuard], component: UsersComponent },
  { path: 'app/SalesPersons', canDeactivate: [CanDeactivateGuard], component: UsersComponent },
  { path: 'app/Authorities', canDeactivate: [CanDeactivateGuard], component: RolesComponent },
  { path: 'app/GlobalFilters', canDeactivate: [CanDeactivateGuard], component: GlobalFiltersComponent },
  { path: 'app/UniversalFilters', canDeactivate: [CanDeactivateGuard], component: UniversalfiltersComponent },
  { path: 'app/GlobalLienholders', canDeactivate: [CanDeactivateGuard], component: LienholdersComponent },
  { path: 'app/Lienholders', canDeactivate: [CanDeactivateGuard], component: Lienholders2Component },
  { path: 'app/Quote1', canDeactivate: [CanDeactivateGuard], component: Quote1Component },
  { path: 'app/QuoteNew', canDeactivate: [CanDeactivateGuard], component: Quote1Component },
  { path: 'app/Quote2', canDeactivate: [CanDeactivateGuard], component: Quote2Component },
  { path: 'app/Quote3', canDeactivate: [CanDeactivateGuard], component: Quote3Component },
  { path: 'app/Results', canDeactivate: [CanDeactivateGuard], component: Quote3Component },
  { path: 'app/Contract', canDeactivate: [CanDeactivateGuard], component: ContractComponent },
  { path: 'app/Packs', canDeactivate: [CanDeactivateGuard], component: PacksComponent },
  { path: 'app/ContractTypes', canDeactivate: [CanDeactivateGuard], component: ContracttypesComponent },
  { path: 'app/TaxRate', canDeactivate: [CanDeactivateGuard], component: TaxrateComponent },
  { path: 'app/ClaimsForm', canDeactivate: [CanDeactivateGuard], component: ClaimsFormComponent },
  { path: 'app/CovWarnings', canDeactivate: [CanDeactivateGuard], component: CovwarningsComponent },
  { path: 'app/ProgramOverride',canDeactivate: [CanDeactivateGuard], component: DescoverrideComponent },
  { path: 'app/CoverageOverride',canDeactivate: [CanDeactivateGuard], component: DescoverrideComponent },
  { path: 'app/SavedQuotes',canDeactivate: [CanDeactivateGuard], component: SavedquotesComponent },
  { path: 'app/DealerMaster',canDeactivate: [CanDeactivateGuard], component: DealermasterComponent },
  { path: 'app/convert',canDeactivate: [CanDeactivateGuard], component: Login1Component },
  { path: 'app/forgotpassword',canDeactivate: [CanDeactivateGuard], component: ForgotPasswordComponent },
  { path: 'app/resetpassword',canDeactivate: [CanDeactivateGuard], component: ForgotPasswordComponent },
  { path: 'app/activate',canDeactivate: [CanDeactivateGuard], component: ForgotPasswordComponent },
  { path: 'app/Unremitted',canDeactivate: [CanDeactivateGuard], component: UnremittedComponent },
  { path: 'app/Remitted',canDeactivate: [CanDeactivateGuard], component: RemittedComponent },
  { path: 'app/Processed',canDeactivate: [CanDeactivateGuard], component: ProcessedComponent },
  { path: 'app/Invoices',canDeactivate: [CanDeactivateGuard], component: InvoicesComponent },
  { path: 'app/LegacyInvoices',canDeactivate: [CanDeactivateGuard], component: LegacyinvoicesComponent },
  { path: 'app/LegacyContracts',canDeactivate: [CanDeactivateGuard], component: LegacycontractsComponent },
  { path: 'app/Migration',canDeactivate: [CanDeactivateGuard], component: MigrationComponent },
  { path: 'app/DealerStatement',canDeactivate: [CanDeactivateGuard], component: StatementComponent },
  { path: 'app/StaticPage',canDeactivate: [CanDeactivateGuard], component: StaticPageComponent },
  { path: 'app/DealerProfit',canDeactivate: [CanDeactivateGuard], component: ProfitComponent },
  { path: 'app/Claims',canDeactivate: [CanDeactivateGuard], component: ClaimsComponent },
  { path: 'app/Repairs',canDeactivate: [CanDeactivateGuard], component: RepairsComponent },
  { path: 'app/Cancellations',canDeactivate: [CanDeactivateGuard], component: CancellationsComponent },
  { path: 'app', component: LoginComponent },
  { path: 'app/**', component: LoginComponent },
  { path: '**', component: LoginComponent }
  

];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, { useHash: Boolean(history.pushState) === false }) ]
})


export class AppRoutingModule {


  
}
