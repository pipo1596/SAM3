import { Headerdata } from "../header/headerdata";

export class Quote3data{
     head = new Headerdata ;
     body = new bodyData;
}

export class bodyData{

pagemode : string = "";
    mode : string = "SAVE";
    data : [Data];
coverages : [Cov];
contracts : [Cont];
   chkdf : [any];
   srchg : [Srchg];
  tables : [Tabl];
  states : [State];
     veh : Vehicle;
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
}

export class Data{
    prg  :string ="";
    ratc :string ="";
    desc :string ="";
    lob  :string ="";
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
    title :string="";
    nup :string="";
    surch: [string] = [""];
    check :boolean = false;
    data :[[[number]]];
    rows :[Term];
    cols :[Col];
}
export class Term{
    mon:number;
    mil:number;
    check:boolean =false;
}
export class Col{
    ded:number;
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
    code :string="";
    type :string=""
}
export class State{
    code :string="";
    desc :string=""
}
export class Vehicle{
    year  : string="";
    make  : string="";
    model : string="";
    miles : string="";
    insrvc: string="";
    price : string="";
    vin   : string="";
    rvtype: string="";
    engtyp: string="";
    mfgw  : string="";
}
export class Cov{
    index :string="";
}