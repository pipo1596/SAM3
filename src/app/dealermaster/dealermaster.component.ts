import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { MasterDealerData } from './dealermaster'; 
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-dealermaster',
  templateUrl: './dealermaster.component.html'
})
export class DealermasterComponent implements OnInit {

	pagedata = new MasterDealerData;
	
	validating = false;
	valid = false;
	changes = false;
	noAuth = true;
	//Input Fields
	dsmd = new Textfield;
	pack = new Textfield;
	user = new Textfield;
	type = new Textfield;
	dsid = new Textfield;
  pass = new Textfield;
  belg:boolean = false;
  dbil:boolean = false;
  nymm:boolean = false;
  //Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();

  constructor(private jsonService: JsonService,private router: Router) { }

  onChange(){
    this.changes= true;
    this.validating = false;
  }
  defaultBill(){
    if(this.pagedata.body.lck1) return false;
    this.dbil =!this.dbil
  }
  onChangeDrop(){
    this.changes= false;
    this.validating = false;
    this.user.value = this.pagedata.body.user;
		this.type.value = this.pagedata.body.type;
		this.dsid.value = this.pagedata.body.dsid;
		this.pass.value = this.pagedata.body.pass;
  }

  checkData(){
    this.validating = true;
    this.valid = true;
    //Reset Error Messages
    this.dsmd.message  = "";
    this.pack.message  = "";
    this.user.message  = "";
    this.type.message  = "";
    this.dsid.message  = "";
    this.pass.message  = "";
    this.dispAlert.default();

    this.loadDb()
  }

  loadDb(){
    if (!this.valid) return false;
    
    Util.showWait();
    this.pagedata.body.mode = "SAVE";
    if(this.dsmd.value === "SE"){
      this.pass.value = "";
    } else if(this.dsmd.value === "SIS"){
      this.type.value = "";
      this.dsid.value = "";
    } else {
      this.user.value = "";
      this.pass.value = "";
      this.type.value = "";
      this.dsid.value = "";
    }
    this.pagedata.body.dsmd = this.dsmd.value;
    this.pagedata.body.pack = this.pack.value;
    this.pagedata.body.user = this.user.value;
    this.pagedata.body.type = this.type.value;
    this.pagedata.body.dsid = this.dsid.value;
    this.pagedata.body.pass = this.pass.value;
    this.pagedata.body.belg = this.belg;
    this.pagedata.body.dbil = this.dbil;
    this.pagedata.body.nymm = this.nymm;

    this.jsonService
    .initService(this.pagedata.body,Util.Url("CGICDLRMST"))
    .subscribe(data => this.errSet = data,
      err => { this.dispAlert.error();Util.hideWait(); },
      () => {
					this.dispAlert.setMessage(this.errSet);
          Util.hideWait();
          if (this.dispAlert.status === "S") {
            this.changes = false;
          }
      }
    );
  }

  cancel(){

    Util.showWait();
    this.validating = false;
    Util.hideWait(); 
    Util.hideTopForm();
    this.dispAlert.default();
    Util.scrollTop();
    this.changes = false;
  }


  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.jsonService
    .initService({"mode":"INIT"},Util.Url("CGICDLRMST"))
    .subscribe(data => this.pagedata = data,
      err => {Util.hideWait(); },
      () => {
        Util.setHead(this.pagedata.head);
        Util.responsiveMenu(); 
        this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'EDITDLR');
        if (this.pagedata.head.status === "O" || this.noAuth ) {                      
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          Util.hideWait();
          this.dsmd.value = this.pagedata.body.dsmd;
          this.pack.value = this.pagedata.body.pack;
          this.dsid.value = this.pagedata.body.dsid;
          this.pass.value = this.pagedata.body.pass;
          this.user.value = this.pagedata.body.user;
          this.type.value = this.pagedata.body.type;
          this.belg       = this.pagedata.body.belg;
          this.dbil       = this.pagedata.body.dbil;
          this.nymm       = this.pagedata.body.nymm;
        }

       }
    );
  }

}
