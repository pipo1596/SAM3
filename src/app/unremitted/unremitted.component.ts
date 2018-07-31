import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Unremitteddata,  Readnextdata } from './unremitteddata'; 
import { Textfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';
import { PagerService } from '../_services'


@Component({
  selector: 'app-unremitted',
  templateUrl: './unremitted.component.html',
  styleUrls: ['./unremitted.component.css']
})

export class UnremittedComponent implements OnInit {

	pagedata = new Unremitteddata;
  readdata = new Readnextdata;
  ran:string = Util.makeid();
  validating = false;
	valid = false;
	changes = false;
	//Input Fields
	frdt  : string="";
	todt  : string="";
	stock : string="";
  lname : string="";
  salep : string="";
  pagemode:string = "L";
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
	//Delete array
	remtarr = [];
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
  view : any;
  canedit = false;
  eecno:string="";
  erScrolid :string = "";
  //Edit Input Fields
  eofn  = new Textfield
  eoln  = new Textfield
  eoad1  = new Textfield
  eoad2  = new Textfield
  eocty = new Textfield
  eost  = new Textfield
  eozip = new Textfield
  eophn = new Textfield
  email = new Textfield

  constructor(private jsonService: JsonService,private router: Router, private pagerService: PagerService) { }

  onChange(){
  	//this.changes = true;
    this.validating = false;
    this.dispAlert.default();
  }
  onChangeE(){
  	this.changes = true;
    this.validating = false;
    this.dispAlert.default();
  }

  checkEdit(){
    this.valid = true;
    this.validating = true;
    this.eofn.message='';
    this.eoln.message='';
    this.eoad1.message='';
    this.eoad2.message='';
    this.eocty.message='';
    this.eost.message='';
    this.eozip.message='';
    this.eophn.message='';
    this.email.message='';
    this.eofn.value   = this.eofn.value.trim();
    this.eoln.value   = this.eoln.value.trim();
    this.eoad1.value  = this.eoad1.value.trim();
    this.eoad2.value  = this.eoad2.value.trim();
    this.eocty.value  = this.eocty.value.trim();
    this.eost.value   = this.eost.value.trim();
    this.eozip.value  = this.eozip.value.trim();
    this.eophn.value  = this.eophn.value.trim();
    this.email.value  = this.email.value.trim();

    if (this.eofn.value == "")  { this.eofn.message  = "( required )"; this.valid = false;this.erscrol('eofn');}
    if (this.eoln.value == "")  { this.eoln.message  = "( required )"; this.valid = false;this.erscrol('eoln');}
    if (this.eoad1.value == "") { this.eoad1.message = "( required )"; this.valid = false;this.erscrol('eoad1');}
    if (this.eocty.value == "") { this.eocty.message = "( required )"; this.valid = false;this.erscrol('eocty');}
    if (this.eost.value == "")  { this.eost.message  = "( required )"; this.valid = false;this.erscrol('eost');}
    if (this.eozip.value == "") { this.eozip.message = "( required )"; this.valid = false;this.erscrol('eozip');}
    if (this.eophn.value == "") { this.eophn.message = "( required )"; this.valid = false;this.erscrol('eophn');}
    if (this.email.value == "") { this.email.message = "( required )"; this.valid = false;this.erscrol('email');}

    
    if (this.eozip.value !== "" && !Util.validZip(this.eozip.value))   { this.eozip.message = "( invalid )"; this.valid = false;this.erscrol('eozip');} 
    if (this.eophn.value !== "" && !Util.validphone(this.eophn.value)) { this.eophn.message = "( invalid )"; this.valid = false;this.erscrol('eophn');}
    if (this.email.value !== "" && !Util.validemail(this.email.value)) { this.email.message = "( invalid )"; this.valid = false;this.erscrol('email');}
   
    this.loadDb();
}

loadDb() {
if (!this.valid){ Util.scrollToId(this.erScrolid);Util.firstErrFocus(); return false;}
Util.showWait();
var obj ={"mode":"UPDATE",
          "ecno":  this.eecno,
          "ofn" :  this.eofn.value,
          "oln" :  this.eoln.value,
          "oad1": this.eoad1.value,
          "oad2": this.eoad2.value,
          "octy": this.eocty.value,
          "ost" :  this.eost.value,
          "ozip": this.eozip.value,
          "ophn": this.eophn.value,
          "oeml": this.email.value
         }
this.jsonService
.initService(obj,Util.Url("CGICUNRMCT"))
.subscribe(data => this.view = data,
err => {Util.responsiveMenu(); },
() => {
this.pagemode = 'L'; 
var index = this.pagedata.contracts.findIndex(obj => obj.ecno==this.eecno);
if(index>=0) {
  this.pagedata.contracts[index].fnam = this.eofn.value;
  this.pagedata.contracts[index].lnam = this.eoln.value;
}
Util.hideWait();
}
);
}
erscrol(id){
if(this.erScrolid=='')
  this.erScrolid = id;
}
formatPhone(phone) {
var numbers = phone.value.replace(/\D/g, ''),
  char = { 0: '(', 3: ') ', 6: '-' };
phone.value = '';
for (var i = 0; i < numbers.length; i++) {
  phone.value += (char[i] || '') + numbers[i];
}
}


  editCont(cont){
    Util.showWait();
    this.eecno = cont.ecno;
    var obj ={"mode":"VIEW",
              "ecno": cont.ecno }
    this.jsonService
  	.initService(obj,Util.Url("CGICUNRMCT"))
  	.subscribe(data => this.view = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        this.pagemode = 'V'; 
        
        this.eofn.message='';
        this.eoln.message='';
        this.eoad1.message='';
        this.eoad1.message='';
        this.eocty.message='';
        this.eost.message='';
        this.eozip.message='';
        this.eophn.message='';
        this.email.message='';
        this.eofn.value  = this.view.ofn;
        this.eoln.value  = this.view.oln;
        this.eoad1.value = this.view.oad1;
        this.eoad2.value = this.view.oad2;
        this.eocty.value = this.view.octy;
        this.eost.value  = this.view.ost;
        this.eozip.value = this.view.ozip;
        this.eophn.value = this.view.ophn;
        this.email.value = this.view.mail;
        Util.hideWait();
        Util.scrollToId("viewtop");
  		}
  	);
    
  }
  clearMode(){
   
    if(this.changes){
    if(!confirm("Disregard changes?")) return false;
    }
    this.changes = false;
    Util.showWait();
    this.pagemode = 'L';
    
    Util.hideWait();
  }


  remitt(){
  	if(this.remtarr.length === 0){
  		return false;
  	}
  	if(confirm("Remitt Selected Contracts?")){
  		Util.showWait();
  		var delArr = [];
  		for(var i=0;i<this.remtarr.length;i++){
  			if(this.remtarr[i] !== undefined){
  				delArr[i]= {"value":this.remtarr[i]};
  				this.pagedata.contracts.splice(this.pagedata.contracts.findIndex(obj => obj.ecno==this.remtarr[i]),1);
          this.pageCount -= 1;
          this.masterPgCnt -= 1;
  			}
  		}
  		this.jsonService
  		.initService({"mode":"REMITT","remtarr":delArr}, Util.Url("CGICUNRMCT"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error(), Util.hideWait();},
  			()=>{
          Util.hideWait();
          this.showDelete = false;
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
            this.setPage(this.pager.currentPage);
            this.remtarr = [];
  					
  				} else {
  					
            this.remtarr = [];
            this.setPage(this.pager.currentPage);
  				}
  			})
  	}
  }
  void(){
  	if(this.remtarr.length === 0){
  		return false;
  	}
  	if(confirm("Void Selected Contracts?")){
  		Util.showWait();
  		var delArr = [];
  		for(var i=0;i<this.remtarr.length;i++){
  			if(this.remtarr[i] !== undefined){
  				delArr[i]= {"value":this.remtarr[i]};
  				this.pagedata.contracts.splice(this.pagedata.contracts.findIndex(obj => obj.ecno==this.remtarr[i]),1);
          this.pageCount -= 1;
          this.masterPgCnt -= 1;
  			}
  		}
  		this.jsonService
  		.initService({"mode":"VOID","remtarr":delArr}, Util.Url("CGICUNRMCT"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error(), Util.hideWait();},
  			()=>{
          Util.hideWait();
          this.showDelete = false;
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
            this.setPage(this.pager.currentPage);
            this.remtarr = [];
  					
  				} else {
  					
            this.remtarr = [];
            this.setPage(this.pager.currentPage);
  				}
  			})
  	}
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
		for(var i=0; i< this.pagedata.contracts.length;i++){
      this.pagedata.contracts[i].show = true;
			var temp = (this.pagedata.contracts[i].ctdti);
			if(parseInt(temp,10) < parseInt(filtfrdt,10) || parseInt(temp,10) > parseInt(filttodt,10)){
				this.pagedata.contracts[i].show = false;
			}
      if(this.stock !== "" && this.pagedata.contracts[i].stck.toUpperCase().indexOf(this.stock.toUpperCase()) === -1){
        this.pagedata.contracts[i].show = false;
      }
      if(this.lname !== "" && this.pagedata.contracts[i].lnam.toUpperCase().indexOf(this.lname.toUpperCase()) === -1){
        this.pagedata.contracts[i].show = false;
      }
      if(this.salep !== "" && this.pagedata.contracts[i].sprs.toUpperCase().indexOf(this.salep.toUpperCase()) === -1){
        this.pagedata.contracts[i].show = false;
      }
      
      if(this.pagedata.contracts[i].show === false){
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

	chkContr(contract){
    contract.selected = !contract.selected;
    
		if(contract.selected){
			this.remtarr.push(contract.ecno);
			this.showDelete = true;
      this.changes = true;

		} else {
			this.remtarr.splice(this.remtarr.indexOf(contract.ecno),1);
			if(this.remtarr.length === 0){
				this.showDelete = false;
        this.changes = false;
			}
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

  viewCont(contractID){
    var d = new Date().getTime();
    Util.showWait();
    var pdf = window.open(Util.Url("cgi/CGGLSRIOV2?PMIONO="+contractID+"&PMRAN="+d),'_blank', 'toolbar=0,scrollbars=-1,resizable=-1');
    if (pdf == null || typeof(pdf)=='undefined') { 	
      alert('Please disable your pop-up blocker and click the link again.'); 
    } 
    else { 	
      pdf.focus();
    }
    Util.hideWait();

  }

  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICUNRMCT"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" ||  Util.noAuth(this.pagedata.head.menuOp,'WUNREMITT')) {
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
          this.canedit = !Util.noAuth(this.pagedata.head.menuOp,'9EDITCNTRC');
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
    this.pagedata.contracts.forEach(sq =>{ if(sq.show) this.dispItems.push(sq)});
    // get current page of items
    this.pagedItems = this.dispItems.slice(this.pager.startIndex, this.pager.endIndex + 1);    
  }

  readNext(anchor){
    if(this.killRecur){
      return;
    }
    this.jsonService
    .initService({"mode":"READNEXT", "ecno":anchor},Util.Url("CGICUNRMCT"))
    .subscribe(data => this.readdata = data,
      err => {Util.responsiveMenu(); },
      () => {
        Util.responsiveMenu();
        Array.prototype.push.apply(this.pagedata.contracts,this.readdata.contracts);
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
