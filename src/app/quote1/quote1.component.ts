import { Component, OnInit } from '@angular/core';
import { Util } from '../utilities/util';
import { Dispalert , Errsetter } from '../utilities/dispalert'; 
import { Router } from '@angular/router'; 
import { Quote1data } from './quote1data'; 
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

  prevVin:string ="";
  ran:string = Util.makeid();
  
  i:number = 0;
  thisyear : number = new Date().getFullYear();
  years :[number]=[this.thisyear+1];

  product= new Textfield; 
  year   = new Textfield;
  dlno   = new Textfield;
  make   = new Textfield;
  model  = new Textfield;
  vin    = new Textfield;
  miles  = new Textfield;
  price  = new Textfield;
  insrvc = new Textfield;
  asofdt = new Textfield;

dmsOn(){
  this.dmsmode = true;
}
dmsOff(){
  this.dmsmode = false;
}

vinCheck(mode){
  if(mode == 'S')  this.onChange();
  if(this.vin.erlevel=="D")this.validvin = false; 
  if(this.vin.value.length < 17){ this.validvin = false;this.prevVin = this.vin.value; }
    if(this.vin.value.length == 17 && this.vin.value !== this.prevVin ) {
     this.prevVin = this.vin.value; 
  if( this.pagedata.body.type ==="R" || this.pagedata.body.type ==="H" ){ return false;}
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
    var srcEl = e.srcElement || e.target;
    if(srcEl.checked){ this.insrvc.value=this.pagedata.body.dyear +"-01-01";}
}

condyes(){
  this.pagedata.body.condyn = true;
  Util.modalid("hide","fucilloModal");
}
condno(){
  this.pagedata.body.condyn = false;
  Util.modalid("hide","fucilloModal");
}
checkStep1(){
  if(this.dmsmode) return false;
    this.validating = true;
    this.valid = true;
    //Reset Error Messages
    this.product.message  = "";
    this.dlno.message     = "";
    this.year.message     = "";
    this.make.message     = "";
    this.model.message    = "";
    this.vin.message      = "";
    this.miles.message    = "";
    this.price.message    = "";
    this.insrvc.message   = "";
    this.asofdt.message   = "";
    //Reset Top Alert
    this.dispAlert.default();
    //Trim Field values
    this.product.value  = this.product.value.trim();
    this.year.value     = this.year.value.trim();
    this.dlno.value      = "";
    this.make.value     = this.make.value.trim();
    this.model.value    = this.model.value.trim();
    this.vin.value      = this.vin.value.trim();
    this.insrvc.value   = this.insrvc.value.trim();
    this.asofdt.value   = this.asofdt.value.trim();

    if(this.pagedata.body.ckprgs.length<1) { this.product.message = "(Select One)"; this.product.erlevel = "D"; this.valid = false; }

    if(this.vin.value !=="" && (this.year.value!=="" || this.make.value !=="" || this.model.value !=="")){
      this.vin.message = "(Year/Make/Model OR VIN)";this.vin.erlevel = "D"; this.valid =false;
    }

    if(this.vin.value == ""){
      if (this.year.value == "") { this.year.message = "(Year required)"; this.year.erlevel = "D"; this.valid = false; }
      if (this.valid && this.make.value == ""){this.year.message = "(Make required)";this.make.message = "R"; this.year.erlevel = "D"; this.valid = false; }
      if (this.valid && this.model.value == ""){this.year.message = "(Model required)";this.model.message = "R"; this.year.erlevel = "D"; this.valid = false; }
    }else{
      if(!this.validvin){this.vin.message = "(Invalid VIN)";this.vin.erlevel = "D";this.valid = false;}
    }

    if(this.miles.value == "" || this.miles.value == null){this.miles.message = "(Required)";this.miles.erlevel="D";this.valid = false;}

    //Auto
    if(this.pagedata.body.type === "A" || (this.pagedata.body.type ==="" && this.pagedata.body.dtype==="A")){      
      if(parseInt(this.miles.value) <= 0){this.miles.message = "(Invalid)";this.miles.erlevel="D";this.valid = false;}
      if(this.valid && this.miles.value.toString().length>7){this.miles.message = "(Too High)";this.miles.erlevel="D";this.valid = false;}
    } 
    //RV
    if(this.pagedata.body.type === "R" || this.pagedata.body.type === "H"){
      if(this.price.value == "" || this.price.value == null){this.price.message = "(Required)";this.price.erlevel="D";this.valid = false;}
      if(parseInt(this.price.value) <= 0){this.price.message = "(Invalid)";this.price.erlevel="D";this.valid = false;}
    }  

    if(this.insrvc.value == ""){this.insrvc.message = "(Required)";this.insrvc.erlevel="D";this.valid = false;}
    if(this.pagedata.head.as400 && this.asofdt.value == ""){this.asofdt.message = "(Required)";this.asofdt.erlevel="D";this.valid = false;}

    if(!this.valid){Util.scrollToId('quotesteps');}
    if (this.valid){//Serve Action
      Util.showWait();
      this.pagedata.body.year    = this.year.value;
      this.pagedata.body.make    = this.make.value;
      this.pagedata.body.model   = this.model.value;
      this.pagedata.body.vin     = this.vin.value;
      this.pagedata.body.miles   = this.miles.value;
      this.pagedata.body.price   = this.price.value;
      this.pagedata.body.insrvc  = this.insrvc.value;
      this.pagedata.body.asofdt  = this.asofdt.value;
      this.pagedata.body.ckprgs = Util.sortByKey(this.pagedata.body.ckprgs,"prg","A");
      this.pagedata.body.ckprgs = Util.sortByKey(this.pagedata.body.ckprgs,"ratc","A");

      this.pagedata.body.mode ="SAVE";
      this.jsonService
        .initService(this.pagedata.body,Util.Url("CGICQUOTE1"))
        .subscribe(data => this.errSet = data,
                    err => { this.dispAlert.error(), Util.hideWait(); },
                     () => {Util.scrollToId('quotesteps');
                            if(this.errSet.status !== "S") this.dispAlert.setMessage(this.errSet);
                            if (this.errSet.status === "S") {
                              Util.showWait();
                              setTimeout(() => {
                                this.router.navigate(['/app/Quote2']);
                              }, 100);
                               this.changes = false; 
                                 }else{
          Util.hideWait();
        }
      }
    );


   }

    
}

onChange() {
  this.validating = false;
  this.dispAlert.default();
  this.changes = true; 
}

yearChange(){
  
  this.onChange();
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
  this.jsonService
    .initService(this.pagedata.body,Util.Url("CGICQUOTE1"))
    .subscribe(data => this.pagedata.body.makes = data,
      err => { },
      () => {Util.hideWait();}
    );
}

importDms(){
  Util.showWait();
  this.onChange();
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
  this.jsonService
    .initService(this.pagedata.body,Util.Url("CGICQUOTE1"))
    .subscribe(data => this.errSet = data = data,
      err => { },
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
  this.jsonService
    .initService(this.pagedata.body,Util.Url("CGICQUOTE1"))
    .subscribe(data => this.pagedata.body.models = data,
      err => { },
      () => {Util.hideWait();}
    );
}

addplan(e,plan){
    var srcEl = e.srcElement || e.target;
    this.changes = true; 
    this.onChange();
    var obj ={"prg":plan.prg,"ratc":plan.ratc,"desc":plan.desc}
    if(srcEl.checked){
        this.pagedata.body.type = plan.plnt;
        plan.typc = this.setcondtype(plan.prg);
        this.pagedata.body.ckprgs.push(obj);
    }else{
      this.pagedata.body.ckprgs.splice(this.prgIndex(plan.prg,plan.ratc), 1);
      if(!this.pagedata.body.ckprgs.length){ this.pagedata.body.type =""; this.pagedata.body.typc=""}
    }
    this.pagedata.body.ckprgs = Util.sortByKey(this.pagedata.body.ckprgs,"desc","A");
}
setcondtype(prg){
  if(!this.pagedata.body.condyn) return "";
  if (this.pagedata.body.condprg.indexOf(prg)>=0){ this.pagedata.body.typc = 'C'; return 'C';}
  else return "";
}
setcondtype2(prg){
  if (this.pagedata.body.condprg.indexOf(prg)>=0){ return 'C'; }
  else return "";
}

prgIndex(prg,ratc){
  for (var i = 0; i < this.pagedata.body.ckprgs.length; i++) {
    if (this.pagedata.body.ckprgs[i].prg == prg && this.pagedata.body.ckprgs[i].ratc==ratc) {
        return i;
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
    .initService({"mode":"INIT"},Util.Url("CGICQUOTE1"))
    .subscribe(data => this.pagedata = data,
      err => {Util.responsiveMenu(); Util.hideWait(); },
      () => {Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
      //Sort By User Ascending
        if (this.pagedata.head.status === "O" || Util.noAuth(this.pagedata.head.menuOp,'QUOTE1')) {
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          this.pagedata.body.pln.plans.forEach(elem=>{elem.desc = elem.desc.toUpperCase();})
          this.pagedata.body.pln.plans = Util.sortByKey(this.pagedata.body.pln.plans, "desc","A");
          this.rfshYears(); 
          
          this.year.value = this.pagedata.body.year;
          this.make.value = this.pagedata.body.make;
          this.model.value = this.pagedata.body.model;
          this.vin.value = this.pagedata.body.vin;
          this.vinCheck('S');
          this.changes = false;
          this.miles.value = this.pagedata.body.miles;
          this.price.value = this.pagedata.body.price;
          this.insrvc.value = this.pagedata.body.insrvc;
          this.asofdt.value = this.pagedata.body.asofdt;
          var master = this.pagedata.body.ckprgs;
          this.pagedata.body.pln.plans = Util.killDups(this.pagedata.body.pln.plans);
          this.pagedata.body.pln.plans.forEach(eachObj =>{  
            var obj = {"prg":eachObj.prg,"ratc":eachObj.ratc}; 
            eachObj.typc = this.setcondtype2(eachObj.prg);
            if(eachObj.plnt==="")eachObj.plnt ="A";//default to Auto if blank
            if(master.findIndex(obj => obj.prg  == eachObj.prg  && 
                                       obj.ratc == eachObj.ratc && 
                                       eachObj.plnt == this.pagedata.body.type)>=0){
            //if(master.findIndex(obj)>=0){  
              eachObj.check = true;
              this.pagedata.body.typc = eachObj.typc;
            }else{
              eachObj.check = false;
            }
           });
           if(!this.pagedata.body.condyn){
             this.pagedata.body.pln.plans.forEach(plan => {
              if(this.pagedata.body.condprg.indexOf(plan.prg)>=0){
              Util.modalid("show","fucilloModal");
              return false;
              }
             });
            
            
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
