import { Component, OnInit , ViewChild  } from '@angular/core';
import { Util } from '../utilities/util';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Contractdata } from '../contract/contractdata'; 
import { JsonService } from '../utilities/json.service';

@Component({
  selector: 'app-signpad',
  templateUrl: './signpad.component.html'
})
export class SignpadComponent implements OnInit {

  constructor(private jsonService: JsonService) { }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  pagedata = new Contractdata();
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 500,
    'canvasHeight': 200
  };
  clearsig(){
    this.signaturePad.clear();
  }
  savesig(){
    this.jsonService
        .initService(this.signaturePad.toDataURL(), Util.Url("CGSAVESIG"))
        .subscribe(
          () => {
            alert("success");

          });
  }
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
 
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());
  }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  ngOnInit() {
    Util.hideWait();
    Util.modalid('show','signmodal');

  }

}
