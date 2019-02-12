import {Headerdata} from "../../header/headerdata";

export class Savedquotesedata{
    head = new Headerdata ;
    squotes :[ SvdQT ];
    ttlpgs = new PageCount;
}

export class Readnextdata {
	squotes :[ SvdQT ];
	ttlpgs = new PageCount;
}

export class SvdQT {
	show : boolean;
	qtid : string;
	fnam : string;
	lnam : string;
	sprs : string;
	stck : string;
	qtdt : string;
	qttm : string;
	year : string;
	make : string;
	model: string;
	qtdti: string;
	vin  : string;
	selected: boolean;
}

export class PageCount {
	cnt : string;
	lstrec: string;
}