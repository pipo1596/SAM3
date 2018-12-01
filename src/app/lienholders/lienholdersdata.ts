import {Headerdata} from "../header/headerdata";

export class Lienholdersdata{
	head = new Headerdata ;
	states : [State];
    filters :[ Lienh ];
}

export class Lienh{
	mode  : string;
	name  : string;
	namei : string;
	adr1  : string;
	city  : string;
	sta   : string;
	zip   : string;
	phon  : string;
	public default(mode){
		this.mode = mode;
		this.name = "";
		this.adr1 = "";
		this.city = "";
		this.namei= "";
		this.sta = "";
		this.zip = "";
		this.phon = "";
	}
}

export class State{
    code :string="";
    desc :string=""
}