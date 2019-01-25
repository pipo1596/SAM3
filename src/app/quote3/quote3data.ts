import { Headerdata } from "../header/headerdata";

export class Quote3data{
     head = new Headerdata ;
     body = new bodyData;
}

export class bodyData{

pagemode : string = "";
    mode : string = "SAVE";
    tabid : string ;
    data : [Data];
coverages : [Cov];
contracts : [Cont];
   chkdf : [any];
   srchg : [Srchg];
  tables : [Tabl];
  states : [State];
     veh : Vehicle;
     dnup : String;
    dspasnew: [string]; 
     tax : number = 0 ;
    code : string = "";
   stock : string = "";
   first : string = "";
    qtid : string = "";
    last : string = "";
 cbfirst : string = "";
  cblast : string = "";
   email : string = "";
   phone : string = "";
    adr1 : string = "";
    adr2 : string = "";
    city : string = "";
   state : string = "";
     zip : string = "";
     mindwn : string = "";
     months : string = "";
     xpc1:boolean;
     xpc2:boolean;
     xpc3:boolean;
     xpc4:boolean;
     xpc5:boolean;
     xm12:boolean;
     xm15:boolean;
     xm18:boolean;
     xm24:boolean;


}

export class Data{
    prg  :string ="";
    ratc :string ="";
    desc :string ="";
    lob  :string ="";
    lobc :string ="";
    showct: boolean = false;
 selected : string =""; 
    ctrct :string ="";
    valu :string="";
    catg :string ="";
    open :boolean =false;
    dflt :boolean =false;
    nup  :string = "";
    dspn :boolean = false;
    dspu :boolean = false;
    dspp :boolean = false;
    cov  = new Coverages;
    trm  = new Terms ;  
    ded  = new Deductibles;
    
}
export class Coverages{
    operation :string="";
    coverages :[any]; 
}

export class Terms{
    operation :string="";
    terms :[any];
}

export class Deductibles{
    operation :string="";
    deductibles :[any];
}
export class Tabl{
    operation :string="";
    rqid:string ="";
    requested:string="";
    errorDetail:string="";
    errmsg:string="";
    prgm:string="";
    ratc:string="";
    showct: boolean = false;
    show : boolean = false;
    dflt : boolean = false;
    valu:number=0;
    catg :string ="";
    ctrct :string ="";
    nup:string="";
    desc : string ="";
    lob : string ="";
    selected:string="";
    rates :[Rate]=[new Rate];
}
export class Rate{
    program  :string="";
    ratc :string="";
    coverage :string="";
    seq :string="";
    title :string="";
    nup :string="";
    surch: [string] = [""];
    check :boolean = false;
    data :[[number]];
    cost :[[[number]]];
    rows :[Term];
    ncbtiers:[ncb];
    cols :[Col];
}
export class ncb{
    prof:number;
    surc:number;
}
export class Term{
    mon:number;
    mil:number;
    check:boolean =false;
}
export class Col{
    ded:number;
    desc:string;
    check:boolean =false;
}
export class Cont{
    code :string="";
    prgm :string="";
    desc :string="";
    catg :string="";
    slob :string="";
    valu :string="";
}
export class Srchg{
    prgm :string="";
    code :string="";
    type :string="";
}
export class State{
    code :string="";
    desc :string=""
}
export class Vehicle{
    name  : string="";
    year  : string="";
    make  : string="";
    model : string="";
    miles : string="";
    lmil  : string="";
    lmth  : string="";
    insrvc: string="";
    price : string="";
    msrp  : string="";
    amfn  : string="";
    vin   : string="";
    rvtype: string="";
    engtyp: string="";
    mfgw  : string="";
}
export class Cov{
    index :string="";
}