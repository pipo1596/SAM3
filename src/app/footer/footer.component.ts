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

}
