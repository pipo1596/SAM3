import { Component, OnInit ,Input, OnDestroy} from '@angular/core';
import { JsonService } from '../utilities/json.service';
import { Headerdata,Locn } from './headerdata';
import { Util } from '../utilities/util';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy {
  @Input() headdata : Headerdata;
  modalIn:any;
  logMeOut:any;
  temploctn:[Locn];
  keytime:any;
  process:boolean = false;
  dealer:string;
  dealerp:string;
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
      initService({"service":"UPDV"},Util.Url("CGICSERVE"))
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
    self.temploctn = [{"dlr":"","desc":""}]; self.temploctn.pop();
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

dealerGroups(){
  if(this.process || this.dealer == this.dealerp){ return false; }

  this.headdata.loctn = [{"dlr":"","desc":""}]
  this.process = true;
  clearTimeout(this.keytime);
  var self = this;
  this.keytime = setTimeout(()=>{ 
    self.dealerp = self.dealer;
    self.headService.
          initService({"service":"LISTLOC","dlr":self.dealer},Util.Url("CGICSERVE")).
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

public logOutTimer(mode){
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
          initService({"service":"LOGOUT"},Util.Url("CGICSERVE"))
            .subscribe(data=>this.headdata = data,
               err => {},
               () => { location.reload();});
       };
        }, 1820000);
}
 

changeLoc(locn){
  this.
    headService.
      initService({"service":"LOCATN","dlr":locn.dlr},Util.Url("CGICSERVE"))
        .subscribe(data=>this.headdata = data,
           err => {},
           () => { Util.showWait();this.router.navigate(['/login']);});

}

logOut(){ 
  this.
    headService.
      initService({"service":"LOGOUT"},Util.Url("CGICSERVE"))
        .subscribe(data=>this.headdata = data,
           err => {},
           () => { Util.showWait();this.router.navigate(['/login']);});
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
    

this.logOutTimer("I");
this.validVersion();
Util.Usersnap();


  }

validVersion(){
  setTimeout(()=>{ 
    if(this.headdata.reld){
      Util.modalid("show","vrsnModal");
    }
    }, 2000);
  
}

  ngOnDestroy(){
    clearTimeout(this.modalIn);
    clearTimeout(this.logMeOut);
  }

}
