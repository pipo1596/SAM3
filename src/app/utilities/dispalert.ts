export class Dispalert{

     status: string="";
     message: string="";
     data : string ="";
    
    public constructor() {
            this.status = "";
            this.message = "";
            this.data ="";
    }

    public setMessage(obj){
        this.status = obj.status;
        this.message = obj.message;
        if (obj.data !== undefined) {
            this.data = obj.data;
        }else{
            this.data ="";
        }
        
    }
    public default(){
        this.status = "";
        this.message = "";
        this.data ="";
    }
    public error(){
        this.status = "E";
        this.message = "Communication Error please try again!";
        this.data ="";
    }
}

export class Errsetter{
     status: string="";
     message: string="";
     data : string ="";
}