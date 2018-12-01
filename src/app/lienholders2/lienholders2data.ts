import {Headerdata} from "../header/headerdata";

export class Lienholders2data{
	head = new Headerdata ;
	states : [State];
    filters :[ Lienh ];
}

export class Lienh{
	mode  : string;
	chek  : boolean;
	dlr   : string;
	lhno  : string;
	adr1  : string;
	city  : string;
	sta   : string;
	zip   : string;
	phon  : string;
	name  : string;
	namei : string;
	public default(mode){
		this.mode = mode;
		this.name = "";
		this.adr1 = "";
		this.city = "";
		this.namei= "";
		this.sta = "";
		this.zip = "";
		this.phon = "";
		this.dlr  = "";
		this.namei = "";
		this.chek = false;
		this.lhno = "";
	}
}
export class State{
    code :string="";
    desc :string=""
}