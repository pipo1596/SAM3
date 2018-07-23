import { Component, OnInit } from '@angular/core';
import { Util } from '../utilities/util';
import { Dispalert, Errsetter } from '../utilities/dispalert';
import { Router } from '@angular/router';
import { Quote2data } from './quote2data';
import { JsonService } from '../utilities/json.service';
import { Textfield } from '../utilities/textfield';
import { Deductibles } from '../quote3/quote3data';
import { Coverages } from '../globalfilters/filtersdata';

@Component({
  selector: 'app-quote2',
  templateUrl: './quote2.component.html'
})
export class Quote2Component implements OnInit {
  changes = false;
  dispAlert = new Dispalert();
  errSet = new Errsetter();
  pagedata = new Quote2data();
  valid  :boolean = false;
  validc :boolean = false;
  validt :boolean = false;
  validd :boolean = false;
  listoc : number = 0;
  listvf : number = 0;
  firsttype   : number = 0;
  message:string ="";
  loading :boolean = true;

  expvehc : boolean = false;
  
  

  constructor(private jsonService: JsonService, private router: Router) { }
  toggle(data) {
    data.open = !data.open;

  }

  toggleschg(incheck){
    if(this.pagedata.body.veh.vin=='n/a' || incheck.type !='VF')
    incheck.chek = !incheck.chek;
  }

  togglebox(incheck,index) {
    incheck.check2 = !incheck.check2;
    
    if(incheck.termc !== undefined && index >=0){
      this.pagedata.body.data[index].cov.coverages.forEach((elem)=>{
        if(elem.desc == incheck.desc) elem.check2 = incheck.check2;
      });
    }
  }
  
  hideDupCov(){
    this.pagedata.body.srchg.forEach(elem =>{
      if(elem.type === "VF")
        this.listvf ++;
      else
        this.listoc ++;
    });
    this.firsttype = this.listvf;
    //this.listoc = Math.round(this.listoc/3);
    //this.listvf = Math.round(this.listvf/3);
    if(this.pagedata.body.srchg.length > 0){
      this.pagedata.body.srchg = Util.sortByKey(this.pagedata.body.srchg, "type","D");
    }
    if(this.pagedata.body.data.length > 0){
    this.pagedata.body.data = Util.sortByKey(this.pagedata.body.data, "desc","A");
    this.pagedata.body.data[0].open = true;
    }
    this.pagedata.body.data.forEach((elem) =>{
    elem.cov.coverages =  Util.sortByKey(elem.cov.coverages, "desc","A");
    var prvdesc ="";
    elem.cov.coverages.forEach((coverage) => {
      if(!coverage.check){
      if(prvdesc == coverage.desc){
        coverage.dup = true;
      }
      prvdesc = coverage.desc;      
    }
    });
  });
  }

  checkData() {
    this.dispAlert.default();

    this.valid  = true;
    
    var messagec = "";
    var messaget = "";
    var messaged = "";

    

    this.pagedata.body.data.forEach(parent=>{
      this.message ="";
      this.validc = false; if (parent.cov.coverages.length <=0) this.validc = true;
      this.validt = false; if (parent.trm.terms.length <=0) this.validt = true;
      this.validd = false; if (parent.ded.deductibles.length <=0) this.validd = true;
      var allexcl = true;
      parent.cov.coverages.forEach(coverage=>{
        if(coverage.check) coverage.check2 = false; else allexcl = false;
        if(coverage.check2) {this.validc = true;}
        
      });
      if (allexcl) this.validc = true;

      allexcl = true;
      parent.trm.terms.forEach(term=>{
        if(term.check) term.check2 = false; else allexcl = false;
        if(term.check2) {this.validt = true;}
      });
      if (allexcl) this.validt = true;

      allexcl = true;
      parent.ded.deductibles.forEach(Deductible=>{
        if(Deductible.check) Deductible.check2 = false;  else allexcl = false;
        if(Deductible.check2) {this.validd = true;}
      });
      if (allexcl) this.validd = true;
//if(this.valid){
    if(!this.validc || !this.validt || !this.validd){ 
      this.message ="( Select a ";
       
      if(!this.validc) this.message += "Coverage";    
      if(!this.validt) {if(!this.validc)this.message+=' / '; this.message += "Term";} 
      if(!this.validd) {if(!this.validc || !this.validt)this.message+=' / ';this.message += "Deductible";}  
      
      this.message += ' )';
             

      if(this.valid){
      this.errSet.status = "E";
      this.errSet.message = "Below selections required!";
      //this.dispAlert.setMessage(this.errSet);
      }
      this.valid=false;
      parent.open = true;
      //Util.scrollToId('quotesteps');
      parent.mesg = this.message;
      
     // return false;
    }else{
      
      parent.mesg = "";
      parent.open = false;
      
    }
  //}
    });

    if(!this.valid) Util.scrollStep2Err();
    else 
    Util.scrollToId('quotesteps');
    this.loadDb();
  }

