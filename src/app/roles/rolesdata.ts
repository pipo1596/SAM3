import { Headerdata } from "../header/headerdata";

export class Rolesdata{
    public head         = new Headerdata ;
    public tableroles   : [ Auth ];
    public roles        : [ Role ];
    public canedit      : boolean = false;
}

export class Role{
    mode    : string ;
    rlno    : string ;
    desc    : string ;
    dscx    : string ;
    dscxi   : string;
    type    : string;
    autharr : [Auth];
}

export class Auth{
    auth : string;
    desc : string;
    chek : string;
}