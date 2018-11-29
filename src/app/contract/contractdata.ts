import { Headerdata } from "../header/headerdata";

export class Contractdata{
     head = new Headerdata ;
     body = new bodyData;
}

export class bodyData{

     mode : string = "SAVE";
      veh : Vehicle;
 contract : Cont;
     dnup : String;
 dspasnew : [string];
   states : [State];
    srchg : [Srchg];
   fields : [Field];
lienholders : [Drp];
}

export class Cont{
        mode : string = "";
        tabid : string;
        //Single contract
        contracts : [Single];
        // prg : string = "";
        // cov : string = "";
        // cvds: string = "";
        // ded : string = "";
        //cvmn : string = "";
        //cvml : string = "";
        //term : string = "";
        // nup : string = "";
        // tax : string = "";
        //ccst : string = "";
        //covc : string = "";
        //End Single Contract
        txrt : string = "";
       stock : string = "";
       first : string = "";
        last : string = "";
     cbfirst : string = "";
      cblast : string = "";
       email : string = "";
       phone : string = "";
       addr1 : string = "";
       addr2 : string = "";
       state : string = "";
        city : string = "";
         zip : string = "";
         vpd : string = ""; 
         vin : string = ""; 
         cpd : string = "";
        lhfi : string = "";
        //Paylink
     payment : string = "";
       ccnam : string = "";
       ccnum : string = "";
       ccexp : string = "";
       cccvv : string = "";
     achbank : string = "";
     achrotn : string = "";
     achacno : string = "";
     achchek : string = "";
      months : string = "";
      totalp : string = "";
      mthlyp : string = "";
      downpm : string = "";
          on : string ="Y"
}

export class Vehicle{
    type  : string = "";
    year  : string = "";
    make  : string = "";
    model : string = "";
    miles : string = "";
    insrvc: string = "";
    price : string = "";
    vin   : string = "";
     mmth : number = 0 ;
     mmil : number = 0 ;
     pmth : number = 0 ;
     pmil : number = 0 ;
    rvtype: string="";
    engtyp: string="";
    mfgw  : string="";
}

export class State{
    code :string="";
    desc :string=""
}

export class Srchg{
    code :string="";
    type :string=""
}

export class VindData{
    status  : string="";
    message : string="";
    vfmatch : string="";
       mmth : number = 0 ;
       mmil : number = 0 ;
       pmth : number = 0 ;
       pmil : number = 0 ;
}

export class Field{
         seq : string="";
        labl : string="";
        type : string="" ;
        prec : string = "" ;
        size : number = 0 ;
        name : string="" ;
        data : [Drp];
       value : string="" ;
     message : string = "" ;
     erlevel : string = "" ;
}
export class Single{
    ratc : string = "";
    prg : string = "";
    cov : string = "";
    cvds: string = "";
    ded : string = "";
   cvmn : string = "";
   cvml : string = "";
   term : string = "";
    nup : string = "";
    tax : string = "";
   ccst : string = "";
   xtr7 : string = "";
   covc : string = "";
}

export class Drp{
    code : string = "";
    desc : string = "";
}
