import {Headerdata} from "../header/headerdata";

export class Repairsdata{
    head = new Headerdata ;
    rows :[ Row ];
    states : [State];
}

export class Row {
    show: string;
    name: string;
   add1 : string;
   city : string;
     st : string;
    zip : string;
    phn : string;
}

export class State{
    code :string="";
    desc :string=""
}

