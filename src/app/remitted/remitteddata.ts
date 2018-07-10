import {Headerdata} from "../header/headerdata";

export class Remitteddata{
    head = new Headerdata ;
    contracts :[ Cont ];
    ttlpgs = new PageCount;
}

export class Readnextdata {
	contracts :[ Cont ];
	ttlpgs = new PageCount;
}

export class Cont {
	show : boolean;
	ivno : string;
	iono : string;
	ecno : string;
	anum : string;
	fnam : string;
	lnam : string;
	sprs : string;
	stck : string;
	ctdt : string;
	year : string;
	make : string;
	modl : string;
	ctdti: string;
	selected: boolean;
}

export class PageCount {
	cnt : string;
	lstrec: string;
}