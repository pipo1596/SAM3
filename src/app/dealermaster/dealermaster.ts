import {Headerdata} from "../header/headerdata";

export class MasterDealerData{
  head = new Headerdata ;
  body : Body ;
  
}

export class Body{
	mode : string;
	dsmd : string;
	belg : boolean;
	dbil : boolean;
	nymm : boolean;
	lck1 : boolean;
	user : string;
	type : string;
	dsid : string;
	pack : string;
	pass : string;
	mmid : string;
	sigm : string;
	drop :[ Drp ];
}

export class Drp{
  key : string;
  desc : string;
}