import { Component, OnInit } from '@angular/core';
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';
import { Util } from '../utilities/util';
import { JsonService } from '../utilities/json.service';
import { Router } from '@angular/router';
import { Forgotpassworddata } from './forgotpassworddata';


@Component({
  selector: 'app-login',
  templateUrl: './forgotpassword.component.html'
})
export class ForgotPasswordComponent implements OnInit {

  employee = new Textfield ;
  npasswordc = new Textfield ;
  npassword = new Textfield ;
  form1 = "";
  resetkey:string ="";
  finprocess:boolean = true;
  viewmode:string ="";
  validating = false;
  valid = false;
  dispAlert = new Dispalert;
  errSet    = new Errsetter();
  pagedata  = new Forgotpassworddata;
  changeP = false;
  haslow = false;
  hascap = false;
  hasnum = false;
  matchp = false;
  haschr8= false;

  checkPassword() {
    this.validating = true;
    this.valid = true;
    this.npassword.message = "";
    this.npasswordc.message = "";
    this.dispAlert.default;
    this.npassword.value = this.npassword.value.trim();
    this.npasswordc.value = this.npasswordc.value.trim();

    if (this.npassword.value == "") { this.npassword.message = "New Password required."; this.npassword.erlevel = "D"; this.valid = false; }
    if (this.npasswordc.value == "") { this.npasswordc.message = "Confirm Password."; this.npasswordc.erlevel = "D"; this.valid = false; }
    if (this.valid && this.npassword.value !== this.npasswordc.value) { this.npassword.message = "Passwords don't match!"; this.npassword.erlevel = "D"; this.valid = false;}
    if (this.valid && this.npassword.value === this.npasswordc.value && !this.validPass()){ this.npassword.message = "Password too weak!";this.npassword.erlevel = "D"; this.valid = false;} 
    
    
    if (this.valid) {
      Util.showWait();
      var jsonObj = {
        mode: "RESETP",
        resetkey: this.resetkey,
        password: this.npassword.value
      }
      this.form1 = JSON.stringify(jsonObj);

      this.loginService
        .initService(JSON.parse(this.form1),Util.Url("CGICFRGTPS"))
        .subscribe(data => this.errSet = data,
          err => { Util.responsiveMenu(); this.dispAlert.error(); Util.hideWait(); },
          () => {Util.responsiveMenu();  
            this.dispAlert.setMessage(this.errSet);
            
            if (this.dispAlert.status === "S") {
              Util.hideWait();
              this.finprocess = false;
            }
            else {
              Util.hideWait();
              this.viewmode = "F";
            }

          }
        );

    }
    else {
      Util.hideWait();
    }
  }
  checkLogin() {
    this.validating = true;
    this.valid = true;
    this.employee.message = "";
    this.dispAlert.default;

    this.employee.value = this.employee.value.trim();

    if (this.employee.value == "") { this.employee.message = "Email Address required."; this.employee.erlevel = "D"; this.valid = false; } 
    if(this.employee.value !== "" && !Util.validemail(this.employee.value)) { this.employee.message = "invalid Email Address!"; this.employee.erlevel = "D"; this.valid = false;}
    
    
    if (this.valid) {
      Util.showWait();
      var jsonObj = {
        mode: "EMLINK",
        email: this.employee.value
      }
      this.form1 = JSON.stringify(jsonObj);

      this.loginService
        .initService(JSON.parse(this.form1),Util.Url("CGICFRGTPS"))
        .subscribe(data => this.errSet = data,
          err => { Util.responsiveMenu(); this.dispAlert.error(); Util.hideWait(); },
          () => {Util.responsiveMenu();  
            this.dispAlert.setMessage(this.errSet);
            
            if (this.dispAlert.status === "S") {
              Util.hideWait();
              this.finprocess = false;
              this.employee.value ="";
            }
            else {
              Util.hideWait();
            }

          }
        );

    }
    else {
      Util.hideWait();
    }
  }
  validPass(){
  
    //LowerCase
    var lowerCaseLetters = /[a-z]/g;
    if(this.npassword.value.match(lowerCaseLetters)) {
      this.haslow = true;
    }else{
      this.haslow = false;
    }
    //UpperCase
    var upperCaseLetters = /[A-Z]/g;
    if(this.npassword.value.match(upperCaseLetters)) {
      this.hascap = true;
    }else{
      this.hascap = false;
    }
    //Number
    var numbers = /[0-9]/g;
    if(this.npassword.value.match(numbers)) {
      this.hasnum = true;
    }else{
      this.hasnum = false;
    }
    //Length
    if(this.npassword.value.length >=8){
      this.haschr8 = true;
    }else{
      this.haschr8 = false;
    }
    //Match
    if(this.npassword.value == this.npasswordc.value && this.npassword.value!==''){
      this.matchp = true;
    }else{
      this.matchp = false;
    }
  
    if(this.haslow && this.hascap && this.hasnum && this.haschr8 && this.matchp){
      return true;
    }else{
      return false;
    }
  }
  onChange() {

    this.validating = false;

  }
  constructor(private loginService: JsonService,
              private router: Router) { }

  ngOnInit() {
    this.resetkey ="";
    var initmode = "INIT";
    this.viewmode = "F";

    if (window.location.href.indexOf("resetpassword") > -1){
      this.viewmode = "R";
      initmode = "INITR"
      this.resetkey = Util.getparm('resetkey');
    }
    if (window.location.href.indexOf("activate") > -1){
      this.viewmode = "A";
      initmode = "INITA"
      this.resetkey = Util.getparm('actvkey');
    }
    
   
    setTimeout(() => { Util.focusById("employee");}, 200);
    Util.showWait();
    this.loginService
    .initService({ "mode": initmode , "resetkey":this.resetkey  },Util.Url("CGICFRGTPS"))
      .subscribe(data => this.pagedata = data,
        err => { Util.hideWait();},
        () => { 
          Util.setHead(this.pagedata.head);
          if (this.pagedata.head.status === "I") {
            this.router.navigate(['/app/Home']);
          }else{
              Util.hideWait();  
              if(this.viewmode == "R" || this.viewmode == "A"){
              this.dispAlert.status = this.pagedata.body.status;
              this.dispAlert.message= this.pagedata.body.message;
              }
          }
        }
      );
  }
}
