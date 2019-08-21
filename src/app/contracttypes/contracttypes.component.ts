import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Contractdata, Cont , Conte} from './contractdata'; 
import { Textfield , Numfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-contracttypes',
  templateUrl: './contracttypes.component.html'
})
export class ContracttypesComponent implements OnInit {

  pagedata = new Contractdata ;

  validating = false;
  valid = false;
  changes = false;
  savedflt = false;
  noAuth = true;
  modebtn = "ADD";
  //Input Fields
  desc = new  Textfield ;
  aply = new  Textfield ;
  catg = new  Textfield ;
  valu = new  Numfield ;
  desce = new  Textfield ;
  catge = new  Textfield ;
  value = new  Numfield ;

  prgm = new  Textfield ;
  prgme = new  Textfield ;
  //Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Top Section
  selectedRec = new Cont;
  selectedRecE = new Conte; 
  selectedRecG = new Cont;
  //New Rec Skeleten
  newRec = new Cont;

  constructor(private jsonService: JsonService,private router: Router) { }

  onChange(){
    this.changes= true;
    this.validating = false;
  }

  addRecInit(){
    this.selectedRecE.default("ADD");
    this.selectedRecE.prgm.pop();
    this.pagedata.programs.plans.forEach(prg=>{
      var jsob ={"prgm":prg.prg.padEnd(10) + prg.ratc,"desc":prg.desc,"aply":prg.aply,"check":false,"dlob":prg.dlob,"lobd":prg.lobd};
      this.selectedRecE.prgm.push(jsob);
    });

    Util.showWait();    
    Util.showTopForm();
    Util.hideWait();
    this.validating = false;
    this.changes = false;

    this.modebtn = "ADD";
    Util.scrollTop();
    Util.focusById("desc");
  
  }

  onSelect(record: Cont): void {
    this.selectedRec.codei  = record.codei;
    this.selectedRec.desc  = record.desc;
    this.selectedRec.aply  = record.aply;
    this.selectedRec.catg  = record.catg;
    this.selectedRec.catgd = record.catgd;
    this.selectedRec.valu  = record.valu;
    this.selectedRec.prgm  = record.prgm;
    this.selectedRec.prgmd = record.prgmd;

    this.selectedRecG = record;
    this.selectedRec.mode = "SAVE";
    this.modebtn = "SAVE";
    Util.showWait();
    Util.showTopForm();
    Util.hideWait();
    Util.scrollTop();
    //Util.focusById("code");
    this.changes = false;
    
  }

