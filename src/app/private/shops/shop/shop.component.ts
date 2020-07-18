import { Component, OnInit } from '@angular/core';
import { Dropitem } from 'src/app/_models/dropitem';
import { Page } from 'src/app/_models/page';
import { DropService } from 'src/app/_providers/services/drop.service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Shop } from 'src/app/_models/shop';
import { ShopService } from 'src/app/_providers/services/shop.service';
import { UserService } from 'src/app/_providers/services/user.service';
import { User } from 'src/app/_models/user';
import { DropStatistics } from 'src/app/_models/drop-statistics';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IMyOptions, MDBModalService } from 'ng-uikit-pro-standard';
import { formatDate } from '@angular/common';
import { WeeklyStats } from 'src/app/_models/weekly-stats';
import { checkValidNumberic, hasRoleForShop, getShopByShopNo } from 'src/app/_providers/validators/validators';
import { DropActionComponent } from '../../drop/drop-action/drop-action.component';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  modalRef: any;
  today: Date = new Date();
  page: Page = new Page();
  loading: boolean;
  shopNumber: string;
  shop: Shop = new Shop();
  dropShopStats: DropStatistics = new DropStatistics();
  itemList: Dropitem[] = [];
  userList: User[] = [];
  user: User;
  hasShopAdminRole: boolean;
  dateFilterForm: FormGroup;
  chartType: string = 'line';
  chartDatasets: Array<any> = [
    { data: [0, 0, 0, 0, 0, 0, 0], label: 'Drop Requests Handled' }
  ];

  chartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];

  chartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
      }
    ]
    }
  };

  pickDateOptions: IMyOptions = {
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'mo',
    maxYear: this.today.getFullYear(),
    disableSince: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 }
  }

  constructor(private _formBuilder: FormBuilder, private _dropService: DropService, private _shopService: ShopService,
     private _userService: UserService, private _router: Router, private _route: ActivatedRoute,
     private _modalService: MDBModalService) { }

  ngOnInit(): void {
    this.shopNumber = window.location.pathname.split("/").pop();
    // this.shopNumber = this._route.snapshot.paramMap.get('id');
    this.user = this._userService.getAuthenticatedUser();
    if(this.shopNumber != null || this.shopNumber != undefined) {
      this.shop = getShopByShopNo(this.user.shops, this.shopNumber);
      this.hasShopAdminRole = this.shop == null || this.shop == undefined ? false : hasRoleForShop(this.user.roles, 3, this.shop.id);
      this.getShop();
    } 

    this.dateFilterForm = this._formBuilder.group({
      pick_date: ''
    });

    this.dateFilterForm.controls['pick_date'].setValue(this.today);

    this.dateFilterForm.get('pick_date').valueChanges.subscribe(value => {
      this.loading = true;
      this.getShopDropStats();
      this.loading = false;
    });

    if(this.shopNumber == null || this.shopNumber == undefined) {
      this._router.navigate(['/drop/shops']);
    }
    else {
      this.getShopDetails();
    }

    this._modalService.closed.subscribe(() => this.getShopDetails());
  }

  getShopDetails() {
    //get the authenticated user
    this.loading = true;
    this._userService.
    getUsers((this.page.pageNumber).toString(), '1', this.user.id.toString(), null, this.shopNumber, null, null, null)
      .subscribe(res => {
        this.user = res.data[0];
        
        this.shop = getShopByShopNo(this.user.shops, this.shopNumber);
        this.hasShopAdminRole = hasRoleForShop(this.user.roles, 3, this.shop.id);
        this.getShop();
        this.loading = false;
      },
      error => {
        this.loading = false;
    });
  }

  getShop() {
    this._shopService.getShops((this.page.pageNumber).toString(), '1', null, null, null, this.shopNumber)
      .subscribe(res => {
        this.shop = res.data[0];

        //get the drop requests for this shop
        this.getShopDropStats();
        this.getItems();
        this.getShopUsers();
      },
      error => {
    });
  }

  getItems() {
    this.page.size = 5;
    this.itemList = [];
    this._dropService.getItems((this.page.pageNumber).toString(), (this.page.size).toString(), null, this.shop.id.toString(), null, null, null, this.shopNumber)
    .subscribe(res => {
      this.itemList = res.data;
    },
    error => {
    });
  }

  getShopUsers() {
    this.page.size = 5;
    this.userList = [];
    this._userService.
    getUsers((this.page.pageNumber).toString(), (this.page.size).toString(), null, this.shop.id.toString(), this.shopNumber, null, null, null)
      .subscribe(res => {
        this.userList = res.data;
      },
      error => {
    });
  }
  
  getShopDropStats() {
    let selectedDate = new Date(this.dateFilterForm.get('pick_date').value).toISOString();
    this._dropService.getDropStats(this.shop.id.toString(), this.shopNumber, selectedDate)
    .subscribe(res => {
      this.dropShopStats = res.data;
      this.dropShopStats.stored_items = (res.data.accepted_items + res.data.release_requests);
      let weeklyStats: WeeklyStats[] = this.dropShopStats.weekly_stats;

      let dataSet: number [] = [];
      weeklyStats.forEach(element => {
        dataSet.push(element.drop_count);
      });
      
      this.chartDatasets = [
        { data: dataSet, label: 'Drop Requests Handled' }
      ];
    },
    error => {
    });
  }

  itemNumber(index: number) {
    return index + 1;
  }

  chartClicked(e: any): void { }
  chartHovered(e: any): void { }

  openRequests(status?: string) {
    this._dropService.setItemStatus(status != undefined && checkValidNumberic(status).validNumeric? status : '');
  
    this._router.navigate(['items'], {relativeTo: this._route});
  }

  openShopUsers() {
    this._router.navigate(['users'], {relativeTo: this._route});
  }

  openShopProfile() {
    this._router.navigate(['profile'], {relativeTo: this._route});
  }

  viewUser(user: User) {
    this._router.navigate(['users/'+user.user_number], {relativeTo: this._route});
  }

  acceptDeclineItem(action, item) {
    this.modalRef = this._modalService.show(DropActionComponent, 
      {
        backdrop: true, 
        ignoreBackdropClick: true,
        class: 'modal-md cascading-modal',
        data: {
          action: action,
          item: item
        }
      }
    );
  }

}
