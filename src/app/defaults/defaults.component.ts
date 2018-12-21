import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Defaultsdata } from './defaultsdata';  
import { Textfield , Numfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-defaults',
  templateUrl: './defaults.component.html'
})
export class DefaultsComponent implements OnInit {

  pagedata = new Defaultsdata ;

  validating = false;
  valid = false;
  changes = false;
  noAuth = true;
  //Input Fields
  perc  = new  Textfield ; 
  rvtp  = new  Textfield ; 
  lntp  = new  Textfield ; 
  ancl  = new  Textfield ; 
  plnk  = new  Textfield ; 
  mnth  = new  Textfield ;
  lhno  = new  Textfield ;
  //Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();

  constructor(private jsonService: JsonService,private router: Router) { }

  onChange(){
    this.changes= true;
    this.validating = false;
  }
  checkData(){
    this.validating = true;
    this.valid = true;
    //Reset Error Messages
    this.perc.message  = "";
    this.rvtp.message  = "";
    this.lntp.message  = "";
    this.lhno.message  = "";
    this.ancl.message  = "";
    this.plnk.message  = "";
    this.mnth.message  = "";
    //Reset Top Alert
    this.dispAlert.default();
    //Required Logic

    //Save Data
    this.loadDb();  
  }

  loadDb(){
    if(!this.valid) return false;
      Util.showWait();
      this.pagedata.body.mode ="SAVE";
      this.pagedata.body.perc  = this.perc.value;
      this.pagedata.body.rvtp  = this.rvtp.value;
      this.pagedata.body.lntp  = this.lntp.value;
      this.pagedata.body.lhno  = this.lhno.value;
      this.pagedata.body.ancl  = this.ancl.value;
      this.pagedata.body.plnk  = this.plnk.value;
      this.pagedata.body.mnth  = this.mnth.value;
      this.jsonService
        .initService(this.pagedata.body,Util.Url("CGICDFLTS"))
        .subscribe(data => this.errSet = data,
                    err => { this.dispAlert.error(); Util.hideWait(); },
                     () => {
                            this.dispAlert.setMessage(this.errSet);
                            Util.hideWait();
                            if (this.dispAlert.status === "S") {
                              
                               this.changes = false; 
                                 }
                          }
                  );

          
  }

  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
    .initService({"mode":"INIT"},Util.Url("CGICDFLTS"))
    .subscribe(data => this.pagedata = data,
      err => { Util.hideWait(); },
      () => { Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'SDEFAULTS');
        if (this.pagedata.head.status === "O" || this.noAuth) {
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          Util.hideWait();
          this.perc.value = this.pagedata.body.perc;
          this.rvtp.value = this.pagedata.body.rvtp;
          this.lntp.value = this.pagedata.body.lntp;
          this.lhno.value = this.pagedata.body.lhno;
          this.ancl.value = this.pagedata.body.ancl;
          this.mnth.value = this.pagedata.body.mnth;
          this.plnk.value = this.pagedata.body.plnk;
        }

       }
    );
  }

  canDeactivate() {

    if(this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

}

}
