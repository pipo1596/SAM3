import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Packsdata , Pack} from './packsdata'; 
import { Textfield , Numfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styles:['/deep/ date-input-polyfill button{display:none}']
})
export class PacksComponent implements OnInit {
  
  pagedata = new Packsdata ;
  tempdata : any;

  validating = false;
  valid = false;
  changes = false;
  noAuth = true;
  warnmesg:string ="";
  modebtn = "ADD";
  sectn:string = "R";
  active:string = "Y";
  //Input Fields
  prg  = new  Textfield ;
  cov  = new  Textfield ;
  term = new  Textfield ;
  nub  = new  Textfield ;
  mino = new  Numfield ;
  upmi = new  Numfield ;
  amti = new  Numfield ;
  amtr = new  Numfield ;
  pcti = new  Numfield ;
  pctr = new  Numfield ;
  amtc = new  Numfield ;
  effd = new  Textfield ;
  expd = new  Textfield ;
  d :Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  dc :string = this.d.toISOString().substring(0, 10);
 
  t :Date = new Date();
  today:string = this.t.toISOString().substring(0, 10);
  dc1 :string = (this.t.toISOString().substring(0, 10)).replace(/-/gi, "");

  //Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Top Section
  selectedRec = new Pack;
  selectedRecG = new Pack;
  //New Rec Skeleten
  newRec = new Pack;

  constructor(private jsonService: JsonService,private router: Router) { }

  onChange(){
    this.changes= true;
    this.validating = false;
  }
  
  xlate(prg){
    var index =this.pagedata.prgdrop.ratecards.findIndex(obj => obj.termp==prg.substring(0,9).trim() && obj.card==prg.substring(10,20).trim());
    if(index>=0)
      return this.pagedata.prgdrop.ratecards[index].desc;
    else
      return prg;
  }
  xlatecov(cov){
    var index = this.pagedata.covdrop.coverages.findIndex(obj => obj.termc==cov );
    if(index>=0)
      return this.pagedata.covdrop.coverages[index].desc;
    else
      return cov;
  }
  
