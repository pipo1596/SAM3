import {Headerdata} from "../header/headerdata";

export class Legacyinvoicesdata{
    head = new Headerdata ;
    linvoices :[ Lginv ];
    ttlpgs = new PageCount;
}

export class Readnextdata {
	linvoices :[ Lginv ];
	ttlpgs = new PageCount;
}

export class Lginv {
	show : boolean;
	ivno : string;
	ivdt : string;
	ivdti : string;
	trdt : string;
	cost : string;	
}

export class PageCount {
	cnt : string;
	lstrec: string;
}