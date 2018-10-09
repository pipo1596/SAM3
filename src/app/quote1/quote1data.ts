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
    insrvc  :string ;
    asofdt  :string ;
    ckprgs :[any];
    models  :[model];
    makes   :[make];
    condprg :[any];
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

export class dms{
    year  :string;
    make  :string;
    model :string;
    vin   :string;
    miles :string;
    insrvc:string;
}