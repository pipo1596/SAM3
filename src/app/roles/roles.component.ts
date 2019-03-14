import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Rolesdata , Role } from './rolesdata';
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert'; 

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {

  validating = false;
  valid = false; 
  modebtn = "ADD";
  dscxi = "";   
  desc = new Textfield;
  changes = false;
  noAuth = true;
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  
  selectedRole = new Role;
  selectedRoleD : any = {"mode":"",
                        "rlno":"",
                        "desc":"",
                        "dscx":"",
                        "dscxi":"",
                        "autharr":[{"auth":"","desc":"","chek":""}]}; 
  

  pagedata = new Rolesdata ;

  //Constructors
  constructor(private rolesService: JsonService, private router: Router) { }
  //When checking/unchecking an authority
  addauth(e){
    var srcEl = e.srcElement || e.target;
    var index =  this.selectedRole.autharr.findIndex(obj => obj.auth==srcEl.defaultValue);
    this.changes = true;
    if(e.target.checked){ 
      this.selectedRole.autharr[index].chek ="Y";
    }
    else{
      this.selectedRole.autharr[index].chek ="";
    }
  }  
  //On edit click
  onSelect(role: Role): void {
    this.selectedRole = JSON.parse(JSON.stringify(role));
    this.dscxi = this.selectedRole.dscx;
    this.selectedRole.mode = "SAVE";
    this.modebtn = "SAVE";
    Util.showWait();
    Util.showRoles();
    Util.hideWait();
    Util.scrollTop();
    this.changes = false;
  }
  //Add New
  addRoleInit(){
    Util.showWait();
    this.selectedRole = Object.assign({}, this.selectedRoleD); 
    this.selectedRole.autharr.pop();
    this.selectedRole.autharr = JSON.parse(JSON.stringify(this.pagedata.tableroles));
    Util.showRoles();
    Util.hideWait();
    this.validating = false;
    this.selectedRole.mode = "ADD";
    this.modebtn = "ADD";
    Util.scrollTop();
    this.changes = false;
  }
  //Cancel Edit/Add
  cancel(){
    Util.showWait();
    this.validating = false;
    this.selectedRole =Object.assign({}, this.selectedRoleD); 
    Util.hideWait(); 
    Util.hideRoles();
    this.dscxi = "";
    this.selectedRole.mode = "ADD";
    this.modebtn = "ADD";
    this.dispAlert.default();
    this.changes = false;
  }
  onChange(){
    this.changes= true;
    this.validating = false;
  }
  //Add Update
  checkRole(){
    this.validating = true;
    this.valid = true;
    this.dispAlert.default();
    //Reset Error Messages
    this.desc.message  = "";
    this.dispAlert.default();
    //Trim Field values
    this.desc.value  = this.selectedRole.desc.trim();

    if (this.desc.value == "") { this.desc.message = "(required)"; this.desc.erlevel = "D"; this.valid = false;Util.scrollTop(); }
    var noneselected = true;
    this.selectedRole.autharr.forEach(element => {
      if(element.chek == 'Y') noneselected = false;
      
    });
    if(noneselected){this.valid = false;this.dispAlert.message="No authorities selected!";this.dispAlert.status="E";Util.scrollTop();}

    if (this.valid){//Serve Action
    Util.showWait();
    this.selectedRole.dscx = this.selectedRole.desc.toUpperCase();
    this.selectedRole.dscxi = this.selectedRole.desc.toUpperCase();
    this.rolesService
    .initService(this.selectedRole,Util.Url("CGICROLESS"))
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error(); Util.hideWait(); },
      () => {
        this.dispAlert.setMessage(this.errSet);
        if (this.dispAlert.status === "S") {
          this.changes = false;
          if(this.selectedRole.mode=="ADD"){
            this.selectedRole.rlno = this.dispAlert.data;
            this.pagedata.roles.push(this.selectedRole);
            this.pagedata.roles =  Util.sortBy2Key(this.pagedata.roles,"type","dscxi","A");
            setTimeout(() => {
              Util.showWait();   //<<<---    using ()=> syntax
              this.cancel();
            }, 500);
          }
          if(this.selectedRole.mode=="SAVE"){
            var indexm = this.pagedata.roles.findIndex(obj => obj.dscxi==this.selectedRole.dscxi);
            this.pagedata.roles.splice(indexm,1);
            this.pagedata.roles.push(this.selectedRole);
            this.pagedata.roles =   Util.sortBy2Key(this.pagedata.roles,"type","dscx","A");
            
            setTimeout(() => {
              Util.showWait();   //<<<---    using ()=> syntax
              this.cancel();
            }, 500);
          }
        }else{
          Util.hideWait();
        }
      }
    );
   }
}

delete(){
  if(confirm("Delete this Authority?")){
  this.selectedRole.mode = "DELETE";
  Util.showWait();
  this.rolesService
  .initService(this.selectedRole,Util.Url("CGICROLESS"))
  .subscribe(data => this.errSet = data,
    err => { this.dispAlert.error(); Util.hideWait(); },
    () => {
      this.changes = false;
      this.dispAlert.setMessage(this.errSet);
      if (this.dispAlert.status === "S") {
          var indexm = this.pagedata.roles.findIndex(obj => obj.dscxi==this.selectedRole.dscxi);
          this.pagedata.roles.splice(indexm,1);
          setTimeout(() => {
            Util.showWait();   //<<<---    using ()=> syntax
            this.cancel();
          }, 1000);
      }else{
        Util.hideWait();
      }
    }
  );
  }
}

  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.rolesService
    .initService({"mode":"INIT"},Util.Url("CGICROLESS"))
    .subscribe(data => this.pagedata = data,
      err => { Util.hideWait(); },
      () => { Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
      //Sort By User Ascending
        this.pagedata.roles =   Util.sortBy2Key(this.pagedata.roles,"type","dscxi","A");
        
        this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'AUTHORITY');
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
