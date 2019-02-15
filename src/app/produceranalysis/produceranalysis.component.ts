import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Produceranalysisdata, Readnextdata } from './produceranalysisdata'; 
import { Dispalert , Errsetter } from '../utilities/dispalert';
import { PagerService } from '../_services'


@Component({
  selector: 'app-produceranalysis',
  templateUrl: './produceranalysis.component.html'
})


export class ProduceranalysisComponent implements OnInit {

	pagedata = new Produceranalysisdata;
  readdata = new Readnextdata;
  ran:string = Util.makeid();
  statsort:boolean = false;
  namesort:boolean = false;
  codesort:boolean = false;
  pagemode:string = "I";
  pagemodel:string = "I";
  parentRec:any;
  listdata: any;
  posScrolid:string="";
  drilldata: any[]=[];
  view : any;
	changes = false;

	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  period :string ="1";
	
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
  killRecur1 : boolean = false;
  dlrn : string="";
  dlrc : string="";

  constructor(private jsonService: JsonService,private router: Router, private pagerService: PagerService) { }

  changeSort(col){
    Util.showWait();

    if(col == 'S'){ 
      this.statsort = !this.statsort; 
      this.namesort = false; 
      this.codesort = false;
    
    if(this.statsort)
      this.pagedata.records = Util.sortByKey(this.pagedata.records ,"stat","A");
    else
      this.pagedata.records = Util.sortByKey(this.pagedata.records ,"stat","D");
    }  
    if(col == 'N'){ 
      this.statsort = false; 
      this.namesort = !this.namesort; 
      this.codesort = false;
    
    if(this.namesort)
      this.pagedata.records = Util.sortByKey(this.pagedata.records ,"dlrn","A");
    else
      this.pagedata.records = Util.sortByKey(this.pagedata.records ,"dlrn","D");
    }  
    if(col == 'C'){ 
      this.statsort = false; 
      this.namesort = false; 
      this.codesort = !this.codesort;
    
    if(this.codesort)
      this.pagedata.records = Util.sortByKey(this.pagedata.records ,"dlrc","A");
    else
      this.pagedata.records = Util.sortByKey(this.pagedata.records ,"dlrc","D");
    }  
      this.setPage(1);
    Util.hideWait();  
  }
  viewCont(agr){
    Util.showWait();
    var obj ={"mode":"VIEW",
              "anum": agr.anum,
              "asuf": agr.asuf,
              "dlr" : agr.dlrc
            }
    this.jsonService
  	.initService(obj,Util.Url("CGICPRCNTR"))
  	.subscribe(data => this.view = data,
  		err => {Util.hideWait(); },
  		() => {
        Util.modalid("show","contractmodal");
        Util.hideWait();  
  		}
  	);
    
  }
  closemodal(){
    Util.modalid("hide","contractmodal");
  }
  clearmode(){
    Util.showWait();
    this.pagemode = 'I';
    this.listdata = [];
    this.drilldata=[];
    this.killRecur1 = true;
    Util.hideWait();
    setTimeout(() => { Util.scrollToIds(this.posScrolid);},100);

  }
  
  onChange(){
  	this.changes = true;
  }
  listmode(mode,rec,anchor){
    

    if(anchor ==''){
      Util.showWait();
      this.pagemode="L";
      this.pagemodel = mode;
      this.parentRec =rec;
      this.killRecur1 = false;
      this.posScrolid = "row"+rec.dlrc.toString();
      window.scrollTo(0, 0);
      this.drilldata=[];}

      if(this.killRecur1){
        return;
      }
    this.jsonService
  	.initService({"mode":"LIST","dlrc": rec.dlrc,"type":mode,"perd":rec.perd,"anchor":anchor},Util.Url("CGICANALYS"))
  	.subscribe(data => this.listdata = data,
  		err => {Util.hideWait(); },
  		() => {
        this.listdata.records.forEach(rc =>{ this.drilldata.push(rc)});
        if (this.listdata.lstrec === "EOF") {
          Util.hideWait();
          return;
        } else {
          this.listmode(mode,rec,this.listdata.lstrec);
        }
        Util.hideWait();
        
      });

  }
  resetf(){
    this.dlrn = "";
    this.dlrc = "";
    this.applyFilter();
  }

  applyFilter(){
    Util.showWait();
    this.dlrc = this.dlrc.trim();
    this.dlrn = this.dlrn.trim();
    this.pageCount = 0;

    for(var i=0; i< this.pagedata.records.length;i++){
      this.pagedata.records[i].show = true;
      
      if(this.dlrn !== "" && this.pagedata.records[i].dlrn.toUpperCase().indexOf(this.dlrn.toUpperCase()) === -1){
        this.pagedata.records[i].show = false;
      }
      if(this.dlrc !== "" && this.pagedata.records[i].dlrc.toUpperCase().indexOf(this.dlrc.toUpperCase()) === -1){
        this.pagedata.records[i].show = false;
      }
      if(this.pagedata.records[i].perd  !== this.period){
        this.pagedata.records[i].show = false;
      }
      
      if(this.pagedata.records[i].show === true){
        this.pageCount += 1;
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

  

  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT","tabid": sessionStorage.getItem("tabid")},Util.Url("CGICANALYS"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.hideWait(); },
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
    this.pagedata.records.forEach(sq =>{ if(sq.show && sq.perd == this.period) this.dispItems.push(sq)});
    // get current page of items
    this.pagedItems = this.dispItems.slice(this.pager.startIndex, this.pager.endIndex + 1);    
  }

  readNext(anchor){
    if(this.killRecur){
      return;
    }
    this.jsonService
    .initService({"mode":"READNEXT", "dlrc":anchor,"tabid": sessionStorage.getItem("tabid")},Util.Url("CGICANALYS"))
    .subscribe(data => this.readdata = data,
      err => {Util.hideWait(); },
      () => {
        Array.prototype.push.apply(this.pagedata.records,this.readdata.records);
        if (this.readdata.ttlpgs.lstrec === "EOF") {
          this.applyFiltBtn = true;
          return;
        } else {
          this.readNext(this.readdata.ttlpgs.lstrec);
        }
      }
    );
  }

 

}
