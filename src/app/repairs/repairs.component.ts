import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Repairsdata, Row } from './repairsdata'; 
import { Textfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-repairs',
  templateUrl: './repairs.component.html'
})

export class RepairsComponent implements OnInit {

  pagedata = new Repairsdata;
  ran:string = Util.makeid();
  validating = false;
	valid = false;
  changes = false;
  mode:string = 'Z';
  //Field
  stat = new Textfield;  
  city = new Textfield;  
  area = new Textfield;  
  zip = new Textfield;  
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
	

  constructor(private jsonService: JsonService,private router: Router) { }

  

  getList(){
    if(!this.valid) return false;
    this.changes = false;
    Util.showWait();
    setTimeout(() => {
      
      var datajson = {"mode":"SEARCH",
                  "city":this.city.value,
                  "stat":this.stat.value,
                  "area":this.area.value,
                  "zip":this.zip.value,
                  };
                  
      this.pagedata.rows = [{"show":"","name":"","add1":"","city":"","st":"","zip":"","phn":""}]; 
      this.pagedata.rows.pop();          
      
      this.jsonService
        .initService(datajson, Util.Url("CGRPREPAIR"))
        .subscribe(data => this.pagedata.rows = data,
          err => { this.dispAlert.error(), Util.hideWait(); },
          () => {
            Util.hideWait();
            });
      }, 100);
  }

  checkData(){
    this.area.value = this.area.value.trim();
    this.city.value = this.city.value.trim();
    this.zip.value  = this.zip.value.trim();

    this.area.message = "";
    this.city.message = "";
    this.stat.message = "";
    this.zip.message = "";

    this.valid = true;
    this.validating = true;
    if(this.mode=="A"){
      if (this.area.value == "") { this.area.message = "(required)"; this.area.erlevel = "D"; this.valid = false; }
    }
    if(this.mode=="C"){
      if (this.city.value == "") { this.city.message = "(required)"; this.city.erlevel = "D"; this.valid = false; }
      if (this.stat.value == "") { this.stat.message = "(required)"; this.stat.erlevel = "D"; this.valid = false; }
    }
    if(this.mode=="Z"){
      if (this.zip.value == "") { this.zip.message = "(required)"; this.zip.erlevel = "D"; this.valid = false; }
      if (this.zip.value !== "" && !Util.validZip(this.zip.value)) { this.zip.message = "(invalid Zip)"; this.zip.erlevel = "D"; this.valid = false; } 
    }

   this.getList();

  }
  onChange(){
    this.changes = true;
    this.validating = false;
  }

  onChangeT(){
    Util.showWait();
    this.pagedata.rows = [{"show":"","name":"","add1":"","city":"","st":"","zip":"","phn":""}]; 
    this.pagedata.rows.pop();          
    this.valid = false;
    this.validating = false;
    this.area.value = ""; 
    this.area.message  = "";
    this.city.value = ""; 
    this.city.message  = "";
    this.stat.value = ""; 
    this.stat.message  = "";
    this.zip.value = ""; 
    this.zip.message  = "";
    
    Util.hideWait();
  }

  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGRPREPAIR"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" ||  Util.noAuth(this.pagedata.head.menuOp,'4RPREPAIRS')) {
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
  

  canDeactivate() {
    var result = true;
    if(this.changes){
      result = window.confirm('Changes not saved! Discard changes?');
    }
    if(result){
      return true;
    }
  }



}
