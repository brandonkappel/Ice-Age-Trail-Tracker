import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, monkeyPatchChartJsTooltip, monkeyPatchChartJsLegend } from 'ng2-charts';

@Component({
  selector: 'ngx-total-miles-chart',
  templateUrl: './total-miles-chart.component.html',
  styleUrls: ['./total-miles-chart.component.scss']
})
export class TotalMilesChartComponent implements OnInit {

  @Input() parent: any


  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top'
    }
  };
  public pieChartLabels: Label[] = [['Total Miles Completed'], 'Miles To Complete'];
  pieChartData: any[]=[]
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public chartColors = [
    {
      backgroundColor: [ '#A9DFBF' , '#E5E7E9' ],
      hoverBackgroundColor: [ '#7DCEA0' , '#D7DBDD '],
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
    this.pieChartData = [this.parent.gds.whoAmI.MilesCompleted, this.parent.totalMilesRemaining]
  }

}

