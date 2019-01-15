import { Component, OnInit } from '@angular/core';
import { Util } from '../utilities/util';
import { Dispalert , Errsetter } from '../utilities/dispalert'; 
import { Router } from '@angular/router'; 
import { Quote1data, Data1 } from './quote1data'; 
import { JsonService } from '../utilities/json.service'; 
import { Textfield } from '../utilities/textfield';


@Component({
  selector: 'app-quote1',
  templateUrl: './quote1.component.html'
})
export class Quote1Component implements OnInit {
  changes = false;
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  pagedata  = new Quote1data();

  validating = false;
  valid = false;
  validvin = true;
  dmsmode = false;
  rvmode = false;
  arrlob = [];
  arrlobAll = [];
  arrdspn = [];
  neednew:boolean = false;
  notfoc:boolean = true;
  data1 = new Data1;
  hascover:boolean = false;
  hasterm:boolean = false;
  hasboth:boolean = false;
  prevVin:string ="";
  ran:string = Util.makeid();
  
  i:number = 0;
  thisyear : number = new Date().getFullYear();
  years :[number]=[this.thisyear+1];

  product= new Textfield; 
  year   = new Textfield;
  dnup   = new Textfield;
  dlno   = new Textfield;
  make   = new Textfield;
  model  = new Textfield;
  vin    = new Textfield;
  miles  = new Textfield;
  engtyp = new Textfield;
  mfgw = new Textfield;
  price  = new Textfield;
  msrp  = new Textfield;
  amfn  = new Textfield;
  lmil  = new Textfield;
  lmth  = new Textfield;
  insrvc = new Textfield;
  asofdt = new Textfield;
  rvtype:string ="";
  rvchange2(){
    Util.showWait();
    this.mfgw.value = "";
    Util.hideWait();
  }
  rvchange(){
    Util.showWait();
    this.mfgw.value = "";
    this.engtyp.value ="";
    this.miles.value = "";
    Util.hideWait();
  }

dmsOn(){
  this.dmsmode = true;
}
dmsOff(){
  this.dmsmode = false;
}

vinCheck(mode){
  if(mode == 'S')  this.onChange();
  if(mode == 'S') this.pagedata.body.requot = false;
  this.vin.value = this.vin.value.toUpperCase();
  if(this.vin.erlevel=="D")this.validvin = false; 
  if(this.vin.value.length < 17){ this.validvin = false;this.prevVin = this.vin.value; }
  if(this.vin.value.length == 17){
    if( this.pagedata.body.type ==="R" || this.pagedata.body.type ==="H" ){this.validvin = true; return true;}
    if( this.pagedata.body.type==='' && this.pagedata.body.dtype==='R'){this.validvin = true; return true;}
    if( this.pagedata.body.type==='' && this.pagedata.body.dtype==='H'){this.validvin = true; return true;}
  }
    if(this.vin.value.length == 17 && this.vin.value !== this.prevVin ) {
     this.prevVin = this.vin.value; 
  
  Util.showWait();
  this.pagedata.body.mode ="VIN";
  this.pagedata.body.vin = this.vin.value;
  this.pagedata.body.year = this.year.value;
  this.pagedata.body.models = [{"model":"","desc":""}];
  this.pagedata.body.makes = [{"make":"","desc":""}];
  this.pagedata.body.models.pop();
  this.pagedata.body.makes.pop();
  this.dlno.value = "";
  this.year.value = "";
  this.make.value = "";
  this.model.value ="";
  this.pagedata.body.tabid = sessionStorage.getItem("tabid");
  this.jsonService
    .initService(this.pagedata.body,Util.Url("CGICQUOTE1"))
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error(); Util.hideWait(); },
                     () => {
                            //this.dispAlert.setMessage(this.errSet);
                            this.vin.message = this.errSet.message;
                            this.vin.erlevel = this.errSet.status;
                            if(this.errSet.status==="S"){ this.validvin = true; this.pagedata.body.dyear = this.errSet.data}
                            else{
                              this.vin.erlevel = 'D';
                            }
                            Util.hideWait();
      }
    );
    }
}

