import { Directive } from '@angular/core';

@Directive({
  selector: '[appSidebarContainer]'
})
export class SidebarContainerDirective {

  constructor() { }

}

@Directive({
  selector: 'appSideBar'
})
export class SidebarDirective {
  
  constructor() {}

}