  loadDb() {
    if(!this.valid) return false;
    Util.showWait2();
    Util.scrollToId('quotesteps');
    this.pagedata.body.mode = "SAVE";

   this.jsonService
      .initService(this.pagedata.body, Util.Url("CGICQUOTE2"))
      .subscribe(data => this.errSet = data,
        err => { this.dispAlert.error(), Util.hideWait(); },
        () => {
          
          if(this.errSet.status !== "S") this.dispAlert.setMessage(this.errSet);
                            if (this.errSet.status === "S") {
            setTimeout(() => {
              
              this.router.navigate(['/app/Quote3']);
            }, 200);
            this.changes = false;
          } else {
            Util.hideWait();
          }
        }
      );

  }

  toggleVeh(){
    this.expvehc = ! this.expvehc;
  } 

  selectAll(e, arr) {
    var srcEl = e.srcElement || e.target;
    this.changes = true;
    arr.forEach(function (eachObj) {
      eachObj.check2 = e.target.checked;
    });

  }

  defaultCheck() {
    this.pagedata.body.data.forEach((eachObj)=>{
      
      if (this.pagedata.body.chkdf.length > 0){
      //Coverages
      eachObj.cov.coverages.forEach(element => {
        var index = this.pagedata.body.chkdf.findIndex(obj => ( obj.type == "C" &&
                                                                obj.cov==element.termc && 
                                                                obj.prg == eachObj.prg &&
                                                                obj.ratc == eachObj.ratc ));
        if(index>=0) element.check2 = true;
        
      });
      //Terms
      eachObj.trm.terms.forEach(element => {
        var index = this.pagedata.body.chkdf.findIndex(obj => ( obj.type == "T" &&
                                                                obj.termm==element.termm && 
                                                                obj.miles==element.miles &&
                                                                obj.prg == eachObj.prg &&
                                                                obj.ratc == eachObj.ratc ));
        if(index>=0) element.check2 = true;
        
      });
      //Deductibles
      eachObj.ded.deductibles.forEach(element => {
        var index = this.pagedata.body.chkdf.findIndex(obj => ( obj.type == "D" &&
                                                                obj.ded == element.code &&
                                                                obj.prg == eachObj.prg &&
                                                                obj.ratc == eachObj.ratc));
        if(index>=0) element.check2 = true;
        
      });
    }
      this.pagedata.body.contracts.forEach(ctrct=>{
        if(ctrct.prgm.padEnd(20) == (eachObj.prg.padEnd(10) +eachObj.ratc.padEnd(10))){
          eachObj.showct = true;
          if(eachObj.ctrct == "") eachObj.ctrct = eachObj.prg.padEnd(10) + eachObj.ratc.padEnd(10) + ctrct.code.padEnd(30) + ctrct.valu;
          return false;
        }
      });
    });
  }

  ngOnInit() {
    this.pagedata.head.status ="I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
      .initService({ "mode": "INIT" }, Util.Url("CGICQUOTE2"))
      .subscribe(data => this.pagedata = data,
        err => {Util.responsiveMenu();  },
        () => {
          if(this.pagedata.body.typc){this.valid=true;this.loadDb();return false;}
          Util.responsiveMenu(); 
          Util.setHead(this.pagedata.head);
          //Sort By User Ascending
          this.pagedata.body.srchg = Util.sortByKey(this.pagedata.body.srchg, "type","D");
          this.pagedata.body.data = Util.killDups2(this.pagedata.body.data);
          this.hideDupCov();
          if (this.pagedata.head.status === "O" || Util.noAuth(this.pagedata.head.menuOp,'QUOTE1')) {


            setTimeout(() => {
              Util.hideWait();
              this.router.navigate(['/app/']);
            }, 100);
          } else {
            this.defaultCheck();
            //if(this.pagedata.body.code === "" && this.pagedata.body.contracts.length) this.pagedata.body.code = this.pagedata.body.contracts[0].code;
            Util.hideWait();
            setTimeout(() => { Util.scrollToId('quotesteps'); }, 100);
          }
          
          this.loading = false;

        } 

      );

  }
  canDeactivate() {

    // if the editName !== this.user.name
    if (this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

  }
}
