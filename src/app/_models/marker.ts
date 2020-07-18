export interface Marker {
    title: string;
	lat: number;
	lng: number;
	label?: string;
    draggable: boolean;
    icon?: string;
    animation?: any;
    clickable: boolean;
    shop_id?: string;
}
