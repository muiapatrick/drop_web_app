import { FirePoint } from 'geofirex';

export class NearestShop {
    id: string;
    shop_name: string;
    g?: string;
    l?: any;
    position?: any;
    shop_location?:string;
    phone_number?:string;
    distance?:string;
    latitude?:number;
    longitude?:number;
    is_open?:boolean;

    constructor(shop_name: string, g?: string, l?: any, position?: any) {}
}
