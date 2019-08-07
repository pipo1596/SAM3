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
  _data:any;
  private tmr:any;
  @Input() set data(data:any){
    this._data = data;
    Util.modalid('show','signmodal');
    if(this._data.meth == "T"){//Topaz Method
      this.onSign();
    }
    if(this._data.meth == "E"){//Topaz Method
      this.StartSign();
    }
    
    
  };
  @Input() i;
  @Output() notify = new EventEmitter();
  baseUri:any = this.makeUri();
  ctx:any;
  isSigned:boolean = false;
  addedevent:boolean =false;
  NumPointsLastTime:number = 0;
  SigWebFontThreshold:number = 155;
  getBlobURL:any = (window.URL && URL.createObjectURL.bind(URL)) ;
  revokeBlobURL:any = (window.URL && URL.revokeObjectURL.bind(URL)); 

  constructor(private jsonService: JsonService) { }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  pagedata = new Contractdata();
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 540,
    'canvasHeight': 120
  };
  clearsig(){
    this.signaturePad.clear();
  }
  onSign()
{
   var canva = <HTMLCanvasElement> document.getElementById('cnvt');
   var ctx = canva.getContext('2d');         
   this.SetDisplayXSize( 540 );
   this.SetDisplayYSize( 120 );
   this.SetTabletState(0, this.tmr,50);
   this.SetJustifyMode(0);
   this.ClearTablet();
   if(this.tmr == null)
   {
    this.tmr = this.SetTabletState(1, ctx, 50);
   }
   else
   {
      this.SetTabletState(0, this.tmr,50);
      this.tmr = null;
      this.tmr = this.SetTabletState(1, ctx, 50);
   }
}
clearTopaz(){
    if(this._data.meth == "T"){
  this.SetTabletState(0, this.tmr,50);
    }
}
  savesig(){
    if(this.signaturePad.isEmpty()){
      alert("Please sign before continuing");
    }else{
    this.GetSigImageB64Html5(this.signaturePad);
    }
  }
  savesigt(){
    var canva = <HTMLCanvasElement> document.getElementById('cnvt');
    if(this.NumberOfTabletPoints() == 0)
   {
      alert("Please sign before continuing");
   }
   else
   {
    this.SetTabletState(0, this.tmr,5000000);
    this.GetSigImageB64Html5(canva);
   }
  }
  savesige(){
    Util.showWait();
    var canva = <HTMLCanvasElement> document.getElementById('cnve');
    if(!this.isSigned)
   {
      alert("Please sign before continuing");
   }
   else
   {
    this.GetSigImageB64Html5(canva);
   }
  }
  savesig2(data){ 
  this.jsonService
        .initService("&MODE="+this._data.mode+
                     "&IONO="+this._data.iono+
                     "&BLOB="+this.writeTiff(data), Util.Url("CGSAVETIF"))
        .subscribe(
          () => {
            Util.hideWait();
            this.clearsig();
            this.clearTopaz();
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
  GetSigImageB64Html5(canvas) 
  {
  
    var img = new Image();
    img.src = canvas.toDataURL();
    var self = this;
    img.onload = function () 
      {
        var cvs = document.createElement('canvas');
        cvs.width = 540;
        cvs.height = 120;
      var cntx = cvs.getContext('2d');
      cntx.drawImage(img, 0, 0);
      var b64String = cntx.getImageData(0, 0, 540, 120).data;
      self.savesig2(b64String);
      cvs.remove();
      }
  }
  
  ngOnInit() {
    //Util.hideWait();
    //Util.modalid('show','signmodal');
    
  }
cancel(){if(this._data.prg == "C"){
  Util.modalidmain('hide','signmodal');
  Util.modalidmain('show','contractModal');
}else{
  Util.modalid('hide','signmodal');
}
  this.clearsig();
}
  writeTiff(inputData){
    var fptr = [];
    var offset;

    /* prep the data */
     var dataPtr = [];
     var datac="";
     for (var y=0;y<120;y++) {
        var bufferBits = " ";
        for (var x=0;x<540;x++) {
           //... calculate the RGB value between 0 and 255 ...
           // only black & white for us
          
           if(this._data.meth == 'T' ){//Topaz
           bufferBits += 
           ( 255 == inputData[((540 * y) + x) * 4]   && 
             255 == inputData[((540 * y) + x) * 4+1] && 
             255 == inputData[((540 * y) + x) * 4+2] &&
             255 == inputData[((540 * y) + x) * 4+3] || x ==0 || y==0? "1" : "0");
           }
           if( this._data.meth == 'E'){//Epad

           bufferBits += 
           ( 200 <  inputData[((540 * y) + x) * 4]   && 
             200 <  inputData[((540 * y) + x) * 4+1] && 
             200 <  inputData[((540 * y) + x) * 4+2] &&
             200 <  inputData[((540 * y) + x) * 4+3] || x ==0 || y==0? "1" : "0");
           }
           if( this._data.meth == 'H'){//Html5
           bufferBits += 
           (  0 < inputData[((540 * y) + x) * 4]    || 
              0 < inputData[((540 * y) + x) * 4+1]  || 
              0 < inputData[((540 * y) + x) * 4+2]  ||
              0 < inputData[((540 * y) + x) * 4+3]  ? "0" : "1");
           }
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
     this.putc((540 & 0xff00) / 256,fptr);    /* Image width */
     this.putc((540 & 0x00ff),fptr);
     this.WriteHexString(fptr,"0000");
  
     /* Height tag, short int */
     this.WriteHexString(fptr,"0101000300000001");
     this.putc((120 & 0xff00) / 256,fptr);    /* Image height */
     this.putc((120 & 0x00ff),fptr);
     this.WriteHexString(fptr,"0000");
  
     /* Compression flag, short int */
     this.WriteHexString(fptr,"010300030000000100010000");   
     
     /* Photometric interpolation tag, short int */
     this.WriteHexString(fptr,"010600030000000100010000");
  
     /* Strip offset tag, long int */
     this.WriteHexString(fptr,"011100040000000100000008");
  
     /* Rows per strip tag, short int */
     this.WriteHexString(fptr,"0116000300000001");
     this.putc((120 & 0xff00) / 256,fptr);
     this.putc((120 & 0x00ff),fptr);
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
  //==============================================================================Topaz Start
  isIE() {
      return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec  
          (navigator.userAgent) != null)));
  }   
  //==============================================================================
  isChrome() {
      var ua = navigator.userAgent;
      if (ua.lastIndexOf('Chrome/') > 0) {
          return true;
      } else {
          return false;
      }
  }  
  //==============================================================================
  makeUri() {
      var prot = location.protocol;
      if (prot == "file:") {
          prot = 'http:';
      }                    
      if (this.isIE()) {
          if (prot == 'https:') {
              return (prot + "//tablet.sigwebtablet.com:47290/SigWeb/");
          } else {
              return (prot + "//tablet.sigwebtablet.com:47289/SigWeb/");
          }
      }       
      if (this.isChrome()) {
          if (prot == 'https:') {
              return (prot + "//tablet.sigwebtablet.com:47290/SigWeb/");
          } else {
              return (prot + "//tablet.sigwebtablet.com:47289/SigWeb/");
          }
      } else {
          if (prot == 'https:') {
              return (prot + "//tablet.sigwebtablet.com:47290/SigWeb/");
          } else {
              return (prot + "//tablet.sigwebtablet.com:47289/SigWeb/");
          }
      }
  }   
  //==============================================================================
  SigWebcreateXHR() {
      try {
          return new XMLHttpRequest();
      } catch (e) {}
      

      alert("XMLHttpRequest not supported");
      return null;
  }   
  //==============================================================================   
  SigWebSetProperty(prop) {
      var xhr = this.SigWebcreateXHR();  
      if (xhr) {                 
          xhr.open("POST", this.baseUri + prop, true);
          xhr.send(null);
          if (xhr.readyState == 4 && xhr.status == 200) {
              return xhr.responseText;
          }
      }
      return "";
  }   
  //============================================================================== 
  SigWebSetPropertySync(prop) {
      var xhr = this.SigWebcreateXHR();   
      if (xhr) {
          xhr.open("POST", this.baseUri + prop, true);
          xhr.send();
          if (xhr.readyState == 4 && xhr.status == 200) {
              return xhr.responseText;
          }
      }
      return "";
  }    
  //============================================================================== 
  SigWebSetStreamProperty(prop, strm) {
      var xhr = this.SigWebcreateXHR();     
      if (xhr) {
          xhr.open("POST", this.baseUri + prop,true);
          xhr.setRequestHeader("Content-Type", "text/plain");
          xhr.send(strm);
      }
      return "";
  }  
  //==============================================================================
  SigWebSetImageStreamProperty(prop, strm) {
      var xhr = this.SigWebcreateXHR();
      if (xhr) {
          xhr.open("POST", this.baseUri + prop, true);
          xhr.setRequestHeader("Content-Type", "image/png");
          xhr.send(strm);
          if (xhr.readyState == 4 && xhr.status == 200) {
              return xhr.responseText;
          }
      }
      return "";
  }  
  //==============================================================================
  SigWebSetImageBlobProperty(prop, strm) {
      var xhr = this.SigWebcreateXHR();    
      if (xhr) {
          xhr.open("POST", this.baseUri + prop, true);
          xhr.setRequestHeader("Content-Type", "blob");
          xhr.send(strm);
          if (xhr.readyState == 4 && xhr.status == 200) {
              return xhr.responseText;
          }
      }
      return "";
  }   
  //==============================================================================  
  SigWebGetProperty(prop) {
      var xhr = this.SigWebcreateXHR();

      if (xhr) {
          xhr.open("GET", this.baseUri + prop, true);
          xhr.send(null);
          if (xhr.readyState == 4 && xhr.status == 200) {
              return xhr.responseText;
          }
      }
      return "";
  }   
  //==============================================================================
  SigWebSetDisplayTarget(obj) {
    this.ctx = obj;
  } 
  //============================================================================== 
  SigWebRefresh() {
      var NumPoints = this.NumberOfTabletPoints();
      if (NumPoints == this.NumPointsLastTime) {
          return;
      }
      this.NumPointsLastTime = NumPoints;  
      var xhr2 = new XMLHttpRequest();
      xhr2.open("GET", this.baseUri + "SigImage/0", true);
      xhr2.responseType = "blob";
      var self = this;
      xhr2.onload = function() {
          var img = new Image();
          img.src = self.getBlobURL(xhr2.response);
          img.onload = function(){
              self.ctx.drawImage(img, 0, 0);
              img = null;
          }
      }
      xhr2.send(null);
  }             
  //==============================================================================
  NumberOfTabletPoints() {
      var Prop = "TotalPoints";
      Prop = Prop;
      return parseInt(this.SigWebGetProperty(Prop));
  }  
 
  //==============================================================================
  AutoKeyStart() {
      var Prop = "AutoKeyStart"; 
      Prop = Prop;
      this.SigWebSetPropertySync(Prop);
  }  
  //==============================================================================
  AutoKeyFinish() {
      var Prop = "AutoKeyFinish"; 
      Prop = Prop;
      this.SigWebSetPropertySync(Prop);
  }
  //==============================================================================
  SetAutoKeyData(keyData) {
      var Prop = "SetAutoKeyData"; 
      Prop = Prop;
      this.SigWebSetStreamProperty(Prop, keyData);
  }    
  SetDisplayXSize(v) {
      var Prop = "DisplayXSize/"; 
      Prop = Prop + v;
      this.SigWebSetPropertySync(Prop);
  }  
  //==============================================================================
  SetDisplayYSize(v) {
      var Prop = "DisplayYSize/";
      Prop = Prop + v;
      this.SigWebSetPropertySync(Prop);
  }   
  //==============================================================================
  ClearTablet() {
      var Prop = "ClearSignature"; 
      Prop = Prop;
      return this.SigWebGetProperty(Prop);
  }  
  //==============================================================================
  SetImageXSize(v) {
      var Prop = "ImageXSize/";   
      Prop = Prop + v;
      this.SigWebSetPropertySync(Prop);
  } 
  //==============================================================================      
  SetJustifyMode(v) {
      var Prop = "JustifyMode/";   
      Prop = Prop + v;
      this.SigWebSetPropertySync(Prop);
  }   
  //==============================================================================    
  SetRealTabletState(v) {
      var Prop = "TabletState/";   
      Prop = Prop + v;
      this.SigWebSetPropertySync(Prop);
  }  
  //============================================================================== 
  GetTabletState() {
      var Prop = "TabletState";    
      Prop = Prop;
      return parseInt(this.SigWebGetProperty(Prop));
  }  
  //==============================================================================  
  SetTabletState(v, ctx, tv) {
      var delay;          
      if (tv) {
          delay = tv;
      } else {
          delay = 100;
      }                   
      if (this.GetTabletState() != v) {
          if (v == 1) {
              if (ctx) {
                  var can = ctx.canvas;
                  this.SetDisplayXSize(can.width);
                  this.SetDisplayYSize(can.height);
                  this.SigWebSetDisplayTarget(ctx);
              }
              this.SetRealTabletState(v);
              if (ctx && (this.GetTabletState() != 0)) {
                  //return setInterval(this.SigWebRefresh, delay);
                  return setInterval(() => { this.SigWebRefresh(); }, delay);
              } else {
                  return null;
              }   
          } else {
              if (ctx) {
                  clearInterval(ctx);
              }
              this.SigWebSetDisplayTarget(null);
              this.SetRealTabletState(v);
          }
      }
      return null;
  }
  //==============================================================================ePad Start

   StartSign(){

	    var canvasObj = <HTMLCanvasElement>document.getElementById('cnve');
		canvasObj.getContext('2d').clearRect(0, 0, canvasObj.width, canvasObj.height);
		this.isSigned = false;
        var message = { "firstName": "", 
                        "lastName": "", 
                        "eMail": "", 
                        "location": "",
                        "imageFormat": 1, 
                        "imageX": 540, 
                        "imageY": 120, 
                        "imageTransparency": false, 
                        "imageScaling": false, 
                        "maxUpScalePercent": 0.0, 
                        "rawDataFormat": "ENC", 
                        "minSigPoints": 25, 
                        "penThickness": 3, 
                        "penColor": "#000000" };
    if(!this.addedevent)
        document.addEventListener('SigCaptureWeb_SignResponse', this.SignResponse.bind(this), false);
        this.addedevent = true;
		var messageData = JSON.stringify(message);
		var element = document.createElement("SigCaptureWeb_ExtnDataElem");
		element.setAttribute("SigCaptureWeb_MsgAttribute", messageData);
		document.documentElement.appendChild(element);
		var evt = document.createEvent("Events");
		evt.initEvent("SigCaptureWeb_SignStartEvent", true, false);				
		element.dispatchEvent(evt);		
    }
	SignResponse(event){

	    var str = event.target.getAttribute("SigCaptureWeb_msgAttri");
		var obj = JSON.parse(str);
        var canvasObj = <HTMLCanvasElement> document.getElementById('cnve');
	    var ctx = canvasObj.getContext('2d');
        var self = this;
			if (obj.errorMsg != null && obj.errorMsg!="" && obj.errorMsg!="undefined")
			{
                //alert(obj.errorMsg);
            }
            else
			{   this.isSigned = obj.isSigned;
                if (obj.isSigned)
				{
					var img = new Image();
					img.onload = function () 
					{
                        ctx.drawImage(img, 0, 0, 540, 120);
					}
					img.src = "data:image/png;base64," + obj.imageData;
                }
            }
    }
    
    

}
