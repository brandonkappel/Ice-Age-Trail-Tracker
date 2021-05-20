import { Component, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { EffortlessComponentBase } from '../efforless-base-component';
import { DataEndpoint } from '../services/eapi-data-services/data-endpoint/data-endpoint';
import { GDS } from '../services/gds.service';

@Component({
  selector: 'ngx-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component extends EffortlessComponentBase implements OnInit {

  parent: any = this;
  allSegments: any[] = [];
  trailSegments: any[];
  roadSegments: any[];
  isLoading = false
  trailsCompleted: number;
  roadsCompleted: number;
  pieChartData: any[] = [];
  allSegmentMiles: number;
  trailSegmentMiles: number;
  roadSegmentMiles: number;
  totalMilesRemaining: number;

  constructor(public gds: GDS, public data: DataEndpoint, public menuService: NbMenuService) {

    super(gds, data, menuService)
    this.isLoading = true
    this.safeSubscribe(this.data.onAllSegmentsChange().subscribe(allSegments => {
      this.isLoading = false
      this.allSegments = allSegments
      this.parse()

    }));
  }


  onGdsReady() {
    this.reload(this);
    // console.error(this.allSegments)
  }

  parse() {
    this.identifyTrailSegments();
    this.identifyRoadSegments();
    this.numberOfSegmentsToComplete();
    this.totalSegmentMiles();
    this.identifyTrailSegmentMiles();
    this.identifyRoadSegmentMiles();
    this.numberOfSegmentMilesToComplete();
  }

  reload(self: this) {
    self.data.reloadAllSegments(self.gds.smqUser || self.gds.smqGuest);
  }

  identifyTrailSegments() {
    let segments = this.allSegments
    let trails = []
    segments.filter(segment => {
      if (segment.IsTrailSegment == true) {
        trails.push(segment)
        this.trailSegments = trails
        this.isLoading = false
      }
    })

  }

  identifyRoadSegments() {
    let segments = this.allSegments
    let roads = []
    segments.filter(segment => {
      if (segment.IsRoadSegment == true) {
        roads.push(segment)
        this.roadSegments = roads
        // console.error('ROAD SEMENTS?',this.roadSegments)
        this.isLoading = false
      }
    })
  }

  numberOfSegmentsToComplete() {
    if (this.gds.whoAmI.TrailsCompleted == undefined) {
      this.trailsCompleted = 0
      console.error(this.trailsCompleted)
    } else {
      this.trailsCompleted =  this.gds.whoAmI.TrailsCompleted.length
    }

    if (this.gds.whoAmI.RoadsCompleted == undefined  ) {
      this.roadsCompleted = 0
    } else {
      this.roadsCompleted = this.gds.whoAmI.RoadsCompleted.length
    }
    // console.error('TRAILS:',this.trailsCompleted)
    // console.error('ROADS:',this.roadsCompleted)
  }

  totalSegmentMiles() {
    let segments = this.allSegments
    let totalMiles: number = 0.0
    segments.forEach(segment => totalMiles += segment.TotalMiles)
    this.allSegmentMiles = totalMiles
  }

  identifyTrailSegmentMiles() {
    let trails = this.trailSegments
    let trailMiles: number = 0
    trails.forEach(trail => trailMiles += trail.TotalMiles)
    this.trailSegmentMiles = trailMiles
  }

  identifyRoadSegmentMiles() {
    let roads = this.roadSegments
    let roadMiles: number = 0
    roads.forEach(road => roadMiles += road.TotalMiles)
    this.roadSegmentMiles = roadMiles
  }

  numberOfSegmentMilesToComplete() {
    this.totalMilesRemaining = this.allSegmentMiles - this.gds.whoAmI.MilesCompleted
  }




}
