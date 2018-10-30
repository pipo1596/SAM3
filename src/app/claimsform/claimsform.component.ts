import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { ClaimsFormdata } from './claimsformdata'; 
import { Textfield , Numfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-claimsform',
  templateUrl: './claimsform.component.html'
})
export class ClaimsFormComponent implements OnInit {

  pagedata = new ClaimsFormdata ;

  validating = false;
  valid = false;
  changes = false;
  noAuth = true;
  accept: string = "";
  pageview:string = "A";

  type:string = "Auto";
  cfax:boolean= false;
  ceml:boolean= false;
  cphn:boolean= false;
  //Input Fields
  ctno = new  Textfield ;
  cnam = new  Textfield ;
  phon = new  Textfield ;
  repr = new  Textfield ;
  reml = new  Textfield ;
  rcnt = new  Textfield ;
  rphn = new  Textfield ;
  rext = new  Textfield ;
  rfax = new  Textfield ;
  year = new  Textfield ;
  make = new  Textfield ;
  modl = new  Textfield ;
  idnt = new  Textfield ;
  odom = new  Textfield ;
  comp = new  Textfield ;
  caus = new  Textfield ;
  recm = new  Textfield ;
  part = new  Textfield ;
  labr = new  Textfield ;
  tax  = new  Textfield ;


  //Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  erScrolid :string = "";
  ctmessage :string ="";
  cterlevel :string ="";
  constructor(private jsonService: JsonService,private router: Router) { }

  onChange(){
    this.changes= true;
    this.validating = false;
  }
  allThree(){
    this.cfax = true;
    this.ceml = true;
    this.cphn = true;
  }
  erscrol(id){
    if(this.erScrolid=='')
      this.erScrolid = id + 'lbl';
  }

  Reset(){
    if(confirm("Clear All Fields?")){
    //Reset Error Messages
    this.ctno.message   = "";
    this.cnam.message   = "";
    this.phon.message   = "";
    this.repr.message   = "";
    this.reml.message   = "";
    this.rcnt.message   = "";
    this.rphn.message   = "";
    this.year.message   = "";
    this.rfax.message   = "";
    this.make.message   = "";
    this.modl.message   = "";
    this.idnt.message   = "";
    this.comp.message   = "";
    this.caus.message   = "";
    this.part.message   = "";
    this.labr.message   = "";
    this.tax.message    = "";
    this.odom.message   = "";

    this.ctno.value     = "";
    this.cnam.value     = "";
    this.phon.value     = "";
    this.rext.value     = "";
    this.rfax.value     = "";
    this.repr.value     = "";
    this.reml.value     = "";
    this.rcnt.value     = "";
    this.rphn.value     = "";
    this.year.value     = "";
    this.make.value     = "";
    this.modl.value     = "";
    this.idnt.value     = "";
    this.comp.value     = "";
    this.caus.value     = "";
    this.part.value     = "";
    this.labr.value     = "";
    this.tax.value      = "";
    this.odom.value     = "";
    this.recm.value     = "";

    this.cfax = false;
    this.ceml = false;
    this.cphn = false;

    this.type = 'Auto';
    Util.showWait();
    Util.hideWait();
    Util.scrollToId("ctnolbl");
    }

  }
  
