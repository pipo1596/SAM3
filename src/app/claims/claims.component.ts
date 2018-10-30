import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Claimsdata, Row } from './claimsdata'; 
import { Textfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';


@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html'
})

export class ClaimsComponent implements OnInit {

	pagedata = new Claimsdata;
  validating = false;
	valid = false;
  changes = false;
  //Field
  period = new Textfield;
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
	

  constructor(private jsonService: JsonService,private router: Router) { }

  processData(){
    this.pagedata.rows = Util.sortByKey(this.pagedata.rows,"cutd","D");
    var total=0;
    var curr="";
    var cls="";
    var temp:[Row]=[{"show":"",
    "cls":"",
    "oln":"",
    "ofn":"",
    "anum":"",
    "asuf":"",
    "clmn":"",
    "ron1":"",
    "pamt":"",
    "cutd":"",
    "btch":"",
    "dat1":"",
    "dat2":""}];
    temp.pop();
    this.pagedata.rows.forEach(elem=>{
      

      if(curr!=="" && curr!==elem.cutd){
       temp.push({"show":"T",
                  "cls":cls,
                  "oln":"",
                  "ofn":"",
                  "anum":"",
                  "asuf":"",
                  "clmn":"",
                  "ron1":"",
                  "pamt": total.toFixed(2),
                  "cutd": curr,
                  "btch":"",
                  "dat1":"",
                  "dat2":""}); 
        total = 0;
        if(cls==""){
          cls = "bg-info";
        }else{cls="";}
        
      }
      elem.cls = cls;
      temp.push(elem);
      total += parseFloat(elem.pamt);
      curr = elem.cutd;
    });
    if(curr!==""){
      temp.push({"show":"T",
                 "cls":cls,
                 "oln":"",
                 "ofn":"",
                 "anum":"",
                 "asuf":"",
                 "clmn":"",
                 "ron1":"",
                 "pamt": total.toFixed(2),
                 "cutd": curr,
                 "btch":"",
                 "dat1":"",
                 "dat2":""}); 
       total = 0;
       if(cls==""){
        cls = "bg-info";
      }else{cls="";}
     }
    this.pagedata.rows = temp;
  }

  onChangeDrop(){
    Util.showWait();
    
    Util.hideWait();
  }

  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGRPCLAIMS"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.hideWait(); },
  		() => {
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" ||  Util.noAuth(this.pagedata.head.menuOp,'2RPCLAIMS')) {
  				Util.showWait();
  				setTimeout(() => {
  					Util.hideWait();
  					this.router.navigate(['/app']);
  				}, 100);
  			} else {
          this.processData();
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
