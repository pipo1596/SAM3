import {Headerdata} from "../header/headerdata";

export class Remitteddata{
    head = new Headerdata ;
	contracts :[ Cont ];
	states : [State];
    ttlpgs = new PageCount;
}

export class Readnextdata {
	contracts :[ Cont ];
	ttlpgs = new PageCount;
}

export class State{
    code :string="";
    desc :string=""
}

export class Cont {
	show : boolean;
	ivno : string;
	ionov : string;
	ionoc : string;
	ionoz : string;
	ecno : string;
	anum : string;
	lhfi : string;
	asuf : string;
	fnam : string;
	lnam : string;
	cfnm : string;
	clnm : string;
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