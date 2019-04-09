import { Headerdata } from "../header/headerdata";

export class Quote1data{
     head = new Headerdata ;
     body = new bodyData;
}

export class bodyData{

    mode    :string = "SAVE";
    dtype   :string ;
    tabid   :string ;
    dtypc   :string ;
    dyear   :string ;
    dnup    :string ;
    type    :string ;
    typc    :string ;
    pln    = new plans ;
    year    :string ;
    dlno    :string ;
    make    :string ;
    model   :string ;
    vin     :string ;
    rvtype  :string ;
    engtyp  :string ;
    mfgw  :string ;
    miles   :string ;
    price   :string ;
    amfn   :string ;
    msrp   :string ;
    lmth   :string ;
    lmil   :string ;
    insrvc  :string ;
    asofdt  :string ;
    requot  :boolean ;
    ckprgs :[any];
    models  :[model];
    makes   :[make];
    condprg :[any];
    engine :[ENGTYP];
    condyn :boolean;
    dms     : dms;
    dispdms :string;
    nymm :string;
    step:string;
    xrvm:boolean;
    xrvt:boolean;
    xrvp:boolean;
    rm12: boolean;
    rm24: boolean;
    rm36: boolean;
    rm48: boolean;
    rm60: boolean;
    rm72: boolean;
    rm84: boolean;
    rmnn: boolean;
    rvmn: string;

}

export class plans{
    operation  : string;
    plans  : [any] ;
}

export class model{
    model :string;
    desc  :string;
}

export class make{
    make  :string;
    desc  :string;
}
export class ENGTYP{
    key  :string;
    desc  :string;
}

export class dms{
    year  :string;
    make  :string;
    model :string;
    vin   :string;
    miles :string;
    insrvc:string;
}

export class Data1{
    data : [Data];
}

export class Data{
    prg  :string ="";
    ratc :string ="";
    lobc :string ="";
    desc :string ="";
    showct: boolean = false;
    hasoc:boolean=false;
    ctrct :string ="";
    valu :string="";
    catg :string="";
    open :boolean =false;
    dflt: boolean = false;
    mesg :string = "";
    cov  = new Coverages;
    trm  = new Terms ;  
}
export class Coverages{
    operation :string="";
    coverages :[any]; 
}

export class Terms{
    operation :string="";
    terms :[any];
}