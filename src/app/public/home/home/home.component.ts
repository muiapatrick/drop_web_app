import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isSign = false;

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  public signup() {
    this._router.navigate(["register"]);
  }

}
