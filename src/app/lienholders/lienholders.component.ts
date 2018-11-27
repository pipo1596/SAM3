import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,  NavigationEnd } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Lienholdersdata, Lienh } from './lienholdersdata';
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-Lien',
  templateUrl: './lienholders.component.html'
})
export class LienholdersComponent implements OnInit {

	pagedata = new Lienholdersdata;
	validating = false;
	valid = false;
	changes = false;
	modebtn = "ADD";
	//Input Fields
	name = new Textfield;
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Top Section
  selectedRec = new Lienh;
  //New Rec Skeleton
  newRec = new Lienh;	
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
  	Util.focusById("name");
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
	this.selectedRec.name = record.name;
  	this.selectedRec.namei = record.namei;

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
  	if(confirm("Delete this Lienholder?")){
  		this.selectedRec.mode = "DELETE";
  		Util.showWait();
  		this.jsonService
  		.initService(this.selectedRec,Util.Url("CGICLHLDRS"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error();Util.hideWait(); },
  			() => {
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
  					this.pagedata.filters.splice(this.pagedata.filters.findIndex(obj => obj.namei==this.selectedRec.namei),1);
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
  	this.dispAlert.default();
  	//Trim Field Values
  	this.name.value = this.selectedRec.name.trim().toUpperCase();
  	this.selectedRec.name = this.selectedRec.name.trim().toUpperCase();
  	if(this.name.value == ""){ this.name.message = "(required)"; this.name.erlevel = 'D'; this.valid = false;}
  	this.loadDb();
  }

  loadDb(){
  	if(!this.valid) return false;
  	Util.showWait();
  	this.jsonService
  	.initService(this.selectedRec,Util.Url("CGICLHLDRS"))
  	.subscribe(data => this.errSet = data,
  		err => {this.dispAlert.error(); Util.hideWait();},
  		() => {
  			this.changes = false;
  			this.dispAlert.setMessage(this.errSet);
  			if(this.dispAlert.status === "S"){
  				if(this.selectedRec.mode == "ADD"){
  					this.newRec.name = this.selectedRec.name;
  					this.newRec.namei= this.selectedRec.name;

  					this.pagedata.filters.push(JSON.parse(JSON.stringify(this.newRec)));

  					setTimeout(() => {
  						Util.showWait();
  						this.cancel();
  					}, 300);
  				}
  				if(this.selectedRec.mode == "SAVE"){
  					this.index = this.pagedata.filters.findIndex(obj => obj.namei==this.selectedRec.namei);
  					this.pagedata.filters[this.index].name = this.selectedRec.name;
  					this.pagedata.filters[this.index].namei = this.selectedRec.name; 
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



  ngOnInit() {
	Util.showWait();
	this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICLHLDRS"))
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