setDate(e){
    var setyear = this.pagedata.body.dyear;
    var d = new Date();
    var y = d.getFullYear();
    if(parseInt(setyear) > y){setyear = y.toString()}
    var srcEl = e.srcElement || e.target;
    if(srcEl.checked){ this.insrvc.value=setyear +"-01-01";}
}

previous(){
  if(this.pagedata.body.step == "1"){Util.modalid("hide","newQuote");return;}
  if(this.pagedata.body.step == "2"){this.router.navigate(['/app/Quote2']);}
  if(this.pagedata.body.step == "3"){this.router.navigate(['/app/Quote3']);}
  if(this.pagedata.body.step == "4"){this.router.navigate(['/app/Results']);}
}
newquote(){
  Util.showWait();
  this.jsonService
    .initService({"mode":"RESET","tabid":sessionStorage.getItem("tabid")},Util.Url("CGICQUOTE1"))
    .subscribe(data => this.pagedata.body.models = data,
      err => { Util.hideWait();},
      () => {
        this.router.navigate(['/app/Quote1']);
        Util.hideWait();}
    );
}

condyes(){
  this.pagedata.body.condyn = true;
  var idx = this.prgIndex1(this.pagedata.body.condprg);
  var plan = this.pagedata.body.pln.plans[idx];
  var obj ={"prg":plan.prg,"ratc":plan.ratc,"desc":plan.desc}
  this.pagedata.body.type = plan.plnt;
  this.pagedata.body.ckprgs.push(obj);
  Util.checkbyid('chk'+plan.prg+plan.ratc);  
  Util.modalid("hide","fucilloModal");
}
condno(){
  this.pagedata.body.condyn = false;
  var idx = this.prgIndex1(this.pagedata.body.condprg);
  var i = 0;
  if(this.pagedata.body.pln.plans.length < 3 && this.pagedata.body.ckprgs.length < 1){
    
    this.pagedata.body.pln.plans.forEach(elem=>{
      if(i!==idx){
        var obj ={"prg":elem.prg,"ratc":elem.ratc,"desc":elem.desc}
        this.pagedata.body.type = elem.plnt;
        this.pagedata.body.ckprgs.push(obj);
        Util.checkbyid('chk'+elem.prg+elem.ratc);
        return;
      }
      i += 1;
    })
  }
  Util.modalid("hide","fucilloModal");
}
checkStep1(){
  if(this.dmsmode) return false;
    this.validating = true;
    this.notfoc = true;
    this.valid = true;
    //Reset Error Messages
    this.product.message  = "";
    this.dlno.message     = "";
    this.year.message     = "";
    this.dnup.message     = "";
    this.make.message     = "";
    this.model.message    = "";
    if(this.vin.value.trim()=="")this.vin.message      = "";
    this.engtyp.message  = "";
    this.mfgw.message  = "";
    this.miles.message    = "";
    this.price.message    = "";
    this.msrp.message    = "";
    this.amfn.message    = "";
    this.lmil.message    = "";
    this.lmth.message    = "";
    this.insrvc.message   = "";
    this.asofdt.message   = "";
    //Reset Top Alert
    this.dispAlert.default();
    //Trim Field values
    this.product.value  = this.product.value.trim();
    this.year.value     = this.year.value.trim();
    this.dlno.value      = "";
    this.make.value     = this.make.value.trim();
    this.dnup.value     = this.dnup.value.trim();
    this.model.value    = this.model.value.trim();
    this.vin.value      = this.vin.value.trim();
    this.engtyp.value  = this.engtyp.value.trim();
    this.mfgw.value  = this.mfgw.value.trim();
    this.insrvc.value   = this.insrvc.value.trim();
    this.asofdt.value   = this.asofdt.value.trim();

    if(this.pagedata.body.ckprgs.length<1) { this.product.message = "(Select One)"; this.product.erlevel = "D"; this.valid = false; }
    if(!this.rvmode){
      if(this.vin.value !=="" && (this.year.value!=="" || this.make.value !=="" || this.model.value !=="")){
        this.vin.message = "(Year/Make/Model OR VIN)";this.vin.erlevel = "D"; this.valid =false;
      }
    }

    if(this.vin.value == "" || this.rvmode){
      if(this.rvmode)this.validvin = true;
      if (this.year.value == "") { this.year.message = "(Year required)"; this.year.erlevel = "D"; this.valid = false; }
      if (this.year.message == "" && this.make.value == ""){this.year.message = "(Make required)";this.make.message = "R"; this.year.erlevel = "D"; this.valid = false; }
      if (this.year.message == "" && this.model.value == ""){this.year.message = "(Model required)";this.model.message = "R"; this.year.erlevel = "D"; this.valid = false; }
      if(this.vin.value !== "" && !this.validvin){this.vin.message = "(Invalid VIN)";this.vin.erlevel = "D";this.valid = false;if(this.notfoc){ Util.focusById("vAin");this.notfoc=false;}}
    }else{
      if(!this.validvin){this.vin.message = "(Invalid VIN)";this.vin.erlevel = "D";this.valid = false;if(this.notfoc){ Util.focusById("vAin");this.notfoc=false;}}
    }
    if(!this.rvmode || this.rvtype == "M"){
      if(this.miles.value == "" || this.miles.value == null){this.miles.message = "(Required)";this.miles.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("mileage");this.notfoc=false;}}
      if(this.rvmode && this.rvtype == "M" && this.engtyp.value == "" ){this.engtyp.message = "(Required)";this.engtyp.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("engtyp");this.notfoc=false;}}
      
    }
    if(this.neednew){
      if(this.dnup.value == "" ){this.dnup.message = "(Required)";this.dnup.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("dnup");this.notfoc=false;}} 
    }
    //Trailer popup
    if(this.rvmode){
      if(this.mfgw.value == ""  ){this.mfgw.message = "(Required)";this.mfgw.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("mfgw");this.notfoc=false;}}
    }
    //Auto
    if(this.pagedata.body.type === "A" || (this.pagedata.body.type ==="" && this.pagedata.body.dtype==="A")){      
      if(parseInt(this.miles.value) <= 0){this.miles.message = "(Invalid)";this.miles.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("mileage");this.notfoc=false;}}
      if(this.valid && this.miles.value.toString().length>7){this.miles.message = "(Too High)";this.miles.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("mileage");this.notfoc=false;}}
    } 
    //RV
    if(this.rvmode){
      if(this.price.value == "" || this.price.value == null){this.price.message = "(Required)";this.price.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("prce");this.notfoc=false;}}
      if(parseInt(this.price.value) > 9999999){this.price.message = "(Too High)";this.price.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("prce");this.notfoc=false;}}
      if(parseInt(this.price.value) <= 0){this.price.message = "(Invalid)";this.price.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("prce");this.notfoc=false;}}
    }  
    //WT //Lease Mode
    if(this.arrlob.indexOf('WT')>-1){
      //Msrp
      if(this.msrp.value == "" || this.msrp.value == null){this.msrp.message = "(Required)";this.msrp.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("msrp");this.notfoc=false;}}
      if(parseInt(this.msrp.value) <= 0){this.msrp.message = "(Invalid)";this.msrp.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("msrp");this.notfoc=false;}}
      //Miles
      if(this.lmil.value == "" || this.lmil.value == null){this.lmil.message = "(Required)";this.lmil.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("lmil");this.notfoc=false;}}
      if(parseInt(this.lmil.value) <= 0){this.lmil.message = "(Invalid)";this.lmil.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("lmil");this.notfoc=false;}}
      if(this.valid && this.lmil.value.toString().length>7){this.lmil.message = "(Too High)";this.lmil.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("lmil");this.notfoc=false;}}
      //Months
      if(this.lmth.value == "" || this.lmth.value == null){this.lmth.message = "(Required)";this.lmth.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("lmth");this.notfoc=false;}}
      if(parseInt(this.lmth.value) <= 0){this.lmth.message = "(Invalid)";this.lmth.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("lmth");this.notfoc=false;}}
      if(this.valid && this.lmth.value.toString().length>3){this.lmth.message = "(Too High)";this.lmth.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("lmth");this.notfoc=false;}}
    }
    if(this.arrlob.indexOf('RVGAP')>-1 || this.arrlob.indexOf('RVTHEFT')>-1 || this.arrlob.indexOf('RVWHEEL')>-1 || this.arrlob.indexOf('RVRS')>-1 ){
      //Amount Financed
      if(this.amfn.value == null || this.amfn.value.toString() == ""){this.amfn.message = "(Required)";this.amfn.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("amfn");this.notfoc=false;}}
      if(parseInt(this.amfn.value) < 0){this.amfn.message = "(Invalid)";this.amfn.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("amfn");this.notfoc=false;}}
    }
    if(this.insrvc.value == ""){this.insrvc.message = "(Required)";this.insrvc.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("servicedate");this.notfoc=false;}}
    if(this.insrvc.value !== "" && !this.rvmode ){//If Auto Inservice Date has to be equal or less than model year 
      if(this.pagedata.body.dyear !==''){
      
      if(parseInt(this.insrvc.value.substring(0,4)) > parseInt(this.pagedata.body.dyear)){
        this.insrvc.message = "(Greater than vehicle year)";this.insrvc.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("servicedate");this.notfoc=false;
      }

      }
    }
  }
    if(this.pagedata.head.as400 && this.asofdt.value == ""){this.asofdt.message = "(Required)";this.asofdt.erlevel="D";this.valid = false;if(this.notfoc){ Util.focusById("asofdt");this.notfoc=false;}}

    if(!this.valid){Util.scrollToId('quotesteps');}
    if (this.valid){//Serve Action
      Util.showWait();
      this.pagedata.body.year    = this.year.value;
      this.pagedata.body.make    = this.make.value;
      this.pagedata.body.model   = this.model.value;
      this.pagedata.body.vin     = this.vin.value;
      this.pagedata.body.dnup    = this.dnup.value;
      this.pagedata.body.engtyp = this.engtyp.value;
      this.pagedata.body.mfgw = this.mfgw.value;
      this.pagedata.body.rvtype = "";
      if(this.rvmode) this.pagedata.body.rvtype  = this.rvtype;
      this.pagedata.body.miles   = this.miles.value;
      this.pagedata.body.price   = this.price.value;
      this.pagedata.body.msrp   = this.msrp.value;
      
      this.pagedata.body.amfn   = this.amfn.value;
      if(this.amfn.value == null || this.amfn.value.toString() == "")  this.pagedata.body.amfn ="";
      this.pagedata.body.lmil   = this.lmil.value;
      this.pagedata.body.lmth   = this.lmth.value;
      this.pagedata.body.insrvc  = this.insrvc.value;
      this.pagedata.body.asofdt  = this.asofdt.value;
      this.pagedata.body.ckprgs = Util.sortByKey(this.pagedata.body.ckprgs,"prg","A");
      this.pagedata.body.ckprgs = Util.sortByKey(this.pagedata.body.ckprgs,"ratc","A");

      this.pagedata.body.mode ="SAVE";
      this.pagedata.body.tabid = sessionStorage.getItem("tabid");
      this.jsonService
        .initService(this.pagedata.body,Util.Url("CGICQUOTE1"))
        .subscribe(data => this.errSet = data,
                    err => { this.dispAlert.error(); Util.hideWait(); },
                     () => {Util.scrollToId('quotesteps');
                            if(this.errSet.status !== "S") this.dispAlert.setMessage(this.errSet);
                            if (this.errSet.status === "S") {
                              Util.showWait();
                              this.checkcoverages();
                              //setTimeout(() => {
                              //  this.router.navigate(['/app/Quote2']);
                              //}, 100);
                               this.changes = false; 
                                 }else{
          Util.hideWait();
        }
      }
    );


   }

    
}

