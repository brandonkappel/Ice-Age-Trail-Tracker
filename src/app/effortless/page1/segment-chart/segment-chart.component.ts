import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'ngx-segment-chart',
  templateUrl: './segment-chart.component.html',
  styleUrls: ['./segment-chart.component.scss']
})
export class SegmentChartComponent implements OnInit {

  @Input() parent: any


  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top'
    }
  };
  public pieChartLabels: Label[] = [['Trail Segments Completed'], ['Road Segments Completed'], 'Segments To Complete'];
  pieChartData: any[]=[]
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public chartColors = [
    {
      backgroundColor: [ '#A9DFBF' ,'#AED6F1 ' , '#E5E7E9' ],
      hoverBackgroundColor: [ '#7DCEA0' ,'#85C1E9 ' , '#D7DBDD '],
      borderWidth: 2,
    }
  ]

  constructor() {

    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.segmentChartData()
  }

  segmentChartData(){
    this.pieChartData = [
      this.parent.trailsCompleted,
      this.parent.roadsCompleted,
      this.parent.allSegments.length - this.parent.gds.whoAmI.NumberOfTrailsCompleted
    ]
  }

}
