import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'ngx-base-data'
})
export class BaseDataComponent  {

  public tables: { title: string, link: string}[] = [

    {
      title: 'Users',
      link: 'users',
    },
    {
      title: 'AllSegments',
      link: 'allsegments',
    },
    {
      title: 'Comments',
      link: 'comments',
    },
  ];
}