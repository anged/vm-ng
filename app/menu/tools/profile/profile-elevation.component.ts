import { Component, Input, OnInit, OnChanges, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { MapService } from '../../../map.service';
import { ProfileToolService } from './profile-tool.service';
import { Symbols } from '../../symbols';

import { Chart } from 'chart.js';
import Graphic = require('esri/Graphic');


class ProfileChart extends Chart {
  tooltip: any;
  fullData: any;
}

ProfileChart.controllers.customChart = ProfileChart.controllers.line;

const customChart = ProfileChart.controllers.line.extend({
  draw: function(ease) {
    // Call super method first
    Chart.controllers.line.prototype.draw.call(this, ease);

    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
      var activePoint = this.chart.tooltip._active[0],
        ctx = this.chart.ctx,
        x = activePoint.tooltipPosition().x,
        topY = this.chart.scales['y-axis-0'].top,
        bottomY = this.chart.scales['y-axis-0'].bottom;

      // draw line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#e61c24';
      ctx.stroke();

      //draw circle point
      ctx.beginPath();
      ctx.arc(activePoint.tooltipPosition().x, activePoint.tooltipPosition().y, 5, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#e61c24';
      ctx.stroke();

      ctx.restore();
    }
  }
});

Chart.controllers.customChart = customChart;


@Component({
  selector: 'profile-elevation',
  templateUrl: './app/menu/tools/profile/profile-elevation.component.html',
  styles: [`
   .canvas-wrapper {
     position: relative;
     height:260px; width:
     calc(100vw - 80px)
   }
   @media only screen and (max-width: 1382px) {
     .canvas-wrapper {
      position: relative;
      height: 160px;
      width: calc(100vw - 640px);
      }
  }
	`],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileElevationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data;
  @ViewChild('elevationChart') elevationChart: ElementRef;

  profileChart: ProfileChart;
  canvasChart: any;
  previousPoint: Graphic;
  view: any;

  constructor(
    private mapService: MapService,
    private profileToolService: ProfileToolService
  ) { }

  ngOnInit() {
    console.log("chart data", this.data);
    this.view = this.mapService.getView();
    this.canvasChart = this.elevationChart.nativeElement.getContext('2d');
    this.profileChart = new ProfileChart(this.canvasChart, {
      type: 'customChart',
      options: {
        maintainAspectRatio: false,
        tooltips: {
          caretPadding: 10,
          caretSize: 4,
          cornerRadius: 2,
          mode: 'index',
          intersect: false,

          // get active tooltip point coordinates
          custom: (tooltipModel) => {
            const isActiveTooltip = this.profileChart.tooltip._active[0] ? true : false;
            if (isActiveTooltip) {
              const activePointIndex = this.profileChart.tooltip._active[0]._index;
              const activePointCoordinates = this.profileChart.fullData[activePointIndex];
              //console.log('tooltipModel', activePointCoordinates);
              this.createPointGraphic(activePointCoordinates);
            }

          }
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 14,
              labelString: 'Aukštis (m)'
            },
            gridLines: {
              display: true
            },
            ticks: {
              callback: function(label, index, labels) { return label + ' m' },
              beginAtZero: false
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 14,
              labelString: 'Atstumas (km)'
            },
            gridLines: {
              display: false
            },
            ticks: {
              //autoSkip: true,
              maxTicksLimit: 10,
              beginAtZero: false
            }
          }]
        }
      }
    });
  }

  initProfileElevationChart(chartData) {
    const data = chartData.geometry.paths[0].map(coord => (Math.round(coord[2] * 10) / 10).toFixed(1));
    // add x y data to chart
    this.profileChart.fullData = chartData.geometry.paths[0].map(coord => { coord.pop(); return coord; });
    console.log('data', data, this.profileChart)
    const datasets = [
      {
        label: '',
        data,
        backgroundColor: [
          'rgba(154, 8, 8, 0.1)'
        ],
        borderColor: [
          'rgba(230, 28, 36, 1.0)'
        ],
        borderWidth: 2,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(150, 106, 236, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverRadius: 0,
        pointRadius: 0,
        spanGaps: false,
        steppedLine: false // square lines enabled, no smoothing
        //pointHitRadius: 10
      }
    ];

    this.profileChart.data.labels = this.getLabel(data, chartData);
    this.profileChart.data.datasets = datasets;

    this.profileChart.update();
  }

  getLabel(dataZCoord: number[], chartData): string[] {
    const dataXCoord = chartData.geometry.paths[0].map(coord => coord[0].toFixed(2));
    const dataYCoord = chartData.geometry.paths[0].map(coord => coord[1].toFixed(2));
    const length = chartData.attributes.ProfileLength.toFixed(2);
    const dataXLength = this.calcLengthXData(dataXCoord, dataYCoord, dataZCoord, length);
    return dataZCoord.map((z, i) => {
      if (i === 0) return '0';
      // calculate current length of point based on x value and full length
      return (dataXLength[i] / 1000).toFixed(3) + ' km';
    });
  }

  // calculate length value in meters by X coordinate
  calcLengthXData(dataXCoord: number[], dataYCoord: number[], dataZCoord: number[], length): number[] {
    let lengthInMeters = 0;
    return dataXCoord.map((x, i) => {
      //console.log('X', x)
      if (i === 0) return 0;
      if (i > 0) {
        //const l = Math.abs(x - dataXCoord[i-1]);
        const l = Math.sqrt(Math.pow((x - dataXCoord[i - 1]), 2) + Math.pow((dataYCoord[i] - dataYCoord[i - 1]), 2));
        lengthInMeters += l;
        return lengthInMeters;
      }
      if (i === (dataXCoord.length - 1)) return length;
    });
  }

  removePointGraphic() {
    if (this.previousPoint) {
      this.view.graphics.remove(this.previousPoint);
    }
  }

  createPointGraphic(pointCoordinates) {
    this.removePointGraphic();

    let point = {
      type: "point", // autocasts as /Point
      x: pointCoordinates[0],
      y: pointCoordinates[1],
      spatialReference: this.view.spatialReference
    };

    let graphic = new Graphic({
      geometry: point,
      symbol: Symbols.profileHoverPoint
    });

    this.view.graphics.add(graphic);
    this.previousPoint = graphic;
  }

  ngOnChanges() {
    this.removePointGraphic();
    //console.log("chart data changed", this.data, this.profileChart);
    this.profileChart && this.profileChart.clear();
    this.data && this.initProfileElevationChart(this.data);
  }

  ngOnDestroy() {
    this.previousPoint = null;
  }

}
