import { Component, OnInit } from '@angular/core';
import { Util } from '../utilities/util';
import { Dispalert, Errsetter } from '../utilities/dispalert';
import { Router } from '@angular/router';
import { Quote2data } from './quote2data';
import { JsonService } from '../utilities/json.service';

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
  chkdcoverages:any;
  warnings:any;
  covnum:number = 0;

  expvehc : boolean = false;
  
  

  constructor(private jsonService: JsonService, private router: Router) { }
  toggle(data) {
    data.open = !data.open;

  }

  toggleschg(incheck){
    if(incheck.lock) return;
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
    var allclosed = true;
    this.pagedata.body.srchg.forEach(elem =>{
      if(elem.type === "VF")
        this.listvf ++;
      else
        this.listoc ++;
    });
    this.firsttype = this.listvf;
    if(this.pagedata.body.srchg.length > 0){
      this.pagedata.body.srchg = Util.sortByKey(this.pagedata.body.srchg, "type","D");
    }
    if(this.pagedata.body.data.length > 0){
    this.pagedata.body.data = Util.sortByKey(this.pagedata.body.data, "desc","A");
    
    //  this.pagedata.body.data[0].open = true;
    }
    this.pagedata.body.data.forEach((elem) =>{
    //if(allclosed && !elem.dflt) {elem.open = true;allclosed = false;}
    elem.cov.coverages =  Util.sortBy2Key(elem.cov.coverages,"seq","desc","A");
    var prvdesc ="";
    this.covnum = 0;
    elem.cov.coverages.forEach((coverage) => {
      if(!coverage.check){
      if(prvdesc == coverage.desc){
        coverage.dup = true;
      }
      prvdesc = coverage.desc;      
    }
    coverage.clrf = this.showclrf(coverage);
    });
  });
  
  }

  checkData(mode) {
    this.dispAlert.default();

    this.valid  = true;
    
    this.pagedata.body.data.forEach(parent=>{
      this.message ="";
      this.validc = false; if (parent.cov.coverages.length <=0) this.validc = true;
      this.validt = false; if (parent.trm.terms.length <=0) this.validt = true;
      this.validd = false; if (parent.ded.deductibles.length <=0) this.validd = true;
      if(!parent.hascov || !parent.hastrm){
        this.validc = true;
        this.validt = true;
        this.validd = true;
      }
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
      if(mode == 'S'){
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
    }
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

    if(!this.valid && mode=='S') 
      Util.scrollStep2Err();
    else 
      Util.scrollToId('quotesteps');
    //this.loadDb();
    if(mode=='S')this.Warnings();
  }

  setCtrct(data){
    this.pagedata.body.contracts.forEach(ctrct=>{
      if((ctrct.prgm.padEnd(20)+ctrct.code.padEnd(30)) == data.ctrct){
        data.catg = ctrct.catg;
        data.valu = ctrct.valu;
        return false;
      }
    });
  }
  Warnings(){
    if(!this.valid) return false;
    this.chkdcoverages = [];

    this.pagedata.body.mode = "WARN";

    this.pagedata.body.data.forEach((elem) =>{
      elem.cov.coverages.forEach((coverage) => {
        if(coverage.check2){
          var ckcov = {"coverage":coverage.termc.padEnd(10)+elem.prg};
          this.chkdcoverages.push(ckcov);
          
        }
      });
    });
    var ckdata = {"mode":"WARN","cov":this.chkdcoverages,"tabid":sessionStorage.getItem("tabid")};
    this.jsonService
      .initService(ckdata, Util.Url("CGICQUOTE2"))
      .subscribe(data => this.warnings = data,
        err => { this.dispAlert.error(); Util.hideWait(); },
        () => {
          if(this.warnings.length <= 0){
            this.loadDb()
          }else{
            Util.showWarnings(this.warnings);
            Util.modalid("show","warnings");
          }
        }
      );

  }

  showclrf(elem){
    if(elem.check || elem.dup) return false;

    this.covnum += 1;
    if((this.covnum % 3) == 0)
      return true;
    else
      return false;   
  }
  
  loadDb() {
    if(!this.valid) return false;
    Util.showWait2('');
    Util.scrollToId('quotesteps');
    this.pagedata.body.mode = "SAVE";
    this.pagedata.body.data.forEach(element => {
      element.ctrct = element.ctrct.padEnd(50)+element.valu;
      
    });
   this.pagedata.body.tabid = sessionStorage.getItem("tabid");
   this.jsonService
      .initService(this.pagedata.body, Util.Url("CGICQUOTE2"))
      .subscribe(data => this.errSet = data,
        err => { this.dispAlert.error(); Util.hideWait(); },
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
      eachObj.check2 = srcEl.checked;
    });

  }

  defaultCheck() {
    this.pagedata.body.data.forEach((eachObj)=>{
      eachObj.cov.coverages.every(element => {if(!element.check) eachObj.hascov = true;return true;});
      eachObj.trm.terms.every(element => {if(!element.check) eachObj.hastrm = true;return true;});
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
    var xxctrct="",xxvalu="",xxcatg="";
      this.pagedata.body.contracts.forEach(ctrct=>{
        if(ctrct.prgm.padEnd(20) == (eachObj.prg.padEnd(10) +eachObj.ratc.padEnd(10))){
          eachObj.showct = true;
          if(eachObj.ctrct.trim() == ""){ 
            if(ctrct.isdf){eachObj.ctrct = eachObj.prg.padEnd(10) + eachObj.ratc.padEnd(10) + ctrct.code.padEnd(30);
                                   eachObj.valu=ctrct.valu;
                                   eachObj.catg=ctrct.catg;
            }else{
              if(xxctrct ==""){
              xxctrct = eachObj.prg.padEnd(10) + eachObj.ratc.padEnd(10) + ctrct.code.padEnd(30);
              xxvalu=ctrct.valu;
              xxcatg=ctrct.catg;
              }
            }
                                  }
        }
      });
      if(eachObj.ctrct.trim()==""){
        eachObj.ctrct = xxctrct;
        eachObj.valu= xxvalu;
        eachObj.catg= xxcatg;
      }
      //has OC?
      this.pagedata.body.srchg.forEach(schg=>{
        if(schg.prgm == eachObj.prg && schg.ratc == eachObj.ratc) {eachObj.hasoc = true;return;}
      });
    });
  }

  ngOnInit() {
    this.pagedata.head.status ="I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
      .initService({ "mode": "INIT","tabid": sessionStorage.getItem("tabid") }, Util.Url("CGICQUOTE2"))
      .subscribe(data => this.pagedata = data,
        err => {Util.responsiveMenu(); Util.hideWait(); },
        () => {
          if(this.pagedata.body.typc){this.valid=true;this.loadDb();return false;}
          Util.responsiveMenu(); 
          Util.setHead(this.pagedata.head);
          //Sort By User Ascending
          this.pagedata.body.srchg = Util.sortByKey(this.pagedata.body.srchg, "type","D");
          this.hideDupCov();
          if (this.pagedata.head.status === "O" || Util.noAuth(this.pagedata.head.menuOp,'QUOTE1')) {


            setTimeout(() => {
              Util.hideWait();
              this.router.navigate(['/app/']);
            }, 100);
          } else {
            this.defaultCheck();
            Util.hideWait();
            setTimeout(() => { Util.scrollToId('quotesteps'); }, 100);
          }

          var allones = true;
          if(this.pagedata.body.srchg.length > 0) allones = false;
          if(this.pagedata.body.chkdf.length > 0) allones = false;

          this.pagedata.body.data.forEach(parent=>{
            if(parent.dflt){//Default Fuccillo Conditional Programs if firt time.
              parent.cov.coverages.forEach((elem)=>{
                elem.check2 = true;
              })
              parent.trm.terms.forEach((elem)=>{
                elem.check2 = true;
              })
              parent.ded.deductibles.forEach((elem)=>{
                elem.check2 = true;
              })
            }
            else{//Default if only one in each
              var i =0;
              var onecov = 0,covind =[];
              var onetrm = 0,trmind =0;
              var oneded = 0,dedind =0;
              //Cov
              parent.cov.coverages.forEach((elem)=>{
                if(!elem.check && !elem.dup) {onecov += 1;}
                if(!elem.check){covind.push(i);}
                i +=1;
              });
              if(onecov == 1) {
                covind.forEach(ind =>{ parent.cov.coverages[ind].check2 = true;})
              }
              
              //Term
              i =0 ;
              parent.trm.terms.forEach((elem)=>{
                if(!elem.check) {onetrm += 1;trmind = i;}
                i+=1;
              });
              if(onetrm == 1) parent.trm.terms[trmind].check2 = true;
              //Ded
              i = 0;
              parent.ded.deductibles.forEach((elem)=>{
                if(!elem.check) {oneded += 1;dedind = i;}
                i+=1;
              })
              if(oneded == 1) parent.ded.deductibles[dedind].check2 = true;
            }

            if(onecov > 1 || onetrm  > 1 || oneded > 1){allones = false;}
          });

          if(allones){
            this.checkData('S');
          }
          
          this.checkData('L');
          this.loading = false;

        } 

      );

  }
  canDeactivate() {
    if (this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

  }
}
