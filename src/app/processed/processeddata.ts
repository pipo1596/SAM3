import {Headerdata} from "../header/headerdata";

export class Processeddata{
    head = new Headerdata ;
    contracts :[ Cont ];
}

export class Readnextdata {
	contracts :[ Cont ];
}

export class Cont {
	show : boolean;
	ofn : string;
	oln : string;
	anum : string;
	asuf : string;
	vin : string;
	yr : string;
	manf : string;
}

