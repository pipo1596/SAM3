import {Headerdata} from "../header/headerdata";

export class Paymentmethodsdata{
	head = new Headerdata ;
    methods :[ Method ];
}

export class Method{
	mode  : string;
	dflt  : boolean;
	prof  : string;
	name  : string;
	type  : string;
	rout  : string;
	acno  : string;
	acnc  : string;
	four  : string;
	nick  : string;
	public default(mode){
		this.mode = mode;
		this.prof = "";
		this.nick = "";
		this.name = "";
		this.type = "";
		this.rout = "";
		this.acno = "";
		this.acnc = "";
		this.four = "";
		this.dflt = false;
	}
}
