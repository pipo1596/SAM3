import {Headerdata} from "../header/headerdata";

export class Packsdata{
          head = new Headerdata ;
          packs :[ Pack ];
          dprg  : string ;
          cmpc  : string ;
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
           show: boolean ;
           mode: string ;
           prgd : string;
           prg : string;
           cov : string;
          covd : string;
          term : string;
          cvmn : string;
          cvml : string;
           nub : string;
          mino : number;
          upmi : number;
          amti : number;
          amtc : number;
          amtr : number;
          pcti : number;
          pctr : number;
          effd : string;
          efdd : string;
          effdi: string;
          expd : string;
          exdd : string;
          expdi: string;
          pkno : string;
          sepr : boolean;

          public default(mode){
            this.show  = false;
            this.mode  = mode;
            this.prg   = "";
            this.prgd   = "";
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
            this.effdi  = "";
            this.expd  = "";
            this.pkno  = "";
            this.sepr  = false;
        }
           
}