import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'reload-widget',
  templateUrl: './reload-widget.component.html',
  styleUrls: ['./reload-widget.component.css']
})
export class ReloadWidgetComponent implements OnInit {
  @Input() reloadHandler : any;
  @Input() reloading : boolean = false;
  @Input() loading : boolean = false;
  @Input() self : any;
  constructor() { 
    
  }
 
  ngOnInit() {
  }
}