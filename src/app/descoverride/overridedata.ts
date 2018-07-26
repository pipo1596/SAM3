import {Headerdata} from "../header/headerdata";

export class Overridedata{
    head = new Headerdata ;
    overrides :[ Ovrd ];
}

export class Ovrd{
	mode : string;
	srky : string;
	prg  : string;
	srkyi: string;
	desc : string;
	desci: string;
	dlr  : string;
	dlri : string;
	type : string;
	public default(mode){
		this.mode = mode;
		this.srky = "";
		this.desc = "";
		this.dlr  = "";
	}
}