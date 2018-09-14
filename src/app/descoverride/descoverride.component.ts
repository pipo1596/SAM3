import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Overridedata, Ovrd } from './overridedata';
import { Textfield , Numfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-descoverride',
  templateUrl: './descoverride.component.html'
})
export class DescoverrideComponent implements OnInit {

	pagedata = new Overridedata;
	validating = false;
	valid = false;
	changes = false;
	modebtn = "ADD";
	//Input Fields
	srky = new Textfield;
	desc = new Textfield;
	dlr  = new Textfield;
	prg  = new Textfield;
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Top Section
  selectedRec = new Ovrd;
  //selectedRecG = new Ovrd;
  //New Rec Skeleton
  newRec = new Ovrd;	
  index : number;
  PMTYPE : string;
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
  	this.selectedRec.type = this.PMTYPE.toUpperCase();
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
	this.selectedRec.srky = record.srky;
	this.selectedRec.prg  = record.prg;
  	this.selectedRec.srkyi= record.srkyi;
  	this.selectedRec.desc = record.desc;
  	this.selectedRec.dlr  = record.dlr;
  	this.selectedRec.dlri = record.dlri;
  	this.selectedRec.type = record.type;

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
  	if(confirm("Delete this Override?")){
  		this.selectedRec.mode = "DELETE";
  		Util.showWait();
  		this.jsonService
  		.initService(this.selectedRec,Util.Url("CGICDESOVR"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error(), Util.hideWait(); },
  			() => {
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
  					this.pagedata.overrides.splice(this.pagedata.overrides.findIndex(obj => obj.srkyi==this.selectedRec.srkyi && obj.dlri==this.selectedRec.dlri),1);
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
	this.srky.message = "";
	this.prg.message = "";  
  	this.desc.message = "";
  	this.dlr.message  = "";
  	this.dispAlert.default();
  	//Trim Field Values
  	this.srky.value = this.selectedRec.srky.trim().toUpperCase();
  	this.prg.value  = this.selectedRec.prg.trim().toUpperCase();
  	this.dlr.value  = this.selectedRec.dlr.trim().toUpperCase();

  	this.selectedRec.srky = this.selectedRec.srky.trim().toUpperCase();
  	this.selectedRec.dlr  = this.selectedRec.dlr.trim().toUpperCase();
  	this.selectedRec.prg  = this.selectedRec.prg.trim().toUpperCase();

  	this.desc.value = this.selectedRec.desc.trim();

  	if(this.srky.value == ""){ this.srky.message = "(required)"; this.srky.erlevel = 'D'; this.valid = false;}
  	if(this.desc.value == ""){ this.desc.message = "(required)"; this.desc.erlevel = 'D'; this.valid = false;}

  	this.loadDb();
  }

  loadDb(){
  	if(!this.valid) return false;
  	Util.showWait();
  	this.jsonService
  	.initService(this.selectedRec,Util.Url("CGICDESOVR"))
  	.subscribe(data => this.errSet = data,
  		err => {this.dispAlert.error(), Util.hideWait();},
  		() => {
  			this.changes = false;
  			this.dispAlert.setMessage(this.errSet);
  			if(this.dispAlert.status === "S"){
  				if(this.selectedRec.mode == "ADD"){
  					this.newRec.srky = this.selectedRec.srky;
  					this.newRec.srkyi= this.selectedRec.srky.toUpperCase().padEnd(10)+this.selectedRec.prg.toUpperCase();
  					this.newRec.desc = this.selectedRec.desc;
  					this.newRec.dlr  = this.selectedRec.dlr;
  					this.newRec.dlri = this.selectedRec.dlr.toUpperCase();
  					this.newRec.type = this.selectedRec.type.toUpperCase();

  					this.pagedata.overrides.push(JSON.parse(JSON.stringify(this.newRec)));

  					setTimeout(() => {
  						Util.showWait();
  						this.cancel();
  					}, 500);
  				}
  				if(this.selectedRec.mode == "SAVE"){
  					this.index = this.pagedata.overrides.findIndex(obj => obj.srkyi==this.selectedRec.srkyi && obj.dlri==this.selectedRec.dlri);
  					this.pagedata.overrides[this.index].srky = this.selectedRec.srky;
  					this.pagedata.overrides[this.index].srkyi = this.selectedRec.srky.padEnd(10)+this.selectedRec.prg; 
  					this.pagedata.overrides[this.index].desc = this.selectedRec.desc; 
  					this.pagedata.overrides[this.index].dlr = this.selectedRec.dlr; 
  					this.pagedata.overrides[this.index].dlri = this.selectedRec.dlr;
  					this.pagedata.overrides[this.index].type = this.selectedRec.type; 
  					
  					// this.selectedRecG.srky = this.selectedRec.srky;
  					// this.selectedRecG.srkyi= this.selectedRec.srky;
  					// this.selectedRecG.desc = this.selectedRec.desc;
  					// this.selectedRecG.dlr  = this.selectedRec.dlr;
  					// this.selectedRecG.dlri = this.selectedRec.dlr;
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
  	this.PMTYPE = this.route.snapshot.paramMap.get('PMTYPE');
	Util.showWait();
	this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT", "type":this.PMTYPE},Util.Url("CGICDESOVR"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
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
