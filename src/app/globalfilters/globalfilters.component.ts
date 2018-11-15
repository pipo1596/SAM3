import { Util } from '../utilities/util';
import { Component, OnInit } from '@angular/core';
import { Dispalert , Errsetter } from '../utilities/dispalert'; 
import { Router } from '@angular/router'; 
import { Filtersdata } from './filtersdata';
import { JsonService } from '../utilities/json.service';


@Component({
  selector: 'app-globalfilters',
  templateUrl: './globalfilters.component.html'
})
export class GlobalFiltersComponent implements OnInit {
  changes = false;
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  pagedata  = new Filtersdata();
  coveragesAll = false;
  termsAll = false;
  deductiblesAll = false;
  prvratc :string ="";
  tempdata : any;

  noAuth = true;
 
 
 
  constructor(private globalFilterService: JsonService,  
              private router: Router) { }


  //Select All Section
  selectAll(e,type){
    var srcEl = e.srcElement || e.target;
    this.changes = true;

    switch(type) {
      case "C":
         this.pagedata.body.cov.coveragesf.forEach(function(eachObj){     
          eachObj.check = e.target.checked;
         });
        break;
      case "T":
      this.pagedata.body.trm.terms.forEach(function(eachObj){ 
        eachObj.check = e.target.checked;
       });
        break;
      case "D": 
      this.pagedata.body.ded.deductibles.forEach(function(eachObj){
        eachObj.check = e.target.checked;
       });
        break;
      
  }
  }
  //on filter Click
  addfilt(e,type,miles){
    var srcEl = e.srcElement || e.target;
    this.changes = true; 
    var index = -1;
    switch(type) {
      case "C":
        index =  this.pagedata.body.cov.coveragesf.findIndex(obj => obj.termc==srcEl.defaultValue);  
        break;
      case "T": 
        index =  this.pagedata.body.trm.terms.findIndex(obj => (obj.termm==srcEl.defaultValue && obj.miles==miles)); 
        break;
      case "D": 
        index =  this.pagedata.body.ded.deductibles.findIndex(obj => obj.code==srcEl.defaultValue);
        break;
    }
    this.dispAlert.message ="";
    if(srcEl.checked){ 
      
      switch(type) {
        case "C":
          this.pagedata.body.cov.coveragesf[index].check = true;
          var desc = this.pagedata.body.cov.coveragesf[index].desc;
          this.pagedata.body.cov.coveragesf.forEach((elem) =>{
            if(elem.desc == desc) elem.check = true;
          });
          break;
        case "T":
          this.pagedata.body.trm.terms[index].check = true;
          break;
        case "D": 
          this.pagedata.body.ded.deductibles[index].check = true;
          break;
      }
      
    }
    else{
      switch(type) {
        case "C":
          this.pagedata.body.cov.coveragesf[index].check = false;
          var desc = this.pagedata.body.cov.coveragesf[index].desc;
          this.pagedata.body.cov.coveragesf.forEach((elem) =>{
            if(elem.desc == desc) elem.check = false;
          });
          break;
        case "T":
          this.pagedata.body.trm.terms[index].check = false;
          break;
        case "D": 
          this.pagedata.body.ded.deductibles[index].check = false;
          break;
      }
    }
  }
  
  newCard(e){
    var srcEl = e.srcElement || e.target;
    if(this.changes)if( !window.confirm('Changes not saved! Discard changes?')){ this.pagedata.body.ratc = this.prvratc;return false;}
    this.prvratc = this.pagedata.body.ratc.toString();
    this.changes = false;
    this.coveragesAll = false;
    this.termsAll = false;
    this.deductiblesAll = false;
    this.dispAlert.message=""
    Util.showWait();
    this.pagedata.body.mode = 'RFSH';
    this.globalFilterService
        .initService({"mode":"RFSH","ratc":this.pagedata.body.ratc},Util.Url("CGICFILTER"))
        .subscribe(data => this.tempdata = data,
        err => { this.dispAlert.error(); Util.hideWait(); },
        () => {
                Util.hideWait();
                
                this.pagedata.body.cov = this.tempdata.cov;
                this.hideDupCov(); 
                this.pagedata.body.ded = this.tempdata.ded;
                this.pagedata.body.trm = this.tempdata.trm;

                this.changes = false; 
          }); 
  }

  hideDupCov(){
    var prvdesc ="";
    this.pagedata.body.cov.coveragesf =  Util.sortByKey(this.pagedata.body.cov.coveragesf, "desc","A");
    this.pagedata.body.cov.coveragesf.forEach((coverage) => {
      if(prvdesc == coverage.desc){
        coverage.dup = true;
      }
      prvdesc = coverage.desc;      
    });

  }

  saveFilters(){
    Util.showWait();
    this.pagedata.body.mode = 'SAVE';
    this.globalFilterService
        .initService(this.pagedata.body,Util.Url("CGICFILTER"))
        .subscribe(data => this.errSet = data,
        err => { this.dispAlert.error(); Util.hideWait(); },
        () => {
              this.dispAlert.setMessage(this.errSet);
                Util.hideWait(); 
                this.changes = false; 
          }); 
  }

  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.globalFilterService
    .initService({"mode":"INIT"},Util.Url("CGICFILTER"))
    .subscribe(data => this.pagedata = data,
      err => {Util.hideWait();  },
      () => {   
        Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'FILTERS');
        if (this.pagedata.head.status === "O" || this.noAuth) {
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          this.hideDupCov(); 
      //Sort By Ascending
      this.prvratc = this.pagedata.body.ratc.toString();
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
