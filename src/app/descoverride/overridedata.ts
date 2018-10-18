import {Headerdata} from "../header/headerdata";

export class Overridedata{
    head = new Headerdata ;
	overrides :[ Ovrd ];
	lobs:[Lob]
}
export class Lob{
	key : string;
	val : string;
}
export class Ovrd{
	mode : string;
	srky : string;
	srky2 : string;
	prg  : string;
	srkyi: string;
	desc : string;
	desci: string;
	lob  : string;
	dlr  : string;
	dlri : string;
	type : string;
	
	public default(mode){
		this.mode = mode;
		this.srky = "";
		this.srky2 = "";
		this.desc = "";
		this.dlr  = "";
		this.prg  = "";
		this.lob  = "";
	}
}