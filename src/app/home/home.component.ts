import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service';
import { Headerdata } from '../header/headerdata';
import { Util } from '../utilities/util';
import { Homedata } from './homedata';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  pagedata = new  Homedata;
  constructor(private homeService: JsonService,
    private router: Router) { }
  
  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
    this.homeService
    .initService({  },Util.Url("CGICHOMES"))
    .subscribe(data => this.pagedata = data,
      err => {Util.hideWait();  },
      () => { Util.responsiveMenu(); 
        Util.setHead(this.pagedata.head);
        if (this.pagedata.head.status !== "I") {
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          Util.scrollTop();
          Util.hideWait();
        }

       }
    );
  }

}
