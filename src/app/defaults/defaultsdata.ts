import {Headerdata} from "../header/headerdata";

export class Defaultsdata{
          head = new Headerdata ;
          body = new bodyData;
}
export class bodyData{
            mode: string ;
            perc: string;
            ancl: string;
            rvtp: string;
            plnk: string;
            pymt: string;
            mnth: string; 
            lntp: string; 
            rvmn: string;

            lntpdrp:[Drp];
            plnkon: boolean;
            haslntp: boolean;
            pln:plans;
            
            xptf: boolean;
            xptm: boolean;
            xpta: boolean; 
            xptc: boolean; 
            xpc5: boolean; 
            xpc1: boolean; 
            xpc2: boolean; 
            xpc3: boolean; 
            xpc4: boolean; 
            xm12: boolean; 
            xm15: boolean; 
            xm18: boolean; 
            xm24: boolean;
            rm12: boolean;
            rm24: boolean;
            rm36: boolean;
            rm48: boolean;
            rm60: boolean;
            rm72: boolean;
            rm84: boolean;
            rmnn: boolean; 
            xrvm: boolean; 
            xrvt: boolean; 
            xrvp: boolean;
            dbil: boolean;
            
}

export class Drp{

    key:string;
    val:string;
}

export class plans{
    operation  : string;
    plans  : [any] ;
}