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
  //Radio Buttons
  perc  = new  Textfield ; 
  rvtp  = new  Textfield ; 
  lntp  = new  Textfield ; 
  ancl  = new  Textfield ; 
  plnk  = new  Textfield ; 
  mnth  = new  Textfield ;
  //CheckBoxes
  xptf  :boolean = false; //paytype
  xptm  :boolean = false; 
  xpta  :boolean = false; 
  xptc  :boolean = false; 

  xpc5  :boolean = false; //%down
  xpc1  :boolean = false; 
  xpc2  :boolean = false; 
  xpc3  :boolean = false; 
  xpc4  :boolean = false; 

  xm12  :boolean = false; //# Months
  xm15  :boolean = false; 
  xm18  :boolean = false; 
  xm24  :boolean = false; 

  xrvm  :boolean = false; //RV Type
  xrvt  :boolean = false; 
  xrvp  :boolean = false;

  //Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Bool
  hasplnk:boolean = false;
  hasrv  :boolean = false;
  hasancl:boolean = false;


  constructor(private jsonService: JsonService,private router: Router) { }

  onChange(){
    this.changes= true;
    this.validating = false;
  }
  checkData(){
    this.validating = true;
    this.valid = true;
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
      //Radio
      this.pagedata.body.perc  = this.perc.value;
      this.pagedata.body.rvtp  = this.rvtp.value;
      this.pagedata.body.lntp  = this.lntp.value;
      this.pagedata.body.ancl  = this.ancl.value;
      this.pagedata.body.plnk  = this.plnk.value;
      this.pagedata.body.mnth  = this.mnth.value;
      
      //Checkboxes
      this.pagedata.body.xptf  = this.xptf;
      this.pagedata.body.xptm  = this.xptm;
      this.pagedata.body.xpta  = this.xpta;
      this.pagedata.body.xptc  = this.xptc;
      this.pagedata.body.xpc1  = this.xpc1;
      this.pagedata.body.xpc2  = this.xpc2;
      this.pagedata.body.xpc3  = this.xpc3;
      this.pagedata.body.xpc4  = this.xpc4;
      this.pagedata.body.xpc5  = this.xpc5;
      this.pagedata.body.xm12  = this.xm12;
      this.pagedata.body.xm15  = this.xm15;
      this.pagedata.body.xm18  = this.xm18;
      this.pagedata.body.xm24  = this.xm24;
      this.pagedata.body.xrvm  = this.xrvm;
      this.pagedata.body.xrvt  = this.xrvt;
      this.pagedata.body.xrvp  = this.xrvp;

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
          this.ancl.value = this.pagedata.body.ancl;
          this.mnth.value = this.pagedata.body.mnth;
          this.plnk.value = this.pagedata.body.plnk;
          //Checkboxes
          this.xptf = this.pagedata.body.xptf;
          this.xptm = this.pagedata.body.xptm;
          this.xpta = this.pagedata.body.xpta;
          this.xptc = this.pagedata.body.xptc;
          this.xpc1 = this.pagedata.body.xpc1;
          this.xpc2 = this.pagedata.body.xpc2;
          this.xpc3 = this.pagedata.body.xpc3;
          this.xpc4 = this.pagedata.body.xpc4;
          this.xpc5 = this.pagedata.body.xpc5;
          this.xm12 = this.pagedata.body.xm12;
          this.xm15 = this.pagedata.body.xm15;
          this.xm18 = this.pagedata.body.xm18;
          this.xm24 = this.pagedata.body.xm24;
          this.xrvm = this.pagedata.body.xrvm;
          this.xrvt = this.pagedata.body.xrvt;
          this.xrvp = this.pagedata.body.xrvp;

          //Set Bool
          this.hasplnk = this.pagedata.body.plnkon;
          this.pagedata.body.pln.plans.forEach(plan =>{
            //Has Anc
            if(plan.lob ==='WT' || plan.lob =='RVGAP' || plan.lob=='RVTHEFT' || plan.lob == 'RVWHEEL' || plan.lob == 'RVRS'){
              this.hasancl = true;
            }
            //Has RV
            if(plan.plnt == "R"){
              this.hasrv = true;
            }
          });
          this.hasplnk = true;
          this.hasancl = true;
          this.hasrv   = true;
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
