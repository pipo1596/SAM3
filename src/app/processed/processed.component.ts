import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Processeddata, Cont, Readnextdata } from './processeddata'; 
import { Textfield , Numfield} from '../utilities/textfield';
import { Dispalert } from '../utilities/dispalert';
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
  showc = false;
  gotpaym = false;
  gothist = false;
  gotrfnd = false;
  dt = new Date();
  gotcanc = false;
  showcc = false;
  canedit = false;
  eanum:string="";
  easuf:string="";
  pagemode:string = "L";
	//Input Fields
	ofn  : string="";
	oln  : string="";
	anum : string="";
  asuf : string="";
  vin  : string="";
  view : any;
  paym : any;
  hist : any;
  rfnd : any;
  canc : any;
  erScrolid :string = "";
  //Edit Input Fields
  eoad1  = new Textfield
  eoad2  = new Textfield
  eocty = new Textfield
  eost  = new Textfield
  eozip = new Textfield
  eophn = new Textfield
  email = new Textfield
  miles = new Textfield
  cdate = new Textfield
	//Alerts
  dispAlert = new Dispalert();
	
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
 
  calculate(){
    this.valid = true;
    this.gotrfnd = false;
    this.validating = true;
    this.cdate.message = "";
    this.miles.message = "";
    if (this.cdate.value == "") { this.cdate.message = "(required)"; this.cdate.erlevel = "D"; this.valid = false; }
    if (this.miles.value == "") { this.miles.message = "(required)"; this.miles.erlevel = "D"; this.valid = false; }

    this.getRefund();
  }
  getRefund(){
    if(!this.valid){return false;}
    Util.showWait();
    var obj ={"mode":"RFND",
              "anum": this.eanum,
              "asuf": this.easuf,
              "miles": this.miles.value,
              "cdate": this.cdate.value
            }
    this.jsonService
  	.initService(obj,Util.Url("CGICPRCNTR"))
  	.subscribe(data => this.rfnd = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        this.gotcanc = false;
        this.gotrfnd = true;
        Util.hideWait();  
  		}
  	);
  }

  togglec(){
    this.showc = !this.showc;
  }
  onChange(){
  	this.changes = true;
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
        this.eoad1.message='';
        this.eoad2.message='';
        this.eocty.message='';
        this.eost.message='';
        this.eozip.message='';
        this.eophn.message='';
        this.email.message='';
        this.eoad1.value  = this.eoad1.value.trim();
        this.eoad2.value  = this.eoad2.value.trim();
        this.eocty.value  = this.eocty.value.trim();
        this.eost.value   = this.eost.value.trim();
        this.eozip.value  = this.eozip.value.trim();
        this.eophn.value  = this.eophn.value.trim();
        this.email.value  = this.email.value.trim();

        if (this.eoad1.value == "") { this.eoad1.message = "( required )"; this.valid = false;this.erscrol('eoad1');}
        if (this.eocty.value == "") { this.eocty.message = "( required )"; this.valid = false;this.erscrol('eocty');}
        if (this.eost.value == "")  { this.eost.message  = "( required )"; this.valid = false;this.erscrol('eost');}
        if (this.eozip.value == "") { this.eozip.message = "( required )"; this.valid = false;this.erscrol('eozip');}
        if (this.eophn.value == "") { this.eophn.message = "( required )"; this.valid = false;this.erscrol('eophn');}

        
        if (this.eozip.value !== "" && !Util.validZip(this.eozip.value))   { this.eozip.message = "( invalid )"; this.valid = false;this.erscrol('eozip');} 
        if (this.eophn.value !== "" && !Util.validphone(this.eophn.value)) { this.eophn.message = "( invalid )"; this.valid = false;this.erscrol('eophn');}
        if (this.email.value !== "" && !Util.validemail(this.email.value)) { this.email.message = "( invalid )"; this.valid = false;this.erscrol('email');}
       
        this.loadDb();
  }

  loadDb() {
    if (!this.valid){ Util.scrollToId(this.erScrolid);Util.firstErrFocus(); return false;}
    Util.showWait();
    var obj ={"mode":"UPDATE",
              "anum":  this.eanum,
              "asuf":  this.easuf,
              "oad1": this.eoad1.value,
              "oad2": this.eoad2.value,
              "octy": this.eocty.value,
              "ost" :  this.eost.value,
              "ozip": this.eozip.value,
              "ophn": this.eophn.value,
              "oeml": this.email.value
             }
    this.jsonService
    .initService(obj,Util.Url("CGICPRCNTR"))
    .subscribe(data => this.view = data,
    err => {Util.responsiveMenu(); },
    () => {
    this.pagemode = 'L'; 
    
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

  setmode(mode){
    Util.showWait();
    this.pagemode = mode;
    this.showc = false;
    this.showcc = false;
    this.gotrfnd = false;
    Util.hideWait();
  }
  viewCont(agr){
    this.eanum = agr.anum;
    this.easuf = agr.asuf;
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
        if(this.view.stat !== 'Active') this.canedit = false; 

        this.eoad1.message='';
        this.eoad1.message='';
        this.eocty.message='';
        this.eost.message='';
        this.eozip.message='';
        this.eophn.message='';
        this.email.message='';
        this.eoad1.value = this.view.oad1;
        this.eoad2.value = this.view.oad2;
        this.eocty.value = this.view.octy;
        this.eost.value  = this.view.ost;
        this.eozip.value = this.view.ozip;
        this.eophn.value = this.view.ophn;
        this.email.value = this.view.mail;
        this.showc = false;
        Util.hideWait();  
  		}
  	);
    
  }
  getHist(){
    
    Util.showWait();
    
    if(this.gothist) {this.pagemode = 'H';this.showcc=false;this.showc=false;Util.hideWait();return false;}
    
    var obj ={"mode":"HIST",
              "anum": this.eanum,
              "asuf": this.easuf
            }
    this.jsonService
  	.initService(obj,Util.Url("CGICPRCNTR"))
  	.subscribe(data => this.hist = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        this.pagemode = 'H';
        this.hist.rows = Util.sortByKey(this.hist.rows,"clmm","D");
        this.gothist = true;
        Util.hideWait();  
  		}
  	);
    
  }
  getPaym(){
    
    Util.showWait();
    
    if(this.gotpaym) {this.pagemode = 'P';this.showcc=false;this.showc=false;Util.hideWait();return false;}
    
    var obj ={"mode":"PAYM",
              "anum": this.eanum,
              "asuf": this.easuf
            }
    this.jsonService
  	.initService(obj,Util.Url("CGICPRCNTR"))
  	.subscribe(data => this.paym = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        this.pagemode = 'P';
        this.gotpaym = true;
        Util.hideWait();  
  		}
  	);
    
  }
  getCanc(){
    
    Util.showWait();
    
    if(this.gotcanc) {this.pagemode = 'C';this.showc=false;this.showcc=false;this.showc=false;Util.hideWait();return false;}
    
    var obj ={"mode":"CANC",
              "anum": this.eanum,
              "asuf": this.easuf
            }
    this.jsonService
  	.initService(obj,Util.Url("CGICPRCNTR"))
  	.subscribe(data => this.canc = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        this.pagemode = 'C';
        this.gotcanc = true;
        this.showc = false;
        this.showcc = false;
        Util.hideWait();  
  		}
  	);
    
  }
  clearMode(){
   
    if(this.changes){
    if(!confirm("Disregard changes?")) return false;
    }
    this.canedit = !Util.noAuth(this.pagedata.head.menuOp,'9EDITCNTRC');
    this.changes = false;
    Util.showWait();
    this.pagemode = 'L';
    this.gotpaym = false;
    this.gothist = false;
    this.gotcanc = false;
    this.cdate.message = "";
    this.miles.message = "";
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
          this.canedit = !Util.noAuth(this.pagedata.head.menuOp,'9EDITCNTRC');
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
