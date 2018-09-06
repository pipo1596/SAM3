import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Contractdata, Cont } from './contractdata'; 
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
  noAuth = true;
  modebtn = "ADD";
  //Input Fields
  code = new  Textfield ;
  desc = new  Textfield ;
  catg = new  Textfield ;
  valu = new  Numfield ;
  prgm = new  Textfield ;
  //Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Top Section
  selectedRec = new Cont;
  selectedRecG = new Cont;
  //New Rec Skeleten
  newRec = new Cont;

  constructor(private jsonService: JsonService,private router: Router) { }

  onChange(){
    this.changes= true;
    this.validating = false;
  }

  addRecInit(){
    this.selectedRec.default("ADD");

    Util.showWait();    
    Util.showTopForm();
    Util.hideWait();
    this.validating = false;
    this.changes = false;

    this.modebtn = "ADD";
    Util.scrollTop();
    Util.focusById("code");
  
  }

  onSelect(record: Cont): void {
    this.selectedRec.code  = record.code;
    this.selectedRec.codei  = record.codei;
    this.selectedRec.desc  = record.desc;
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
      err => { this.dispAlert.error(), Util.hideWait(); },
      () => {
        this.dispAlert.setMessage(this.errSet);
        if (this.dispAlert.status === "S") {
  
            this.pagedata.contracts.splice(this.pagedata.contracts.findIndex(obj => obj.codei==this.selectedRec.codei),1);
            setTimeout(() => {
              Util.showWait();   
              this.cancel();
            }, 500);
  
          
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
    //Reset Error Messages
    this.code.message  = "";
    this.desc.message  = "";
    this.catg.message  = "";
    this.valu.message  = "";
    this.prgm.message  = "";
    this.dispAlert.default();
    //Trim Field values
    this.code.value  = this.selectedRec.code.trim().toUpperCase();
    this.selectedRec.code = this.selectedRec.code.trim().toUpperCase();
    if(this.valid && this.valu.value < 0){ this.valu.message = "(invalid)"; this.valu.erlevel = "D"; this.valid = false; }
    if(this.valu.value!== null) this.valu.value = parseFloat(this.valu.value.toFixed(2));
    
    
    this.desc.value  = this.selectedRec.desc.trim();
    this.catg.value  = this.selectedRec.catg.trim();
    this.valu.value  = this.selectedRec.valu;
    this.prgm.value  = this.selectedRec.prgm.trim();

    if (this.code.value == "") { this.code.message = "(required)"; this.code.erlevel = "D"; this.valid = false; }
    if (this.desc.value == "") { this.desc.message = "(required)"; this.desc.erlevel = "D"; this.valid = false; }
    if (this.valu.value == null) { this.valu.message = "(required)"; this.valu.erlevel = "D"; this.valid = false; }
    if(this.valid && this.valu.value < 0){ this.valu.message = "(invalid)"; this.valu.erlevel = "D"; this.valid = false; }
    if(this.valid && this.valu.value > 999999){ this.valu.message = "(Too high)"; this.valu.erlevel = "D"; this.valid = false; }
    if (this.catg.value == "") { this.catg.message = "(required)"; this.catg.erlevel = "D"; this.valid = false; }
    if (this.prgm.value == "") { this.prgm.message = "(required)"; this.prgm.erlevel = "D"; this.valid = false; }

    this.loadDb()
  }

  loadDb(){
    if (!this.valid) return false;
    
    Util.showWait();
    this.jsonService
    .initService(this.selectedRec,Util.Url("CGICCTTYPE"))
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error(), Util.hideWait(); },
      () => {
        this.changes = false;
        this.dispAlert.setMessage(this.errSet);
        if (this.dispAlert.status === "S") {

          if(this.selectedRec.mode=="ADD"){
            this.newRec.code  = this.selectedRec.code;
            this.newRec.codei = this.selectedRec.code.toUpperCase();
            this.newRec.desc  = this.selectedRec.desc;
            this.newRec.catg  = this.selectedRec.catg;
            this.newRec.catgd = Util.getSelDesc(this.selectedRec.catg,this.pagedata.categories);
            this.newRec.valu  = this.selectedRec.valu;
            this.newRec.prgm  = this.selectedRec.prgm;
            this.newRec.prgmd = Util.getSelDescP(this.selectedRec.prgm,this.pagedata.programs.plans);

            this.pagedata.contracts.push(JSON.parse(JSON.stringify(this.newRec)));

            setTimeout(() => {
              Util.showWait();   
              this.cancel();
            }, 500);


          }
          if(this.selectedRec.mode=="SAVE"){
            //this.index = this.pagedata.users.findIndex(obj => obj.user==this.selectedUser.user);
            //alert(this.index);
            this.selectedRecG.code  = this.selectedRec.code;
            this.selectedRecG.codei = this.selectedRec.code;
            this.selectedRecG.desc  = this.selectedRec.desc;
            this.selectedRecG.catg  = this.selectedRec.catg;
            this.selectedRecG.catgd = Util.getSelDesc(this.selectedRec.catg,this.pagedata.categories);
            this.selectedRecG.valu  = this.selectedRec.valu;
            this.selectedRecG.prgm  = this.selectedRec.prgm;
            this.selectedRecG.prgmd = Util.getSelDescP(this.selectedRec.prgm,this.pagedata.programs.plans);
            setTimeout(() => {
              Util.showWait();   
              this.cancel();
            }, 500);
          }

          
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
      err => {Util.responsiveMenu(); },
      () => {
        Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
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

       }
    );
  }

  canDeactivate() {

    if(this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

}

}
