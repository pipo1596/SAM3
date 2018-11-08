import { Component, OnInit } from '@angular/core';
import { Util } from '../utilities/util';
import { Dispalert, Errsetter } from '../utilities/dispalert';
import { Router } from '@angular/router';
import { Quote3data, Cont } from './quote3data';
import { JsonService } from '../utilities/json.service';
import { Textfield } from '../utilities/textfield';
import { Location } from '@angular/common';
import { indexDebugNode } from '@angular/core/src/debug/debug_node';

@Component({
  selector: 'app-quote3',
  templateUrl: './quote3.component.html'
})
export class Quote3Component implements OnInit {

  changes = false;
  dispAlert = new Dispalert();
  errSet = new Errsetter();
  pagedata = new Quote3data();
  expvehc: boolean = false;
  expcalc: boolean = false;
  listvf: number = 0;
  listoc: number = 0;
  ran:string = Util.makeid();
  loading: boolean = true;
  cont: Cont = { "code": "", "prgm": "", "desc": "", "catg": "", "slob": "", "valu": "0" };

  rightMatch: [any];
  ncbarr:[any];
  ncbarrv:[number];

  months: string = "12";
  mindwn: string = "5";
  totalp: string = "";
  mthlyp: string = "";
  downpm: string = "";
  balnce: string = "";
  firsttable: number = 0;
  hasQuote1:boolean = true;
  otcmode = false;
  notaxalert = true;
  //Bottom Section
  validating = false;
  valid = false;
  stock = new Textfield;
  first = new Textfield;
  last = new Textfield;
  cbfirst = new Textfield;
  cblast = new Textfield;
  email = new Textfield;
  phone = new Textfield;
  adr1 = new Textfield;
  adr2 = new Textfield;
  city = new Textfield;
  state = new Textfield;
  zip = new Textfield;

  constructor(private jsonService: JsonService, private router: Router, private location: Location) { }


