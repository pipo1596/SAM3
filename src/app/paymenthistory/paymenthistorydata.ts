import {Headerdata} from "../header/headerdata";

export class PaymentHistorydata{
    head = new Headerdata ;
    payments :[ Lginv ];
    ttlpgs = new PageCount;
}

export class Readnextdata {
	payments :[ Lginv ];
	ttlpgs = new PageCount;
}

export class Lginv {
	show : boolean;
	phno : string;
	nick : string;
	type : string;
	typi : string;
	iden : string;
	four : string;
	comm : string;
	date : string;
	atch : string;
	dati : string;
	conf : string;
	dlrc : string;
	dlrn : string;
	user : string;
	totl : string;	
	detl : [pdrec]
}

export class pdrec {
	ivno : string;
	totl : string;
}
export class PageCount {
	cnt : string;
	lstrec: string;
}