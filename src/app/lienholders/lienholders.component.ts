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
	sta = new Textfield;
	adr1 = new Textfield;
	city = new Textfield;
	zip = new Textfield;
	phon = new Textfield;
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
	this.selectedRec.sta = record.sta;
	this.selectedRec.adr1 = record.adr1;
	this.selectedRec.city = record.city;
	this.selectedRec.zip = record.zip;
	this.selectedRec.phon = record.phon;
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
  		.initService(this.selectedRec,Util.Url("CGICGLHLDR"))
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
  formatPhone(phone) {
    var numbers = phone.replace(/\D/g, ''),
      char = { 0: '(', 3: ') ', 6: '-' };
    phone = '';
    for (var i = 0; i < numbers.length; i++) {
      phone += (char[i] || '') + numbers[i];
	}
	this.selectedRec.phon = phone;
  }
  checkData(){
  	this.validating = true;
  	this.valid = true;
  	//Reset Error Messages
	this.name.message = "";
	this.sta.message = "";
	this.adr1.message = "";
	this.city.message = "";
	this.zip.message = "";
	this.phon.message = "";
  	this.dispAlert.default();
  	//Trim Field Values
  	this.name.value = this.selectedRec.name.trim().toUpperCase();
  	this.zip.value = this.selectedRec.zip.trim().toUpperCase();
  	this.phon.value = this.selectedRec.phon.trim().toUpperCase();
	this.sta.value = this.selectedRec.sta.trim().toUpperCase();
	this.adr1.value = this.selectedRec.adr1.trim().toUpperCase();
	this.city.value = this.selectedRec.city.trim().toUpperCase();
	  
  	this.selectedRec.name = this.selectedRec.name.trim().toUpperCase();
  	this.selectedRec.sta = this.selectedRec.sta.trim().toUpperCase();
  	this.selectedRec.adr1 = this.selectedRec.adr1.trim().toUpperCase();
  	this.selectedRec.city = this.selectedRec.city.trim().toUpperCase();
	this.selectedRec.zip = this.selectedRec.zip.trim().toUpperCase();
	this.selectedRec.phon = this.selectedRec.phon.trim().toUpperCase();
	  
  	if(this.name.value == ""){ this.name.message = "(required)"; this.name.erlevel = 'D'; this.valid = false;}
  	if(this.adr1.value !== "" || this.city.value !== "" || this.sta.value!=="" || this.zip.value !==""){ 
		if(this.adr1.value == ""){ this.adr1.message = "(required)"; this.adr1.erlevel = 'D'; this.valid = false;}
		if(this.city.value == ""){ this.city.message = "(required)"; this.city.erlevel = 'D'; this.valid = false;}
		if(this.sta.value == ""){ this.sta.message = "(required)"; this.sta.erlevel = 'D'; this.valid = false;}
		if(this.zip.value == ""){ this.zip.message = "(required)"; this.zip.erlevel = 'D'; this.valid = false;}
		if (this.zip.value !== "" && !Util.validZip(this.zip.value)) { this.zip.message = "(invalid Zip)"; this.zip.erlevel = "D";this.valid = false;}
	}	
	if (this.phon.value !== "" && !Util.validphone(this.phon.value)) { this.phon.message = "( invalid )"; this.phon.erlevel = "D";this.valid = false;}
  	this.loadDb();
  }

  loadDb(){
  	if(!this.valid) return false;
  	Util.showWait();
  	this.jsonService
  	.initService(this.selectedRec,Util.Url("CGICGLHLDR"))
  	.subscribe(data => this.errSet = data,
  		err => {this.dispAlert.error(); Util.hideWait();},
  		() => {
  			this.changes = false;
  			this.dispAlert.setMessage(this.errSet);
  			if(this.dispAlert.status === "S"){
  				if(this.selectedRec.mode == "ADD"){
  					this.newRec.name = this.selectedRec.name;
  					this.newRec.sta = this.selectedRec.sta;
  					this.newRec.zip = this.selectedRec.zip;
  					this.newRec.phon = this.selectedRec.phon;
  					this.newRec.adr1 = this.selectedRec.adr1;
  					this.newRec.city = this.selectedRec.city;
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
  					this.pagedata.filters[this.index].sta = this.selectedRec.sta;
  					this.pagedata.filters[this.index].zip = this.selectedRec.zip;
  					this.pagedata.filters[this.index].phon = this.selectedRec.phon;
  					this.pagedata.filters[this.index].adr1 = this.selectedRec.adr1;
  					this.pagedata.filters[this.index].city = this.selectedRec.city;
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

  canDeactivate() {

    if(this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

}

  ngOnInit() {
	Util.showWait();
	this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICGLHLDR"))
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
