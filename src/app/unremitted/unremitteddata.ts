import {Headerdata} from "../header/headerdata";

export class Unremitteddata{
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
	ionov : string;
	ionoc : string;
	ionoz : string;
	ecno : string;
	asuf : string;
	anum : string;
	fnam : string;
	lhfi : string;
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