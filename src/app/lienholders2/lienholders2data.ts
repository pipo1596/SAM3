import {Headerdata} from "../header/headerdata";

export class Lienholders2data{
    head = new Headerdata ;
    filters :[ Lienh ];
}

export class Lienh{
	mode  : string;
	chek  : boolean;
	dlr   : string;
	lhno  : string;
	name  : string;
	namei : string;
	public default(mode){
		this.mode = mode;
		this.name = "";
		this.dlr  = "";
		this.namei = "";
		this.chek = false;
		this.lhno = "";
	}
}