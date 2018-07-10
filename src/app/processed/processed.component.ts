import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Processeddata, Cont, Readnextdata } from './processeddata'; 
import { Textfield , Numfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';
import { PagerService } from '../_services/index'


@Component({
  selector: 'app-processed',
  templateUrl: './processed.component.html',
  styleUrls: ['./processed.component.css']
})

export class ProcessedComponent implements OnInit {

	pagedata = new Processeddata;
  ran:string = Util.makeid();
  validating = false;
	valid = false;
  changes = false;
  searched = false;
  pagemode:string = "L";
	//Input Fields
	ofn  : string="";
	oln  : string="";
	anum : string="";
  asuf : string="";
  vin  : string="";
  view : any;
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
	
	showDelete : boolean = false;
  //Paging
  pager: any = {}; // pager object
  pagedItems: any[]=[""]; // paged items
  dispItems: any[]; // paged items
  //two values, one for filtering and the other keeps track of deletes
  pageCount : number=0;
  masterPgCnt : number=0;
  //navigate away from page stop the recursive calls to build quotes
  killRecur : boolean = false;

  constructor(private jsonService: JsonService,private router: Router, private pagerService: PagerService) { }

  onChange(){
  	this.changes = true;
    this.validating = false;
    this.dispAlert.default();
  }

  viewCont(agr){
    Util.showWait();
    var obj ={"mode":"VIEW",
              "anum": agr.anum,
              "asuf": agr.asuf
            }
    this.jsonService
  	.initService(obj,Util.Url("CGICPRCNTR"))
  	.subscribe(data => this.view = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        this.pagemode = 'V'; 
  		}
  	);
    Util.hideWait();
  }
  clearMode(){
    Util.showWait();
    this.pagemode = 'L';
    Util.hideWait();
  }
  getData(){
    Util.showWait();
    this.changes = false;
    this.dispAlert.default();
    this.oln = this.oln.trim();
    this.ofn = this.ofn.trim();
    this.anum = this.anum.trim();
    this.asuf = this.asuf.trim();
    this.vin = this.vin.trim();
    

   // if(this.oln =='' && 
   //    this.ofn =='' &&
   //    this.anum =='' &&
   //    this.asuf =='' &&
   //    this.vin =='' 
   //  ){
   //     this.dispAlert.message = "At least one search criteria required!";
   //     this.dispAlert.status = 'E';
   //     
   //     Util.hideWait();
   //     this.pagedata.contracts = [{"show": true,                 
   //                                "oln":"",
   //                                "ofn":"",
   //                                "anum":"",
   //                                "asuf":"",
   //                                "vin":"",
   //                                "yr":"",
   //                                "manf":""
   //                               }];
   //     this.pagedata.contracts.pop();
   //     this.masterPgCnt = 0;
   //     this.pageCount = 0;
   //     this.setPage(1);
   //     return false;
   //   }


    var obj ={"mode":"SEARCH",
              "oln": this.oln,
              "ofn": this.ofn,
              "anum": this.anum,
              "asuf": this.asuf,
              "vin": this.vin
            }
    this.jsonService
  	.initService(obj,Util.Url("CGICPRCNTR"))
  	.subscribe(data => this.pagedata.contracts = data,
  		err => {Util.responsiveMenu(); },
  		() => {
            this.pageCount = this.pagedata.contracts.length;
            this.masterPgCnt = this.pageCount;
            this.setPage(1); 
            this.searched = true;
  		}
  	);
  }

  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICPRCNTR"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" ||  Util.noAuth(this.pagedata.head.menuOp,'W1PCNTINQ')) {
  				Util.showWait();
  				setTimeout(() => {
  					Util.hideWait();
  					this.router.navigate(['/app']);
  				}, 100);
  			} else {
          this.pageCount = this.pagedata.contracts.length;
          console.log(this.pagedata.contracts);
          this.masterPgCnt = this.pageCount;
          this.setPage(1); 
  				Util.hideWait();
  			}
  		}
  	);
  }

  setPage(page: number){
    this.pager = this.pagerService.getPager(this.pageCount, page, 25);
    this.dispItems =[ ];
    this.pagedata.contracts.forEach(sq =>{ if(sq.show) this.dispItems.push(sq)});
    // get current page of items
    this.pagedItems = this.dispItems.slice(this.pager.startIndex, this.pager.endIndex + 1); 
    if(this.pageCount > 0)
      this.pager.totalPages = Math.ceil(this.pageCount / 25);
    else
      this.pager.totalPages = 0;
    
    Util.showWait();
    Util.hideWait();
    // get pager object from service
       
  }

  

  canDeactivate() {
    var result = true;
    if(this.changes){
      result = window.confirm('Changes not saved! Discard changes?');
    }
    if(result){
      this.killRecur = true;
      return true;
    }
  }

}
