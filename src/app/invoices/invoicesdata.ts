import {Headerdata} from "../header/headerdata";

export class Invoicesdata{
    head = new Headerdata ;
    invoices :[ Inv ];
    ttlpgs = new PageCount;
}

export class Readnextdata {
	invoices :[ Inv ];
	ttlpgs = new PageCount;
}

export class Inv {
	show : boolean;
	ivno : string;
	ivdt : string;
	ivdd : string;
	amnt : string;
	selected: boolean;
}

export class PageCount {
	cnt : string;
	lstrec: string;
}