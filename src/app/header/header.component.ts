import { Component, OnInit ,Input, OnDestroy} from '@angular/core';
import { JsonService } from '../utilities/json.service';
import { Headerdata,Locn,Agnt } from './headerdata';
import { Util } from '../utilities/util';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy {
  @Input() headdata : Headerdata;
  modalIn:any;
  stage:boolean =false;
  logMeOut:any;
  temploctn:[Locn];
  tempAgnt:[Agnt];
  keytime:any;
  process:boolean = false;
  process2:boolean = false;
  process3:boolean = false;
  agentlast:boolean = false;
  agnfocus:boolean = false;
  dealer:string;
  agent:string="";
  dealerp:string;
  agentp:string;
  ran:string = Util.makeid();
  
  constructor(private headService: JsonService,
              private router: Router) {  this.router.routeReuseStrategy.shouldReuseRoute = function(){
                return false;
             }
            
             this.router.events.subscribe((evt) => {
                if (evt instanceof NavigationEnd) {
                   // trick the Router into believing it's last link wasn't previously loaded
                   this.router.navigated = false;
                   // if you need to scroll back to top, here is the right place
                   window.scrollTo(0, 0);
                }
            });
             }

hideAlert(){
  Util.modalid('hide','alertModal');
}     

hideVersion(){
  Util.modalid('hide','vrsnModal');
}  

getVersion(){
  Util.showWait();
        this.
      headService.
      initService({"service":"UPDV","tabid": sessionStorage.getItem("tabid")},Util.Url("CGICSERVE"))
        .subscribe(data=>this.headdata = data,
           err => {},
           () => {location.reload();});
}

dealerGroupsAles(){

  //this.temploctn = this.headdata.loctn; 
  this.process = true;
  clearTimeout(this.keytime);
  
  var self = this;
  if(this.dealer !== ""){
  this.keytime = setTimeout(()=>{ 
    self.temploctn = [{"stat":"","dlr":"","desc":""}]; self.temploctn.pop();
                self.headdata.loctn.forEach(loc =>{ 
                  var toucase1 = loc.desc.toUpperCase();
                  var toucase2 = self.dealer.toUpperCase();

                  if(toucase1.indexOf(toucase2)>-1){
                    self.temploctn.push(loc);
                  }

                });
                self.process = false;
                
    }, 100);
  }else{
    this.temploctn = this.headdata.loctn;
    self.process = false; 
  }
}
clearagent(){this.agent='';this.agentp="";this.tempAgnt = [{"agnt":"" , "desc":""}];this.headdata.loctn = [{"stat":"","dlr":"","desc":""}];this.tempAgnt.pop();this.dealerp="";this.dealerGroups();}
cleardealer(){this.dealer='';this.dealerp="";this.headdata.loctn = [{"stat":"","dlr":"","desc":""}];this.agentSearch();}
agnblur(){ setTimeout(()=>{ this.agnfocus = false;},300);}
dealerGroups(){
  if(this.process || this.dealer == this.dealerp){ return false; }

  this.headdata.loctn = [{"stat":"","dlr":"","desc":""}]
  this.process = true;
  this.agent = "";
  clearTimeout(this.keytime);
  var self = this;
  this.keytime = setTimeout(()=>{ 
    self.dealerp = self.dealer;
    self.headService.
          initService({"service":"LISTLOC","dlr":self.dealer,"tabid": sessionStorage.getItem("tabid")},Util.Url("CGICSERVE")).
          subscribe(data=>self.headdata.loctn = data,
               err => {},
               () => { 
                self.headdata.loctn = Util.sortByKey(self.headdata.loctn,"desc","A");
                self.process = false;
                if(self.dealer !== self.dealerp){
                  self.dealerGroups();
                }
               });
    self.dealerp = self.dealer;
    }, 400);
}
agentSearch(){
  if(this.process2 || this.agent == this.agentp){ return false; }
  this.agnfocus = true;
  this.headdata.loctn = [{"stat":"","dlr":"","desc":""}];
  this.tempAgnt = [{"agnt":"" , "desc":""}]; 
  this.tempAgnt.pop();
  this.process2 = true;
  this.agentlast = false;
  this.dealer = "";
  clearTimeout(this.keytime);
  var self = this;
  this.keytime = setTimeout(()=>{ 
    self.agentp = self.agent;
    self.headService.
          initService({"service":"LISTAGNT","agnt":self.agent,"tabid": sessionStorage.getItem("tabid")},Util.Url("CGICSERVE")).
          subscribe(data=>self.tempAgnt = data,
               err => {},
               () => { 
                
                self.process2 = false;
                if(self.agent !== self.agentp){
                  self.agentSearch();
                }
               });
    self.agentp = self.agent;
    }, 400);
}
setAgent(code){
  this.process2 = true;
  this.process3 = true;
  this.agent = code;
  this.agentp= "";
  this.headdata.loctn = [{"stat":"","dlr":"","desc":""}];
  this.tempAgnt = [{"agnt":"" , "desc":""}]; 
  this.tempAgnt.pop();
  this.headService.
          initService({"service":"AGNTDLRS","agnt":this.agent,"tabid": sessionStorage.getItem("tabid")},Util.Url("CGICSERVE")).
          subscribe(data=>this.headdata.loctn = data,
               err => {},
               () => { 
                
                this.process2 = false;
                this.process3 = false;
                this.agentlast = true;
                
               });
  
}
public logOutTimer(mode){
    if(mode=="R"){ Util.modal("hide");this.router.navigate([this.router.url]);}
    clearTimeout(this.modalIn);
    clearTimeout(this.logMeOut);
    Util.hidebyid("toolate");
    Util.showbyid("staylogin");
if(!this.stage){
    this.modalIn = setTimeout(()=>{ 
        this.hideVersion();
        this.hideAlert();
        if(this.headdata.status === "I") { Util.modal("show");}
        }, 1800000);
    this.logMeOut = setTimeout(()=>{ Util.hidebyid("staylogin");Util.showbyid("toolate");}, 1820000);
}
}

public logOutTimerB(mode){
    if(mode=="R"){ Util.modal("hide");}
    clearTimeout(this.modalIn);
    clearTimeout(this.logMeOut);

    this.modalIn = setTimeout(()=>{ 
        this.hideVersion();
        this.hideAlert();
        Util.modal("show");
        }, 1800000);
    this.logMeOut = setTimeout(()=>{ 
       if(this.headdata.status === "I") {
        this.headService.
          initService({"service":"LOGOUT","tabid": sessionStorage.getItem("tabid")},Util.Url("CGICSERVE"))
            .subscribe(data=>this.headdata = data,
               err => {},
               () => { location.reload();});
       };
        }, 1820000);
}
 

changeLoc(locn){
  this.
    headService.
      initService({"service":"LOCATN","dlr":locn.dlr,"tabid": sessionStorage.getItem("tabid")},Util.Url("CGICSERVE"))
        .subscribe(data=>this.headdata = data,
           err => {},
           () => { Util.showWait();this.router.navigate(['/app/Home']);});

}

logOut(){ 
  this.
    headService.
      initService({"service":"LOGOUT","tabid": sessionStorage.getItem("tabid")},Util.Url("CGICSERVE"))
        .subscribe(data=>this.headdata = data,
           err => {},
           () => { Util.showWait();this.router.navigate(['/app/login']);});
}  


showLoc(){
  Util.modalid("show","roofTop");
  if(this.headdata.as400){
    this.dealer = this.headdata.currdlr;
    if(this.dealer !== "") this.dealerGroups();
  }
  this.headdata.loctn =  Util.sortByKey(this.headdata.loctn,"desc","A");
  this.temploctn = this.headdata.loctn;
  //Util.focusById("dealersearch");
  Util.selectById("dealersearch");
}

hideLoc(){
  Util.modalid("hide","roofTop");
}
  ngOnInit() {
    
    if (window.location.href.indexOf("qa.milo") > -1) this.stage = true;
    if (window.location.href.indexOf("192.168.6.48") > -1) this.stage = true;
    if (window.location.href.indexOf("192.168.6.47") > -1) this.stage = true;
    if (window.location.href.indexOf("localhost") > -1) this.stage = true;
    //console.log(window.location.href);
    //console.log(this.stage);

this.logOutTimer("I");
this.validVersion();
Util.Usersnap();


  }

validVersion(){
  setTimeout(()=>{ 
    if(this.headdata.reld && Util.Env()){
     // Util.modalid("show","vrsnModal");
      location.reload();
    }
    }, 1000);
  
}

  ngOnDestroy(){
    clearTimeout(this.modalIn);
    clearTimeout(this.logMeOut);
  }

}