checkcoverages(){
  this.jsonService
      .initService({ "mode": "INIT1","tabid": sessionStorage.getItem("tabid") }, Util.Url("CGICQUOTE2"))
      .subscribe(data => this.data1 = data,
        err => {Util.hideWait();},
        
        () => {
          
          this.data1.data.every(eachObj=>{
            this.hascover = false;
            this.hasterm = false;
            //Has Coverages
              eachObj.cov.coverages.forEach(element => {if(!element.check) {this.hascover = true;}});
            if(this.hascover){
              eachObj.trm.terms.forEach(element => {if(!element.check) {this.hasterm = true;}});
            }
            if(this.hascover && this.hasterm)
            { this.hasboth = true;
              return false;//breaks the loop.
            }
            return true;
          });
          if(this.hasboth){
            this.router.navigate(['/app/Quote2']);
          }else{
            Util.hideWait();
            Util.modalid("show","nocoverages");
          }
        });
}
closecov(){
  Util.modalid("hide","nocoverages");
}
onChange() {
  this.validating = false;
  this.dispAlert.default();
  this.changes = true; 
}

yearChange(){
  
  this.onChange();
  this.pagedata.body.requot = false;
  this.pagedata.body.dyear = this.year.value;
  if( this.pagedata.body.type ==="R" || this.pagedata.body.type ==="H" ){ return false;}
  Util.showWait();
  this.pagedata.body.mode ="YEAR";
  this.pagedata.body.year = this.year.value;
  this.pagedata.body.models = [{"model":"","desc":""}];
  this.pagedata.body.makes = [{"make":"","desc":""}];
  this.pagedata.body.models.pop();
  this.pagedata.body.makes.pop();
  this.make.value = "";
  this.model.value ="";
  this.pagedata.body.tabid = sessionStorage.getItem("tabid");
  this.jsonService
    .initService(this.pagedata.body,Util.Url("CGICQUOTE1"))
    .subscribe(data => this.pagedata.body.makes = data,
      err => {Util.hideWait(); },
      () => {Util.hideWait();}
    );
}

