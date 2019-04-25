import { Component, OnInit } from '@angular/core';
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';
import { Util } from '../utilities/util';
import { JsonService } from '../utilities/json.service';
import { Router } from '@angular/router';
import { Logindata } from './logindata';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  employee = new Textfield ;
  password = new Textfield ;
  form1 = "";
  validating = false;
  valid = false;
  dispAlert = new Dispalert;
  errSet    = new Errsetter();
  pagedata  = new Logindata;
  changeP = false;

  checkLogin() {
    this.validating = true;
    this.valid = true;
    this.employee.message = "";
    this.password.message = "";
    this.dispAlert.default;

    this.employee.value = this.employee.value.trim();
    this.password.value = this.password.value.trim();

    if (this.employee.value == "") { this.employee.message = "Email required."; this.employee.erlevel = "D"; this.valid = false; }
    if (this.password.value == "") { this.password.message = "Password required."; this.password.erlevel = "D"; this.valid = false; }
    
    
    if (this.valid) {
      Util.showWait();
      var jsonObj = {
        service: "LOGIN",
        employee: this.employee.value,
        password: this.password.value,
        tabid : sessionStorage.getItem("tabid")
      }
      this.form1 = JSON.stringify(jsonObj);

      this.loginService
        .initService(JSON.parse(this.form1),Util.Url("CGICLOGINS"))
        .subscribe(data => this.errSet = data,
          err => { Util.responsiveMenu(); this.dispAlert.error(); Util.hideWait(); },
          () => {Util.responsiveMenu();  
            this.dispAlert.setMessage(this.errSet);
            
            if (this.dispAlert.status === "S") {
              Util.hideWait();
              Util.Fullstory(this.employee.value.toUpperCase(),this.dispAlert.data);
              setTimeout(() => {
                Util.showWait();   
                this.router.navigate(['/app/Home']);
              }, 500);
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
   
    setTimeout(() => { Util.focusById("employee");}, 200);
    Util.showWait();
    this.loginService
    .initService({ "service": "INIT","tabid": sessionStorage.getItem("tabid") },Util.Url("CGICLOGINS"))
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