  addRecInit(){
    this.selectedRec.default("ADD");
    
    Util.showWait();    
    Util.showTopForm();
    Util.hideWait();
    this.validating = false;
    this.changes = false;
    this.sectn = "R";
    if(this.pagedata.cmpc == 'PIP') this.sectn = 'B';

    this.modebtn = "ADD";
    Util.scrollTop();
    Util.focusById("code");
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

  onSelect(record: Pack): void {
    this.selectedRec.prg  = record.prg;
    this.selectedRec.cov  = record.cov;
    this.selectedRec.covd = record.cov;
    this.selectedRec.term = record.term;
    this.selectedRec.cvmn = record.term.substring(0, 3);
    this.selectedRec.cvml = record.term.substring(3);
    this.selectedRec.nub  = record.nub;
    this.selectedRec.mino = record.mino;
    this.selectedRec.upmi = record.upmi;
    this.selectedRec.amti = record.amti;
    this.selectedRec.amtc = record.amtc;
    this.selectedRec.amtr = record.amtr;
    this.selectedRec.pcti = record.pcti;
    this.selectedRec.pctr = record.pctr;
    this.selectedRec.effd = record.effd;
    this.selectedRec.effdi = record.effd;
    this.selectedRec.expd = record.expd;
    this.selectedRec.pkno = record.pkno;
    if(this.selectedRec.amti !==null || this.selectedRec.pcti !==null){this.sectn = "I";}else{this.sectn="R";}
    if(this.pagedata.cmpc == 'PIP') this.sectn = "B";

    this.selectedRecG = record;
    this.selectedRec.mode = "SAVE";
    this.modebtn = "SAVE";
    Util.showWait();
    Util.showTopForm();
    Util.hideWait();
    Util.scrollTop();
    Util.focusById("code");
    this.changes = false;
    this.newPrg("E");
    if(new Date(this.selectedRec.effd).toISOString().split('T')[0] < this.t.toISOString().split('T')[0]){
      setTimeout(() => {alert("Changes to this pack will not go into effect until tomorrow!")},500);
    }
  }

  delete(){
    if(confirm("Delete this Pack?")){
    this.selectedRec.mode = "DELETE";
    Util.showWait();
    this.jsonService
    .initService(this.selectedRec,Util.Url("CGICPACKSS")) 
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error();Util.hideWait(); },
      () => {
        this.dispAlert.setMessage(this.errSet);
        if (this.dispAlert.status === "S") {
          
          
          if(new Date(this.selectedRecG.effd).toISOString().split('T')[0] < this.t.toISOString().split('T')[0]){
            if(this.selectedRecG.expd > this.today) this.selectedRecG.expd = this.today;
          }else{
            this.pagedata.packs.splice(this.pagedata.packs.findIndex(obj => obj.pkno==this.selectedRec.pkno),1);
          }
          //if(new Date(this.selectedRecG.effd+ 'T00:00') > new Date(this.selectedRecG.expd+ 'T00:00')){
          //  this.selectedRecG.effd = this.selectedRecG.expd;
          //  }
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
    this.sortngroup(); 
  }

  newPrg(mode){
    if(this.selectedRec.prg == ""){ this.pagedata.trm.terms =  [{"termm":"","miles":"","check":false}];
                                    this.pagedata.covdrop.coverages =  [{"termp":"","termc":"","check":false}];
                                    return false;}
    this.changes = false;
    this.dispAlert.message="";
    if(mode=="NEW"){
      this.selectedRec.term = "";
      this.selectedRec.cvmn = "";
      this.selectedRec.cvml = "";
      this.selectedRec.cov = "";
    }
    Util.showWait();
    this.jsonService
        .initService({"mode":"PRG","prg":this.selectedRec.prg},Util.Url("CGICPACKSS"))
        .subscribe(data => this.tempdata = data,
        err => { this.dispAlert.error(); Util.hideWait(); },
        () => {
                Util.hideWait(); 
                this.pagedata.trm = this.tempdata.trm;
                this.pagedata.covdrop = this.tempdata.covdrop;
          }); 
  }

  checkData(){
    this.validating = true;
    this.valid = true;
    //Reset Error Messages
    this.prg.message  = "";
    this.effd.message = "";
    this.expd.message = "";
    this.term.message = "";
    this.amti.message = "";
    this.amtr.message = "";
    this.amtc.message = "";
    this.pcti.message = "";
    this.pctr.message = "";
    this.mino.message = "";
    this.upmi.message = "";
    this.warnmesg = "";

    this.dispAlert.default();
    //Trim Field values
    this.selectedRec.prg = this.selectedRec.prg.trim().padEnd(20).toUpperCase();
    this.prg.value   = this.selectedRec.prg.trim();
    this.effd.value  = this.selectedRec.effd.trim();
    this.expd.value  = this.selectedRec.expd.trim();
    this.term.value  = this.selectedRec.term;    
    this.amti.value  = this.selectedRec.amti;
    this.amtr.value  = this.selectedRec.amtr;
    this.amtc.value  = this.selectedRec.amtc;
    this.pcti.value  = this.selectedRec.pcti;
    this.pctr.value  = this.selectedRec.pctr;
    this.mino.value  = this.selectedRec.mino;
    this.upmi.value  = this.selectedRec.upmi;

    if (this.prg.value  == "") { this.prg.message  = "(required)"; this.prg.erlevel  = "D"; this.valid = false; }
    if (this.effd.value == "") { this.effd.message = "(required)"; this.effd.erlevel = "D"; this.valid = false; }
    if(this.effd.message =="" && this.effd.value !== this.selectedRec.effdi){//If Entry mode or if date changed!
      if(new Date(this.effd.value).toISOString().split('T')[0] < new Date().toISOString().split('T')[0]){
        this.effd.message = "(Cannot be in the past)"; this.effd.erlevel = "D"; this.valid = false;
      }
      if(new Date(this.effd.value).toISOString().split('T')[0] == new Date().toISOString().split('T')[0]){
        this.effd.message = "(Must be at least 1 day in the future)"; this.effd.erlevel = "D"; this.valid = false;
      }
    }
    
    if (this.expd.value == "") { this.expd.message = "(required)"; this.expd.erlevel = "D"; this.valid = false; }
    if (this.expd.value !== "") {
      if(new Date(this.expd.value).toISOString().split('T')[0] <= new Date().toISOString().split('T')[0]){
        this.expd.message = "(Cannot be in the past)"; this.expd.erlevel = "D"; this.valid = false;
      }
      }
    if (this.effd.message == "" && this.expd.message ==""){
    if(new Date(this.effd.value).toISOString().split('T')[0] > new Date(this.expd.value).toISOString().split('T')[0]){
      this.expd.message = "(Cannot be less than effective date)"; this.expd.erlevel = "D"; this.valid = false;
      }
    }
    if (this.amti.value < 0 && !this.pagedata.head.as400){ this.amti.message = "(invalid)"; this.amti.erlevel = "D"; this.valid = false; }
    if (this.amti.value!== null && (this.amti.value > 99999 || (this.amti.value.toString().length > 8))){ 
        this.amti.message = "(Too big)"; this.amti.erlevel = "D"; this.valid = false; 
      }

    if (this.amtr.value < 0 && !this.pagedata.head.as400){ this.amtr.message = "(invalid)"; this.amtr.erlevel = "D"; this.valid = false; }
    if (this.amtr.value!== null && (this.amtr.value > 99999 || (this.amtr.value.toString().length > 8))){ 
      this.amtr.message = "(Too big)"; this.amtr.erlevel = "D"; this.valid = false; 
    }
    if (this.amtc.value < 0){ this.amtc.message = "(invalid)"; this.amtc.erlevel = "D"; this.valid = false; }
    if (this.amtc.value!== null && (this.amtc.value > 99999 || (this.amtc.value.toString().length > 8))){ 
      this.amtc.message = "(Too big)"; this.amtc.erlevel = "D"; this.valid = false; 
    }

    //Retail Or Internal
    if(this.pagedata.cmpc !=='PIP'){
      if((this.amtc.value !== null || this.amtr.value !== null || this.pctr.value !==null) &&
      (this.amti.value !== null || this.pcti.value !==null)){this.warnmesg = "(RETAIL --OR-- INTERNAL)";  this.valid = false; }
      if(this.amtc.value === null && this.amtr.value === null && this.pctr.value ===null &&
       this.amti.value === null && this.pcti.value ===null) {this.warnmesg = "(RETAIL --OR-- INTERNAL REQUIRED)"; this.valid = false; }
    }else{
      if((this.amtc.value == null && this.amtr.value == null && this.pctr.value ==null) &&
      (this.amti.value == null && this.pcti.value ==null)){this.warnmesg = "(RETAIL --AND/OR-- INTERNAL)";  this.valid = false; }
      }
    if (this.pcti.value < 0){ this.pcti.message = "(invalid)"; this.pcti.erlevel = "D"; this.valid = false; }
    if (this.pcti.value!== null && (this.pcti.value > 99.99 || (this.pcti.value.toString().length > 6))){ 
      this.pcti.message = "(Too big)"; this.pcti.erlevel = "D"; this.valid = false; 
    }
    if (this.pctr.value < 0){ this.pctr.message = "(invalid)"; this.pctr.erlevel = "D"; this.valid = false; }
    if (this.pctr.value!== null && (this.pctr.value > 99.99 || (this.pctr.value.toString().length > 6))){ 
      this.pctr.message = "(Too big)"; this.pctr.erlevel = "D"; this.valid = false; 
    }
    if (this.mino.value < 0){ this.mino.message = "(invalid)"; this.mino.erlevel = "D"; this.valid = false; }
    if (this.mino.value!== null && (this.mino.value > 999999 || (this.mino.value.toString().length > 6))){ 
      this.mino.message = "(Too big)"; this.mino.erlevel = "D"; this.valid = false; 
    }
    if (this.upmi.value < 0){ this.upmi.message = "(invalid)"; this.upmi.erlevel = "D"; this.valid = false; }
    if (this.upmi.value!== null && (this.upmi.value > 999999 || (this.upmi.value.toString().length > 6))){ 
      this.upmi.message = "(Too big)"; this.upmi.erlevel = "D"; this.valid = false; 
    }
    if (this.valid && (this.effd.value > this.expd.value)){this.expd.message = "(Must be greater than effective date)"; this.expd.erlevel = "D"; this.valid = false;}
    this.loadDb()
  }

  loadDb(){
    if (!this.valid) return false;
    
    Util.showWait();
    this.jsonService
    .initService(this.selectedRec,Util.Url("CGICPACKSS"))
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error(); Util.hideWait(); },
      () => {
        this.changes = false;
        this.dispAlert.setMessage(this.errSet);
        if (this.dispAlert.status === "S") {
          
          var y = new Date();
                  
          if(this.selectedRec.mode=="ADD" || this.selectedRec.mode=="SAVE"){

            if(this.selectedRec.mode =="ADD" || this.selectedRec.effd < this.today){
            this.newRec.pkno = this.dispAlert.data;
            this.newRec.prg  = this.selectedRec.prg;
            this.newRec.cov  = this.selectedRec.cov;
            this.newRec.covd  = this.xlatecov(this.selectedRec.cov);
            this.newRec.term = this.selectedRec.term;
            this.newRec.cvmn = this.selectedRec.term.substring(0, 3);
            this.newRec.cvml = this.selectedRec.term.substring(3);
            this.newRec.nub  = this.selectedRec.nub;
            this.newRec.mino = this.selectedRec.mino;
            this.newRec.upmi = this.selectedRec.upmi;
            this.newRec.effd = this.selectedRec.effd;
            this.newRec.expd = this.selectedRec.expd;            
            this.newRec.exdd = this.selectedRec.expd.toString().replace(/-/gi, "");
            if(this.selectedRec.mode == "SAVE" && this.selectedRec.effd < this.today) this.newRec.effd =  this.dc;
            this.newRec.efdd = this.newRec.effd.toString().replace(/-/gi, "");
            this.newRec.amti = this.selectedRec.amti;
            this.newRec.amtr = this.selectedRec.amtr;
            this.newRec.pcti = this.selectedRec.pcti;
            this.newRec.pctr = this.selectedRec.pctr;
            this.newRec.amtc = this.selectedRec.amtc;
            
            if(this.dispAlert.data!==undefined && this.dispAlert.data!=="" && this.dispAlert.data!=="D")
            this.pagedata.packs.push(JSON.parse(JSON.stringify(this.newRec)));
            }  
           // if(this.selectedRec.mode=="SAVE" && this.selectedRec.effd <= this.today){
            if(this.selectedRec.mode=="SAVE"){
              //alert(this.index);
              if(this.selectedRecG.effd > this.today){
              this.selectedRecG.prg  = this.selectedRec.prg.padEnd(20);
              this.selectedRecG.cov  = this.selectedRec.cov;
              this.selectedRecG.covd = this.xlatecov(this.selectedRec.cov);
              this.selectedRecG.term = this.selectedRec.term;
              this.selectedRecG.cvmn = this.selectedRec.term.substring(0, 3);
              this.selectedRecG.cvml = this.selectedRec.term.substring(3);
              this.selectedRecG.nub  = this.selectedRec.nub;
              this.selectedRecG.mino = this.selectedRec.mino;
              this.selectedRecG.upmi = this.selectedRec.upmi;
              this.selectedRecG.effd = this.selectedRec.effd;
              this.selectedRecG.amti = this.selectedRec.amti;
              this.selectedRecG.amtr = this.selectedRec.amtr;
              this.selectedRecG.pcti = this.selectedRec.pcti;
              this.selectedRecG.pctr = this.selectedRec.pctr;
              this.selectedRecG.amtc = this.selectedRec.amtc;
              }
              if(this.dispAlert.data!==undefined && this.dispAlert.data!=="")
                this.selectedRecG.expd = y.toISOString().substring(0, 10);
              else{
                this.selectedRecG.expd = this.selectedRec.expd;
              }
              this.selectedRecG.efdd = this.selectedRecG.effd.toString().replace(/-/gi, "");
              this.selectedRecG.exdd = this.selectedRecG.expd.toString().replace(/-/gi, "");
              
              
              
            }

            setTimeout(() => {
              Util.showWait();   
              this.cancel();
            }, 500);


          }
          

          
        }else{
          Util.hideWait();
        }
        this.sortngroup();   

      }
    );
  }

   effect(){
    Util.showWait();
    this.sortngroup();
    if(this.sectn=="R"){
    this.selectedRec.amti = null;
    this.selectedRec.pcti = null;
    }else{
    this.selectedRec.amtr = null;
    this.selectedRec.amtc = null;
    this.selectedRec.pctr = null;
    }
    Util.hideWait();
  }

  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
    .initService({"mode":"INIT"},Util.Url("CGICPACKSS"))
    .subscribe(data => this.pagedata = data,
      err => { Util.hideWait(); },
      () => { Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'PACKS');
        if (this.pagedata.head.status === "O" || this.noAuth) {
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          Util.hideWait();
          this.selectedRec.prg = this.pagedata.dprg;
          this.pagedata.packs.forEach((elem)=>{
            elem.prgd = this.xlate(elem.prg);
          });
          this.sortngroup();
          
        }

       }
    );
  }

  sortngroup(){
    this.pagedata.packs.forEach((elem)=>{
      elem.prgd = this.xlate(elem.prg);
    });
    this.pagedata.packs = Util.sortBy2Key(this.pagedata.packs,"prgd","efdd","A");
    var pvprg = "";
    this.pagedata.packs.forEach((elem)=>{
      elem.sepr = false;
      elem.show = (this.active == 'N' || (this.dc1>=elem.efdd && this.dc1<=elem.exdd));
      if(elem.show){
          if(pvprg !== elem.prg)
            elem.sepr = true;
            pvprg = elem.prg;
      }

      
    });
  }

  canDeactivate() {

    if(this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

}
}
