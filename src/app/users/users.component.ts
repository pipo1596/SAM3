import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Usersdata , User } from './usersdata'; 
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  
  validating = false;
  valid = false;
  noAuth = true;
  dealermode = false;
  haslow = false;
  hascap = false;
  hasnum = false;
  matchp = false;
  haschr8= false;
  mode = "ADD";
  modebtn = "ADD";
  useri = "";
  pswd1 = "";
  pswd2 = "";
  dlrv:any;
  editP = "Y";//Edit Password
  reqpass1 = false;
  index = 0;
  changes = false;
  reqpass2 = false;
  //Input Fields
  user = new  Textfield ;
  rlno = new  Textfield ;
  fnam = new  Textfield ;
  lnam = new  Textfield ;
  pswdc= new  Textfield ;
  pswd = new  Textfield ;
  sprs = new  Textfield ;
  disc = new  Textfield ;
  dlr = new  Textfield ;

  dispAlert = new Dispalert();
  errSet    = new Errsetter();

  pagedata = new Usersdata ;
  selectedUser: User = { 
    "mode":"",
    "user":"",
    "useri":"",
    "rlno":"",
    "rold":"",
    "fnam":"",
    "lnam":"",
    "sprs":"",
    "disc":"",
    "pswd":"",
    "dlr":[{"dlri":"","desc":""}]
  }; 
  selectedUserG: User = {
    "mode":"",
    "user":"",
    "useri":"",
    "rlno":"",
    "rold":"",
    "fnam":"",
    "lnam":"",
    "sprs":"",
    "disc":"",
    "pswd":"",
    "dlr" :[{"dlri":"","desc":""}]
  };  
  
  
 
  constructor(private usersService: JsonService,
    private router: Router) { 

    }

