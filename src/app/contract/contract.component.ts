import { Component, OnInit } from '@angular/core';
import { Util } from '../utilities/util';
import { Dispalert, Errsetter } from '../utilities/dispalert';
import { Router } from '@angular/router';
import { Contractdata , VindData} from './contractdata'; 
import { JsonService } from '../utilities/json.service';
import { Textfield } from '../utilities/textfield';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html'
})
export class ContractComponent implements OnInit {

  changes = false;
  dispAlert = new Dispalert();
  dispAlertlh = new Dispalert();
  errSet = new Errsetter();
  errSetlh = new Errsetter();
  pagedata = new Contractdata();
  vindata = new VindData;
  erScrolid :string = "";
  pvinsrvc:string = "";
  dsplhfi:boolean = true;

  payment:string ='F';
  //CC fields
  cctyp : string ="U";
  ccnam  = new Textfield;
  ccnum  = new Textfield;
  ccexp  = new Textfield;
  cccvv  = new Textfield;
  //ACH fields
  achbank  = new Textfield;
  achrotn  = new Textfield;
  achacno  = new Textfield;
  achchek  = new Textfield;
  //Lhfi Fields
  name = new Textfield;
  phon = new Textfield;
  adr1 = new Textfield;
  citylh = new Textfield;
  stalh = new Textfield;
  ziplh = new Textfield;

  tries : number = 0;
  ionos : string ="";

