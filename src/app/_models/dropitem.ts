import { DropStatus } from './drop-status';
import { Shop } from './shop';

export class Dropitem {
    id: number;
    is_paid: boolean;
    is_other_pick: boolean;
    item_name: string;
    item_description: string;
    item_type: string;
    item_size: string;
    other_person_name: string;
    other_person_phone: string;
    item_tag_number: string;
    item_drop_number: string;
    release_number: string;
    hours_stored: number;
    base_cost: number;
    total_cost_paid: number;
    total_commission_paid: number;
    payment_required: boolean;
    total_cost: number;
    total_cost_unpaid: number;
    pick_date: any;
    date_picked: any;
    accept_date: any;
    status_date: any;
    status: DropStatus;
    shop: Shop;
    user: any;
}
