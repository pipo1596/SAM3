import { Headerdata } from "../header/headerdata";

export class Quote1data{
     head = new Headerdata ;
     body = new bodyData;
}

export class bodyData{

    mode    :string = "SAVE";
    dtype   :string ;
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
    step:string;

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