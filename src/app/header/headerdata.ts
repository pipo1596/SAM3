export class Headerdata{
    status  : string="N";
       reld : boolean =false;
    fnam    : string ="";
    title    : string ="Loading...";
    lnam    : string="";
    menuOp  : [Menu];
    currloc : string ="";
    currdlr : string ="";
    as400   : boolean = false;
    multi   : boolean = false;
    loctn   : [ Locn ]
    
}

export class Menu{
        key  : string = "";
        desc : string = "";
        type : string = "";
        link : string = "";
}

export class Locn{

        dlr  : string = "";
        desc : string = "";

}