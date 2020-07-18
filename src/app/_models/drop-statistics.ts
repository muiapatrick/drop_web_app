import { WeeklyStats } from './weekly-stats';

export class DropStatistics {
    new_dropping: number = 0;
    accepted_items: number = 0;
    release_requests: number = 0;
    total_earning: number = 0;
    shop_earning: number = 0;
    drop_earning: number = 0;
    weekly_accepted_items: number = 0;
    weekly_release_requests: number = 0;
    weekly_unpicked_requests: number = 0;
    Weekly_total_earning: number = 0;
    Weekly_shop_earning: number = 0;
    Weekly_drop_earning: number = 0;
    weekly_stats: WeeklyStats[] = [];
    stored_items:number = 0;
}