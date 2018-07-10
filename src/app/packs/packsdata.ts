import {Headerdata} from "../header/headerdata";

export class Packsdata{
          head = new Headerdata ;
          packs :[ Pack ];
          dprg  : string ;
          prgdrop = new RateCards;
          covdrop = new Coverages;
          trm   = new Terms ; 
}

export class RateCards{
  ratecards :[any];
}
export class Coverages{
  operation :string="";
  coverages :[any]; 
}
export class Terms{
  operation :string="";
  terms :[any];
}

export class Pack{
           mode: string ;
           prg : string;
           cov : string;
          term : string;
           nub : string;
          mino : number;
          upmi : number;
          amti : number;
          amtc : number;
          amtr : number;
          pcti : number;
          pctr : number;
          effd : string;
          expd : string;
          pkno : string;

          public default(mode){
            this.mode  = mode;
            this.prg   = "";
            this.cov   = "";
            this.term  = "";
            this.nub   = "";
            this.mino  = null;
            this.upmi  = null;
            this.amti  = null;
            this.amtc  = null;
            this.amtr  = null;
            this.pcti  = null;
            this.pctr  = null;
            this.effd  = "";
            this.expd  = "";
            this.pkno  = "";
        }
           
}