import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,  NavigationEnd } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Paymentmethodsdata, Method } from './paymentmethodsdata';
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-Lien',
  templateUrl: './paymentmethods.component.html'
})
export class PaymentmethodsComponent implements OnInit {

	pagedata = new Paymentmethodsdata;
	validating = false;
	valid = false;
	changes = false;
	modebtn = "ADD";
	//Input Fields
	name = new Textfield;
	type = new Textfield;
	nick = new Textfield;
	rout = new Textfield;
	acno = new Textfield;
	acnc = new Textfield;
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Top Section
  selectedRec = new Method;
  //New Rec Skeleton
  newRec = new Method;	
  index : number;
  dispType : string;
  boxchange:boolean = false;

  constructor(private jsonService: JsonService,private router: Router, private route: ActivatedRoute) { 
  	this.router.routeReuseStrategy.shouldReuseRoute = function(){
	    return false;
		};

		this.router.events.subscribe((evt) => {
	    if (evt instanceof NavigationEnd) {
	      this.router.navigated = false;
	      window.scrollTo(0, 0);
	    }
		});
  }

  

  saveboxes(){
	var jsonObj = {
		mode: "BOXES",
		dflt: "",
        boxes:[]
	  };
	  this.pagedata.methods.forEach(elem =>{ if(elem.dflt){
		
		  jsonObj.boxes.push({prof:elem.prof});
		
		}});
		Util.showWait();
		this.jsonService
		.initService(jsonObj,Util.Url("CGICPYMTMT"))
		.subscribe(data => this.errSet = data,
			err => { this.dispAlert.error();Util.hideWait(); },
			() => {
				this.dispAlert.setMessage(this.errSet);
				if(this.dispAlert.status === "S"){
					
						Util.showWait();
						this.cancel();
						
					
				} else {
					Util.hideWait();
				}
				this.boxchange = false;
			})
}

  onChange(){
  	this.changes = true;
  	this.validating = false;
  }
  onChangebox(elem){
	this.changes = true;
	this.boxchange = true;
	elem.chek = !elem.chek;
	if(elem.dflt && !elem.chek){ elem.dflt = false;}
}
  setdefault(elem){
	this.pagedata.methods.forEach((record) => {
		if(record !== elem)
		record.dflt = false;
	  });  
	this.changes = true;
	this.boxchange = true;
	elem.dflt = !elem.dflt;
	if(elem.dflt){elem.chek = true;}
}


  addRecInit(){
  	this.selectedRec.default("ADD");
  	this.dispAlert.default();
  	Util.showWait();
  	Util.showTopForm();
  	Util.hideWait();
  	this.validating = false;
  	this.changes = false;
  	this.modebtn = "ADD";
  	Util.scrollTop();
  }

  cancel(){
    Util.showWait();
    this.validating = false;
    this.selectedRec.default("ADD"); 
    Util.hideWait(); 
    Util.hideTopForm();
    this.modebtn = "ADD";
    this.dispAlert.default();
    Util.scrollTop();
    this.changes = false;  	
  }


  delete(record){
  	if(confirm("Delete this Payment Method?")){
  		record.mode = "DEACT";
  		Util.showWait();
  		this.jsonService
  		.initService(record,Util.Url("CGICPYMTMT"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error();Util.hideWait(); },
  			() => {
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
  					this.pagedata.methods.splice(this.pagedata.methods.findIndex(obj => obj.prof==record.prof),1);
  					setTimeout(() => {
  						Util.showWait();
  						this.cancel();
  					}, 300);
  				} else {
  					Util.hideWait();
  				}
  			})
  	}
  }

  checkData(){
  	this.validating = true;
  	this.valid = true;
  	//Reset Error Messages
		this.name.message = "";
		this.type.message = "";
		this.acno.message = "";
		this.acnc.message = "";
		this.nick.message = "";
		this.rout.message = "";
	
  	this.dispAlert.default();
  	//Trim Field Values
		this.type.value = this.selectedRec.type.trim();
		this.name.value = this.selectedRec.name.trim();
		this.acno.value = this.selectedRec.acno.trim();
		this.acnc.value = this.selectedRec.acnc.trim();
		this.nick.value = this.selectedRec.nick.trim();
		this.rout.value = this.selectedRec.rout.trim();

	  if(this.type.value == ""){ this.type.message = "(required)"; this.type.erlevel = 'D'; this.valid = false;}
	  if(this.name.value == ""){ this.name.message = "(required)"; this.name.erlevel = 'D'; this.valid = false;}
	  if(this.acnc.value == ""){ this.acnc.message = "(required)"; this.acnc.erlevel = 'D'; this.valid = false;}
	  if(this.acnc.value !== "" && this.acnc.value !== this.acno.value){ this.acno.message = "(Account Number Don't Match)"; this.acno.erlevel = 'D'; this.valid = false;}
	  if(this.nick.value == ""){ this.nick.message = "(required)"; this.nick.erlevel = 'D'; this.valid = false;}
		if(this.rout.value == ""){ this.rout.message = "(required)"; this.rout.erlevel = 'D'; this.valid = false;}
		if(this.acno.value !== "" && this.acno.value.length < 6){ this.acno.message = "(Invalid)"; this.acno.erlevel = 'D'; this.valid = false;}
		if(this.acno.value == ""){ this.acno.message = "(required)"; this.acno.erlevel = 'D'; this.valid = false;}
	  
  	this.loadDb();
  }

  loadDb(){
  	if(!this.valid) return false;
  	Util.showWait();
  	this.jsonService
  	.initService(this.selectedRec,Util.Url("CGICPYMTMT"))
  	.subscribe(data => this.errSet = data,
  		err => {this.dispAlert.error(); Util.hideWait();},
  		() => {
  			this.changes = false;
  			this.dispAlert.setMessage(this.errSet);
  			if(this.dispAlert.status === "S"){
  				if(this.selectedRec.mode == "ADD"){
  					this.newRec.name = this.selectedRec.name;
  					this.newRec.type = this.selectedRec.type;
  					this.newRec.acno = this.selectedRec.acno;
  					this.newRec.nick = this.selectedRec.nick;
						this.newRec.prof = this.dispAlert.data;
						this.newRec.four = this.newRec.acno.substr(-4);//Last Four of Account Number
						if(!this.pagedata.methods || this.pagedata.methods.length<1){this.newRec.dflt = true;}

  					this.pagedata.methods.push(JSON.parse(JSON.stringify(this.newRec)));

  					setTimeout(() => {
  						Util.showWait();
  						this.cancel();
  					}, 300);
  				}
  				
  				
  			} else{
  				Util.hideWait();
  			}
  		}
  		)
  }

  canDeactivate() {

    if(this.changes || this.boxchange)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

}

  ngOnInit() {
	Util.showWait();
	this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICPYMTMT"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.hideWait(); },
  		() => {
			Util.setHead(this.pagedata.head);
			  Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" ||  Util.noAuth(this.pagedata.head.menuOp,'PAYMETHOD')) {
  				Util.showWait();
  				setTimeout(() => {
  					Util.hideWait();
  					this.router.navigate(['/app']);
  				}, 100);
  			} else {
  				Util.hideWait();
  			}
  		}
  	);
  }

}
