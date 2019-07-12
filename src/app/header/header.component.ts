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
  pvactn:boolean=false;
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
  Util.modalid('hide','mmModalError');
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

dealerGroupsAles(e){
   this.pvactn = (e!==undefined && e.keyCode == 13);
  this.process = true;
  clearTimeout(this.keytime);
  
  var self = this;
  if(this.dealer !== ""){
  this.keytime = setTimeout(()=>{ 
    self.temploctn = [{"stat":"","statd":"","dlr":"","desc":""}]; self.temploctn.pop();
                self.headdata.loctn.forEach(loc =>{ 
                  var toucase1 = loc.desc.toUpperCase();
                  var toucase2 = self.dealer.toUpperCase();

                  if(toucase1.indexOf(toucase2)>-1){
                    self.temploctn.push(loc);
                  }

                });

                var pos1 = this.temploctn.findIndex(obj => obj.dlr ==self.dealer.trim());
                
              if(pos1>-1){
              if (this.pvactn || (e!==undefined && e.keyCode == 13)) {
                this.changeLoc(self.temploctn[0]);
                return false;
              }
            }
                self.process = false;
                
    }, 100);
  }else{
    this.temploctn = this.headdata.loctn;
    self.process = false; 
  }
}
clearagent(e){this.agent='';this.agentp="";this.tempAgnt = [{"agnt":"" , "desc":""}];this.headdata.loctn = [{"stat":"","statd":"","dlr":"","desc":""}];this.tempAgnt.pop();this.dealerp="";this.dealerGroups(e);}
cleardealer(){this.dealer='';this.dealerp="";this.headdata.loctn = [{"stat":"","statd":"","dlr":"","desc":""}];this.agentSearch();}
agnblur(){ setTimeout(()=>{ this.agnfocus = false;},300);}
dealerGroups(e){
  this.pvactn = (e!==undefined && e.keyCode == 13);
  if(this.process || 
    (this.dealer == this.dealerp && (e!==undefined && e.keyCode !== 13))){ return false; }
  

  this.headdata.loctn = [{"stat":"","statd":"","dlr":"","desc":""}]
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
                var pos1 = this.headdata.loctn.findIndex(obj => obj.dlr ==self.dealer.trim());
                if(pos1>0){
                    self.headdata.loctn.unshift(self.headdata.loctn[pos1]);
                    self.headdata.loctn.splice(pos1+1,1);
                
                
              }
              if(pos1>-1){
              if (this.pvactn || (e!==undefined && e.keyCode == 13)) {
                this.changeLoc(self.headdata.loctn[0]);
                return false;
              }
            }
                self.process = false;
                if(self.dealer !== self.dealerp){
                  self.dealerGroups(e);
                }
               });
    self.dealerp = self.dealer;
    }, 400);
}
agentSearch(){
  if(this.process2 || this.agent == this.agentp){ return false; }
  this.agnfocus = true;
  this.headdata.loctn = [{"stat":"","statd":"","dlr":"","desc":""}];
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
  this.headdata.loctn = [{"stat":"","statd":"","dlr":"","desc":""}];
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
        }, 7180000);
    this.logMeOut = setTimeout(()=>{ Util.hidebyid("staylogin");Util.showbyid("toolate");}, 7200000);
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
        }, 7180000);
    this.logMeOut = setTimeout(()=>{ 
       if(this.headdata.status === "I") {
        this.headService.
          initService({"service":"LOGOUT","tabid": sessionStorage.getItem("tabid")},Util.Url("CGICSERVE"))
            .subscribe(data=>this.headdata = data,
               err => {},
               () => { location.reload();});
       };
        }, 7200000);
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

goMenuMetric(){ 
  var url;
  Util.showWait();
  this.
    headService.
      initService({"service":"MMLINK"},Util.Url("CGICSERVE"))
        .subscribe(data=>url = data,
           err => {},
           () => { 
          if(url.link!=='E') { 
           // window.location.href= url.link;
           Util.hideWait();
            var win = window.open(url.link, '_blank');
             win.focus();
          }else{
            Util.hideWait();
            Util.modalid("show","mmModalError");
          }
          
          });
}  


showLoc(e){
  Util.modalid("show","roofTop");
  if(this.headdata.as400){
    this.dealer = this.headdata.currdlr;
    if(this.dealer !== "") this.dealerGroups(e);
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