  withcommas(x){
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  canceltax(){
    Util.modalid("hide","taxmodal");
  }
  clearsel(obj1){
    Util.showWait();
    obj1.selected = "";
    Util.hideWait();
  }
  oktax(){
    Util.modalid("hide","taxmodal");
    this.notaxalert = false;
    this.createCont();
  }
  createCont() {
    var selectedone = false;
    var selectedmult = false;
    var arrlob =[];
    this.pagedata.body.tables.forEach(element => {//One of each required
      
      if(element.selected !==undefined && element.selected !=="" && element.show && element.rates.length>0) 
      { selectedone = true;
        if(arrlob.indexOf(element.lob)>-1){selectedmult = true;}
        arrlob.push(element.lob)
        
      }
    });
    if (!selectedone) { Util.alertmodal("No coverages selected!", "Errors Detected"); return false; }
    //Multiple LOB!!
    if(selectedmult){
      var errmsg ="";
      var arrlob2 = [];
      var arrcnt =[];
      //load count
      for(var i=0; i < arrlob.length; i++){
        if(arrlob2.indexOf(arrlob[i])<0){
          arrlob2.push(arrlob[i]);
          arrcnt.push(1);
        }else{
          arrcnt[arrlob2.indexOf(arrlob[i])] = arrcnt[arrlob2.indexOf(arrlob[i])]+1; 
        }
      }
      //Error Message
      for(var i=0; i < arrcnt.length; i++){
        if(arrcnt[i]>1){
          errmsg = errmsg+"Multiple ["+arrlob2[i]+"] ("+arrcnt[i]+") Selected, please select one of each Line of Business.<br>";
        }

      }


      Util.alertmodal(errmsg, "Errors Detected"); return false;
    }
    if(this.pagedata.body.tax>0 && this.notaxalert){ Util.modalid("show","taxmodal"); return false;}
    this.notaxalert = true;
    Util.showWait();
    var contract: any = {};
    contract.mode = 'CONT';
    contract.CCST ='';
    contract.XTR8 ='';
    contract.COVC ='';
    contract.COV  ='';
    contract.NUP  ='';
    contract.PRG  ='';
    contract.RATC ='';
    contract.CVDS ='';
    contract.DED  ='';
    contract.CVMN ='';
    contract.CVML ='';
    contract.TAX  ='';
    contract.TERM ='';

    this.pagedata.body.tables.forEach(cont =>{
    if(cont.selected!==undefined && cont.selected!==""){
    var p = parseInt(cont.selected.substring(0, 3));
    var t = parseInt(cont.selected.substring(4, 7));
    var r = parseInt(cont.selected.substring(8, 11));
    var c = parseInt(cont.selected.substring(12, 15));
    var tb = this.pagedata.body.tables[p];
    contract.CCST += tb.rates[t].data[r][c][0].toString().padEnd(15);
    
    contract.COVC += Math.ceil(tb.rates[t].data[r][c][1]).toString().padEnd(15);
    contract.XTR8 += this.getCostPlus(p,t,r,c).toString().padEnd(15);
    contract.COV +=  tb.rates[t].coverage.padEnd(10);
    contract.NUP +=  tb.rates[t].nup.padEnd(1);
    contract.PRG += tb.rates[t].program.padEnd(10);
    contract.RATC += tb.rates[t].ratc.padEnd(10);
    contract.CVDS += tb.rates[t].title.padEnd(50);
    contract.DED +=  tb.rates[t].cols[c].ded.toString().padEnd(10);
    
    if(this.xlatelobc(contract.PRG.trim(), contract.RATC.trim())=='WT'){
      contract.CVMN += this.pagedata.body.veh.lmth.toString().padEnd(3);
      contract.CVML += this.pagedata.body.veh.lmil.toString().padEnd(7);
      contract.TERM += (this.pagedata.body.veh.lmth+' Months / ' +
                    this.withcommas(this.pagedata.body.veh.lmil)+' Miles').padEnd(50);
    }else{
      contract.CVMN += tb.rates[t].rows[r].mon.toString().padEnd(3);
      contract.CVML += tb.rates[t].rows[r].mil.toString().padEnd(7);
      contract.TERM += (tb.rates[t].rows[r].mon+' Months / ' +
                    this.withcommas(tb.rates[t].rows[r].mil)+' Miles').padEnd(50);
    }
   
    contract.TXRT = this.pagedata.body.tax;
    if(this.pagedata.body.tax>0){
    var subt = (contract.CCST/(1+(contract.TXRT/100)));
    contract.TAX  +=  (contract.CCST - subt).toFixed(2).toString().padEnd(15);
    }                
    
  }                 
                  });
    //alert(JSON.stringify(contract)) ;

    this.jsonService
        .initService(contract, Util.Url("CGICCNTRCT"))
        .subscribe(data => this.errSet = data,
          err => { this.dispAlert.error(); Util.hideWait(); },
          () => {
            this.router.navigate(['/app/Contract']);

          });
  }
  //==================================================================================================//
  getCostPlus(p,t,r,c){
    var i = this.ncbarr.indexOf(p.toString().padEnd(4)+
                                t.toString().padEnd(4)+
                                r.toString().padEnd(4)+
                                c.toString().padEnd(4) );
    if(i>-1){
      return this.ncbarrv[i];
    }
    else return 0;
  }
  //==================================================================================================//
  onChange() {

    this.validating = false;
    this.changes = true;
  }
  //==================================================================================================//
  mode3() {
    Util.showWait();
    this.pagedata.body.pagemode = '3';
    this.nodefaultsel();
    this.location.replaceState("/app/Quote3");
    setTimeout(() => {
      Util.hideWait();
      Util.scrollToId('quotesteps');
    }, 300);
  }
  //==================================================================================================//  
  otcOn() {
    this.otcmode = true;
  }
  //==================================================================================================//
  otcOff() {
    this.otcmode = false;
  }
  //==================================================================================================//
  toggle(data) {
    Util.showWait();
    var status = data.open;
    this.pagedata.body.data.forEach((element) => {
      element.open = false;
    })
    data.open = !status;
    Util.scrollToId('step3left');
    var i = 0;
    this.pagedata.body.tables.forEach(table => {
      var index = -1;
      if (table.rates !== undefined) index = table.rates.findIndex(obj => (obj.program == data.prg && obj.ratc == data.ratc));
      if (index >= 0) {
        //var tmp = this.pagedata.body.tables[0];
        //          this.pagedata.body.tables[0] = this.pagedata.body.tables[i];
        //          this.pagedata.body.tables[i] = tmp;
        this.firsttable = i;
      }
      i++;
    });

    Util.hideWait();
  }
  //==================================================================================================//
  togglebox(incheck, intype, inprg, inratc, indexin) {
    incheck.check2 = !incheck.check2;
    Util.showWait();
    switch (intype) {
      case ('C'):
        var index = this.pagedata.body.chkdf.findIndex(obj => (
          obj.type == 'C' &&
          obj.cov == incheck.termc &&
          obj.prg == inprg &&
          obj.ratc == inratc));
        break;
      case ('T'):
        var index = this.pagedata.body.chkdf.findIndex(obj => (
          obj.type == 'T' &&
          obj.miles == incheck.miles &&
          obj.termm == incheck.termm &&
          obj.prg == inprg &&
          obj.ratc == inratc));
        break;
      case ('D'):
        var index = this.pagedata.body.chkdf.findIndex(obj => (
          obj.type == 'D' &&
          obj.ded == incheck.code &&
          obj.prg == inprg &&
          obj.ratc == inratc));
        break;

    }
    if (index >= 0 && !incheck.check2)
      this.pagedata.body.chkdf.splice(index, 1);
    else if (incheck.check2)
      switch (intype) {
        case ('C'):
          this.pagedata.body.chkdf.push({
            "type": intype,
            "prg": inprg,
            "ratc": inratc,
            "cov": incheck.termc,
            "ded": "",
            "termm": "",
            "miles": "",
            "indx": indexin,
            "check": "T"
          });
          break;
        case ('T'):
          this.pagedata.body.chkdf.push({
            "type": intype,
            "prg": inprg,
            "ratc": inratc,
            "cov": "",
            "ded": "",
            "termm": incheck.termm,
            "miles": incheck.miles,
            "indx": indexin,
            "check": "T"
          });
          break;
        case ('D'):
          this.pagedata.body.chkdf.push({
            "type": intype,
            "prg": inprg,
            "ratc": inratc,
            "cov": "",
            "ded": incheck.code,
            "termm": "",
            "miles": "",
            "indx": indexin,
            "check": "T"
          });
          break;


      }



    this.defaultCheck("C");

    //Clear All selected on any action
    this.pagedata.body.coverages = [{ "index": "" }];
    this.pagedata.body.coverages.pop();
    this.pagedata.body.tables.forEach(table => {
      if (table.rates !== undefined) {
        table.rates.forEach(rate => {
          if (rate.data !== undefined) {
            rate.data.forEach(row => {
              row.forEach(unitp => {
                if (unitp[2] !== undefined) unitp[2] = 0;
              });
            });
          }
        });
      }
    });

    Util.hideWait();
  }
  //==================================================================================================//
  toggleCov(incheck, intype, inprg, inratc, indexin) {

    var status = incheck.check2;
    this.pagedata.body.data.forEach((eachObj) => {
      //Coverages
      eachObj.cov.coverages.forEach(element => {

        if (incheck.desc == element.desc) {
          

          element.check2 = status;
          this.togglebox(element, intype, inprg, inratc, indexin);
        }
      });
    });
  }
  //==================================================================================================//
  toggleAllT(e, intype, inprg, inratc, indexin) {

    var srcEl = e.srcElement || e.target;

    this.pagedata.body.data.forEach((eachObj) => {
      //Trm
      if (inprg == eachObj.prg && inratc == eachObj.ratc) {
      eachObj.trm.terms.forEach(element => {
        if(!element.check && !element.disbl){
          var index = this.pagedata.body.chkdf.findIndex(obj => (
            obj.type == 'T' &&
            obj.miles == element.miles &&
            obj.termm == element.termm &&
            obj.prg == inprg &&
            obj.ratc == inratc));
            if (index >= 0 ) this.pagedata.body.chkdf.splice(index, 1);
          element.check2 = !srcEl.checked;
          this.togglebox(element, intype, inprg, inratc, indexin);
        }
      });
    }
    });
  }
  //==================================================================================================//
  toggleAllD(e, intype, inprg, inratc, indexin) {

    var srcEl = e.srcElement || e.target;

    this.pagedata.body.data.forEach((eachObj) => {
      if (inprg == eachObj.prg && inratc == eachObj.ratc) {
      //Ded
      eachObj.ded.deductibles.forEach(element => {
        if(!element.check && !element.disbl){
          var index = this.pagedata.body.chkdf.findIndex(obj => (
            obj.type == 'D' &&
            obj.ded == element.code &&
            obj.prg == inprg &&
            obj.ratc == inratc));
            if (index >= 0 ) this.pagedata.body.chkdf.splice(index, 1);
          element.check2 = !srcEl.checked;
          this.togglebox(element, intype, inprg, inratc, indexin);
        }
      });
    }
    });
  }
  //==================================================================================================//
  toggleCovAll(e, intype, inprg, inratc, indexin) {

    var srcEl = e.srcElement || e.target;

    this.pagedata.body.data.forEach((eachObj) => {
      //Coverages
      if (inprg == eachObj.prg && inratc == eachObj.ratc) {
      eachObj.cov.coverages.forEach(element => {
        if(!element.check && !element.disbl && !element.dup){
          var index = this.pagedata.body.chkdf.findIndex(obj => (
            obj.type == 'C' &&
            obj.cov == element.termc &&
            obj.prg == inprg &&
            obj.ratc == inratc));
            if (index >= 0 ) this.pagedata.body.chkdf.splice(index, 1);
          element.check2 = !srcEl.checked;
          this.togglebox(element, intype, inprg, inratc, indexin);
        }
      });
    }
    });
  }
  //==================================================================================================//  
  toggleVeh() {
    this.expvehc = !this.expvehc;
  }
  //==================================================================================================//  
  toggleCalc() {
    this.expcalc = !this.expcalc;
  }
  //==================================================================================================//  
  hideLeft() {
    Util.hideLeft();
  }
  //==================================================================================================//
  showLeft() {
    Util.showLeft();
  }
  //==================================================================================================//
  formatPhone() {
    var numbers = this.phone.value.replace(/\D/g, ''),
      char = { 0: '(', 3: ') ', 6: '-' };
    this.phone.value = '';
    for (var i = 0; i < numbers.length; i++) {
      this.phone.value += (char[i] || '') + numbers[i];
    }
  }
  //==================================================================================================//
  checkData() {

    this.dispAlert.default();
    if (this.otcmode) return false;
    this.validating = true;
    this.valid = true;

    this.stock.message = "";
    this.first.message = "";
    this.last.message = "";
    this.email.message = "";
    this.phone.message = "";
    this.adr1.message = "";
    this.adr2.message = "";
    this.city.message = "";
    this.state.message = "";
    this.zip.message = "";

    this.stock.value = this.stock.value.trim();
    this.first.value = this.first.value.trim();
    this.last.value = this.last.value.trim();
    this.cbfirst.value = this.cbfirst.value.trim();
    this.cblast.value = this.cblast.value.trim();
    this.adr1.value = this.adr1.value.trim();
    this.adr2.value = this.adr2.value.trim();
    this.city.value = this.city.value.trim();
    this.zip.value = this.zip.value.trim();
    if (this.pagedata.body.coverages.length <= 0) { Util.alertmodal("No coverages selected!", "Errors Detected"); this.valid = false; }



    var adent = this.adr1.value + this.city.value + this.state.value + this.zip.value;

    if (this.stock.value == "") { this.stock.message = "(required)"; this.stock.erlevel = "D"; this.valid = false; }
    if (this.first.value == "") { this.first.message = "(required)"; this.first.erlevel = "D"; this.valid = false; }
    if (this.last.value == "") { this.last.message = "(required)"; this.last.erlevel = "D"; this.valid = false; }
    if (this.email.value !== "" && !Util.validemail(this.email.value)) { this.email.message = "(invalid Email)"; this.email.erlevel = "D"; this.valid = false; }
    if (this.phone.value !== "" && !Util.validphone(this.phone.value)) { this.phone.message = "(invalid Phone)"; this.phone.erlevel = "D"; this.valid = false; }
    if (this.zip.value !== "" && !Util.validZip(this.zip.value)) { this.zip.message = "(invalid Zip)"; this.zip.erlevel = "D"; this.valid = false; }
    if (adent !== "" && this.adr1.value == "") { this.adr1.message = "(required)"; this.adr1.erlevel = "D"; this.valid = false; }
    if (adent !== "" && this.city.value == "") { this.city.message = "(required)"; this.city.erlevel = "D"; this.valid = false; }
    if (adent !== "" && this.state.value == "") { this.state.message = "(required)"; this.state.erlevel = "D"; this.valid = false; }
    if (adent !== "" && this.zip.value == "") { this.zip.message = "(required)"; this.zip.erlevel = "D"; this.valid = false; }
    this.loadDb();
  }
  //==================================================================================================//
  calcChng(field) {
    if (parseFloat(this.totalp) <= 0 || isNaN(parseFloat(this.totalp))) this.totalp = "0";
    if (parseFloat(this.downpm) <= 0 || isNaN(parseFloat(this.downpm))) this.downpm = "0";

    if (field !== "downpm") this.downpm = (parseFloat(this.totalp) * (parseFloat(this.mindwn) / 100)).toFixed(2);

    if (parseFloat(this.downpm) > parseFloat(this.totalp)) this.downpm = parseFloat(this.totalp).toFixed(2);

    this.balnce = (parseFloat(this.totalp) - (parseFloat(this.downpm))).toFixed(2);
    this.mthlyp = (parseFloat(this.balnce) / (parseFloat(this.months))).toFixed(2);

    if (field !== "totalp") this.totalp = parseFloat(this.totalp).toFixed(2);
    if (field !== "mthlyp") this.mthlyp = parseFloat(this.mthlyp).toFixed(2);
    if (field !== "downpm") this.downpm = parseFloat(this.downpm).toFixed(2);
    if (field !== "balnce") this.balnce = parseFloat(this.balnce).toFixed(2);

    if (parseFloat(this.totalp) <= 0 || isNaN(parseFloat(this.totalp))) this.totalp = "";
    if (parseFloat(this.downpm) <= 0 || isNaN(parseFloat(this.downpm))) this.downpm = "";
  }
  //==================================================================================================//
  loadDb() {
    if (!this.valid){Util.scrollToId('userinfo'); return false;}
    Util.showWait2('');
    this.applySurch("D");
    setTimeout(() => {
      this.pagedata.body.mode = "SAVE";
      this.pagedata.body.tables.forEach((table) => {
        if (table.valu !== -1.2323 && table.valu !== undefined)
          table.ctrct = table.ctrct.substring(0, 50)+table.valu;
      });

      this.pagedata.body.stock = this.stock.value;
      this.pagedata.body.first = this.first.value;
      this.pagedata.body.last = this.last.value;
      this.pagedata.body.cbfirst = this.cbfirst.value;
      this.pagedata.body.cblast = this.cblast.value;
      this.pagedata.body.email = this.email.value;
      this.pagedata.body.phone = this.phone.value;
      this.pagedata.body.adr1 = this.adr1.value;
      this.pagedata.body.adr2 = this.adr2.value;
      this.pagedata.body.city = this.city.value;
      this.pagedata.body.state = this.state.value;
      this.pagedata.body.zip = this.zip.value;

      this.jsonService
        .initService(this.pagedata.body, Util.Url("CGICQUOTE3"))
        .subscribe(data => this.errSet = data,
          err => { this.dispAlert.error(); Util.hideWait(); },
          () => {

            this.pagedata.body.tables.forEach((table) => {
              table.show = false;
              if (table.valu !== -1.2323 && table.valu !== undefined)
                table.ctrct = table.ctrct.substring(0, 50);
            });



           
            var tb = this.pagedata.body.tables;
            this.pagedata.body.coverages.forEach(cov => {
              var p = parseInt(cov.index.substring(0, 3));
              var t = parseInt(cov.index.substring(4, 7));
              var r = parseInt(cov.index.substring(8, 11));
              var c = parseInt(cov.index.substring(12, 15));
              if (tb[p] !== undefined && tb[p].rates !== undefined)
                if (tb[p].rates[t] !== undefined)
                  if (tb[p].rates[t].data[r] !== undefined)
                    if (tb[p].rates[t].data[r][c] !== undefined) {
                      tb[p].rates[t].data[r][c][2] = 1;
                      tb[p].show = true;
                    }

            });
            this.nodefaultsel();
            this.pagedata.body.pagemode = 'R';
            this.changes = false;
            this.location.replaceState("/app/Results");
            this.pagedata.body.qtid = this.errSet.data;
            Util.scrollToId('quotesteps');
            //this.dispAlert.setMessage(this.errSet);
            if (this.dispAlert.status === "S") {
              setTimeout(() => {
                Util.hideWait();


              }, 100);
              this.changes = false;
            } else {
              Util.hideWait();
            }
          }
        );
    }, 100);
  }
  //==================================================================================================//
  eligibility(index) {

    Util.showWait();

    setTimeout(() => {
      this.defaultCheck("C");
      Util.hideWait();
    }, 20);
  }
  //==================================================================================================//
  arrayToMatrix(mode) {

    //Disable
    var master: [any] = [""];
    var cov = this.pagedata.body.chkdf;
    master.pop();
    if (this.pagedata.body.tables.length <= 0) return false;
    this.pagedata.body.tables.forEach((table) => {
      if (table.rates !== undefined) {
        table.rates.forEach((program) => {

          var index = cov.findIndex(obj => (obj.type == "C" &&
            obj.cov == program.coverage &&
            obj.prg == program.program &&
            obj.ratc == program.ratc));
          if (index >= 0) {
            program.check = true;
            table.nup = this.pagedata.body.data[cov[index].indx].nup;
            table.dflt = this.pagedata.body.data[cov[index].indx].dflt;
            table.showct = false;
            table.prgm = this.pagedata.body.data[cov[index].indx].prg;
            table.ratc = this.pagedata.body.data[cov[index].indx].ratc;
            table.catg = this.pagedata.body.data[cov[index].indx].catg;
            table.ctrct = this.pagedata.body.data[cov[index].indx].ctrct;
            table.valu = parseFloat(this.pagedata.body.data[cov[index].indx].valu);
          }
          else
            program.check = false;


          if (program.check) {
            master.push({
              "type": "C"
              , "prg": program.program
              , "ratc": program.ratc
              , "cov": program.coverage
              , "ded": ""
              , "termm": ""
              , "miles": ""
              , "nup": program.nup
              , "check": false
            });
          }
          //if(table.nup===undefined || table.nup==="") table.nup = program.nup;
          program.rows.forEach(row => {
            var index = cov.findIndex(obj => (obj.type == "T" &&
              obj.miles == row.mil &&
              obj.termm == row.mon &&
              obj.prg == program.program &&
              obj.ratc == program.ratc));
            if (index >= 0)
              row.check = true;
            else
              row.check = false;

            if (program.check && table.nup == program.nup) {
              master.push({
                "type": "T"
                , "prg": program.program
                , "ratc": program.ratc
                , "cov": ""
                , "ded": ""
                , "termm": row.mon
                , "miles": row.mil
                , "nup": program.nup
                , "check": false
              });
            }

            program.cols.forEach((col) => {
              var index = cov.findIndex(obj => (obj.type == "D" &&
                obj.ded == col.ded &&
                obj.prg == program.program &&
                obj.ratc == program.ratc));
              if (index >= 0)
                col.check = true;
              else
                col.check = false;

              if (program.check && table.nup == program.nup) {
                master.push({
                  "type": "D"
                  , "prg": program.program
                  , "ratc": program.ratc
                  , "cov": ""
                  , "ded": col
                  , "termm": ""
                  , "miles": ""
                  , "nup": program.nup
                  , "check": false
                });
              }
            });
          });
          table.desc = this.xlateprg(program.program, program.ratc);
          table.lob = this.xlatelob(program.program, program.ratc);
        });
      }
    });
    this.rightMatch = master;

    //Hide Contracts if none
    this.pagedata.body.tables.forEach(table => {
      this.pagedata.body.contracts.forEach(ctrct => {
        if (table.prgm !== undefined && table.ratc !== undefined) {
          if (ctrct.prgm.padEnd(20) == table.prgm.padEnd(10) + table.ratc.padEnd(10)) {
            table.showct = true;
            return false;
          }
        }
      });
    });

    if (this.pagedata.body.tables.length > 0 && mode == "I") {
      
      this.pagedata.body.tables.forEach((table) => {
        if (table.rates !== undefined)
          table.rates = Util.sortBy2Key(table.rates, "title", "program", "A");
      });

    }
  }
  //==================================================================================================//
  dspUsed(prg){
    if(this.pagedata.body.dspasnew.indexOf(prg)>-1) return "New";
    else
    return "Used";      
  }
  //==================================================================================================//
  hideDupCov() {

    this.pagedata.body.srchg.forEach(elem => {
      if (elem.type === "VF")
        this.listvf++;
      else
        this.listoc++;
    });

    if (this.pagedata.body.srchg.length > 0) {
      this.pagedata.body.srchg = Util.sortByKey(this.pagedata.body.srchg, "type", "D");
    }

    this.pagedata.body.data.forEach((elem) => {
      elem.cov.coverages = Util.sortByKey(elem.cov.coverages, "desc", "A");


      //N
      var prvdesc = "";
      elem.cov.coverages.forEach((coverage) => {
        coverage.dup = false;
        if (coverage.nup == "N") {
          if (!coverage.check) {
            if (prvdesc == coverage.desc && !coverage.check) {
              coverage.dup = true;
            }

            if (!coverage.disbl) {
              prvdesc = coverage.desc;
            }
          }
        }
      });
      //U
      var prvdesc = "";
      elem.cov.coverages.forEach((coverage) => {
        if (coverage.nup == "U") {
          if (!coverage.check) {
            if (prvdesc == coverage.desc && !coverage.check) {
              coverage.dup = true;
            }

            if (!coverage.disbl) {
              prvdesc = coverage.desc;
            }
          }
        }
      });
      //P
      var prvdesc = "";
      elem.cov.coverages.forEach((coverage) => {
        if (coverage.nup == "P") {
          if (!coverage.check) {
            if (prvdesc == coverage.desc && !coverage.check) {
              coverage.dup = true;
            }

            if (!coverage.disbl) {
              prvdesc = coverage.desc;
            }
          }
        }
      });


    });
  }
  //==================================================================================================//  
  chekDesc2(index, desc, val) {
    if (index < 0) return false;
    this.pagedata.body.data[index].cov.coverages.forEach((element) => {
      if (element.desc == desc) element.check2 = val;
    });
  }
  //==================================================================================================//  
  chekDesc(mode) {
    var i = 0;
    this.pagedata.body.data.forEach((eachObj) => {
      //Coverages
      eachObj.cov.coverages.forEach(element => {

        if (!element.disbl) this.chekDesc2(i, element.desc, element.check2);

      });
      i++;
    });

  }
  //==================================================================================================//
  nodefaultsel() {
    this.pagedata.body.data.forEach((eachObj) => { eachObj.selected = '' });
  }
  //==================================================================================================//  
  defaultCheck(mode) {
    if (mode == "I") {
      this.stock.value = this.pagedata.body.stock;
      this.first.value = this.pagedata.body.first;
      this.last.value = this.pagedata.body.last;
      this.cbfirst.value = this.pagedata.body.cbfirst;
      this.cblast.value = this.pagedata.body.cblast;
      this.email.value = this.pagedata.body.email;
      this.phone.value = this.pagedata.body.phone;
      this.adr1.value = this.pagedata.body.adr1;
      this.adr2.value = this.pagedata.body.adr2;
      this.city.value = this.pagedata.body.city;
      this.state.value = this.pagedata.body.state;
      this.zip.value = this.pagedata.body.zip;


    }

    this.arrayToMatrix(mode);
    this.pagedata.body.data.forEach((eachObj) => {
      //Coverages
      eachObj.cov.coverages.forEach(element => {


        var index = this.pagedata.body.chkdf.findIndex(obj => (obj.type == "C" &&
          obj.cov == element.termc &&
          obj.prg == eachObj.prg &&
          obj.ratc == eachObj.ratc));
        if (index >= 0) { element.check2 = true; }

        var indexin = this.rightMatch.findIndex(obj => (obj.type == "C" &&
          obj.cov == element.termc &&
          obj.prg == eachObj.prg &&
          obj.ratc == eachObj.ratc));
        if (indexin >= 0) {
          element.disbl = false;
          //if(mode=="I"){
          if (eachObj.nup === undefined || eachObj.nup == "") eachObj.nup = this.rightMatch[indexin].nup;
          if (this.rightMatch[indexin].nup == "N") eachObj.dspn = true;
          if (this.rightMatch[indexin].nup == "U") eachObj.dspu = true;
          if (this.rightMatch[indexin].nup == "P") eachObj.dspp = true;
          element.nup = this.rightMatch[indexin].nup;
          //}

        }
        else {
          element.check2 = false;
        }

      });
      //Terms
      eachObj.trm.terms.forEach(element => {

        var index = this.pagedata.body.chkdf.findIndex(obj => (obj.type == "T" &&
          obj.termm == element.termm &&
          obj.miles == element.miles &&
          obj.prg == eachObj.prg &&
          obj.ratc == eachObj.ratc));
        if (index >= 0) element.check2 = true;
        var indexin = this.rightMatch.findIndex(obj => (obj.type == "T" &&
          obj.termm == element.termm &&
          obj.miles == element.miles &&
          obj.prg == eachObj.prg &&
          obj.ratc == eachObj.ratc));
        if (indexin >= 0)
          element.disbl = false;
        else {
          element.check2 = false;
          element.disbl = true;
        }



      });
      //Deductibles
      eachObj.ded.deductibles.forEach(element => {

        var index = this.pagedata.body.chkdf.findIndex(obj => (obj.type == "D" &&
          obj.ded == element.code &&
          obj.prg == eachObj.prg &&
          obj.ratc == eachObj.ratc));
        if (index >= 0) element.check2 = true;

        var indexin = this.rightMatch.findIndex(obj => (obj.type == "D" &&
          obj.ded.ded == element.code &&
          obj.prg == eachObj.prg &&
          obj.ratc == eachObj.ratc));
        if (indexin >= 0)
          element.disbl = false;
        else {
          element.check2 = false;
          element.disbl = true;
        }

      });
    });

    if (mode == "I") this.defaultCheck("C");
    this.chekDesc(mode);



  }
  //==================================================================================================//
  applySurch(mode) {
    this.ncbarr =[''];this.ncbarr.pop();
    this.ncbarrv =[0];this.ncbarrv.pop();
    if (mode == 'C') { Util.showWait(); }

    this.pagedata.body.tables.forEach((table, i0) => {
      if (table.rates !== undefined && table.prgm !== undefined && table.ctrct !== undefined) {
        var ic = this.pagedata.body.contracts.findIndex(obj => (obj.code.trim() == table.ctrct.substring(20).trim()));
        if (ic > -1) {
          this.cont = this.pagedata.body.contracts[ic];
          table.catg = this.cont.catg;
          if (table.valu == undefined || table.valu == -1.2323){if(this.cont.catg=='OTC') table.valu = parseFloat(this.cont.valu);}
          if (mode == 'D' && this.cont.catg == 'OTC') this.cont.valu = table.valu.toFixed(2);
        }

        table.rates.forEach((rate, i1) => {
          rate.data.forEach((row, i2) => {
            row.forEach((unitp, i3) => {

              //Original Value
              if (mode == 'C' || mode == 'D') unitp[0] = unitp[1];
              //Cost
              var cost = 0 ;
              if(rate.cost !== undefined)
              if(rate.cost[i2]!==undefined && rate.cost[i2].length>0)
              if(rate.cost[i2][i3]!==undefined && rate.cost[i2][i3].length>0)
                cost+=rate.cost[i2][i3][0];

                
              //Contract Types
              if (table.ctrct.trim() !== "") {

                if (ic > -1) {

                  switch (this.cont.catg) {
                    case "PCT":
                      unitp[0] = unitp[0] * (1 + parseFloat(this.cont.valu));
                      table.valu = -1.2323;
                      break;
                    case "OTC":
                      unitp[0] = unitp[0] + table.valu;
                      break;
                    case "RTL":
                      unitp[0] = parseFloat(this.cont.valu);
                      table.valu = -1.2323;
                      break;
                    default:
                      unitp[0] = unitp[0] + parseFloat(this.cont.valu);
                      table.valu = -1.2323;
                      break;
                  }
                }
              }
              if(this.cont.catg!=="RTL"){
              //Surcharges
              this.pagedata.body.srchg.forEach((surch, i4) => {
                var srchi = rate.surch.findIndex(sch => (surch.code == sch));
                if (srchi > -1 && surch.prgm == rate.program) {
                  unitp[0] = unitp[0] + unitp[srchi + 3];
                  if(rate.cost !== undefined)
                  if(rate.cost[i2]!==undefined && rate.cost[i2].length>0)
                  if(rate.cost[i2][i3]!==undefined && rate.cost[i2][i3].length>srchi+2)
                  cost += rate.cost[i2][i3][srchi+3];
                }
              });
              //NCB Charge
              var ncbsurch = 0;
              if(cost > 0){
              var profit = unitp[0]-cost;
              if(profit <=3000 && unitp[0]<=5000){//Apply only if profit is less than 3k and retail price less than 5k.
              var lowlimit =0;
              rate.ncbtiers = Util.sortByKey(rate.ncbtiers,"prof","A");
              rate.ncbtiers.forEach(ncb=>{
                if(lowlimit <= profit && profit <= ncb.prof ) ncbsurch = ncb.surc;
                lowlimit = ncb.prof +0.01;
              })
            }
              unitp[0] += ncbsurch;
              
              }
              this.ncbarr.push(i0.toString().padEnd(4) +
                               i1.toString().padEnd(4) +
                               i2.toString().padEnd(4) +
                               i3.toString().padEnd(4) 
              );
              this.ncbarrv.push(ncbsurch);
              //Taxes
              if (this.pagedata.body.tax > 0) unitp[0] = unitp[0] + unitp[0] * this.pagedata.body.tax / 100;
            }
            unitp[0] = Math.ceil(unitp[0])
            });
          });
        });
      }
    });
    if (mode == 'C') Util.hideWait();
  }
  //==================================================================================================//  
  xlatelob(prg, ratc) {
    if (this.pagedata.body.data === undefined) return "";
    var index = this.pagedata.body.data.findIndex(obj => (obj.prg == prg && obj.ratc == ratc));

    if (index >= 0) return this.pagedata.body.data[index].lob;
    else return "";

  }
  //==================================================================================================//  
  xlatelobc(prg, ratc) {
    if (this.pagedata.body.data === undefined) return "";
    var index = this.pagedata.body.data.findIndex(obj => (obj.prg == prg && obj.ratc == ratc));

    if (index >= 0) return this.pagedata.body.data[index].lobc;
    else return "";

  }
  //==================================================================================================//  
  xlateprg(prg, ratc) {
    if (this.pagedata.body.data === undefined) return "";
    var index = this.pagedata.body.data.findIndex(obj => (obj.prg == prg && obj.ratc == ratc));

    if (index >= 0) return this.pagedata.body.data[index].desc;
    else return "";

  }
  //==================================================================================================//
  selectCov(e, parent, table, row, col) {
    var cov = this.pagedata.body.coverages;
    var srcEl = e.srcElement || e.target;
    
    if (srcEl.checked) {
      this.totalp = this.pagedata.body.tables[parent].rates[table].data[row][col][0].toString();
      this.calcChng("totalp");
    }
    var ind = {
      "index": parent.toString().padEnd(4) +
        table.toString().padEnd(4) +
        row.toString().padEnd(4) +
        col.toString().padEnd(4)
    };

    if (cov.length > 0 && srcEl.checked) {
      var count = 0;
      cov.forEach(cv => {
        if (cv.index.substring(0, 4) == parent) {
          count++;
        }
      });
      if (count >= 5) {
        alert("Cannot exceed 5 selections per product!");
        srcEl.checked = false;
        return false;
      }
    }

    if (srcEl.checked) {
      cov.push(ind);
      this.pagedata.body.tables[parent].rates[table].data[row][col][2] = 1;
    } else {
      cov.splice(cov.findIndex(obj => obj.index == ind.index), 1);
      this.pagedata.body.tables[parent].rates[table].data[row][col][2] = 0;
    }
  }
  //==================================================================================================//  
  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait2('');
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
      .initService({ "mode": "INIT" }, Util.Url("CGICQUOTE3"))
      .subscribe(data => this.pagedata = data,
        err => { Util.responsiveMenu(); Util.hideWait();},
        () => {
          Util.setHead(this.pagedata.head);
          Util.responsiveMenu();
          this.hasQuote1 = !Util.noAuth(this.pagedata.head.menuOp,'QUOTE1');
          if (this.pagedata.body.data.length > 0) {
            this.pagedata.body.data = Util.sortBy2Key(this.pagedata.body.data, "desc", "prg", "A");
            
            
          }
          Util.showWait2('');
          if(this.pagedata.body.veh.insrvc == ''){
            Util.hideWait2();
              this.router.navigate(['/app/Quote1']);
              return false;
          }


          //Sort By User Ascending
          if (this.pagedata.head.status === "O") {


            setTimeout(() => {
              Util.hideWait2();
              this.router.navigate(['/app/']);
            }, 100);
          } else {

            if (this.pagedata.body.code === "" && this.pagedata.body.contracts.length > 0) this.pagedata.body.code = this.pagedata.body.contracts[0].code;
            Util.hideWait2();

            this.dispAlert.default();
            this.defaultCheck("I");
            this.pagedata.body.tables.forEach(table => {
              if (table.rates !== undefined && table.rates.length > 0){
                table.rates = Util.sortBy2Key(table.rates, "title", "program", "A");
                var ic = this.pagedata.body.contracts.findIndex(obj => (obj.prgm.trim() == table.rates[0].program.padEnd(10) +table.rates[0].ratc.trim()));
        if (ic > -1) {
          this.cont = this.pagedata.body.contracts[ic];
          table.catg = this.cont.catg;
          if (table.valu == undefined && this.cont.catg =='OTC') table.valu = parseFloat(this.cont.valu);
        }
      }

            });
            
            this.applySurch("I");
            this.hideDupCov();

            var tb = this.pagedata.body.tables;
            

          }
          
          this.nodefaultsel();
          if (window.location.href.indexOf("3") > -1)
            this.pagedata.body.pagemode = '3';
          else
            this.pagedata.body.pagemode = 'R';
          this.loading = false;
          if (this.pagedata.body.data.length > 0) {
            this.pagedata.body.tables = Util.sortByKey(this.pagedata.body.tables, "desc", "A");
            this.pagedata.body.data = Util.sortByKey(this.pagedata.body.data, "desc", "A");
            this.pagedata.body.states = Util.sortByKey(this.pagedata.body.states,"desc","A");
            this.pagedata.body.data[0].open = true;
            }
            this.pagedata.body.coverages.forEach(cov => {
              var p = parseInt(cov.index.substring(0, 3));
              var t = parseInt(cov.index.substring(4, 7));
              var r = parseInt(cov.index.substring(8, 11));
              var c = parseInt(cov.index.substring(12, 15));
              if (tb[p] !== undefined && tb[p].rates !== undefined)
                if (tb[p].rates[t] !== undefined)
                  if (tb[p].rates[t].data[r] !== undefined)
                    if (tb[p].rates[t].data[r][c] !== undefined) {
                      tb[p].rates[t].data[r][c][2] = 1;
                      tb[p].show = true;
                    }

            });  

            //Default Fuccillo Conditional Programs if firt time.
            var i=0;
            
            this.pagedata.body.tables.forEach((elm,parent)=>{
              if(elm.dflt){
                elm.rates.forEach((elm1,table)=>{
                  elm1.rows.forEach((elm2,row)=>{
                    elm1.cols.forEach((elm3,col)=>{
                      if(i<5){
                      var ind = {
                        "index": parent.toString().padEnd(4) +
                         table.toString().padEnd(4) +
                         row.toString().padEnd(4) +
                         col.toString().padEnd(4)
                        };
                        this.pagedata.body.coverages.push(ind);
                        this.pagedata.body.tables[parent].rates[table].data[row][col][2] = 1;
                        i=i+1;
                        };
                      })
                    })
                })
              }
  
            });
            if(i>0 && this.pagedata.body.tables.length ==1){
              setTimeout(() => { Util.scrollToId('userinfo');
              Util.selectById("stock"+this.ran); }, 100);
              return false;
              }


          setTimeout(() => { Util.scrollToId('quotesteps'); }, 100);

        }

      );

  }
  //==================================================================================================//
  canDeactivate() {
    // if the editName !== this.user.name
    if (this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

  }
  //==================================================================================================//
}