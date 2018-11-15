import { Headerdata } from "../header/headerdata";

export class Filtersdata{
    public head = new Headerdata ;
    public body = new bodyData;
}

export class bodyData{
    public mode ="SAVE";
    public ratc = "";
    public termp = "";
    public drop = new RateCards;
    public cov  = new Coverages;
    public trm  = new Terms ;  
    public ded  = new Deductibles;
}


export class RateCards{
    ratecards :[any];
}
export class Coverages{
    operation :string="";
    coveragesf :[any]; 
}

export class Terms{
    operation :string="";
    terms :[any];
}

export class Deductibles{
    operation :string="";
    deductibles :[any];
}