  delete(){
    if(confirm("Delete this Contract Type?")){
    this.selectedRec.mode = "DELETE";
    Util.showWait();
    this.jsonService
    .initService(this.selectedRec,Util.Url("CGICCTTYPE")) 
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error(); Util.hideWait(); },
      () => {
        this.dispAlert.setMessage(this.errSet);
        if (this.dispAlert.status === "S") {
  
            this.pagedata.contracts.splice(this.pagedata.contracts.findIndex(obj => obj.codei==this.selectedRec.codei),1);
            var pvpgm = "";
            this.pagedata.contracts = Util.sortBy2Key(this.pagedata.contracts,"prgmd","desc","A");
        this.pagedata.contracts.forEach((elem)=>{
          elem.sepr = false;
          if(pvpgm !== elem.prgm)
            elem.sepr = true;
          pvpgm = elem.prgm;
        });
            setTimeout(() => {
              Util.showWait();   
              this.cancel();
            }, 200);
  
          
        }else{
          Util.hideWait();
        }
          
  
      }
    );
    }
  }

  checkData(){
    this.validating = true;
    this.valid = true;

    if(this.modebtn == 'SAVE'){
    //Reset Error Messages
    this.desc.message  = "";
    this.aply.message  = "";
    this.catg.message  = "";
    this.valu.message  = "";
    this.prgm.message  = "";
    this.dispAlert.default();
    //Trim Field values
    if(this.valid && this.valu.value < 0){ this.valu.message = "(invalid)"; this.valu.erlevel = "D"; this.valid = false; }
    if(this.valu.value!== null) this.valu.value = parseFloat(this.valu.value.toFixed(2));
    
    this.desc.value  = this.selectedRec.desc.trim();
    
    this.catg.value  = this.selectedRec.catg.trim();
    if(this.catg.value=='OTR')
      this.aply.value  = this.selectedRec.aply.trim();
    else
      this.aply.value  = "";
    this.valu.value  = this.selectedRec.valu;
    this.prgm.value  = this.selectedRec.prgm.trim();

    if (this.desc.value == "") { this.desc.message = "(required)"; this.desc.erlevel = "D"; this.valid = false; }
    if (this.valu.value == null) { this.valu.message = "(required)"; this.valu.erlevel = "D"; this.valid = false; }
    if(this.valid && this.valu.value < 0){ this.valu.message = "(invalid)"; this.valu.erlevel = "D"; this.valid = false; }
    if(this.valid && this.valu.value > 999999){ this.valu.message = "(Too high)"; this.valu.erlevel = "D"; this.valid = false; }
    if (this.catg.value == "") { this.catg.message = "(required)"; this.catg.erlevel = "D"; this.valid = false; }
    if (this.prgm.value == "") { this.prgm.message = "(required)"; this.prgm.erlevel = "D"; this.valid = false; }

    this.loadDbS();
    
    }
    if(this.modebtn == 'ADD'){
      //Reset Error Messages
    this.desce.message  = "";
    this.catge.message  = "";
    this.value.message  = "";
    this.prgme.message  = "";
    this.dispAlert.default();
    //Trim Field values
    if(this.valid && this.value.value < 0){ this.value.message = "(invalid)"; this.value.erlevel = "D"; this.valid = false; }
    if(this.value.value!== null) this.value.value = parseFloat(this.value.value.toFixed(2));
    
    this.desce.value  = this.selectedRecE.desc.trim();
    this.catge.value  = this.selectedRecE.catg.trim();
    this.value.value  = this.selectedRecE.valu;

    var selectedplan = false;
    this.selectedRecE.prgm.forEach(element => {
      if(element.check){
        selectedplan = true;
        return true;
      }      
    });
    if(!selectedplan){ this.prgme.message = "(Select One)"; this.prgme.erlevel = "D"; this.valid = false; }

    if (this.desce.value == "") { this.desce.message = "(required)"; this.desce.erlevel = "D"; this.valid = false; }
    if (this.value.value == null) { this.value.message = "(required)"; this.value.erlevel = "D"; this.valid = false; }
    if(this.valid && this.value.value < 0){ this.value.message = "(invalid)"; this.value.erlevel = "D"; this.valid = false; }
    if(this.valid && this.value.value > 999999){ this.value.message = "(Too high)"; this.value.erlevel = "D"; this.valid = false; }
    if (this.catge.value == "") { this.catge.message = "(required)"; this.catge.erlevel = "D"; this.valid = false; }

    this.loadDbE();
    

    }
  }

  loadDbS(){
    if (!this.valid) return false;
    
    Util.showWait();
    this.jsonService
    .initService(this.selectedRec,Util.Url("CGICCTTYPE"))
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error(); Util.hideWait(); },
      () => {
        this.changes = false;
        this.dispAlert.setMessage(this.errSet);
        if (this.dispAlert.status === "S") {
            this.selectedRecG.codei = this.selectedRec.codei;
            this.selectedRecG.desc  = this.selectedRec.desc;
            this.selectedRecG.aply  = this.selectedRec.aply;
            this.selectedRecG.catg  = this.selectedRec.catg;
            this.selectedRecG.catgd = Util.getSelDesc(this.selectedRec.catg,this.pagedata.categories);
            this.selectedRecG.valu  = this.selectedRec.valu;
            this.selectedRecG.prgm  = this.selectedRec.prgm;
            this.selectedRecG.prgmd = Util.getSelDescP(this.selectedRec.prgm,this.pagedata.programs.plans);
            var pvpgm = "";
            this.pagedata.contracts = Util.sortBy2Key(this.pagedata.contracts,"prgmd","desc","A");
        this.pagedata.contracts.forEach((elem)=>{
          elem.sepr = false;
          if(pvpgm !== elem.prgm)
            elem.sepr = true;
          pvpgm = elem.prgm;
        });
            setTimeout(() => {
              Util.showWait();   
              this.cancel();
            }, 200);
        }else{
          Util.hideWait();
        }
      }
    );
  }

  setdefault(elem){
    this.pagedata.contracts.forEach(elm => {
      if(elm.prgm == elem.prgm) elm.dflt = false;
      
    });
    elem.dflt = true;
    this.changes= true;
    this.savedflt = true;
  }
  savedflts(){
    Util.showWait();
    var datadf ={"mode":"DFLT","list":[]};
    this.pagedata.contracts.forEach(elm=>{
      var obj={"code":elm.codei,"dflt":elm.dflt};
      datadf.list.push(obj);
    });
    this.jsonService
    .initService(datadf,Util.Url("CGICCTTYPE"))
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error(); Util.hideWait(); },
      () => {
        this.changes= false;
        this.savedflt = false;
        Util.hideWait();
      });
    
  }
  loadDbE(){
    if (!this.valid) return false;
    
    Util.showWait();
    this.jsonService
    .initService(this.selectedRecE,Util.Url("CGICCTTYPE"))
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error(); Util.hideWait(); },
      () => {
        this.changes = false;
        this.dispAlert.setMessage(this.errSet);
        if (this.dispAlert.status === "S") {
            var codes = this.dispAlert.data.match(/.{1,15}/g);
            var i = 0;
            this.selectedRecE.prgm.forEach((pgm)=>{
              if(pgm.check){
            this.newRec.codei = codes[i];
            this.newRec.desc  = this.selectedRecE.desc;
            
            this.newRec.catg  = this.selectedRecE.catg;
            if(this.newRec.catg == 'OTR')
              this.newRec.aply  = this.selectedRecE.aply;
            else
              this.newRec.aply  = "";
            this.newRec.catgd = Util.getSelDesc(this.selectedRecE.catg,this.pagedata.categories);
            this.newRec.valu  = this.selectedRecE.valu;
            this.newRec.prgm  = pgm.prgm;
            this.newRec.prgmd = Util.getSelDescP(this.newRec.prgm,this.pagedata.programs.plans);
            this.newRec.dflt  = false;

            this.pagedata.contracts.push(JSON.parse(JSON.stringify(this.newRec)));
            i++;
              }
          });
          this.pagedata.contracts = Util.sortBy2Key(this.pagedata.contracts,"prgmd","desc","A");
          var pvpgm = "";
        this.pagedata.contracts.forEach((elem)=>{
          elem.sepr = false;
          if(pvpgm !== elem.prgm)
            elem.sepr = true;
          pvpgm = elem.prgm;
        });
            setTimeout(() => {
              Util.showWait();   
              this.cancel();
            }, 200);

        }else{
          Util.hideWait();
        }
      }
    );
  }

  cancel(){

    Util.showWait();
    this.validating = false;
    this.selectedRec.default("ADD"); 
    Util.hideWait(); 
    Util.hideTopForm();
    this.modebtn = "ADD";
    this.dispAlert.default();
    Util.scrollTop();
    this.changes = false;
    
  }
  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
    .initService({"mode":"INIT"},Util.Url("CGICCTTYPE"))
    .subscribe(data => this.pagedata = data,
      err => {Util.hideWait(); },
      () => {
        Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        this.pagedata.contracts = Util.sortBy2Key(this.pagedata.contracts,"prgmd","desc","A");
        
        var pvpgm = "";
        this.pagedata.contracts.forEach((elem)=>{
          elem.sepr = false;
          if(pvpgm !== elem.prgm)
            elem.sepr = true;
          pvpgm = elem.prgm;
        });

        var pvlob = "";
        this.pagedata.programs.plans = Util.sortByKey(this.pagedata.programs.plans,"desc","A");
        this.pagedata.programs.plans = Util.sortBy2Key(this.pagedata.programs.plans,"plnt","lobd","A");
        this.pagedata.programs.plans.forEach((eachObj)=>{
          if(pvlob =="" || pvlob !== eachObj.lobd) eachObj.dlob = true;
          pvlob = eachObj.lobd; 
        });

        this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'CONTRACT');
        if (this.pagedata.head.status === "O" || this.noAuth) {
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          Util.hideWait();
        }
        this.pagedata.programs.plans = Util.sortByKey(this.pagedata.programs.plans,"desc","A");
        this.pagedata.programs.plans = Util.sortByKey(this.pagedata.programs.plans,"lobd","A");
       }
    );
  }

  canDeactivate() {

    if(this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

}

}
