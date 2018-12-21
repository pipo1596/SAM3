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
           mnth: string; 
           lntp: string; 
           lhno: string; 
           lntpdrp:[Drp];
           lienholders:[Drp];
}

export class Drp{

    key:string;
    val:string;
}