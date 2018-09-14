import {Headerdata} from "../header/headerdata";
import { bodyData } from "../globalfilters/filtersdata";

export class Usersdata{
    public head = new Headerdata ;
    public ingrp :boolean= false;
    public users :[ User ];
    public roles :[ Role ];
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
    agrp : string;
    stat : string;
    rlno : string;
    rold : string;
    fnam : string;
    lnam : string;
    sprs : string;
    disc : string;
    slcd : string;
    pswd : string;  
    dlr  : [ Dlr ];
}

export class Dlr{
    dlri : string;
    desc : string;
}

