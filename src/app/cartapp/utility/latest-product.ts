interface LatestProd {
    id:number;
    no:number;
    equipment:string;
    brand:string;
    price:number;
}

export interface LatestProduct {
    type:string;
    product:LatestProd | any
}
