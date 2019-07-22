import { Component, OnInit , ViewChild , Input, Output, EventEmitter } from '@angular/core';
import { Util } from '../utilities/util';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Contractdata } from '../contract/contractdata'; 
import { JsonService } from '../utilities/json.service';

@Component({
  selector: 'app-signpad',
  templateUrl: './signpad.component.html'
})
export class SignpadComponent implements OnInit {
  @Input() data;
  @Input() i;
  @Output() notify = new EventEmitter();
  constructor(private jsonService: JsonService) { }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  pagedata = new Contractdata();
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 540,
    'canvasHeight': 200
  };
  clearsig(){
    this.signaturePad.clear();
  }
  savesig(){
    
    this.GetSigImageB64(this.signaturePad);
  }
  savesig2(data){ 
  this.jsonService
        .initService("&MODE="+this.data.mode+
                     "&IONO="+this.data.iono+
                     "&BLOB="+this.writeTiff(data,this.signaturePad.options), Util.Url("CGSAVETIF"))
        .subscribe(
          () => {
            this.clearsig();
            this.notify.emit({ event : this.i });

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
  GetSigImageB64(canvas) 
  {
  
    var img = new Image();
    img.src = canvas.toDataURL();
    var self = this;
    img.onload = function () 
      {
        var cvs = document.createElement('canvas');
        cvs.width = 540;
        cvs.height = 200;
      var cntx = cvs.getContext('2d');
      cntx.drawImage(img, 0, 0);
      var b64String = cntx.getImageData(0, 0, 540, 200).data;
      self.savesig2(b64String);
      cvs.remove();
      }
  }
  
  ngOnInit() {
    //Util.hideWait();
    //Util.modalid('show','signmodal');
    
  }
cancel(){
  Util.modalidmain('hide','signmodal');
}
  writeTiff(inputData,optn){
    var fptr = [];
    var offset;

    /* prep the data */
     var dataPtr = [];
     var datac="";
     for (var y=0;y<optn.canvasHeight;y++) {
        var bufferBits = " ";
        for (var x=0;x<optn.canvasWidth;x++) {
           //... calculate the RGB value between 0 and 255 ...
           // only black & white for us
          
           bufferBits += 
           (  0 < inputData[((optn.canvasWidth * y) + x) * 4]    || 
              0 < inputData[((optn.canvasWidth * y) + x) * 4+1]  || 
              0 < inputData[((optn.canvasWidth * y) + x) * 4+2]  ||
              0 < inputData[((optn.canvasWidth * y) + x) * 4+3]  ? "0" : "1");
  
           if (bufferBits.length == 5)
           {
            this.WriteHexString(dataPtr, parseInt(bufferBits,2).toString(16) );
              bufferBits = " ";
           }
        }
        if ( bufferBits.length > 1 ) {
          this.WriteHexString(dataPtr, parseInt(bufferBits,2).toString(16) );
          bufferBits = " ";
        }
        this.WriteHexString(dataPtr,"0");
         //putc(42,dataPtr);
     }                                                                   
     datac = dataPtr.join("");//.match(RegExp('.{1,125}','g')).join("0");
    
    /* Write the header */
    this.WriteHexString(fptr,"4d4d002a");    /* Little endian & TIFF identifier */
     offset = datac.length/2 + 8;
     this.putc((offset & 0xff000000) / 16777216,fptr);
     this.putc((offset & 0x00ff0000) / 65536,fptr);
     this.putc((offset & 0x0000ff00) / 256,fptr);
     this.putc((offset & 0x000000ff),fptr);
  
     /* Write the binary data */
     this.WriteHexString(fptr,datac);
  
     /* Write the footer */
     this.WriteHexString(fptr,"0007");  /* The number of directory entries (dec7) */
      
     /* Width tag, short int */
     this.WriteHexString(fptr,"0100000300000001");
     this.putc((optn.canvasWidth & 0xff00) / 256,fptr);    /* Image width */
     this.putc((optn.canvasWidth & 0x00ff),fptr);
     this.WriteHexString(fptr,"0000");
  
     /* Height tag, short int */
     this.WriteHexString(fptr,"0101000300000001");
     this.putc((optn.canvasHeight & 0xff00) / 256,fptr);    /* Image height */
     this.putc((optn.canvasHeight & 0x00ff),fptr);
     this.WriteHexString(fptr,"0000");
  
     /* Compression flag, short int */
     this.WriteHexString(fptr,"010300030000000100010000");   
     
     /* Photometric interpolation tag, short int */
     this.WriteHexString(fptr,"010600030000000100010000");
  
     /* Strip offset tag, long int */
     this.WriteHexString(fptr,"011100040000000100000008");
  
     /* Rows per strip tag, short int */
     this.WriteHexString(fptr,"0116000300000001");
     this.putc((optn.canvasHeight & 0xff00) / 256,fptr);
     this.putc((optn.canvasHeight & 0x00ff),fptr);
     this.WriteHexString(fptr,"0000");
  
     /* Strip byte count flag, long int */
     this.WriteHexString(fptr,"0117000400000001");
     offset = datac.length /2;
     this.putc((offset & 0xff000000) / 16777216,fptr);
     this.putc((offset & 0x00ff0000) / 65536,fptr);
     this.putc((offset & 0x0000ff00) / 256,fptr);
     this.putc((offset & 0x000000ff),fptr);
  
     /* End of the directory entry */
     this.WriteHexString(fptr,"00000000"); 
     return fptr.join("");
  }
  //==============================================================================
  putc(inp,out)
  {
    out.push('' + this.dec2hex(inp))  
  }
  //==============================================================================
  WriteHexString(out,inp)
  {
    for (var i = 0; i < inp.length; i += 2) {
        out.push('' + inp.substr(i, 2));
    } 
  }
  //==============================================================================
  getOffset(src,offset,amt) {
   if (amt==null) amt=2;
   return src.substr(offset*2,amt*2); 
  }       
  //==============================================================================
  dec2hex(dec) {
    return (dec<16?"0":"")+dec.toString(16);
  }
  //==============================================================================
  hex2dec(hex) {
    return parseInt(hex, 16);
  }
  //==============================================================================

}
