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
    codei: string;
    desc : string;
    catg : string;
    catgd: string;
    valu : number;
    prgm : string;
    prgmd: string;
    dflt : boolean;
    sepr : boolean;
    public default(mode){
        this.mode = mode;
        this.desc = "";
        this.catg = "";
        this.catgd = "";
        this.valu = null;
        this.prgm = "";
        this.prgmd = "";
        this.sepr = false;
    }
}
export  class Conte{
    mode : string;
    desc : string;
    catg : string;
    catgd: string;
    valu : number;
    prgm : [any];
    prgmd: string;
    public default(mode){
        this.mode = mode;
        this.desc = "";
        this.catg = "";
        this.catgd = ""; 
        this.valu = null;
        this.prgm = [''];
        this.prgmd = "";
    }
}