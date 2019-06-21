import {Headerdata} from "../header/headerdata";

export class Usersdata{
    public head = new Headerdata ;
    public ingrp :boolean= false;
    public users :[ User ];
    public roles :[ Role ];
    public comp: [Key];
}

export class Role{
    rlno : string;
    rold : string;
}

export  class User{
    mode : string;
    smode: boolean;
    user : string;
    useri : string;
    dlrc : string;
    agrp : string;
    stat : string;
    rlno : string;
    cmpc : string;
    rold : string;
    fnam : string;
    lnam : string;
    mmid : string;
    sprs : string;
    disc : string;
    slcd : string;
    pswd : string;  
    dlr  : [ Dlr ];
    slcds : [ Slc ];
    
}

export class Dlr{
    dlri : string;
    desc : string;
}
export class Key{
    key : string;
    val : string;
}
export class Slc{
    code : string;
}

