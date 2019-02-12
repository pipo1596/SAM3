import { Component, OnInit } from '@angular/core';
import { JsonService } from '../../utilities/json.service'; 
import { Util } from '../../utilities/util';
import { Textfield} from '../../utilities/textfield';
import { Dispalert , Errsetter } from '../../utilities/dispalert';


@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html'
})
export class AnalysisComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    Util.hideWait();
    
  }

}
