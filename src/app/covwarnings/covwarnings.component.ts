import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Covwarningsdata, Warn } from './covwarningsdata';
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-covwarnings',
  templateUrl: './covwarnings.component.html'
})
export class CovwarningsComponent implements OnInit {

	pagedata = new Covwarningsdata;
	validating = false;
	valid = false;
	changes = false;
	modebtn = "ADD";
	//Input Fields
	cov = new Textfield;
	wrn = new Textfield;
	dlr  = new Textfield;
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Top Section
  selectedRec = new Warn;
  //selectedRecG = new Ovrd;
  //New Rec Skeleton
  newRec = new Warn;	
  index : number;
  dispType : string;

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



  onChange(){
  	this.changes = true;
  	this.validating = false;
  }


  addRecInit(){
  	//delete this.selectedRecG;
  	this.selectedRec.default("ADD");
  	this.dispAlert.default();
  	Util.showWait();
  	Util.showTopForm();
  	Util.hideWait();
  	this.validating = false;
  	this.changes = false;
  	this.modebtn = "ADD";
  	Util.scrollTop();
  	Util.focusById("srky");
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

  onSelect(record) {
  	this.dispAlert.default();
  	//delete this.selectedRecG;
	this.selectedRec.cov = record.cov;
	this.selectedRec.dlr  = record.dlr;
  	this.selectedRec.wrn = record.wrn;
  	this.selectedRec.covi = record.covi;
  	this.selectedRec.dlri = record.dlri;

  	//this.selectedRecG = record;
  	this.selectedRec.mode = "SAVE";
  	this.modebtn = "SAVE";

    Util.showWait();
    Util.showTopForm();
    Util.hideWait();
    Util.scrollTop();
    this.changes = false;
  }

  delete(){
  	if(confirm("Delete this Warning?")){
  		this.selectedRec.mode = "DELETE";
  		Util.showWait();
  		this.jsonService
  		.initService(this.selectedRec,Util.Url("CGICCOVWRN"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error();Util.hideWait(); },
  			() => {
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
  					this.pagedata.warnings.splice(this.pagedata.warnings.findIndex(obj => obj.covi==this.selectedRec.covi && obj.dlri==this.selectedRec.dlri),1);
  					setTimeout(() => {
  						Util.showWait();
  						this.cancel();
  					}, 500);
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
	this.cov.message = "";
	this.wrn.message = "";  
  	this.dlr.message  = "";
  	this.dispAlert.default();
  	//Trim Field Values
  	this.cov.value = this.selectedRec.cov.trim().toUpperCase();
  	this.wrn.value  = this.selectedRec.wrn.trim().toUpperCase();
  	this.dlr.value  = this.selectedRec.dlr.trim().toUpperCase();

  	this.selectedRec.cov = this.selectedRec.cov.trim().toUpperCase();
  	this.selectedRec.dlr  = this.selectedRec.dlr.trim().toUpperCase();
  	this.selectedRec.wrn  = this.selectedRec.wrn.trim();

  	this.dlr.value = this.selectedRec.dlr.trim();

  	if(this.cov.value == ""){ this.cov.message = "(required)"; this.cov.erlevel = 'D'; this.valid = false;}
  	if(this.wrn.value == ""){ this.wrn.message = "(required)"; this.wrn.erlevel = 'D'; this.valid = false;}

  	this.loadDb();
  }

  loadDb(){
  	if(!this.valid) return false;
  	Util.showWait();
  	this.jsonService
  	.initService(this.selectedRec,Util.Url("CGICCOVWRN"))
  	.subscribe(data => this.errSet = data,
  		err => {this.dispAlert.error(); Util.hideWait();},
  		() => {
  			this.changes = false;
  			this.dispAlert.setMessage(this.errSet);
  			if(this.dispAlert.status === "S"){
  				if(this.selectedRec.mode == "ADD"){
  					this.newRec.cov = this.selectedRec.cov;
  					this.newRec.covi= this.selectedRec.cov.toUpperCase().padEnd(10);
  					this.newRec.dlr = this.selectedRec.dlr;
  					this.newRec.dlri = this.selectedRec.dlr.toUpperCase();
  					this.newRec.wrn = this.selectedRec.wrn.trim();

  					this.pagedata.warnings.push(JSON.parse(JSON.stringify(this.newRec)));

  					setTimeout(() => {
  						Util.showWait();
  						this.cancel();
  					}, 500);
  				}
  				if(this.selectedRec.mode == "SAVE"){
  					this.index = this.pagedata.warnings.findIndex(obj => obj.covi==this.selectedRec.covi && obj.dlri==this.selectedRec.dlri);
  					this.pagedata.warnings[this.index].cov = this.selectedRec.cov;
  					this.pagedata.warnings[this.index].covi = this.selectedRec.cov; 
  					this.pagedata.warnings[this.index].dlr = this.selectedRec.dlr; 
  					this.pagedata.warnings[this.index].dlri = this.selectedRec.dlr;
  					this.pagedata.warnings[this.index].wrn = this.selectedRec.wrn; 
  					setTimeout(() => {
  						Util.showWait();
  						this.cancel();
  					}, 500);
  				}
  				
  			} else{
  				Util.hideWait();
  			}
  		}
  		)
  }



  ngOnInit() {
	Util.showWait();
	this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICCOVWRN"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.hideWait(); },
  		() => {
			Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" || !this.pagedata.head.as400) {
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
