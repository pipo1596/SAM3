import { Component, OnInit ,Input, OnDestroy} from '@angular/core';
import { JsonService } from '../utilities/json.service';
import { Headerdata } from './headerdata';
import { Util } from '../utilities/util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy {
  @Input() headdata : Headerdata;
  modalIn:any;
  logMeOut:any;

  keytime:any;
  process:boolean = false;
  dealer:string;
  dealerp:string;
  ran:string = Util.makeid();
  
  constructor(private headService: JsonService,
              private router: Router) { }

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
}

hideLoc(){
  Util.modalid("hide","roofTop");
}
  ngOnInit() {
    

this.logOutTimer("I");
this.validVersion();
window.onbeforeunload = () => {
 this.logOut();
};

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
