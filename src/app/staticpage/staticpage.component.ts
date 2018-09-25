import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Util } from '../utilities/util';
import { StaticPageData } from './staticpage'; 
import { JsonService , HtmlService} from '../utilities/json.service';
import { HtmlParser } from '@angular/compiler';


@Component({
  selector: 'app-staticpage',
  templateUrl: './staticpage.component.html'
})


export class StaticPageComponent implements OnInit {

	pagedata = new StaticPageData;
  constructor(private jsonService: JsonService,private htmlService:HtmlService,private router: Router) { }
  pagehtml:HtmlParser;
  pageid: string;
  loading: boolean = true;


 
  expand(){
    if(this.pageid=='faqs') Util.setFAQ();
  }
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
    this.pageid = Util.getparm('pageid');
    this.pagedata.head.title =decodeURI(Util.getparm('title'));
  	this.htmlService
  	.initService(Util.UrlStatic("StaticPages/"+this.pageid+".html"))
  	.subscribe(data => this.pagehtml = data,
  		err => {Util.hideWait();},
  		() => {
        this.loading = false;
        Util.hideWait();

  			}
  	);
  }


}
