import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppModule } from './../app.module';
import { AnalysisComponent } from './analysis/analysis.component';


@NgModule({
  imports: [
    CommonModule,
    AppModule
  ],
  declarations: [AnalysisComponent]
})
export class AgentsModule { }