importDms(){
  Util.showWait();
  this.onChange();
  this.pagedata.body.requot = false;
  this.pagedata.body.mode ="DMS";
  this.pagedata.body.dlno = this.dlno.value;
  this.year.value = "";
  this.make.value = "";
  this.model.value ="";
  this.miles.value ="";
  this.vin.value ="";
  this.prevVin = "";
  this.insrvc.value ="";
  this.vin.erlevel ="";
  this.vin.message ="";
  this.pagedata.body.dyear = "";
  this.pagedata.body.tabid = sessionStorage.getItem("tabid");
  this.jsonService
    .initService(this.pagedata.body,Util.Url("CGICQUOTE1"))
    .subscribe(data => this.errSet = data = data,
      err => { Util.hideWait(); },
      () => {
        this.pagedata.body.dms = JSON.parse(this.errSet.data);
        this.dispAlert.setMessage(this.errSet);
        if(this.errSet.status == "S"){
          if(this.pagedata.body.dms.vin !==""){
            this.vin.value = this.pagedata.body.dms.vin;
            this.vinCheck('D');
          }else{
            this.year.value = this.pagedata.body.dms.year;
            this.make.value = this.pagedata.body.dms.make;
            this.model.value = this.pagedata.body.dms.model;
            
          }
          this.miles.value = this.pagedata.body.dms.miles;
          this.insrvc.value = this.pagedata.body.dms.insrvc;
        }
        
        Util.hideWait();}
    );
}
makeChange(){
  Util.showWait();
  this.onChange();
  this.pagedata.body.mode ="MAKE";
  this.pagedata.body.make = this.make.value;
  this.pagedata.body.models = [{"model":"","desc":""}];
  this.pagedata.body.models.pop();
  
  this.model.value ="";
  this.pagedata.body.tabid = sessionStorage.getItem("tabid");
  this.jsonService
    .initService(this.pagedata.body,Util.Url("CGICQUOTE1"))
    .subscribe(data => this.pagedata.body.models = data,
      err => { Util.hideWait();},
      () => {Util.hideWait();}
    );
}

