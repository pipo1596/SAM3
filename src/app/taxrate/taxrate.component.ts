import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Taxratedata } from './taxratedata'; 
import { Textfield , Numfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-taxrate',
  templateUrl: './taxrate.component.html'
})
export class TaxrateComponent implements OnInit {

  pagedata = new Taxratedata ;

  validating = false;
  valid = false;
  changes = false;
  noAuth = true;
  //Input Fields
  rate  = new  Numfield ; 
  incl = new  Textfield ;
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
    this.rate.message  = "";
    this.incl.message     = "";
    //Reset Top Alert
    this.dispAlert.default();
    //Required Logic

    if(this.rate.value == null) { this.rate.message = "(required)"; this.rate.erlevel = "D"; this.valid = false; }
    if(this.valid && this.rate.value < 0){this.rate.message = "(Invalid)";this.rate.erlevel="D";this.valid = false;}
    if(this.valid && this.rate.value > 99){this.rate.message = "(Too high)";this.rate.erlevel="D";this.valid = false;}
    if(this.incl.value == "") { this.incl.message = "(required)"; this.incl.erlevel = "D"; this.valid = false; }
    //Save Data
    this.loadDb();  
  }

  loadDb(){
    if(!this.valid) return false;
      Util.showWait();
      this.pagedata.body.mode ="SAVE";
      this.pagedata.body.rate  = this.rate.value;
      this.pagedata.body.incl  = this.incl.value;
      this.jsonService
        .initService(this.pagedata.body,Util.Url("CGICTAXRTS"))
        .subscribe(data => this.errSet = data,
                    err => { this.dispAlert.error(), Util.hideWait(); },
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
    .initService({"mode":"INIT"},Util.Url("CGICTAXRTS"))
    .subscribe(data => this.pagedata = data,
      err => { Util.responsiveMenu(); },
      () => { Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'TXRATE');
        if (this.pagedata.head.status === "O" || this.noAuth) {
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          Util.hideWait();
          this.rate.value = this.pagedata.body.rate;
          this.incl.value = this.pagedata.body.incl;
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
