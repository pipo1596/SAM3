import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Statementdata } from './statementdata'; 
import { Textfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';


@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.css']
})

export class StatementComponent implements OnInit {

	pagedata = new Statementdata;
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
  	.initService({"mode":"INIT"},Util.Url("CGRPDLRSTM"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" ||  Util.noAuth(this.pagedata.head.menuOp,'1RPDLRSTTM')) {
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
