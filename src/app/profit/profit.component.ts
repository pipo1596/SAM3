import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Profitdata } from './profitdata'; 
import { Textfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';


@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.css']
})

export class ProfitComponent implements OnInit {

	pagedata = new Profitdata;
  ran:string = Util.makeid();
  validating = false;
	valid = false;
  changes = false;
  //Field
  period = new Textfield;
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
	

  constructor(private jsonService: JsonService,private router: Router) { }

  onChange(){
    this.validating = false;
    this.dispAlert.default();
  }


	cancel(){
    Util.showWait();
    this.validating = false;
    Util.hideWait();
    Util.scrollTop();
    this.changes = false;
    this.dispAlert.default(); 
  }

  onChangeDrop(){
    Util.showWait();
    if(this.period.value !=='')
      Util.setIframeSrc(Util.Url(this.period.value));
    else
    Util.setIframeSrc("");
    Util.hideWait();
  }

  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGRPDLRPRF"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" ||  Util.noAuth(this.pagedata.head.menuOp,'0RPDLRPRFT')) {
  				Util.showWait();
  				setTimeout(() => {
  					Util.hideWait();
  					this.router.navigate(['/app']);
  				}, 100);
  			} else {
          Util.hideWait();
          //Util.setIframeSrc(Util.Url('output/000000000000190.pdf'));
          
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
