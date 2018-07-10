import {Headerdata} from "../header/headerdata";

export class Usersdata{
    public head = new Headerdata ;
    public users :[ User ];
    public roles :[ Role ];
}

export class Role{
    rlno : string;
    rold : string;
}

export  class User{
    mode : string;
    user : string;
    useri : string;
    rlno : string;
    rold : string;
    fnam : string;
    lnam : string;
    sprs : string;
    pswd : string;  
    dlr  : [ Dlr ];
}

export class Dlr{
    dlri : string;
    desc : string;
}