validPass(){
  
  //LowerCase
  var lowerCaseLetters = /[a-z]/g;
  if(this.pswd1.match(lowerCaseLetters)) {
    this.haslow = true;
  }else{
    this.haslow = false;
  }
  //UpperCase
  var upperCaseLetters = /[A-Z]/g;
  if(this.pswd1.match(upperCaseLetters)) {
    this.hascap = true;
  }else{
    this.hascap = false;
  }
  //Number
  var numbers = /[0-9]/g;
  if(this.pswd1.match(numbers)) {
    this.hasnum = true;
  }else{
    this.hasnum = false;
  }
  //Length
  if(this.pswd1.length >=8){
    this.haschr8 = true;
  }else{
    this.haschr8 = false;
  }
  //Match
  if(this.pswd1 == this.pswd2 && this.pswd1!==''){
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

addDealer(){
  this.validating = false;
  if(this.dlr.value==""){
    this.dlr.erlevel = "D";
    this.dlr.message = "(Required)";
    return false;
  }
  Util.showWait();
  this.usersService
    .initService({"mode":"DLRV","onedlr":this.dlr.value},Util.Url("CGICUSERSS"))
    .subscribe(data => this.dlrv = data,
      err => {  },
      () => {
        if(this.dlrv.dlri == this.dlr.value){
          var index = this.selectedUser.dlr.findIndex(obj => obj.dlri==this.dlr.value);
          if(index <0) this.selectedUser.dlr.push(this.dlrv);
          this.dlr.erlevel = "S";
          this.dlr.message = "(Dealer Added)";
          this.dlr.value = "";
        }else{
          this.dlr.erlevel = "D";
          this.dlr.message = "(Dealer #"+this.dlr.value+" is invalid!)";
          this.dlr.value = "";
        }
        Util.hideWait();
        
       }
      );
    }

removeDlr(dealer){
  Util.showWait();
  var index = this.selectedUser.dlr.findIndex(obj => obj.dlri==dealer.dlr);
  this.selectedUser.dlr.splice(index,1);
  this.dlr.erlevel = "S";
  this.dlr.message = "(Dealer removed)";
  this.dlr.value = "";
  Util.hideWait();

}    
onSelect(user: User): void {
  this.selectedUser.mode = "SAVE";
  this.selectedUser.user = user.user;
  this.selectedUser.useri = user.useri;
  this.selectedUser.rlno = user.rlno;
  this.selectedUser.rold = user.rold;
  this.selectedUser.fnam = user.fnam;
  this.selectedUser.lnam = user.lnam;
  this.selectedUser.sprs = user.sprs;
  this.selectedUser.disc = user.disc;
  this.selectedUser.dlr = user.dlr;
  this.selectedUser.pswd = "";
  this.dlr.erlevel ="";
  this.dlr.message ="";
  this.dlr.value ="";
  this.selectedUserG = user;
  this.pswd1 = "";
  this.pswd2 = "";
  this.useri = this.selectedUser.user.toUpperCase();
  this.mode = "SAVE";
  this.modebtn = "SAVE";
  this.editP = "N";
  Util.showWait();
  Util.showUsers();
  Util.hideWait();
  Util.scrollTop();
  this.changes = false;
  this.haslow = false;
  this.hascap = false;
  this.hasnum = false;
  this.matchp = false;
  this.haschr8= false;
  
}

addUserInit(){
  Util.showWait();
   this.selectedUser = {
    "mode":"ADD",
    "user":"",
    "useri":"",
    "rlno":"",
    "rold":"",
    "fnam":"",
    "lnam":"",
    "sprs":"",
    "disc":"",
    "pswd":"",
    "dlr" :[{"dlri":"","desc":""}]
  };  
  this.selectedUser.dlr.pop();
  this.dlr.erlevel ="";
  this.dlr.message ="";
  this.dlr.value ="";
  this.changes = false;
  Util.showUsers();
  Util.hideWait();
  this.validating = false;
  this.useri = "";
  this.mode = "ADD";
  this.modebtn = "ADD";
  this.editP = "Y";
  this.pswd1 = "";
  this.pswd2 = "";
  Util.scrollTop();
  this.haslow = false;
  this.hascap = false;
  this.hasnum = false;
  this.matchp = false;
  this.haschr8= false;
  

}
delete(){
  if(confirm("Delete this User?")){
  this.mode = "DELETE";
  Util.setfieldval("formmode","DELETE");
  Util.showWait();
  this.usersService
  .initService(Util.formdata("adduser"),Util.Url("CGICUSERSS")) 
  .subscribe(data => this.errSet = data,
    err => { this.dispAlert.error(), Util.hideWait(); },
    () => {
      this.dispAlert.setMessage(this.errSet);
      if (this.dispAlert.status === "S") {

          this.changes = false;
          this.index = this.pagedata.users.findIndex(obj => obj.user==this.selectedUser.user);
          this.pagedata.users.splice(this.index,1);
          setTimeout(() => {
            Util.showWait();   
            this.cancel();
          }, 1000);

        
      }else{
        Util.hideWait();
      }
        

    }
  );
  }
}
cancel(){

  Util.showWait();
  this.validating = false;
  this.selectedUser = {
    "mode":"",
    "user":"",
    "useri":"",
    "rlno":"",
    "rold":"",
    "fnam":"",
    "lnam":"",
    "sprs":"",
    "disc":"",
    "pswd":"",
    "dlr" :[{"dlri":"","desc":""}]
  };  
  this.selectedUser.dlr.pop();
  this.changes = false;
  Util.hideWait(); 
  Util.hideUsers();
  this.useri = "";
  this.mode = "ADD";
  this.modebtn = "ADD";
  this.editP = "Y";
  this.dispAlert.default();
  this.pswd1 = "";
  this.pswd2 = "";
  Util.scrollTop();
  
}

checkUser(){
  if(this.dealermode){this.addDealer();return false;}
    this.validating = true;
    this.valid = true;
    //Reset Error Messages
    this.user.message  = "";
    this.rlno.message  = "";
    this.fnam.message  = "";
    this.lnam.message  = "";
    this.sprs.message  = "";
    this.disc.message  = "";
    this.pswdc.message = "";
    this.pswd.message  = "";
    this.dispAlert.default();
    this.reqpass1 = false;
    this.reqpass2 = false;
    //Trim Field values
    this.user.value  = this.selectedUser.user.trim();
    this.rlno.value  = this.selectedUser.rlno.trim();
    this.fnam.value  = this.selectedUser.fnam.trim();
    this.lnam.value  = this.selectedUser.lnam.trim();
    this.sprs.value  = this.selectedUser.sprs.trim();
    this.disc.value  = this.selectedUser.disc.trim();
    this.pswdc.value = this.pswd2.trim();
    this.pswd.value  = this.pswd1.trim();

    if (this.user.value == "") { this.user.message = "(required)"; this.user.erlevel = "D"; this.valid = false; }
    if (this.user.value !== "" && !Util.validemail(this.user.value)) { this.user.message = "(invalid email!)"; this.user.erlevel = "D"; this.valid = false; }
    if (this.fnam.value == "") { this.fnam.message = "(required)"; this.fnam.erlevel = "D"; this.valid = false; }
    if (this.lnam.value == "") { this.lnam.message = "(required)"; this.lnam.erlevel = "D"; this.valid = false; }
    if (this.rlno.value == "") { this.rlno.message = "(required)"; this.rlno.erlevel = "D"; this.valid = false; }

    if (this.sprs.value == "") { this.sprs.message = "(required)"; this.sprs.erlevel = "D"; this.valid = false; }
    if (this.pswd1 == "" && this.editP == "Y") { this.pswd.message = "(required)"; this.pswd.erlevel = "D"; this.valid = false; this.reqpass1=true;}
    if (this.pswd1 !== this.pswd2 && this.editP == "Y") { this.pswd.message = "(Passwords don't match)"; this.pswd.erlevel = "D"; this.valid = false; this.reqpass1=true;}
    if (this.pswd2 == "" && this.editP == "Y") { this.pswdc.message = "(required)"; this.pswdc.erlevel = "D"; this.valid = false;this.reqpass2=true; }
    if (this.pswd1 === this.pswd2 && this.pswd1 !=='' && this.editP == "Y" && !this.validPass()){ this.pswd.message = "(Password not valid)"; this.pswd.erlevel = "D"; this.valid = false; this.reqpass1=true;} 
   if (this.valid){//Serve Action
    Util.showWait();
    this.selectedUser.mode = this.mode;
    this.selectedUser.pswd = this.pswd1;
    this.usersService
    //.initService(Util.formdata("adduser"),Util.Url("CGICUSERSS"))
    
    .initService(this.selectedUser,Util.Url("CGICUSERSS"))
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error(), Util.hideWait(); },
      () => {
        this.dispAlert.setMessage(this.errSet);
        if (this.dispAlert.status === "S") {

          if(this.mode=="ADD"){
            this.pagedata.users.push({
              "mode":this.selectedUser.mode,
              "user":this.selectedUser.user,
              "useri":this.selectedUser.user,
              "rlno":this.selectedUser.rlno,
              "rold":Util.getSelText(this.selectedUser.rlno,this.pagedata.roles),
              "fnam":this.selectedUser.fnam,
              "lnam":this.selectedUser.lnam,
              "sprs":this.selectedUser.sprs,
              "disc":this.selectedUser.disc,
              "pswd":"",
              "dlr": this.selectedUser.dlr
            });

            setTimeout(() => {
              Util.showWait();   
              this.cancel();
            }, 1000);


          }
          if(this.mode=="SAVE"){
            //this.index = this.pagedata.users.findIndex(obj => obj.user==this.selectedUser.user);
            //alert(this.index);
            this.selectedUserG.user = this.selectedUser.user;
            this.selectedUserG.rlno = this.selectedUser.rlno;
            this.selectedUserG.rold = Util.getSelText(this.selectedUser.rlno,this.pagedata.roles);
            this.selectedUserG.fnam = this.selectedUser.fnam;
            this.selectedUserG.lnam = this.selectedUser.lnam;
            this.selectedUserG.sprs = this.selectedUser.sprs;
            this.selectedUserG.disc = this.selectedUser.disc;
            this.selectedUserG.pswd = "";
            this.selectedUserG.dlr = this.selectedUser.dlr;
            setTimeout(() => {
              Util.showWait();   
              this.cancel();
            }, 1000);
          }
          this.changes = false;
          
        }else{
          Util.hideWait();
        }
          

      }
    );


   }

    
}

onChange() {

  this.validating = false;
  this.changes= true;
}

changePass(){
  this.validating = false;
  if(this.editP ==="Y")
    this.editP="N";
  else
    this.editP = "Y";
}

  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.usersService
    .initService({"mode":"INIT"},Util.Url("CGICUSERSS"))
    .subscribe(data => this.pagedata = data,
      err => { Util.responsiveMenu(); },
      () => { Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
      //Sort By User Ascending
        this.pagedata.users =  Util.sortByKey(this.pagedata.users, "user","A");

        this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'EUSERS');
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