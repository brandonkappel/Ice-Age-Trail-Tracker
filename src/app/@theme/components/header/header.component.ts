import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, take } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { GDS } from '../../../effortless/services/gds.service';
import { NbAuthService, NbAuthJWTToken } from '../../../@core/auth';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  isAuthenticated: boolean;
  tokenTime;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';
  userMenu = []

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private authService: NbAuthService,
              public gds: GDS) {


                this.gds.onReady().pipe(take(1)).subscribe(ready => {
                  console.error("GDS READINESS", this.gds.whoAmI);
                  this.userMenu = [ { title: 'Profile', link: '/effortless/profile', hidden: !this.gds.whoAmI }, { title: this.gds.whoAmI ? 'Log out' : 'Log in', link: this.gds.whoAmI ? '/auth/logout' : '/auth/login' } ];
                })

                this.authService.onAuthenticationChange()
                .subscribe(value => {
                  this.isAuthenticated = value;
                  console.error('authentication changed', value, this.gds.whoAmI);
                  this.userMenu = [ { title: 'Profile', link: '/effortless/profile', hidden: !this.gds.whoAmI }, { title: this.gds.whoAmI ? 'Log out' : 'Log in', link: this.gds.whoAmI ? '/auth/logout' : '/auth/login' } ];
                });
          
                this.authService.onTokenChange()
                .subscribe((token: NbAuthJWTToken) => {
                  if (token.isValid()) {
                    let start = Math.floor((token.getTokenExpDate().getTime()-Date.now())/1000);
                    timer(1000, 1000).pipe
                    (map(i => start - i)).pipe(take(start + 1))
                    .subscribe(i => this.tokenTime=(i-(i%=60))/60+(9<i?':':':0')+i);
                  }
                  this.userMenu = [ { title: 'Profile', link: '/effortless/profile', hidden: !this.gds.whoAmI }, { title: this.gds.whoAmI ? 'Log out' : 'Log in', link: this.gds.whoAmI ? '/auth/logout' : '/auth/login' } ];
                });

  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
      

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
