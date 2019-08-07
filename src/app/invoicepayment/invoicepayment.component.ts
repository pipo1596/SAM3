import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest,HttpClient } from '@angular/common/http';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { InvoicePaymentdata } from './invoicepaymentdata'; 
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-invoicepayment',
  templateUrl: './invoicepayment.component.html'
})
export class InvoicePaymentComponent implements OnInit {

  pagedata = new InvoicePaymentdata ;

  validating = false;
  valid = false;
  resp:any={};
  changes = false;
  changeamount = false;
  jsonObj:any;
  newRec:any;
  ran:string = Util.makeid();
  step:number = 1;
  noAuth = true;
  prof:string="";
  paymode:string = "";
  upfile:string = "";
  imgtrgt:string ="";
  //Input Fields
  method = new  Textfield ;
  pdate = new  Textfield ;
  ptyp = new  Textfield ;
  name = new Textfield;
	type = new Textfield;
	nick = new Textfield;
	rout = new Textfield;
	acno = new Textfield;
	acnc = new Textfield;
  save = new Textfield;
  totl = new Textfield;
  filesc:any=[];

  umsg : string="";
  comm = new Textfield;
  iden = new Textfield;
  inpfile:any;
  canadd:boolean = false;
  //Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();

  constructor(private jsonService: JsonService,private router: Router,private httpf: HttpClient) { }

  cancelACH(){
    if(confirm("Cancel Payment and Submission of invoices?")){
      this.router.navigate(['/app/Invoices']);
    }
  }