addplan(e,plan){
    this.rvmode = false;
    var srcEl = e.srcElement || e.target;
    this.changes = true; 
    this.onChange();
    var obj ={"prg":plan.prg,"ratc":plan.ratc,"desc":plan.desc}
    if(srcEl.checked){
        this.pagedata.body.type = plan.plnt;
        
        this.pagedata.body.ckprgs.push(obj);
        if(plan.dspasn == "Y") this.arrdspn.push("Y");
        this.arrlobAll.push(plan.lob);
        if((plan.lob ==='WT' || plan.lob =='RVGAP' || plan.lob=='RVTHEFT' || plan.lob =='RVWHEEL' || plan.lob =='RVRS' ) && this.arrlob.indexOf(plan.lob)==-1){ this.arrlob.push(plan.lob);Util.showWait();Util.hideWait();}
    }else{
      if(plan.dspasn == "Y") this.arrdspn.pop();
      this.pagedata.body.ckprgs.splice(this.prgIndex(plan.prg,plan.ratc), 1);
      if(!this.pagedata.body.ckprgs.length){ this.pagedata.body.type ="";}

      var iloball = this.arrlobAll.indexOf(plan.lob);
      if (iloball > -1) { this.arrlobAll.splice(iloball, 1);}

      if((plan.lob ==='WT' || plan.lob =='RVGAP' || plan.lob=='RVTHEFT' || plan.lob == 'RVWHEEL' || plan.lob == 'RVRS')){
      var ilob = this.arrlob.indexOf(plan.lob);
      if (ilob > -1) { this.arrlob.splice(ilob, 1);}
      
      Util.showWait();Util.hideWait();
      }
    }
    //Collect New / Used if Dsp as new and no RV/AUTO LOB selected.
    if(this.arrlobAll.indexOf("AUTO")<0 && this.arrlobAll.indexOf("RV")<0 &&  this.arrdspn.length > 0 && this.pagedata.body.ckprgs.length>0){
      if(!this.neednew){Util.showWait();Util.hideWait();this.pagedata.body.dnup;} this.neednew = true;}
      else{if(this.neednew){Util.showWait();Util.hideWait();this.pagedata.body.dnup;}this.neednew = false;}

    if(this.pagedata.body.type == "R" || this.pagedata.body.type == 'H') this.rvmode = true;
    if(this.rvtype == "") this.rvtype = "M";
    if(!this.rvmode){this.engtyp.value ="";this.mfgw.value ="";this.price.value="";}
    if(this.pagedata.body.type=="" && (this.pagedata.body.dtype == "R" || this.pagedata.body.dtype == 'H')) this.rvmode = true;
    this.pagedata.body.ckprgs = Util.sortByKey(this.pagedata.body.ckprgs,"desc","A");
}

