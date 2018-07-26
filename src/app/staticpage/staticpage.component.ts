import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Util } from '../utilities/util';
import { StaticPageData } from './staticpage'; 
import { JsonService } from '../utilities/json.service';

@Component({
  selector: 'app-staticpage',
  templateUrl: './staticpage.component.html'
})
export class StaticPageComponent implements OnInit {

	pagedata = new StaticPageData;
  constructor(private jsonService: JsonService,private router: Router) { }




  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICSVQT"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        Util.setHead(this.pagedata.head);
        Util.responsiveMenu();
        Util.hideWait();
  			
  			}
  	);
  }


}
