import { Component, Input, OnInit, OnChanges, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { MapService } from '../../../map.service';
import { ProfileToolService } from './profile-tool.service';

import { Chart } from 'chart.js';

Chart.controllers.customChart = Chart.controllers.line;

const customChart = Chart.controllers.line.extend({
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
           ctx.strokeStyle = 'red';
           ctx.stroke();

           //draw circle point
           ctx.beginPath();
           ctx.arc(activePoint.tooltipPosition().x, activePoint.tooltipPosition().y, 5, 0, 2 * Math.PI, false);
           ctx.fill();
           ctx.strokeStyle = '#5a6782';
           ctx.stroke();

           ctx.restore();
           console.log('tooltip', this,this.chart.tooltip._active, activePoint.tooltipPosition().y);
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
	`]
})

export class ProfileElevationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data;
  @ViewChild('elevationChart') elevationChart: ElementRef;

  profileChart: Chart;
  canvasChart: any;

  constructor(
    private mapService: MapService,
    private profileToolService: ProfileToolService
  ) { }

  ngOnInit() {
    console.log("chart data", this.data);

    this.canvasChart = this.elevationChart.nativeElement.getContext('2d');
  }

  initProfileElevationChart(chartData) {
    const data = chartData.geometry.paths[0].map(coord => coord[2].toFixed(2));
    const length  = chartData.attributes.ProfileLength.toFixed(2);
    const dataLength = data.length;
    console.log('data', data, this.profileChart)
    const datasets = [
      {
        label: '',
        data,
        cubicInterpolationMode: 'monotone',
        backgroundColor: [
          'rgba(153, 164, 186, 0.8)'
        ],
        borderColor: [
          'rgba(90, 103, 130, 1.0);'
        ],
        borderWidth: 2,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(150, 106, 236, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverRadius: 0,
        pointRadius: 0,
        spanGaps: false,
        //pointHitRadius: 10
      }
    ];
    if (!this.profileChart) {
      this.profileChart = new Chart(this.canvasChart, {
        type: 'customChart',
        data: {
          labels: data.map((z, i) => {
           const mid = (((dataLength - 1) / 2).toFixed(0));
           const midValue = (length/2).toFixed(2);
           console.log((((dataLength - 1) / 2).toFixed(0)), (length/2).toFixed(2));
           if (i === 0) return 0;
           if (i === mid) return midValue;
           if (i === (dataLength - 1)) return length;
           return ' ';
          }),
          //labels: ["Spalis", "Lapkritis", "Gruodis", "Sausis", "Vasaris", "Kovas", "Balandis"],
          datasets
        },
        options: {
          maintainAspectRatio: false,
          tooltips: {
            caretPadding: 10,
            caretSize: 4,
            cornerRadius: 2,
            mode: 'index',
            intersect: false
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Absoliutinis aukštis (m)'
              },
              gridLines: {
                display: true
              },
              ticks: {
                beginAtZero: false
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Distancija (m)'
              },
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: false
              }
            }]
          }
        }
      });

    } else {
     this.profileChart.data = {
       labels: data.map(d => ''),
       //labels: ["Spalis", "Lapkritis", "Gruodis", "Sausis", "Vasaris", "Kovas", "Balandis"],
       datasets
     }
     this.profileChart.update();
    }
  }

  ngOnChanges() {
    //console.log("chart data changed", this.data, this.profileChart);
    this.profileChart && this.profileChart.clear();
    this.data && this.initProfileElevationChart(this.data);
  }

  ngOnDestroy() {

  }

}
