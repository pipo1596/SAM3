import {Headerdata} from "../header/headerdata";

export class Produceranalysisdata{
    head = new Headerdata ;
    records :[ Rec ];
    ttlpgs = new PageCount;
}

export class Readnextdata {
	records :[ Rec ];
	ttlpgs = new PageCount;
}

export class Rec {
	  show : boolean;
	  perd : string;
	  stat : string;
	  dlrn : string;
	  dlrc : string;
	  cprc : string;
	  cpnd : string;
	  cdnd : string;
	  clmp : string;
	  clmd : string;
	  clmo : string;
}

export class PageCount {
	cnt : string;
	lstrec: string;
}