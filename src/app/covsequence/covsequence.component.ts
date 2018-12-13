import { Util } from '../utilities/util';
import { Component, OnInit } from '@angular/core';
import { Dispalert , Errsetter } from '../utilities/dispalert'; 
import { Router } from '@angular/router'; 
import { Covsequencedata } from './covsequencedata';
import { JsonService } from '../utilities/json.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-',
  templateUrl: './covsequence.component.html'
})
 
export class CovsequenceComponent implements OnInit {
  changes = false;
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  pagedata  = new Covsequencedata();
  arr300 =[];

 
  constructor(private covsequenceService: JsonService,  
              private router: Router) { }

  seqChng(elem){
    this.changes = true;
    this.pagedata.body.cov.forEach((coverage) => {
      if(coverage.val == elem.val) coverage.seq = elem.seq;
    });
    }

  newCmpc(){
    Util.showWait();
    this.changes = true;
    this.dispAlert.default();
    this.pagedata.body.mode = 'NEWCMPC';
    this.pagedata.body.prg = "";
    this.pagedata.body.cov = [{"key":"","val":"","lck":false,"seq":""}];
    this.pagedata.body.cov.pop();
    this.covsequenceService
        .initService({"mode":this.pagedata.body.mode,"cmpc":this.pagedata.body.cmpc},Util.Url("CGICCOVSEQ"))
        .subscribe(data => this.pagedata.body.prgs = data,
        err => { this.dispAlert.error(); Util.hideWait(); },
        () => {
                Util.hideWait(); 
                this.pagedata.body.prgs = Util.sortByKey(this.pagedata.body.prgs,"val","A");
                
                
                this.changes = false; 
          }); 
    
  }

  newPrg(){
    Util.showWait();
    this.changes = true;
    this.dispAlert.default();
    this.pagedata.body.mode = 'NEWPRG';
    this.covsequenceService
        .initService({"mode":this.pagedata.body.mode,"cmpc":this.pagedata.body.cmpc,"prg":this.pagedata.body.prg},Util.Url("CGICCOVSEQ"))
        .subscribe(data => this.pagedata.body.cov = data,
        err => { this.dispAlert.error(); Util.hideWait(); },
        () => {
                Util.hideWait(); 
                this.pagedata.body.cov = Util.sortBy2Key(this.pagedata.body.cov,"seq","val","A");
                var pvval = "";
                var pvseq = "";
                this.pagedata.body.cov.forEach((coverage) => {
                  if(pvval !=="" && pvval == coverage.val && pvseq == coverage.seq) coverage.lck = true;
                  pvval = coverage.val;
                  pvseq = coverage.seq;
                });
                this.changes = false; 
          }); 

  }

  saveSeq(){
    Util.showWait();
    this.pagedata.body.mode = 'SAVE';
    this.covsequenceService
        .initService(this.pagedata.body,Util.Url("CGICCOVSEQ"))
        .subscribe(data => this.errSet = data,
        err => { this.dispAlert.error(); Util.hideWait(); },
        () => {
              this.dispAlert.setMessage(this.errSet);
                Util.hideWait(); 
                this.pagedata.body.cov = Util.sortBy2Key(this.pagedata.body.cov,"seq","val","A");
                this.changes = false; 
          }); 
  }

  ngOnInit() {
    Util.showWait();
    
      
      this.arr300 = 'ABCDEFGHIJKLMNOPQRSTUVWXY'.split('')
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.covsequenceService
    .initService({"mode":"INIT"},Util.Url("CGICCOVSEQ"))
    .subscribe(data => this.pagedata = data,
      err => {Util.hideWait();  },
      () => {   
        Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        if (this.pagedata.head.status === "O" || !this.pagedata.head.as400) {
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          this.pagedata.body.prgs = Util.sortByKey(this.pagedata.body.prgs,"val","A");
         
          Util.hideWait();
        }
       }
    );

  }

  canDeactivate() {

    // if the editName !== this.user.name
    if(this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

}

}
