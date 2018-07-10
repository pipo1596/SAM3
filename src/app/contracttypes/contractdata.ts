import {Headerdata} from "../header/headerdata";

export class Contractdata{
    head = new Headerdata ;
    contracts :[ Cont ];
    categories :[ Drp ];
    programs = new Prg ;
}

export class Drp{
    key : string;
    desc : string;
}

export class Prg{
    operation  : string;
    plans  : [any] ;
}

export  class Cont{
    mode : string;
    code : string;
    codei: string;
    desc : string;
    catg : string;
    catgd: string;
    valu : number;
    prgm : string;
    prgmd: string;
    public default(mode){
        this.mode = mode;
        this.code = "";
        this.desc = "";
        this.catg = "";
        this.catgd = "";
        this.valu = null;
        this.prgm = "";
        this.prgmd = "";
    }
}