import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Migrationdata} from './migrationdata'; 
import { Dispalert } from '../utilities/dispalert';

@Component({
  selector: 'app-migration',
  templateUrl: './migration.component.html'
})

export class MigrationComponent implements OnInit {

  pagedata = new Migrationdata;
  ran:string = Util.makeid();
  process:boolean = false;
  keytime:any;
  dummy:any;
  //Field
  dealerp:string;
  dealer:string="";  
  cachemode:boolean = false;
  dispAlert = new Dispalert();

  constructor(private jsonService: JsonService,private router: Router) { }
  dealerGroups(){
    if(this.process || this.dealer == this.dealerp){ return false; }
  
    this.pagedata.loc = []
    this.process = true;
    clearTimeout(this.keytime);
    var self = this;
    this.keytime = setTimeout(()=>{ 
      self.dealerp = self.dealer;
      self.jsonService.
            initService({"service":"LISTLOC","dlr":self.dealer,"tabid":sessionStorage.getItem("tabid")},Util.Url("CGICSERVE")).
            subscribe(data=>self.pagedata.loc = data,
                 err => {Util.hideWait();},
                 () => { 
                  self.pagedata.loc = Util.sortByKey(self.pagedata.loc,"desc","A");
                  self.process = false;
                  if(self.dealer !== self.dealerp){
                    self.dealerGroups();
                  }
                 });
      self.dealerp = self.dealer;
      }, 400);
  }
  import(loc){
    Util.showWait();
    loc.stat = "P";
    this.jsonService
  	.initService({"mode":"MIGRATE","dlr":loc.dlr},Util.Url("CGICMIGRAT"))
  	.subscribe(data => this.dummy = data,
  		err => {Util.hideWait(); },
  		() => {
        
          Util.hideWait();
          
  		}
  	);
  }
  clearcache(loc){
    Util.showWait();
    loc.statd = "N";
    this.jsonService
  	.initService({"mode":"CLEARONE","dlr":loc.dlr},Util.Url("CGICMIGRAT"))
  	.subscribe(data => this.dummy = data,
  		err => {Util.hideWait(); },
  		() => {
        
          Util.hideWait();
          
  		}
  	);
  }

  clearall(){

    Util.showWait();
    this.jsonService
  	.initService({"mode":"CLEARALL"},Util.Url("CGICMIGRAT"))
  	.subscribe(data => this.dummy = data,
  		err => {Util.hideWait(); },
  		() => {
          this.pagedata.loc =[];
          this.dealer ="";
          this.dealerp ="";
          Util.hideWait();
          
  		}
  	);

  }
  ngOnInit() {
    if (window.location.href.indexOf("ClearCache") != -1)
      this.cachemode = true;
    else
      this.cachemode = false;
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICMIGRAT"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.hideWait(); },
  		() => {
        
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" ||  !this.pagedata.head.as400 ) {
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
  
  checkdata(){

  }
  canDeactivate() {
    
      return true;
  }



}
