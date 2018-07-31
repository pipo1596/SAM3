import {Headerdata} from "../header/headerdata";

export class Covwarningsdata{
    head = new Headerdata ;
    warnings :[ Warn ];
}

export class Warn{
	mode : string;
	cov  : string;
	dlr  : string;
	covi : string;
	dlri : string;
	wrn : string;
	public default(mode){
		this.mode = mode;
		this.cov = "";
		this.wrn = "";
		this.dlr = "";
	}
}