prgIndex(prg,ratc){
  for (var i = 0; i < this.pagedata.body.ckprgs.length; i++) {
    if (this.pagedata.body.ckprgs[i].prg == prg && this.pagedata.body.ckprgs[i].ratc==ratc) {
        return i;
    }
}
  return -1;
}

prgIndex1(prg){
  for(var j=0;j<prg.length;j++){
  for (var i = 0; i < this.pagedata.body.pln.plans.length; i++) {
    if (this.pagedata.body.pln.plans[i].prg == prg[j]) {
        return i;
    }
}
  }
  return -1;
}

constructor(private jsonService: JsonService,private router: Router){}

ngOnInit() {

  this.pagedata.head.status ="I";
  this.pagedata.body.ckprgs =[""];
  Util.showWait();
  this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
    .initService({"mode":"INIT","tabid":sessionStorage.getItem("tabid")},Util.Url("CGICQUOTE1"))
    .subscribe(data => this.pagedata = data,
      err => {Util.responsiveMenu(); Util.hideWait(); },
      () => {Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        if(this.pagedata.body.type == "R" || this.pagedata.body.type == 'H') this.rvmode = true;
        if(this.pagedata.body.type=="" && (this.pagedata.body.dtype == "R" || this.pagedata.body.dtype == 'H')) this.rvmode = true;
      //Sort By User Ascending
        if (this.pagedata.head.status === "O" || Util.noAuth(this.pagedata.head.menuOp,'QUOTE1')) {
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          this.pagedata.body.pln.plans.forEach(elem=>{elem.desc = elem.desc.toUpperCase();})
          this.pagedata.body.pln.plans = Util.sortByKey(this.pagedata.body.pln.plans, "desc","A");
          this.pagedata.body.pln.plans = Util.sortBy2Key(this.pagedata.body.pln.plans, "plnt","lobd","A");
          
          this.rfshYears(); 
          
          this.year.value = this.pagedata.body.year;
          this.dnup.value = this.pagedata.body.dnup;
          this.make.value = this.pagedata.body.make;
          this.model.value = this.pagedata.body.model;
          this.vin.value = this.pagedata.body.vin;
          this.rvtype = this.pagedata.body.rvtype;
          this.engtyp.value = this.pagedata.body.engtyp;
          this.mfgw.value = this.pagedata.body.mfgw;
          if(this.rvmode && this.rvtype == "") this.rvtype = "M";
          var tempr = this.pagedata.body.requot;
          this.vinCheck('S');
          this.pagedata.body.requot = tempr;
          this.changes = false;
          this.miles.value = this.pagedata.body.miles;
          this.price.value = this.pagedata.body.price;
          this.msrp.value = this.pagedata.body.msrp;
          this.amfn.value = this.pagedata.body.amfn;
          this.lmil.value = this.pagedata.body.lmil;
          this.lmth.value = this.pagedata.body.lmth;
          this.insrvc.value = this.pagedata.body.insrvc;
          this.asofdt.value = this.pagedata.body.asofdt;
          var master = this.pagedata.body.ckprgs;
          //this.pagedata.body.pln.plans = Util.killDups(this.pagedata.body.pln.plans);
          var pvlob ="";
          this.pagedata.body.pln.plans.forEach(eachObj =>{  
            var obj = {"prg":eachObj.prg,"ratc":eachObj.ratc}; 
            if(eachObj.plnt==="")eachObj.plnt ="A";//default to Auto if blank
            if(master.findIndex(obj => obj.prg  == eachObj.prg  && 
                                       obj.ratc == eachObj.ratc && 
                                       eachObj.plnt == this.pagedata.body.type)>=0){
              eachObj.check = true;
              if(eachObj.dspasn == "Y") this.arrdspn.push("Y");
              if(this.arrlob.indexOf(eachObj.lob)==-1) this.arrlob.push(eachObj.lob);
              this.arrlobAll.push(eachObj.lob);
            }else{
              eachObj.check = false;
             // if(eachObj.dspasn == "Y") this.arrdspn.pop();
            }
            //Display LOB Header
            if(pvlob =="" || pvlob !== eachObj.lobd) eachObj.dlob = true;
            pvlob = eachObj.lobd; 
           });
           //Collect New/Used
           if(this.arrlobAll.indexOf("AUTO")<0 && this.arrlobAll.indexOf("RV")<0 &&  this.arrdspn.length > 0){ this.neednew = true;}
           if(!this.pagedata.body.condyn){
             this.pagedata.body.pln.plans.forEach(plan => {
              if(this.pagedata.body.condprg.indexOf(plan.prg)>=0 && this.pagedata.body.ckprgs.length <=0){
              Util.modalid("show","fucilloModal");
              return false;
              }
             });
            
            
           }
          if(Util.newQuote() && this.pagedata.body.ckprgs.length >0) Util.modalid("show","newQuote");
          if(this.pagedata.body.pln.plans.length == 1){
            if(this.pagedata.body.ckprgs.length < 1 ){
              var plan = this.pagedata.body.pln.plans[0];
              var obj ={"prg":plan.prg,"ratc":plan.ratc,"desc":plan.desc}
              this.pagedata.body.type = plan.plnt;
              this.pagedata.body.ckprgs.push(obj);
              Util.checkbyid('chk'+plan.prg+plan.ratc); 
              if(this.arrlob.indexOf(plan.lob)==-1){ this.arrlob.push(plan.lob);
              this.arrlobAll.push(plan.lob);
              if(plan.dspasn == "Y") this.arrdspn.push("Y");
              if(this.arrlobAll.indexOf("AUTO")<0 && this.arrlobAll.indexOf("RV")<0 &&  this.arrdspn.length > 0 && this.pagedata.body.ckprgs.length>0){
                this.neednew = true;}
            }
            }
          }
          Util.hideWait();
        }
       }
    );
}

rfshYears(){
    var back = this.thisyear-100;
          if(this.pagedata.body.dtype === "A") back = 1979; 
          for(this.i=this.thisyear;this.i>=back;this.i--) {
              this.years.push(this.i);
            }
}
canDeactivate() {

    if(this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

}

}
