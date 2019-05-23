import {Headerdata} from "../header/headerdata";

export class Overridedata{
    head = new Headerdata ;
	overrides :[ Ovrd ];
	lobs:[Drp]
	cmpcs:[Drp]
}
export class Drp{
	key : string;
	val : string;
}
export class Ovrd{
	mode : string;
	cmpc : string;
	srky : string;
	srky2 : string;
	form : string;
	prg  : string;
	srkyi: string;
	desc : string;
	dsc3 : string;
	qdsc : string;
	desci: string;
	lob  : string;
	dlr  : string;
	dlri : string;
	type : string;
	belg : boolean;
	bullets:[Bullet]
	
	public default(mode){
		this.mode = mode;
		this.srky = "";
		this.srky2 = "";
		this.form = "";
		this.desc = "";
		this.qdsc = "";
		this.dlr  = "";
		this.prg  = "";
		this.lob  = "";
		this.belg  = false;
		this.bullets = [{desc:"",seq:"",dscx:""}]
	}
}

export class Bullet{
	desc: String;
	seq : String;
	dscx: String;

}