  vinE:boolean = true;
  validvin:boolean = false;
  prevVin:string = '';
  ran:string = Util.makeid();
  //Bottom Section
  validating = false;
  valid = false;
  //LH Popup
  validatinglh = false;
  validlh = false;
  costwrn = false;
  months: string = "12";
  mindwn: string = "5";
  caldwn: string = "";
  totalp: string = "0";
  mthlyp: string = "";
  downpm: string = "";
  downpmMsg: string = "";
  balnce: string = "";
  //Fields
  stock = new Textfield;
  vpd = new Textfield;
  cpd = new Textfield;
  vin = new Textfield;
  first = new Textfield;
  last = new Textfield;
  cbfirst = new Textfield;
  cblast = new Textfield;
  lhfi = new Textfield;
  email = new Textfield;
  phone = new Textfield;
  addr1 = new Textfield;
  addr2 = new Textfield;
  city = new Textfield;
  state = new Textfield;
  zip = new Textfield;
  Requote(){
    this.router.navigate(['/app/Quote1']);
  }
  //==================================================================================================//
  effect(){
    Util.showWait();
    Util.hideWait();
  }
  //==================================================================================================//
  calcChng(field) {
    if (parseFloat(this.totalp) <= 0 || isNaN(parseFloat(this.totalp))) this.totalp = "0";
    if (parseFloat(this.downpm) <= 0 || isNaN(parseFloat(this.downpm))) this.downpm = "0";
    if (parseFloat(this.downpm) > parseFloat(this.totalp)) this.downpm = parseFloat(this.totalp).toFixed(2);

    if (field !== "downpm") this.downpm = (parseFloat(this.totalp) * (parseFloat(this.mindwn) / 100)).toFixed(2);
    this.caldwn ='';
    var percdwn = '5';
    if(parseFloat(this.totalp)>0) percdwn = ((parseFloat(this.downpm) / (parseFloat(this.totalp) )* 100)).toFixed(1); 
    if(parseFloat(this.totalp)>0){
    if(parseFloat(percdwn) !== 5 &&
       parseFloat(percdwn) !== 10 &&
       parseFloat(percdwn) !== 20 &&
       parseFloat(percdwn) !== 30 &&
       parseFloat(percdwn) !== 40  ){
         this.caldwn = percdwn.toString();
         this.mindwn = this.caldwn;
       }else{this.mindwn = parseInt(percdwn).toString();}
      }
    //Down Payment
    this.downpmMsg = "";
    if(parseFloat(percdwn)<5) { this.downpmMsg = "(5% Or more required)";}
    

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
  validCC(){
    this.cctyp = Util.cardType(this.ccnum.value);
    this.formatCredit();
  }
  editVin(){
    this.vinE = true;
    this.vin.message ='';
    this.prevVin = "";
  }
  vinCheck(){
    this.vin.value = this.vin.value.toUpperCase();
    if(this.vin.value.length < 17){ this.validvin = false;this.prevVin = this.vin.value; }
    if(this.pagedata.body.veh.price!==""){
      if(this.vin.value.length == 17){
        Util.showWait();
        this.validvin = true;
        this.vinE = false;
        
      }
      Util.hideWait();
      return false;
    }
      if(this.vin.value.length == 17 && this.vin.value !== this.prevVin ) {
       this.prevVin = this.vin.value; 
    Util.showWait();
    
    this.jsonService
      .initService({"mode":"VIN","vin":this.vin.value,"tabid": sessionStorage.getItem("tabid")},Util.Url("CGICCNTRCT"))
      .subscribe(data => this.vindata = data,
        err => { this.dispAlert.error(); Util.hideWait(); },
                       () => {
                              this.vin.message = this.vindata.message;
                              this.vin.erlevel = this.vindata.status;
                              
                              this.validating = true;
                              if(this.vindata.status==="S"){ 
                                this.pagedata.body.veh.mmil = this.vindata.mmil;
                                this.pagedata.body.veh.mmth = this.vindata.mmth;
                                this.pagedata.body.veh.pmil = this.vindata.pmil;
                                this.pagedata.body.veh.pmth = this.vindata.pmth;
                                this.validvin = true;this.vinE = false;}
                              else{
                                this.vin.erlevel = 'D';
                              }
                              if(this.validvin && this.vindata.vfmatch !='Y'){
                                this.changes = false;
                                this.erscrol('vin');
                                Util.modalid('show','VFMismatchModal');
                              }
                              Util.hideWait();
        }
      );
      }
  } 

  defaultFields(){
    var dt = new Date();
    if(this.pagedata.body.contract.vpd !=='')
      this.vpd.value   = this.pagedata.body.contract.vpd;
    else
      this.vpd.value   =  new Date().toISOString().split('T')[0];
    if(this.pagedata.body.contract.cpd !=='')
      this.cpd.value   = this.pagedata.body.contract.cpd;
    else
      this.cpd.value   =  new Date().toISOString().split('T')[0];
    this.vin.value   = this.pagedata.body.veh.vin;
    if(this.vin.value!=='') this.vinE = false;
    this.stock.value   = this.pagedata.body.contract.stock;
    this.first.value   = this.pagedata.body.contract.first;
    this.last.value    = this.pagedata.body.contract.last;
    this.ccnam.value   = this.pagedata.body.contract.first+' '+this.pagedata.body.contract.last;
    this.cblast.value  = this.pagedata.body.contract.cblast;
    this.lhfi.value  = this.pagedata.body.contract.lhfi;
    this.cbfirst.value = this.pagedata.body.contract.cbfirst;
    this.email.value   = this.pagedata.body.contract.email;
    this.phone.value   = this.pagedata.body.contract.phone;
    this.addr1.value   = this.pagedata.body.contract.addr1;
    this.addr2.value   = this.pagedata.body.contract.addr2;
    this.city.value    = this.pagedata.body.contract.city;
    this.state.value   = this.pagedata.body.contract.state;
    this.zip.value     = this.pagedata.body.contract.zip;

  }
  constructor(private jsonService: JsonService, private router: Router) { }

  checkReqFields(){
    this.pagedata.body.fields.forEach(fld =>{

      fld.message = "";
      fld.value = fld.value.trim();
      if (fld.value == "") { fld.message = "(required)"; fld.erlevel = "D"; this.valid = false;this.erscrol(fld.name); }
      if(fld.value !==""){

        if(fld.type=='TEL' && !Util.validphone(fld.value)){fld.message = "(Invalid)";fld.erlevel="D";this.valid = false;this.erscrol(fld.name);}
        if(fld.type=='EML' && !Util.validemail(fld.value)){fld.message = "(Invalid)";fld.erlevel="D";this.valid = false;this.erscrol(fld.name);}
      
      switch (fld.prec){
        case('I')://Integer
        if(parseInt(fld.value) < 0 || isNaN(parseInt(fld.value))){
          fld.message = "(Invalid)";fld.erlevel="D";this.valid = false;this.erscrol(fld.name);
        }else{fld.value = parseInt(fld.value).toString();}
        break;
        case('D')://Dollar
        if(parseFloat(fld.value) < 0 || isNaN(parseFloat(fld.value))){
          fld.message = "(Invalid)";fld.erlevel="D";this.valid = false;this.erscrol(fld.name);
        }else{fld.value = parseFloat(fld.value).toFixed(2).toString();}
        break;
        case('P')://Percentage
        if(parseFloat(fld.value) < 0 || parseFloat(fld.value)>100 || isNaN(parseFloat(fld.value))){
          fld.message = "(Invalid)";fld.erlevel="D";this.valid = false;this.erscrol(fld.name);}
        break;

      } 
    } 

    });

  }
  erscrol(id){
    if(this.erScrolid=='')
      this.erScrolid = id + 'lbl';
  }

  checkData() {

    this.dispAlert.default();
    this.validating = true;
    this.valid = true;
    this.erScrolid = "";
    this.stock.message = "";
    this.vpd.message = "";
    this.vin.message = "";
    this.first.message = "";
    this.last.message = "";
    this.lhfi.message = "";
    this.email.message = "";
    this.phone.message = "";
    this.addr1.message = "";
    this.addr2.message = "";
    this.city.message = "";
    this.state.message = "";
    this.zip.message = "";

    //Credit Card
    this.ccnum.message ="";
    this.ccexp.message ="";
    this.cccvv.message ="";
    this.ccnam.message ="";
    this.ccnum.value = this.ccnum.value.trim();
    this.ccexp.value = this.ccexp.value.trim();
    this.cccvv.value = this.cccvv.value.trim();
    this.ccnam.value = this.ccnam.value.trim();
    //ACH
    this.achbank.message ="";
    this.achrotn.message ="";
    this.achacno.message ="";
    this.achchek.message ="";
    this.achbank.value = this.achbank.value.trim();
    this.achrotn.value = this.achrotn.value.trim();
    this.achacno.value = this.achacno.value.trim();
    this.achchek.value = this.achchek.value.trim();

    this.downpmMsg ="";

    this.vin.value = this.vin.value.trim();
    this.vpd.value = this.vpd.value.trim();
    this.cpd.value = this.cpd.value.trim();
    this.stock.value = this.stock.value.trim();
    this.first.value = this.first.value.trim();
    this.last.value = this.last.value.trim();
    this.cbfirst.value = this.cbfirst.value.trim();
    this.cblast.value = this.cblast.value.trim();
    this.lhfi.value = this.lhfi.value.trim();
    this.addr1.value = this.addr1.value.trim();
    this.addr2.value = this.addr2.value.trim();
    this.city.value = this.city.value.trim();
    this.zip.value = this.zip.value.trim();

    
    if (this.vin.value == "") { this.vin.message = "(required)"; this.vin.erlevel = "D"; this.valid = false;this.erscrol('vin'); }
    if (this.pagedata.body.veh.type=='A' && this.vin.value !=='' && !this.validvin) { 
      this.vin.message = "( Invalid VIN for "+this.pagedata.body.veh.year+" "+
                                              this.pagedata.body.veh.make+" "+
                                              this.pagedata.body.veh.model+"! )"; this.vin.erlevel = "D"; this.valid = false; this.erscrol('vin');}
    if (this.vpd.value == "") { this.vpd.message = "(required)"; this.vpd.erlevel = "D"; this.valid = false; this.erscrol('vpd');}
    if(this.validvin && this.vindata.vfmatch !='Y'&& this.pagedata.body.veh.price ==""){
      this.valid = false;
      this.changes = false;
      this.erscrol('vin');
      Util.modalid('show','VFMismatchModal');
    }

    if (this.stock.value == "") { this.stock.message = "(required)"; this.stock.erlevel = "D"; this.valid = false; this.erscrol('stock');}
    if (this.cpd.value == "") { this.cpd.message = "(required)"; this.cpd.erlevel = "D"; this.valid = false; this.erscrol('cpd');}
    if (this.first.value == "") { this.first.message = "(required)"; this.first.erlevel = "D"; this.valid = false; this.erscrol('first');}
    if (this.last.value == "") { this.last.message = "(required)"; this.last.erlevel = "D"; this.valid = false; this.erscrol('last');}
    if (this.email.value == "") { this.email.message = "(required)"; this.email.erlevel = "D"; this.valid = false; this.erscrol('email');}
    if (this.email.value !== "" && !Util.validemail(this.email.value)) { this.email.message = "(invalid Email)"; this.email.erlevel = "D"; this.valid = false; this.erscrol('email');}
    if (this.phone.value == "") { this.phone.message = "(required)"; this.phone.erlevel = "D"; this.valid = false; this.erscrol('phone');}
    if (this.phone.value !== "" && !Util.validphone(this.phone.value)) { this.phone.message = "(invalid Phone)"; this.phone.erlevel = "D"; this.valid = false; this.erscrol('phone');}
    
    if (this.addr1.value == "") { this.addr1.message = "(required)"; this.addr1.erlevel = "D"; this.valid = false; this.erscrol('addr1');}
    if (this.city.value == "") { this.city.message = "(required)"; this.city.erlevel = "D"; this.valid = false; this.erscrol('city');}
    if (this.state.value == "") { this.state.message = "(required)"; this.state.erlevel = "D"; this.valid = false; this.erscrol('state');}
    if (this.zip.value == "") { this.zip.message = "(required)"; this.zip.erlevel = "D"; this.valid = false; this.erscrol('zip');}
    if (this.zip.value !== "" && !Util.validZip(this.zip.value)) { this.zip.message = "(invalid Zip)"; this.zip.erlevel = "D"; this.valid = false;this.erscrol('zip'); } 

    this.checkReqFields();
    this.checkPayLink();
    this.loadDb();
  }

  checkPayLink(){
    var d = new Date();
    if(this.payment == 'F'){ 
      this.ccnum.value = "";
      this.ccexp.value = "";
      this.cccvv.value = "";
      this.ccnam.value = "";
      return false;
    }
    //Credit Card
    if(this.payment == 'C'){
      //Credit Card Number
      if (this.ccnum.value == "") { this.ccnum.message = "(required)"; this.ccnum.erlevel = "D"; this.valid = false; this.erscrol('ccnum');}
      if (this.ccnum.value !=="" && this.cctyp == "U"){this.ccnum.message = "(invalid card)"; this.ccnum.erlevel = "D"; this.valid = false; this.erscrol('ccnum');}
      //Expiration Date
      if (this.ccexp.value == "") { this.ccexp.message = "(required)"; this.ccexp.erlevel = "D"; this.valid = false; this.erscrol('ccexp');}
      if (this.ccexp.value !=="" && parseInt(d.getFullYear().toString().substring(2,4)) > parseInt(this.ccexp.value.substring(5,7))){ this.ccexp.message = "(Expired Card!)"; this.ccexp.erlevel = "D"; this.valid = false; this.erscrol('ccexp');}
      if (this.ccexp.value !=="" && parseInt(this.ccexp.value.substring(0,2))>12){this.ccexp.message = "(invalid!)"; this.ccexp.erlevel = "D"; this.valid = false; this.erscrol('ccexp');}
      if (this.ccexp.value !=="" && parseInt(d.getFullYear().toString().substring(2,4)) == parseInt(this.ccexp.value.substring(5,7))){ 
        if((parseInt(d.getMonth().toString())+1) > parseInt(this.ccexp.value.substring(0,2))){
        this.ccexp.message = "(Expired Card!)"; this.ccexp.erlevel = "D"; this.valid = false; this.erscrol('ccexp');}
      }
      //Security Code
      if (this.cccvv.value == "") { this.cccvv.message = "(required)"; this.cccvv.erlevel = "D"; this.valid = false; this.erscrol('cccvv');}
      //Name On Card
      if (this.ccnam.value == "") { this.ccnam.message = "(required)"; this.ccnam.erlevel = "D"; this.valid = false; this.erscrol('ccnam');}
      //Down Payment
      if(this.downpm <(parseFloat(this.totalp) * (parseFloat(this.mindwn) / 100)).toFixed(2))
      { this.downpmMsg = "(5% Or more required)";  this.valid = false; this.erscrol('downpm');}
    }
    //ACH
    if(this.payment == 'A'){
      //Fields
      if (this.achbank.value == "") { this.achbank.message = "(required)"; this.achbank.erlevel = "D"; this.valid = false; this.erscrol('achbank');}
      if (this.achrotn.value == "") { this.achrotn.message = "(required)"; this.achrotn.erlevel = "D"; this.valid = false; this.erscrol('achrotn');}
      if (this.achacno.value == "") { this.achacno.message = "(required)"; this.achacno.erlevel = "D"; this.valid = false; this.erscrol('achacno');}
      if (this.achacno.value == "") { this.achchek.message = "(required)"; this.achchek.erlevel = "D"; this.valid = false; this.erscrol('achchek');}
       //Down Payment
      if(this.downpm <(parseFloat(this.totalp) * (parseFloat(this.mindwn) / 100)).toFixed(2))
      { this.downpmMsg = "(5% Or more required)";  this.valid = false; this.erscrol('downpm');}
    }
    if(this.payment == 'M'){
       //Down Payment
      if(this.downpm <(parseFloat(this.totalp) * (parseFloat(this.mindwn) / 100)).toFixed(2))
      { this.downpmMsg = "(5% Or more required)";  this.valid = false; this.erscrol('downpm');}
    }
  }

  clearPayment(){
      this.ccnum.value = "";
      this.ccexp.value = "";
      this.cccvv.value = "";
      this.ccnam.value = "";
      this.downpmMsg ="";
  }

  clearexp(){
    this.ccexp.value ='';
  }
  viewPdf(index){

    var pdf = window.open(Util.Url("cgi/CGGLSRIOV2?PMIONO="+this.ionos.substring(index*10,index*10+10)),'_blank', 'toolbar=0,scrollbars=-1,resizable=-1');
    if (pdf == null || typeof(pdf)=='undefined') { 	
      alert('Please disable your pop-up blocker and click the link again.'); 
    } 
    else { 	
      pdf.focus();
    }
  }
  viewPdfz(index){
    index = index + this.pagedata.body.contract.contracts.length;
    var pdf = window.open(Util.Url("cgi/CGGLSRIOV2?PMIONO="+this.ionos.substring(index*10,index*10+10)),'_blank', 'toolbar=0,scrollbars=-1,resizable=-1');
    if (pdf == null || typeof(pdf)=='undefined') { 	
      alert('Please disable your pop-up blocker and click the link again.'); 
    } 
    else { 	
      pdf.focus();
    }
  }
  hidePdf(){
    Util.modalid('hide','contractModal');
  }
  hidemdl(id){
    Util.modalid('hide',id);
  }

  loadDb() {
    if (!this.valid){ Util.scrollToId(this.erScrolid);Util.firstErrFocus(); return false;}
    this.changes = false;
    Util.showWait2('<p>Creating Contracts Please Wait...</p>');
    setTimeout(() => {
      var postdata:any ={};
      this.pagedata.body.contract.mode = 'SAVE';
      this.pagedata.body.contract.vin = this.vin.value;
      this.pagedata.body.contract.vpd = this.vpd.value;
      this.pagedata.body.contract.cpd = this.cpd.value;
      this.pagedata.body.contract.stock = this.stock.value;
      this.pagedata.body.contract.first = this.first.value;
      this.pagedata.body.contract.last = this.last.value;
      this.pagedata.body.contract.cbfirst = this.cbfirst.value;
      this.pagedata.body.contract.cblast = this.cblast.value;
      this.pagedata.body.contract.lhfi = this.lhfi.value;
      this.pagedata.body.contract.email = this.email.value;
      this.pagedata.body.contract.phone = this.phone.value;
      this.pagedata.body.contract.addr1 = this.addr1.value;
      this.pagedata.body.contract.addr2 = this.addr2.value;
      this.pagedata.body.contract.city = this.city.value;
      this.pagedata.body.contract.state = this.state.value;
      this.pagedata.body.contract.zip = this.zip.value;
      //PayLink
      this.pagedata.body.contract.payment = this.payment;
      this.pagedata.body.contract.ccnam   = this.ccnam.value;
      this.pagedata.body.contract.ccnum   = this.ccnum.value;
      this.pagedata.body.contract.ccexp   = this.ccexp.value;
      this.pagedata.body.contract.cccvv   = this.cccvv.value;
      this.pagedata.body.contract.achbank = this.achbank.value;
      this.pagedata.body.contract.achrotn = this.achrotn.value;
      this.pagedata.body.contract.achacno = this.achacno.value;
      this.pagedata.body.contract.achchek = this.achchek.value;
      this.pagedata.body.contract.months  = this.months;
      this.pagedata.body.contract.mthlyp  = this.mthlyp;
      this.pagedata.body.contract.downpm  = this.downpm;
      this.pagedata.body.contract.tabid = sessionStorage.getItem("tabid");
      postdata.contract = this.pagedata.body.contract;
      postdata.fields   = this.pagedata.body.fields;
      this.jsonService
        .initService(postdata, Util.Url("CGICCNTRCT"))
        .subscribe(data => this.errSet = data,
          err => { this.dispAlert.error();Util.hideWait(); },
          () => {
            Util.scrollToId('quotesteps');
            //Success
            if(this.errSet.status =='S'){
              this.tries = 0;
              this.ionos = this.errSet.data;
              this.UrlDelay();
            }
            //Date Updated (Carfax)
            if(this.errSet.status =='D'){
              Util.hideWait();
              this.pagedata.body.veh.insrvc = this.errSet.data;
              Util.modalid('show','carfaxdate');
            }
            //Date mismatch Requote (Carfax)
            if(this.errSet.status =='Q'){
              Util.hideWait();
              this.pagedata.body.veh.insrvc = this.errSet.data;
              Util.modalid('show','carfaxrequote');
            }
            //Missing Forms
            if(this.errSet.status =='E'){
              this.dispAlert.message = this.errSet.message;
              this.dispAlert.status = this.errSet.status;
              Util.hideWait();
            }
            
            });
      }, 100);
  }

  UrlDelay(){

    this.tries += 1;
    this.jsonService
      .initService({ "mode": "IONOS" ,"ionos":this.ionos,"tabid": sessionStorage.getItem("tabid")}, Util.Url("CGICCNTRCT"))
      .subscribe(data => this.errSet = data,
        err => {Util.hideWait();  },
        () => {
          if(this.errSet.status == 'S'){Util.hideWait();Util.modalid('show','contractModal');return;}
          if(this.tries <20 )
            setTimeout(() => { this.UrlDelay(); }, 1000);
          else{
            Util.modalid('show','contractModal');
            Util.hideWait();
            return;
          }

          
        });

  }

  onChange() {
    this.validating = false;
    this.changes= true;
  }
  onChangelh() {
    this.validatinglh = false;
    this.changes= true;
  }

  
formatCVV() {
  
  this.cccvv.value = this.cccvv.value.replace(/\D/g, '');
} 
  formatExp() {
    var origl = this.ccexp.value.length;
    var numbers = this.ccexp.value.replace(/\D/g, ''),
      char = { 2: ' / ' };
    this.ccexp.value = '';
    for (var i = 0; i < numbers.length; i++) {
      this.ccexp.value += (char[i] || '') + numbers[i];
    }
    if(numbers.length == 2 && origl ==2){
      this.ccexp.value += ' / ';
    }
  }
  formatPhone(phone) {
    var numbers = phone.value.replace(/\D/g, ''),
      char = { 0: '(', 3: ') ', 6: '-' };
    phone.value = '';
    for (var i = 0; i < numbers.length; i++) {
      phone.value += (char[i] || '') + numbers[i];
    }
  }
  formatCredit() {
    var numbers = this.ccnum.value.replace(/\D/g, ''),
      char = {  4: ' ', 8: ' ' ,12:' '};
    this.ccnum.value = '';
    for (var i = 0; i < numbers.length; i++) {
      this.ccnum.value += (char[i] || '') + numbers[i];
    }
  }

  //==================================================================================================//
  
  dspNup(prg,nup){
    if(this.pagedata.body.dspasnew.indexOf(prg)>-1 && this.pagedata.body.dnup !=='' ){
      //If no Auto/Rv selected Eligibility will be populated from step 1 Or set on load from first Auto/Rv plan
        switch (this.pagedata.body.dnup){
          case "U": return "Used";
          case "N": return "New";
      }
      
      
    }
    else{
      switch (nup){
        case "U": return "Used";
        case "N": return "New";
      }
    }
       
  }
  
  ngOnInit() {
    this.pagedata.head.status ="I";
    
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
      .initService({ "mode": "INIT" ,"tabid":sessionStorage.getItem("tabid")}, Util.Url("CGICCNTRCT"))
      .subscribe(data => this.pagedata = data,
        err => {Util.hideWait();  },
        () => {Util.responsiveMenu(); 
          this.months = this.pagedata.body.months;
          this.mindwn = this.pagedata.body.mindwn;
          this.payment= this.pagedata.body.plnk;
          this.caldwn = "";
          this.pagedata.body.fields = Util.killDups3(this.pagedata.body.fields);
          Util.setHead(this.pagedata.head);
          this.pagedata.body.states = Util.sortByKey(this.pagedata.body.states,"desc","A");
          this.defaultFields();
          setTimeout(() => { Util.scrollToId('quotesteps'); }, 100);
          if (this.pagedata.head.status === "O" || this.pagedata.body.contract.contracts.length<1) { 
            Util.showWait();
            setTimeout(() => {
              Util.hideWait();
              if(this.pagedata.body.contract.contracts.length<1)
                this.router.navigate(['/app/Home']);
              else
                this.router.navigate(['/app']);
            }, 100);
          } else {
            Util.hideWait();
            this.vinCheck();
            var totalpn = 0;

            this.pagedata.body.contract.contracts.forEach(cnt =>{ 
              if(cnt.xtr7 !=='1')  totalpn += parseFloat(cnt.ccst);
              if(cnt.ccst < cnt.covc) this.costwrn = true;
            });
            if(this.costwrn) Util.modalid('show','costwarning');
            this.totalp = totalpn.toString();
            this.calcChng("totalp");
          }
          this.pvinsrvc = this.pagedata.body.veh.insrvc;
          if(this.pagedata.body.lienholders && this.pagedata.body.lienholders.length > 0)
            this.pagedata.body.lienholders = Util.sortByKey(this.pagedata.body.lienholders,"desc","A");
          
          var indexlh = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLHFI'));
          if(indexlh>-1){
             this.dsplhfi = false;
             if(this.lhfi.value !=="") this.pagedata.body.fields[indexlh].value = this.lhfi.value;
             this.setlhadr('C');
          }
          var indexx3 = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECXTR3'));
          if(indexx3>-1){
              this.pagedata.body.fields[indexx3].value = this.pagedata.body.lntp;
          }
        }
      );
  }
  setlhadr(mode){
    
    var indexlh = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLHFI'));
    if(indexlh > -1){
      if(this.lhfi.value !=="" && mode=="N") this.pagedata.body.fields[indexlh].value = this.lhfi.value;
      var lhindex = this.pagedata.body.lienholders.findIndex( obj => (obj.code == this.pagedata.body.fields[indexlh].value));
      var block = this.pagedata.body.lienholders[lhindex];
    }else{
      var lhindex = this.pagedata.body.lienholders.findIndex( obj => (obj.code == this.lhfi.value));
      var block = this.pagedata.body.lienholders[lhindex];
    }
    if(block !== undefined){
    if(indexlh > -1 || lhindex > -1 ){
      Util.showWait();
      Util.hideWait();
      //Addr1
      var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLAD1'));
      if(index>-1) this.pagedata.body.fields[index].value = block.adr1;
      //City
      var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLCTY'));
      if(index>-1) this.pagedata.body.fields[index].value = block.city;
      //State
      var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLST'));
      if(index>-1) this.pagedata.body.fields[index].value = block.sta;
      //Zip
      var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLZIP'));
      if(index>-1) this.pagedata.body.fields[index].value = block.zip;
      //Phone
      var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLPHN'));
      if(index>-1) this.pagedata.body.fields[index].value = block.phon;

    }
  }

  }
  newlhfi(){
    Util.modalid('show','newlienholder');
    if(this.pagedata.body.fields !== undefined){
    //Name
    var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLHFI'));
    var ind2 = -1;
    if(this.pagedata.body.lienholders && this.pagedata.body.lienholders.length > 0 && index > -1){
      ind2 = this.pagedata.body.lienholders.findIndex(obj => (obj.code == this.pagedata.body.fields[index].value));
    }
    if(ind2>-1 ) 
      this.name.value =  this.pagedata.body.lienholders[ind2].desc; 
    else if(index > -1)
      this.name.value =  this.pagedata.body.fields[index].value; 
    //Addr1
    var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLAD1'));
    if(index>-1) this.adr1.value = this.pagedata.body.fields[index].value; 
    //City
    var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLCTY'));
    if(index>-1) this.citylh.value = this.pagedata.body.fields[index].value;
    //State
    var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLST'));
    if(index>-1) this.stalh.value = this.pagedata.body.fields[index].value;
    //Zip
    var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLZIP'));
    if(index>-1) this.ziplh.value = this.pagedata.body.fields[index].value;
    //Phone
    var index = this.pagedata.body.fields.findIndex(obj => (obj.name == 'ECLPHN'));
    if(index>-1) this.phon.value = this.pagedata.body.fields[index].value;
    }
    this.dispAlertlh.default();
  }
  addlienh(){
    this.validlh = true;
    this.validatinglh = true;
    //Reset Error Messages
	this.name.message = "";
	this.stalh.message = "";
	this.adr1.message = "";
	this.citylh.message = "";
	this.ziplh.message = "";
	this.phon.message = "";
  this.dispAlertlh.default();
  //CheckData
  if(this.name.value == ""){ this.name.message = "(required)"; this.name.erlevel = 'D'; this.validlh = false;}
  	if(this.adr1.value !== "" || this.citylh.value !== "" || this.stalh.value!=="" || this.ziplh.value !==""){ 
		if(this.adr1.value == ""){ this.adr1.message = "(required)"; this.adr1.erlevel = 'D'; this.validlh = false;}
		if(this.citylh.value == ""){ this.citylh.message = "(required)"; this.citylh.erlevel = 'D'; this.validlh = false;}
		if(this.stalh.value == ""){ this.stalh.message = "(required)"; this.stalh.erlevel = 'D'; this.validlh = false;}
		if(this.ziplh.value == ""){ this.ziplh.message = "(required)"; this.ziplh.erlevel = 'D'; this.validlh = false;}
		if (this.ziplh.value !== "" && !Util.validZip(this.ziplh.value)) { this.ziplh.message = "(invalid Zip)"; this.ziplh.erlevel = "D";this.validlh = false;}
	}	
	if (this.phon.value !== "" && !Util.validphone(this.phon.value)) { this.phon.message = "( invalid )"; this.phon.erlevel = "D";this.validlh = false;}
  //Add New Lienholder
  if(this.validlh){
    Util.showWait();
    var newRec:any ={};
          newRec.mode = 'ADDPLUS';
          newRec.name = this.name.value;
					newRec.sta  = this.stalh.value;
  				newRec.zip  = this.ziplh.value;
  				newRec.phon = this.phon.value;
  				newRec.adr1 = this.adr1.value;
  				newRec.city = this.citylh.value;

  	this.jsonService
  	.initService(newRec,Util.Url("CGICLHLDRS"))
  	.subscribe(data => this.errSetlh = data,
  		err => {this.dispAlertlh.error(); Util.hideWait();},
  		() => {
        this.dispAlertlh.message = this.errSetlh.message;
          this.dispAlertlh.status = this.errSetlh.status;
          this.dispAlertlh.data = this.errSetlh.data;
        if(this.errSetlh.status == "S"){
          

          this.refreshlhfi();
          Util.modalid('hide','newlienholder');
          

        }else{
          Util.hideWait();
        }
        

      })


  }  
}
refreshlhfi(){
  
        this.lhfi.value = this.dispAlertlh.data;
        var added:any  = {};

            added.code = this.dispAlertlh.data;
            added.desc = this.name.value.toUpperCase();
            added.adr1 = this.adr1.value.toUpperCase();
            added.city = this.citylh.value.toUpperCase();
            added.sta  = this.stalh.value.toUpperCase();
            added.phon = this.phon.value.toUpperCase();
  					added.zip  = this.ziplh.value.toUpperCase();

  					this.pagedata.body.lienholders.push(JSON.parse(JSON.stringify(added)));
        this.setlhadr('N');

        this.name.value = "";
	      this.stalh.value = "";
	      this.adr1.value = "";
	      this.citylh.value = "";
	      this.ziplh.value = "";
        this.phon.value = "";
        Util.hideWait();

        
}
  canDeactivate() {

    if (this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

  }
}