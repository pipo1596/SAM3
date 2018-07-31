import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Savedquotesedata, Readnextdata } from './savedquotesdata'; 
import { Dispalert , Errsetter } from '../utilities/dispalert';
import { PagerService } from '../_services'


@Component({
  selector: 'app-savedquotes',
  templateUrl: './savedquotes.component.html',
  styleUrls: [ './savedquotes.component.css']
})


export class SavedquotesComponent implements OnInit {

	pagedata = new Savedquotesedata;
  readdata = new Readnextdata;
  ran:string = Util.makeid();

	validating = false;
	valid = false;
	changes = false;
	//Input Fields
	frdt : string="";
	todt : string="";
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
	//Delete array
	delQtid = [];
	showDelete : boolean = false;
  //Paging
  pager: any = {}; // pager object
  pagedItems: any[]=[""]; // paged items
  dispItems: any[]; // paged items
  applyFiltBtn : boolean = false;
  //two values, one for filtering and the other keeps track of deletes
  pageCount : number=0;
  masterPgCnt : number=0;
  //navigate away from page stop the recursive calls to build quotes
  killRecur : boolean = false;
  stock : string="";
  lname : string="";
  salep : string="";

  constructor(private jsonService: JsonService,private router: Router, private pagerService: PagerService) { }

  onChange(){
  	this.changes = true;
  	this.validating = false;
  }

  dateFilter(){
    Util.showWait();
    this.stock = this.stock.trim();
    this.lname = this.lname.trim();
    this.salep = this.salep.trim();
    this.pageCount = this.masterPgCnt;
  	if(this.frdt === "" || !this.isValidDate(this.frdt)){
      this.frdt = "0";
    }
    if(this.todt === "" || !this.isValidDate(this.todt)){
      this.todt = "99999999";      
  	} 
		var filtfrdt = this.frdt.replace(/-/g,"");
		var filttodt = this.todt.replace(/-/g,"");
		for(var i=0; i< this.pagedata.squotes.length;i++){
      this.pagedata.squotes[i].show = true;
			var temp = (this.pagedata.squotes[i].qtdti);
			if(parseInt(temp,10) < parseInt(filtfrdt,10) || parseInt(temp,10) > parseInt(filttodt,10)){
				this.pagedata.squotes[i].show = false;
			}
      if(this.stock !== "" && this.pagedata.squotes[i].stck.toUpperCase().indexOf(this.stock.toUpperCase()) === -1){
        this.pagedata.squotes[i].show = false;
      }
      if(this.lname !== "" && this.pagedata.squotes[i].lnam.toUpperCase().indexOf(this.lname.toUpperCase()) === -1){
        this.pagedata.squotes[i].show = false;
      }
      if(this.salep !== "" && this.pagedata.squotes[i].sprs.toUpperCase().indexOf(this.salep.toUpperCase()) === -1){
        this.pagedata.squotes[i].show = false;
      }
      if(this.pagedata.squotes[i].show === false){
        this.pageCount -= 1;
      }
		}
    this.pager.totalPages = Math.ceil(this.pageCount / 25);
    if(this.pager.totalPages>0){
      this.setPage(1);
    }else{
      this.pager = {};
    }
  	Util.hideWait();
  }

