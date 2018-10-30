import {Headerdata} from "../header/headerdata";

export class Legacycontractsdata{
    head = new Headerdata ;
    lcontracts :[ Lginv ];
    ttlpgs = new PageCount;
}

export class Readnextdata {
	lcontracts :[ Lginv ];
	ttlpgs = new PageCount;
}

export class Lginv {
	show : boolean;
	anum : string;
	asuf : string;
	date : string;
	datei: string;
	ccst : string;	
}

export class PageCount {
	cnt : string;
	lstrec: string;
}