  changeamnt(){
    if(confirm("If you choose to change the amount to pay, processing will be delayed on all invoices that are being submitted.")){
      this.changeamount = true;
      setTimeout(() => { Util.focusById("topay");}, 200);
    }

  }
  typchange(){
    Util.showWait();
    this.onChange();
    this.inpfile ="";
    this.imgtrgt = "";
    this.upfile = "";
    this.comm.value = "";
    this.iden.value = "";
    Util.hideWait();
  }
  onFileChange(event){
    this.upfile = "";
    this.imgtrgt = "";
    this.filesc =[];
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
     
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        if(this.isValid(file)){
            this.upfile = file.name;
            this.filesc.push(file);
            if(this.isImage(file)){
              this.imgtrgt = reader.result.toString();
            }
          }
        else{
          alert("Valid files are Images and PDF!");
          event.value ="";
          this.upfile = "";
          this.imgtrgt ="";
        }

    };
  }

  }

  isImage(file){
    if (file["type"].split("/")[0] =="image") 
          return true;//returns true or false
    return false;
  }

  isValid(file){
    if (file["type"].split("/")[0] =="image") 
          return true;//returns true or false
    if (file["type"] =="application/pdf") 
          return true;//returns true or false\
  return false;
}
  addnew(){
    Util.showWait();
    this.onChange();
    this.save.value = "Y"; 
    this.type.value = ""; 
    this.name.value = "";
    this.acno.value = "";
    this.acnc.value = "";
    this.nick.value = "";
    this.rout.value = "";
    Util.hideWait();
  }
  cancel(){
    if(this.step==1) this.method.value ='';this.step=1;
  }

  onChange(){
    this.changes= true;
    this.validating = false;
  }
  checkData(){
    this.validating = true;
    this.valid = true;
    //Reset Error Messages
    this.pdate.message  = "";
    this.method.message = "";
    this.type.message = "";
    this.name.message = "";
    this.acno.message = "";
    this.acnc.message = "";
    this.nick.message = "";
    this.rout.message = "";
    this.ptyp.message = "";
    this.iden.message = "";
    this.comm.message = "";
    this.totl.message = "";
    this.umsg = "";
   
    //Reset Top Alert
    this.dispAlert.default();
    //Required Logic
    //Trim Field Values
		this.type.value = this.type.value.trim();
		this.name.value = this.name.value.trim();
		this.acno.value = this.acno.value.trim();
		this.acnc.value = this.acnc.value.trim();
		this.nick.value = this.nick.value.trim();
    this.rout.value = this.rout.value.trim();
    this.totl.value = this.totl.value.trim();
    this.iden.value = this.iden.value.trim();
    this.comm.value = this.comm.value.trim();

    if(this.totl.value!=="")this.totl.value = (parseFloat(this.totl.value)).toFixed(2);
    
    if(this.pdate.value == '') { this.pdate.message = "(required)"; this.pdate.erlevel = "D"; this.valid = false; }
    if(this.pdate.value !== "" && !Util.isdatestring("pdate",this.pdate.value)){
      this.pdate.message = "(invalid)"; this.pdate.erlevel = "D"; this.valid = false;
    }
    //Date in Future
    if(this.valid && !Util.isFutureDate(this.pdate.value)){
      this.pdate.message = "(Only 2 days into the future allowed!)"; this.pdate.erlevel = "D"; this.valid = false;
    }
    if(this.method.value == "") { this.method.message = "(required)"; this.method.erlevel = "D"; this.valid = false; }
    if(this.method.value =='ADDNEW'){
	    if(this.type.value == ""){ this.type.message = "(required)"; this.type.erlevel = 'D'; this.valid = false;}
	    if(this.name.value == ""){ this.name.message = "(required)"; this.name.erlevel = 'D'; this.valid = false;}
	    if(this.acnc.value == ""){ this.acnc.message = "(required)"; this.acnc.erlevel = 'D'; this.valid = false;}
	    if(this.acnc.value !== "" && this.acnc.value !== this.acno.value){ this.acno.message = "(Account Number Don't Match)"; this.acno.erlevel = 'D'; this.valid = false;}
      if(this.save.value=='Y' && this.nick.value == ""){ this.nick.message = "(required)"; this.nick.erlevel = 'D'; this.valid = false;}
      if(this.rout.value == ""){ this.rout.message = "(required)"; this.rout.erlevel = 'D'; this.valid = false;}
      if(this.acno.value !== "" && this.acno.value.length < 6){ this.acno.message = "(Invalid)"; this.acno.erlevel = 'D'; this.valid = false;}
      if(this.acno.value == ""){ this.acno.message = "(required)"; this.acno.erlevel = 'D'; this.valid = false;}
    }

    //ADDPAYMENT
    if(this.paymode=='P'){
      if(this.ptyp.value ==""){this.ptyp.message = "(required)"; this.ptyp.erlevel = 'D'; this.valid = false;}
      if((this.ptyp.value=="E" || this.ptyp.value=="U") && this.upfile ==""){
        this.umsg = "(upload required)";this.valid = false;
      }
      if(this.ptyp.value!=="O" && this.iden.value ==""){
        this.iden.message = "(required)";this.iden.erlevel ='D';this.valid = false;
      }
      if(this.ptyp.value =="O" && this.comm.value ==""){
        this.comm.message = "(required)";this.comm.erlevel ='D';this.valid = false;
      }
      if(this.totl.value ==""){this.totl.message="(required)";this.totl.erlevel ='D';this.valid = false;}
      if(this.totl.value !=="" && parseFloat(this.totl.value)<=0){this.totl.message="(invalid)";this.totl.erlevel ='D';this.valid = false;}

    }
    if(this.paymode =="" && this.changeamount){
      if(this.comm.value ==""){this.comm.message = "(required)";this.comm.erlevel ='D';this.valid = false;      }
      if(this.totl.value ==""){this.totl.message="(required)";this.totl.erlevel ='D';this.valid = false;}
      if(this.totl.value !=="" && parseFloat(this.totl.value)<=0){this.totl.message="(invalid)";this.totl.erlevel ='D';this.valid = false;}
    }


    
    this.step2();  
  }

  step2(){
    if(!this.valid){Util.scrollToId('quotesteps'); return false;}
    if(this.step == 2){
      this.step3();
      return false;
    }
    if(this.step == 3){
      if(this.paymode == "")
        this.router.navigate(['/app/Invoices']);
      else
      this.router.navigate(['/app/MakePayment']);
      return false;
    }
    if(this.method.value =='ADDNEW' && this.save.value == 'Y'){
      this.jsonObj = {
        mode: "CHECK",
        acno: this.acno.value,
        type: this.type.value,
        name: this.name.value,
        nick: this.nick.value,
        rout: this.rout.value
      }
      Util.showWait();
      this.jsonService
        .initService(this.jsonObj,Util.Url("CGICPYMTMT"))
        .subscribe(data => this.errSet = data,
                    err => { this.dispAlert.error(); Util.hideWait(); },
                     () => {
                            Util.hideWait();
                            if (this.errSet.status === "S") {
                                this.step = 2;
                                this.changeamount = false;
                                setTimeout(() => { Util.scrollToId("quotesteps");},200);
                                 }else{
                                   this.nick.message = this.errSet.message;
                                   this.nick.erlevel = 'D'; this.valid = false;
                                   this.step = 1;
                                 }
                          }
                  );

    }
    else{
    this.step = 2;
    this.changeamount = false;
    setTimeout(() => { Util.scrollToId("quotesteps");},200);
    }
    
  }

  step3(){
    if(!this.valid) return false;
    Util.showWait();

    if(this.method.value =='ADDNEW' && this.save.value == 'Y'){
      this.jsonObj = {
        mode: "ADDF",
        acno: this.acno.value,
        type: this.type.value,
        name: this.name.value,
        nick: this.nick.value,
        rout: this.rout.value
      }
      
      this.jsonService
        .initService(this.jsonObj,Util.Url("CGICPYMTMT"))
        .subscribe(data => this.errSet = data,
                    err => { this.dispAlert.error(); Util.hideWait(); },
                     () => {
                            
                            if (this.errSet.status === "S") {
                              this.prof = this.errSet.data;
                              this.uploadImg();
                                 }else{
                                   this.dispAlert.message = this.errSet.message;
                                   this.dispAlert.status  = this.errSet.status;
                                   Util.hideWait();
                                 }
                          }
                  );

    }
    else{
      this.prof = this.method.value;
      this.uploadImg();
    
    }
    
  }

  schedule(iono){
    
    this.jsonObj = {
      mode: "SCHDL",
      acno: this.acno.value,
      iono: iono,
      type: this.type.value,
      name: this.name.value,
      nick: this.nick.value,
      pdat: this.pdate.value,
      prof: this.prof,
      meth: this.method.value,
      totl: this.totl.value,
      comm: this.comm.value,
      payml: this.totl.value,
      rout: this.rout.value
    }
  
    
   


    this.jsonService
        .initService(this.jsonObj,Util.Url("CGICINVPMT"))
        .subscribe(data => this.errSet = data,
                    err => { this.dispAlert.error(); Util.hideWait(); },
                     () => {
                            Util.hideWait();
                              this.dispAlert.message = this.errSet.message;
                              this.dispAlert.status  = this.errSet.status;
                            if (this.errSet.status === "S") {
                                 this.step = 3;
                                 Util.scrollToId("quotesteps");
                                 this.changes = false;
                                 }else{
                                   this.step = 1;
                                 }
                          }
                  );

  }
  scheduleP(iono){
    this.jsonObj = {
      mode: "SCHDLP",
      iono: iono,
      ptyp: this.ptyp.value,
      iden: this.iden.value,
      comm: this.comm.value,
      acno: this.acno.value,
      type: this.type.value,
      name: this.name.value,
      nick: this.nick.value,
      pdat: this.pdate.value,
      prof: this.prof,
      meth: this.method.value,
      totl: this.totl.value,
      rout: this.rout.value
    }
  

    this.jsonService
        .initService(this.jsonObj,Util.Url("CGICINVPMT"))
        .subscribe(data => this.errSet = data,
                    err => { this.dispAlert.error(); Util.hideWait(); },
                     () => {
                            Util.hideWait();
                              this.dispAlert.message = this.errSet.message;
                              this.dispAlert.status  = this.errSet.status;
                            if (this.errSet.status === "S") {
                                 this.step = 3;
                                 Util.scrollToId("quotesteps");
                                 this.changes = false;
                                 }else{
                                   this.step = 1;
                                 }
                          }
                  );

  }

  uploadImg(){
    if(this.upfile !==""){
    const formData: FormData = new FormData();
    formData.append('file', this.filesc[0], this.filesc[0].name);

    // create a http-post request and pass the form
    // tell it to report the upload progress
    const req = new HttpRequest('POST', Util.Url("CGXIMGUPL"), formData,{withCredentials:Util.Env()});
    
    this.httpf.request(req).subscribe(data => {this.resp =  JSON.parse(JSON.stringify(data));},
      err => { Util.hideWait(); },
      () => {
        if(this.resp.body.status=='S'){
          if(this.paymode =="P")
            this.scheduleP(this.resp.body.data);
          else
            this.schedule(this.resp.body.data);
        }
      });
    }else{
      if(this.paymode =="P")
        this.scheduleP('');
      else
        this.schedule('');
    }
  }

  ngOnInit() {
    if(window.location.href.indexOf("Make")>-1) this.paymode = 'P'; 
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
    .initService({"mode":"INIT"+this.paymode},Util.Url("CGICINVPMT"))
    .subscribe(data => this.pagedata = data,
      err => { Util.hideWait(); },
      () => { Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        if(this.paymode == 'P')
          this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'PAYMXMAKE');
        else
          this.noAuth = false; 
          //this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'PAYMETHOD'); 
        if (this.pagedata.head.status === "O" || this.noAuth) {
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          Util.hideWait();
          this.canadd =  !Util.noAuth(this.pagedata.head.menuOp,'PAYMETHOD');
          //Default Date
          var now = new Date();
          var month = (now.getMonth() + 1).toString();               
          var day = now.getDate().toString();
          if (parseInt(month) < 10) 
            month = "0" + month.toString();
          if (parseInt(day) < 10) 
            day = "0" + day;
          this.pdate.value = now.getFullYear().toString()+'-'+month+'-'+day;
          //Default Payment
          this.pagedata.body.paymnt.forEach(elem=>{
            if(elem.stat == 'Y') this.method.value = elem.prof;
          });
        this.totl.value = this.pagedata.body.totl.toString();
        if(this.totl.value!=="")this.totl.value = (parseFloat(this.totl.value)).toFixed(2);  

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
