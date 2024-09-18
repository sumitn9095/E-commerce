export class CommonConstants {
    public static user(){
        if(typeof window !== "undefined") return JSON.parse(sessionStorage.getItem("shop_user_details") as any);
    }
    public static orderId() {
        if(typeof window !== "undefined") return sessionStorage.getItem("shop_orderId") as any;
    }

    public static categoriez(){
        return ['Laptop','Computer','Water Heater','Television','Fan','Chair','Clothes'];
    }
}