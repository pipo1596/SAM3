import { Headerdata } from "../header/headerdata";

export class Covsequencedata{
    public head = new Headerdata ;
    public body = new bodyData;
}

export class bodyData{
     mode :string ="SAVE";
     cmpc :string ="INT";
     prg  :string ="";
     comp :[Drp];
     prgs  :[Drp];
     cov  :[Covr];
}

export class Drp{
    key :string="";
    val :string="";
}

export class Covr{
    key :string="";
    val :string="";
    lck :boolean = false;
    seq :string="";
}


