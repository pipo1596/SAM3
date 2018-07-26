import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Util } from '../utilities/util';
import { StaticPageData } from './staticpage'; 
import { JsonService , HtmlService} from '../utilities/json.service';
import { TEMPLATE_DRIVEN_DIRECTIVES } from '@angular/forms';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-staticpage',
  templateUrl: './staticpage.component.html'
})
export class StaticPageComponent implements OnInit {

	pagedata = new StaticPageData;
  constructor(private jsonService: JsonService,private htmlService:HtmlService,private router: Router) { }
  pagehtml:HtmlParser;



  ngOnInit() {
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICHOMES"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        Util.setHead(this.pagedata.head);
        Util.responsiveMenu();
        this.getHtml();
  			}
  	);
  }
  getHtml() {
  	this.htmlService
  	.initService(Util.Url("/StaticPages/help.html"))
  	.subscribe(data => this.pagehtml = data,
  		err => { console.log(this.pagehtml);Util.responsiveMenu(); },
  		() => {
        Util.hideWait();
        console.log(this.pagehtml);
        
  			}
  	);
  }


}
