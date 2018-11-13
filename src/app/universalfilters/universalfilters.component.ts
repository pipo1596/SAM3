import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Universalfiltersdata, Cov } from './universalfiltersdata';
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-universalfilters',
  templateUrl: './universalfilters.component.html'
})
export class UniversalfiltersComponent implements OnInit {

	pagedata = new Universalfiltersdata;
	validating = false;
	valid = false;
	changes = false;
	modebtn = "ADD";
	//Input Fields
	cov = new Textfield;
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Top Section
  selectedRec = new Cov;
  //selectedRecG = new Ovrd;
  //New Rec Skeleton
  newRec = new Cov;	
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
  	Util.focusById("cov");
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
  	this.selectedRec.covi = record.covi;

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
  	if(confirm("Delete this Filter?")){
  		this.selectedRec.mode = "DELETE";
  		Util.showWait();
  		this.jsonService
  		.initService(this.selectedRec,Util.Url("CGICUNIVFL"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error();Util.hideWait(); },
  			() => {
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
  					this.pagedata.filters.splice(this.pagedata.filters.findIndex(obj => obj.covi==this.selectedRec.covi),1);
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
  	this.dispAlert.default();
  	//Trim Field Values
  	this.cov.value = this.selectedRec.cov.trim().toUpperCase();
  	this.selectedRec.cov = this.selectedRec.cov.trim().toUpperCase();
  	if(this.cov.value == ""){ this.cov.message = "(required)"; this.cov.erlevel = 'D'; this.valid = false;}
  	this.loadDb();
  }

  loadDb(){
  	if(!this.valid) return false;
  	Util.showWait();
  	this.jsonService
  	.initService(this.selectedRec,Util.Url("CGICUNIVFL"))
  	.subscribe(data => this.errSet = data,
  		err => {this.dispAlert.error(); Util.hideWait();},
  		() => {
  			this.changes = false;
  			this.dispAlert.setMessage(this.errSet);
  			if(this.dispAlert.status === "S"){
  				if(this.selectedRec.mode == "ADD"){
  					this.newRec.cov = this.selectedRec.cov;
  					this.newRec.covi= this.selectedRec.cov.toUpperCase().padEnd(10);

  					this.pagedata.filters.push(JSON.parse(JSON.stringify(this.newRec)));

  					setTimeout(() => {
  						Util.showWait();
  						this.cancel();
  					}, 500);
  				}
  				if(this.selectedRec.mode == "SAVE"){
  					this.index = this.pagedata.filters.findIndex(obj => obj.covi==this.selectedRec.covi);
  					this.pagedata.filters[this.index].cov = this.selectedRec.cov;
  					this.pagedata.filters[this.index].covi = this.selectedRec.cov; 
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
  	.initService({"mode":"INIT"},Util.Url("CGICUNIVFL"))
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
