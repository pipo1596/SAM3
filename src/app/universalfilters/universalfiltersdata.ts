import {Headerdata} from "../header/headerdata";

export class Universalfiltersdata{
    head = new Headerdata ;
    filters :[ Cov ];
}

export class Cov{
	mode : string;
	cov  : string;
	covi : string;
	public default(mode){
		this.mode = mode;
		this.cov = "";
	}
}