  checkData(){
    this.validating = true;
    this.valid = true;
    //Reset Error Messages
    this.ctno.message     = "";
    this.cnam.message     = "";
    this.phon.message     = "";
    this.repr.message     = "";
    this.reml.message     = "";
    this.rcnt.message     = "";
    this.rphn.message     = "";
    this.year.message     = "";
    this.make.message     = "";
    this.modl.message     = "";
    this.idnt.message     = "";
    this.comp.message     = "";
    this.caus.message     = "";
    this.part.message     = "";
    this.labr.message     = "";
    this.tax.message      = "";
    this.ctno.value     = this.ctno.value.trim();
    this.cnam.value     = this.cnam.value.trim();
    this.phon.value     = this.phon.value.trim();
    this.rext.value     = this.rext.value.trim();
    this.repr.value     = this.repr.value.trim();
    this.reml.value     = this.reml.value.trim();
    this.rcnt.value     = this.rcnt.value.trim();
    this.rphn.value     = this.rphn.value.trim();
    this.year.value     = this.year.value.trim();
    this.make.value     = this.make.value.trim();
    this.modl.value     = this.modl.value.trim();
    this.idnt.value     = this.idnt.value.trim();
    this.comp.value     = this.comp.value.trim();
    this.caus.value     = this.caus.value.trim();
    this.part.value     = this.part.value.trim();
    this.labr.value     = this.labr.value.trim();
    this.tax.value      = this.tax.value.trim();
    this.rfax.value     = this.rfax.value.trim();
    this.odom.value     = this.odom.value.trim();
    this.recm.value     = this.recm.value.trim();
    //Reset Top Alert
    this.dispAlert.default();
    //Required Logic
    this.ctmessage = "";
    this.erScrolid ="";

    this.part.value = this.validDollar(this.part.value);
    this.labr.value = this.validDollar(this.labr.value);
    this.tax.value  = this.validDollar(this.tax.value);
    
    if(this.ctno.value == "") { this.ctno.message = "(required)"; this.ctno.erlevel = "D"; this.valid = false;this.erscrol('ctno'); }
    if(this.cnam.value == "") { this.cnam.message = "(required)"; this.cnam.erlevel = "D"; this.valid = false;this.erscrol('cnam'); }
    if(this.phon.value == "") { this.phon.message = "(required)"; this.phon.erlevel = "D"; this.valid = false;this.erscrol('phon'); }
    if(this.repr.value == "") { this.repr.message = "(required)"; this.repr.erlevel = "D"; this.valid = false;this.erscrol('repr'); }
    if(this.reml.value == "") { this.reml.message = "(required)"; this.reml.erlevel = "D"; this.valid = false;this.erscrol('reml'); }
    if(this.reml.value !== "" && !Util.validemail(this.reml.value)) { this.reml.message = "(invalid Email)"; this.reml.erlevel = "D"; this.valid = false; this.erscrol('reml');}
    if(this.rcnt.value == "") { this.rcnt.message = "(required)"; this.rcnt.erlevel = "D"; this.valid = false;this.erscrol('rcnt'); }
    if(this.rphn.value == "") { this.rphn.message = "(required)"; this.rphn.erlevel = "D"; this.valid = false;this.erscrol('rphn'); }
    if(this.year.value == "") { this.year.message = "(required)"; this.year.erlevel = "D"; this.valid = false;this.erscrol('year'); }
    if(this.make.value == "") { this.make.message = "(required)"; this.make.erlevel = "D"; this.valid = false;this.erscrol('make'); }
    if(this.modl.value == "") { this.modl.message = "(required)"; this.modl.erlevel = "D"; this.valid = false;this.erscrol('modl'); }
    if(this.idnt.value == "") { this.idnt.message = "(required)"; this.idnt.erlevel = "D"; this.valid = false;this.erscrol('idnt'); }
    if(this.comp.value == "") { this.comp.message = "(required)"; this.comp.erlevel = "D"; this.valid = false;this.erscrol('comp'); }
    if(this.caus.value == "") { this.caus.message = "(required)"; this.caus.erlevel = "D"; this.valid = false;this.erscrol('caus'); }
    if(this.part.value == "") { this.part.message = "(required)"; this.part.erlevel = "D"; this.valid = false;this.erscrol('part'); }
    if(this.labr.value == "") { this.labr.message = "(required)"; this.labr.erlevel = "D"; this.valid = false;this.erscrol('labr'); }
    if(this.tax.value == "")  { this.tax.message  = "(required)";  this.tax.erlevel = "D"; this.valid = false;this.erscrol('tax'); }
    if(!this.ceml && !this.cphn && !this.cfax ){ this.ctmessage  = " (Contact Info Required)";  this.cterlevel = "D"; this.valid = false;this.erscrol('cfax'); }
    //Save Data
    this.loadDb();  
  }
  formatPhone(phone) {
    var numbers = phone.value.replace(/\D/g, ''),
      char = { 0: '(', 3: ') ', 6: '-' };
    phone.value = '';
    for (var i = 0; i < numbers.length; i++) {
      phone.value += (char[i] || '') + numbers[i];
    }
  }

