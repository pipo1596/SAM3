import { Component, OnInit } from '@angular/core';
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';
import { Util } from '../utilities/util';
import { JsonService } from '../utilities/json.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { Login1data } from './login1data';
import { utils } from 'protractor';


@Component({
  selector: 'app-login',
  templateUrl: './login1.component.html'
})
export class Login1Component implements OnInit {

  producer = new Textfield ;
  employee = new Textfield ;
  password = new Textfield ;
  nuser = new Textfield ;
  nuserc = new Textfield ;
  npasswordc = new Textfield ;
  npassword = new Textfield ;
  form1 = "";
  validating = false;
  valid = false;
  dispAlert = new Dispalert;
  errSet    = new Errsetter();
  pagedata  = new Login1data;
  changeP = false;
  haslow = false;
  hascap = false;
  hasnum = false;
  matchp = false;
  haschr8= false;
  created:boolean = false;

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

  checkLogin() {
    this.validating = true;
    this.valid = true;
    this.producer.message = "";
    this.employee.message = "";
    this.password.message = "";
    this.dispAlert.default;

    this.producer.value = this.producer.value.trim();
    this.employee.value = this.employee.value.trim();
    this.password.value = this.password.value.trim();
    this.nuser.value = this.nuser.value.trim();
    this.nuserc.value = this.nuserc.value.trim();
    this.npassword.value = this.npassword.value.trim();
    this.npasswordc.value = this.npasswordc.value.trim();

    if (this.producer.value == "") { this.producer.message = "Producer # required."; this.producer.erlevel = "D"; this.valid = false; }
    if (this.employee.value == "") { this.employee.message = "Employee ID required."; this.employee.erlevel = "D"; this.valid = false; }
    if (this.password.value == "") { this.password.message = "Password required."; this.password.erlevel = "D"; this.valid = false; }
    if(this.changeP){
      this.nuser.message = "";
      this.nuserc.message = "";
      this.npassword.message = "";
      this.npasswordc.message = "";
      if (this.nuser.value == "") { this.nuser.message = "Email required."; this.nuser.erlevel = "D"; this.valid = false; }
      if (this.nuserc.value == "") { this.nuserc.message = "Confirm your email."; this.nuserc.erlevel = "D"; this.valid = false; }
      if (this.nuser.value !== "" && !Util.validemail(this.nuser.value)){ this.nuser.message = "Invalid Email!"; this.nuser.erlevel = "D"; this.valid = false; }
      if (this.valid && (this.nuserc.value !== this.nuser.value)){ this.nuser.message = "Emails don't match!"; this.nuser.erlevel = "D"; this.valid = false; }
      if (this.npassword.value == "") { this.npassword.message = "New Password required."; this.npassword.erlevel = "D"; this.valid = false; }
      if (this.npasswordc.value == "") { this.npasswordc.message = "Confirm Password."; this.npasswordc.erlevel = "D"; this.valid = false; }
      if (this.valid && this.npassword.value !== this.npasswordc.value) { this.npassword.message = "Passwords don't match!"; this.npassword.erlevel = "D"; this.valid = false;}
      if (this.valid && this.npassword.value === this.npasswordc.value && !this.validPass()){ this.npassword.message = "Password too weak!";this.npassword.erlevel = "D"; this.valid = false;} 
      if (this.valid && this.password.value === this.npassword.value){ this.npassword.message = "You cannot reuse your old password!"; this.valid = false;} 

    }else{
      this.nuser.message = "";
      this.npassword.message = "";
      this.npasswordc.message = "";
    }
    
    if (this.valid) {
      Util.showWait();
      var jsonObj = {
        service: "LOGIN",
        producer: this.producer.value,
        employee: this.employee.value,
        password: this.password.value,
        nuser:this.nuser.value,
        npassword:this.npassword.value,
        npasswordc:this.npasswordc.value
      }
      this.form1 = JSON.stringify(jsonObj);

      this.loginService
        .initService(JSON.parse(this.form1),Util.Url("CGICLOGINC"))
        .subscribe(data => this.errSet = data,
          err => { Util.responsiveMenu(); this.dispAlert.error(); Util.hideWait(); },
          () => {Util.responsiveMenu();  
            this.dispAlert.setMessage(this.errSet);
            if(this.dispAlert.data=="C") {this.changeP = true;setTimeout(() => { Util.focusById("nuser");}, 200);}
            if (this.dispAlert.status === "S") {
              Util.hideWait();
              this.created = true;
            //  setTimeout(() => {
            //    Util.showWait();   
            //    this.router.navigate(['/app/Home']);
            //  }, 500);
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

  onChange() {

    this.validating = false;

  }
  constructor(private loginService: JsonService,
              private router: Router) { }

  ngOnInit() {
  
    setTimeout(() => { Util.focusById("producer");}, 200);
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.loginService
    .initService({ "service": "INIT" },Util.Url("CGICLOGINC"))
      .subscribe(data => this.pagedata = data,
        err => { },
        () => { 
          Util.setHead(this.pagedata.head);
          if (this.pagedata.head.status === "I") {
            this.router.navigate(['/app/Home']);
          }else{
              Util.hideWait();  
          }
        }
      );
  }
}
