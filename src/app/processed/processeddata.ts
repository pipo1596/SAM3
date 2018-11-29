import {Headerdata} from "../header/headerdata";

export class Processeddata{
    head = new Headerdata ;
	contracts :[ Cont ];
	states : [State];
}

export class Readnextdata {
	contracts :[ Cont ];
}
export class State{
    code :string="";
    desc :string=""
}
export class Cont {
	show : boolean;
	rst : string;
	ofn : string;
	oln : string;
	anum : string;
	asuf : string;
	vin : string;
	yr : string;
	dlr : string;
	manf : string;
}

