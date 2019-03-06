import {Headerdata} from "../header/headerdata";

export class InvoicePaymentdata{
          head = new Headerdata ;
          body = new bodyData;
}
export class bodyData{
           invo: [INVO] ;
           totl: number;
           name: string;
           code: string;
           paymnt:[mehtod]
}
export class INVO{
    ivno: string;
    amnt: number;
}
export class mehtod{
    nick: string;
    prof: string;
    four: string;
}