import {Headerdata} from "../header/headerdata";

export class Lienholdersdata{
    head = new Headerdata ;
    filters :[ Lienh ];
}

export class Lienh{
	mode  : string;
	name  : string;
	namei : string;
	public default(mode){
		this.mode = mode;
		this.name = "";
	}
}