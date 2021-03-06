import { RouterModule, Routes } from '@angular/router';
import { Component, NgModule } from '@angular/core';

import { EffortlessComponent } from './effortless.component';
import { Page1Component } from './page1/page1.component';
import { DerivedDataDeclarations } from './data/derived-data-declarations';
import { ProfileComponent } from './profile/profile.component';
import { TrailsComponent } from './trails/trails.component';
import { TrailComponent } from './trails/trail/trail.component';


let effortlessChildren = [
  {
    path: 'page1',
    component: Page1Component,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'trails',
    component: TrailsComponent,
  },
  {
    path: 'trails/trail/:trailId',
    component: TrailComponent,
  }
];
DerivedDataDeclarations.derivedPages.forEach(feDerivedPage => {
  effortlessChildren.push(feDerivedPage);
});

const routes: Routes = [{
  path: '',
  component: EffortlessComponent,
  children: effortlessChildren,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EffortlessRoutingModule {
}
