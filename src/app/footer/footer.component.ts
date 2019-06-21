import { Component, OnInit } from '@angular/core';
import { Util } from '../utilities/util';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  year :string = new Date().getFullYear().toString();

  constructor() { }
  toTop(){
    Util.hidebyid("totop");
    Util.scrollTop();
  }
  ngOnInit() {
  }
  openseal(){ 
    if(window.location.protocol.toLowerCase()=="https:"){var mode="https:";} else {var mode="http:";}
     var host=location.host;   
      var baseURL=mode+"//seals.networksolutions.com/siteseal_seek/siteseal?v_shortname=NETSS&v_querytype=W&v_search="+host+"&x=5&y=5";
      window.open(baseURL,"NETSS","width=450,height=500,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,copyhistory=no,resizable=no");return false;
    }
  

}