  isValidDate(dateString){
	  var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/; //check pattern is yyyy-mm-dd
	  if(!regex_date.test(dateString)){
	    return false;
	  }
    var parts   = dateString.split("-"); //parts is an array after split ['y','m','d']
    var day     = parseInt(parts[2], 10);
    var month   = parseInt(parts[1], 10);
    var year    = parseInt(parts[0], 10);
    if(year < 1000 || year > 5000 || month == 0 || month > 12){
    	return false;
    }
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)){
      monthLength[1] = 29; //leap year
    }
  	return day > 0 && day <= monthLength[month - 1];
	}

	chkDelete(quote){
    quote.selected = !quote.selected;
		if(quote.selected){
			this.delQtid.push(quote.qtid);
			this.showDelete = true;
      this.changes = true;

		} else {
			this.delQtid.splice(this.delQtid.indexOf(quote.qtid),1);
			if(this.delQtid.length === 0){
				this.showDelete = false;
        this.changes = false;
			}
		}
	}

  delete(){
  	if(this.delQtid.length === 0){
  		return false;
  	}
  	if(confirm("Delete Quotes?")){
  		Util.showWait();
  		var delArr = [];
  		for(var i=0;i<this.delQtid.length;i++){
  			if(this.delQtid[i] !== undefined){
  				delArr[i]= {"value":this.delQtid[i]};
  				this.pagedata.squotes.splice(this.pagedata.squotes.findIndex(obj => obj.qtid==this.delQtid[i]),1);
          this.pageCount -= 1;
          this.masterPgCnt -= 1;
  			}
  		}
  		this.jsonService
  		.initService({"mode":"DELETE","dltarr":delArr}, Util.Url("CGICSVQT"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error(), Util.hideWait();},
  			()=>{
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
            this.setPage(this.pager.currentPage);
            this.delQtid = [];
  					setTimeout(() => {
  						Util.showWait();
  						this.cancel();
  					}, 500);
  				} else {
  					Util.hideWait();
            this.delQtid = [];
            this.setPage(this.pager.currentPage);
  				}
  			})
  	}
  }

  cancel(){
    Util.showWait();
    this.validating = false;
    Util.hideWait();
    Util.scrollTop();
    this.changes = false;
    this.showDelete = false;
    this.dispAlert.default(); 
  }

  viewQt(quoteID){
  	Util.showWait();
  	this.jsonService
  	.initService({"mode":"VIEWQT","qtid":quoteID}, Util.Url("CGICSVQT"))
  	.subscribe(data => this.errSet = data,
  		err => {this.dispAlert.error(), Util.hideWait();},
  		() => {
  			this.dispAlert.setMessage(this.errSet);
  			if(this.errSet.status !== "S") this.dispAlert.setMessage(this.errSet);
  			if(this.errSet.status === "S"){
  				Util.showWait();
  				this.dispAlert.default();
  				setTimeout(() => {
  					this.router.navigate(['/app/Results']);
  				}, 100);
  				this.changes = false;
  			} else {
  				Util.hideWait();
  			}
  		})
  }

  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICSVQT"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" || Util.noAuth(this.pagedata.head.menuOp,'SAVEDQ')) {
  				Util.showWait();
  				setTimeout(() => {
  					Util.hideWait();
  					this.router.navigate(['/app']);
  				}, 100);
  			} else {
          this.pageCount = parseInt(this.pagedata.ttlpgs.cnt,10);
          this.masterPgCnt = this.pageCount;
          this.setPage(1); 
  				Util.hideWait();
          if(this.pagedata.ttlpgs.lstrec !== 'EOF'){
            this.readNext(this.pagedata.ttlpgs.lstrec);
          } else {
            this.applyFiltBtn = true;
          }
  			}
  		}
  	);
  }

  setPage(page: number){
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    Util.showWait();
    Util.hideWait();
    // get pager object from service
    this.pager = this.pagerService.getPager(this.pageCount, page, 25);
    this.dispItems =[ ];
    this.pagedata.squotes.forEach(sq =>{ if(sq.show) this.dispItems.push(sq)});
    // get current page of items
    this.pagedItems = this.dispItems.slice(this.pager.startIndex, this.pager.endIndex + 1);    
  }

  readNext(anchor){
    if(this.killRecur){
      return;
    }
    this.jsonService
    .initService({"mode":"READNEXT", "qtid":anchor},Util.Url("CGICSVQT"))
    .subscribe(data => this.readdata = data,
      err => {Util.responsiveMenu(); },
      () => {
        Util.responsiveMenu();
        Array.prototype.push.apply(this.pagedata.squotes,this.readdata.squotes);
        if (this.readdata.ttlpgs.lstrec === "EOF") {
          this.applyFiltBtn = true;
          return;
        } else {
          this.readNext(this.readdata.ttlpgs.lstrec);
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
      this.killRecur = true;
      return true;
    }
  }

}