  validDollar(value){
    var regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    if (regex.test(value))
    {
      //Input is valid, check the number of decimal places
      var twoDecimalPlaces = /\.\d{2}$/g;
      var oneDecimalPlace = /\.\d{1}$/g;
      var noDecimalPlacesWithDecimal = /\.\d{0}$/g;
      
      if(value.match(twoDecimalPlaces ))
      {
          //all good, return as is
          return value;
      }
      if(value.match(noDecimalPlacesWithDecimal))
      {
          //add two decimal places
          return value+'00';
      }
      if(value.match(oneDecimalPlace ))
      {
          //ad one decimal place
          return value+'0';
      }
      //else there is no decimal places and no decimal
      return value+".00";
  }
  return "";

  }

  loadDb(){
    if (!this.valid){ Util.scrollToId(this.erScrolid);Util.firstErrFocus(); return false;}
      Util.showWait();
      this.pagedata.body.mode ="SAVE";
      
      this.pagedata.body.type  = this.type;
      this.pagedata.body.cfax  = this.cfax;
      this.pagedata.body.ceml  = this.ceml;
      this.pagedata.body.cphn  = this.cphn;
      this.pagedata.body.ctno  = this.ctno.value;
      this.pagedata.body.cnam  = this.cnam.value;
      this.pagedata.body.phon  = this.phon.value;
      this.pagedata.body.repr  = this.repr.value;
      this.pagedata.body.reml  = this.reml.value;
      this.pagedata.body.rcnt  = this.rcnt.value;
      this.pagedata.body.rphn  = this.rphn.value;
      this.pagedata.body.rext  = this.rext.value;
      this.pagedata.body.rfax  = this.rfax.value;
      this.pagedata.body.year  = this.year.value;
      this.pagedata.body.make  = this.make.value;
      this.pagedata.body.modl  = this.modl.value;
      this.pagedata.body.idnt  = this.idnt.value;
      this.pagedata.body.odom  = this.odom.value;
      this.pagedata.body.comp  = this.comp.value;
      this.pagedata.body.caus  = this.caus.value;
      this.pagedata.body.recm  = this.recm.value;
      this.pagedata.body.part  = this.part.value;
      this.pagedata.body.labr  = this.labr.value;
      this.pagedata.body.tax   = this.tax.value;
      
      this.jsonService
        .initService(this.pagedata.body,Util.Url("CGICCLMFRM"))
        .subscribe(data => this.errSet = data,
                    err => { this.dispAlert.error(); Util.hideWait(); },
                     () => {
                            this.dispAlert.setMessage(this.errSet);
                            Util.hideWait();
                            if (this.dispAlert.status === "S") {
                              
                               this.changes = false; 
                               this.pageview = 'A';
                               alert("Thank you, We have received your request.")
                               
                               this.accept = "";
                                 }
                          }
                  );

          
  }

  checkAccept(){
    if(this.accept ==  ""){ alert("Please read the disclaimer and choose whether or not you accept the terms.");return false;}
    if(this.accept == "N"){alert("You have chosen not to accept the terms of the disclaimer.  You will now be redirected to the main page.");
                            this.router.navigate(['/app/']);return false;}
    this.pageview = "C";
    Util.showWait();
    Util.hideWait();
    this.type = 'Auto';
  }

  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
    .initService({"mode":"INIT"},Util.Url("CGICCLMFRM"))
    .subscribe(data => this.pagedata = data,
      err => { Util.hideWait(); },
      () => { Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        //this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'TXRATE');
        this.noAuth = false;
        if (this.pagedata.head.status === "O" || this.noAuth) {
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          Util.hideWait();
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
