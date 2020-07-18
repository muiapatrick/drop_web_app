import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { AuthService } from 'src/app/_providers/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'side-bar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private $BODY;
  private $MENU_TOGGLE;
  private $SIDEBAR_MENU;
  private $SIDEBAR_FOOTER;
  private $LEFT_COL;
  private $RIGHT_COL;
  private $NAV_MENU;
  private $FOOTER;  

  constructor(private _authService : AuthService, private _router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.plot();
  }

  anchorClicked(elementId: any, routeTo?:string) {    
      console.log("CLICKED ELEMENT ID :: "+elementId);
  
      let $li = $("#" + elementId.replace("chevron", "li")).parent();
  
      if ($li.is(".active")) {
        $li.removeClass("active active-sm");
        $("ul:first", $li).slideUp(function() {});
      } else {
        // prevent closing menu if we are on child menu
        if (!$li.parent().is(".child_menu")) {
          $("#sidebar-menu")
            .find("li")
            .removeClass("active active-sm");
          $("#sidebar-menu")
            .find("li ul")
            .slideUp();

          console.log($li);
        }
  
        $li.addClass("active");
  
        $("ul:first", $li).slideDown(function() {});
    }
    if(routeTo != null && routeTo != undefined) {
      this._router.navigate([routeTo]);
    }
  }

  itemClicked() {
    // $li.removeClass("active active-sm");
    //     $("ul:first", $li).slideUp(function() {});

  }
  

  plot() {
    console.log("in sidebar");

    this.$BODY = $("body");
    this.$MENU_TOGGLE = $("#menu_toggle");
    this.$SIDEBAR_MENU = $("#sidebar-menu");
    this.$SIDEBAR_FOOTER = $(".sidebar-footer");
    this.$LEFT_COL = $(".left_col");
    this.$RIGHT_COL = $(".right_col");
    this.$NAV_MENU = $(".nav_menu");
    this.$FOOTER = $("footer");

    let $a = this.$SIDEBAR_MENU.find("a");
    this.$SIDEBAR_MENU.find("a").on("click", function(ev) {
      let $li = $(this).parent();

      if ($li.is(".active")) {
        $li.removeClass("active active-sm");
        $("ul:first", $li).slideUp(function() {
          this.setContentHeight();
        });
      } else {
        // prevent closing menu if we are on child menu
        if (!$li.parent().is(".child_menu")) {
          this.$SIDEBAR_MENU.find("li").removeClass("active active-sm");
          this.$SIDEBAR_MENU.find("li ul").slideUp();
        }

        $li.addClass("active");

        $("ul:first", $li).slideDown(function() {
          this.setContentHeight();
        });
      }
    });

    // toggle small or large menu
    this.$MENU_TOGGLE.on("click", function() {
      if (this.$BODY.hasClass("nav-md")) {
        this.$SIDEBAR_MENU.find("li.active ul").hide();
        this.$SIDEBAR_MENU
          .find("li.active")
          .addClass("active-sm")
          .removeClass("active");
      } else {
        this.$SIDEBAR_MENU.find("li.active-sm ul").show();
        this.$SIDEBAR_MENU
          .find("li.active-sm")
          .addClass("active")
          .removeClass("active-sm");
      }

      this.$BODY.toggleClass("nav-md nav-sm");

      this.setContentHeight();
    });
  }

  setContentHeight() {
    // reset height
    this.$RIGHT_COL.css("min-height", $(window).height());

    const bodyHeight = this.$BODY.outerHeight();
    const footerHeight = this.$BODY.hasClass("footer_fixed") ? -10 : this.$FOOTER.height();
    const leftColHeight = this.$LEFT_COL.eq(1).height() + this.$SIDEBAR_FOOTER.height();
    let contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

    // normalize content
    contentHeight -= this.$NAV_MENU.height() + footerHeight;

    this.$RIGHT_COL.css("min-height", contentHeight);
  }

  logout() {
    this._authService.logout();
  }

  
}
