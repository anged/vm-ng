import { Component, Input, OnChanges, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Chart } from 'chart.js';

import { MapWidgetsService } from '../../map-widgets.service';

@Component({
  selector: 'sidebar-buildings',
  templateUrl: './app/map-widgets/themes/buildings/sidebar-buildings.component.html',
  styleUrls: ['./app/map-widgets/themes/buildings/sidebar-buildings.component.css'],
  animations: [
    trigger('sidebarToggle', [
      state('s-close', style({
        transform: 'translate3d(326px,0,0)'
      })),
      state('s-open', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('s-open => s-close', animate('100ms ease-in')),
      transition('s-close => s-open', animate('100ms ease-out'))
    ])
  ]
})

export class SidebarBuildingsComponent implements OnChanges {
  @Input() mainSidebarState;
  @Input() sidebarHeatContent;
  @ViewChild('mChart') heatMonthsChart: ElementRef;
  @ViewChild('cChart') heatClassesChart: ElementRef;

  heatingMonthsData: any;
  heatingClassesData: any;
  monthsChart: Chart;
  classesChart: Chart;
  lastHeatingYear: number;

  innerState = 's-close';
  sidebarMonthsState = 's-close';
  sidebarClassesState = 's-close';
  sidebarInfoState = 's-close';
  sidebarQuartersState = 's-close';

  selectionByTypeState = false;

  // chart labels for tooltip
  chartLabels = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private mapWidgetsService: MapWidgetsService) { }

  selectBuildingsByType() {
    this.selectionByTypeState = !this.selectionByTypeState;
    this.mapWidgetsService.selectBuildingsByType(this.sidebarHeatContent.TIPINIS_PR, this.selectionByTypeState);
  }

  openSidaberGroup(name: string) {
    switch (name) {
      case 'quarters':
        this.sidebarQuartersState = 's-open';
        break;
      case 'months':
        this.sidebarMonthsState = 's-open';
        break;
      case 'classes':
        this.sidebarClassesState = 's-open';
        break;
      case 'info':
        this.sidebarInfoState = 's-open';
        break;
    }

    this.cdr.detectChanges();
  }

  closeSidaberGroup(name: string = '') {
    switch (name) {
      case 'months':
        this.sidebarMonthsState = 's-close';
        break;
      case 'quarters':
        this.sidebarQuartersState = 's-close';
        break;
      case 'classes':
        this.sidebarClassesState = 's-close';
        break;
      case 'info':
        this.sidebarInfoState = 's-close';
        break;
      default:
        this.sidebarMonthsState = 's-close';
        this.sidebarClassesState = 's-close';
        this.sidebarInfoState = 's-close';
    }

    //diselect buildigns by type if their are selected
    if (this.selectionByTypeState) {
      this.selectBuildingsByType();
    }

    // detect changes when closing sidebar group
    this.cdr.detectChanges();
  }

  initHeatMonthsGraphic() {
    const el = this.heatMonthsChart.nativeElement.getContext('2d');
    this.monthsChart && this.monthsChart.clear();
    const datasets = [
      {
        label: `${this.lastHeatingYear}-${this.lastHeatingYear + 1} m.`,
        data: this.initMonthsDataset()[this.lastHeatingYear],
        backgroundColor: [
          'rgba(150, 106, 236, 0.2)'
        ],
        borderColor: [
          'rgba(150, 106, 236, 1)'
        ],
        borderWidth: 1,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(150, 106, 236, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBackgroundColor: 'rgba(150, 106, 236, 1)',
        pointHoverRadius: 5,
        pointRadius: 5
      },
      {
        label: `${this.lastHeatingYear - 1}-${this.lastHeatingYear} m.`,
        data: this.initMonthsDataset()[this.lastHeatingYear - 1],
        backgroundColor: [
          'rgba(153, 195, 146, 0.2)'
        ],
        borderColor: [
          'rgba(153, 195, 146, 1)'
        ],
        borderWidth: 1,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(153, 195, 146, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBackgroundColor: 'rgba(153, 195, 146, 1)',
        pointHoverRadius: 5,
        pointRadius: 5
      },
      {
        label: `${this.lastHeatingYear - 2}-${this.lastHeatingYear - 1} m.`,
        data: this.initMonthsDataset()[this.lastHeatingYear - 2],
        backgroundColor: [
          'rgba(222, 135, 71, 0.2)'
        ],
        borderColor: [
          'rgba(222, 135, 71, 1)'
        ],
        borderWidth: 1,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(222, 135, 71, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBackgroundColor: 'rgba(222, 135, 71, 1)',
        pointHoverRadius: 5,
        pointRadius: 5
      }
    ];
    if (!this.monthsChart) {
      this.monthsChart = new Chart(el, {
        type: 'line',
        data: {
          labels: ["Spalis", "Lapkritis", "Gruodis", "Sausis", "Vasaris", "Kovas", "Balandis"],
          datasets
        },
        options: {
          tooltips: {
            caretSize: 0
          },
          legend: {
            display: true
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'kWh/m²'
              },
              ticks: {
                beginAtZero: false
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Mėnuo'
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
      this.monthsChart.data.datasets = datasets;
      this.monthsChart.update();
    }

  }

  initMonthsDataset() {
    const dataset = {};
    this.heatingMonthsData.forEach(set => {
      const att = set.attributes;
      dataset[att.SEZONAS] = [
        att.SPAL_KW ? parseFloat(att.SPAL_KW.toFixed(2)) : att.SPAL_KW,
        att.LAPKR_KW ? parseFloat(att.LAPKR_KW.toFixed(2)) : att.LAPKR_KW,
        att.GRUOD_KW ? parseFloat(att.GRUOD_KW.toFixed(2)) : att.GRUOD_KW,
        att.SAUS_KW ? parseFloat(att.SAUS_KW.toFixed(2)) : att.SAUS_KW,
        att.VASAR_KW ? parseFloat(att.VASAR_KW.toFixed(2)) : att.VASAR_KW,
        att.KOVAS_KW ? parseFloat(att.KOVAS_KW.toFixed(2)) : att.KOVAS_KW,
        att.BALAN_KW ? parseFloat(att.BALAN_KW.toFixed(2)) : att.BALAN_KW
      ];
    });
    return dataset;
  }

  initClassesData() {
    const labels = this.heatingClassesData.classes.map(label => label + ' klasė');
    const data = {
      labels,
      datasets: [{
        label: '',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2
      }]
    };
    const dataset = data.datasets[0];
    this.heatingClassesData.classes.forEach((name) => {
      this.chartLabels.push(this.heatingClassesData.dataByClasses[name].label + ', viso pastatų: ');
      dataset.data.push(this.heatingClassesData.dataByClasses[name].count);
      dataset.backgroundColor.push(this.heatingClassesData.dataByClasses[name].color);
      dataset.borderColor.push(this.heatingClassesData.dataByClasses[name].strokeColor);
    });
    return data;
  }

  initHeatClassesGraphic() {
    const el = this.heatClassesChart.nativeElement.getContext('2d');
    this.classesChart && this.classesChart.clear();
    const data = this.initClassesData();
    if (!this.classesChart) {
      this.classesChart = new Chart(el, {
        type: 'bar',
        options: {
          tooltips: {
            position: 'nearest',
            callbacks: {
              //bug: cutting off long label
              //solution: split label and add beforeTitle
              label: function(tooltipItem, data) {
                const label = ', viso pastatų: '
                const result = data.datasets["0"].data[tooltipItem.index];
                return label + result;
              },
              beforeTitle: (tooltipItems) => {
                return this.chartLabels[tooltipItems[0].index].split(',')[0];
              },
              // add empty string
              title: () => {
                return '';
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
                labelString: 'Namų skaičius'
              },
              ticks: {
                beginAtZero: true
              }
            }]
            ,
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Faktinio energijos suvartojimo klasė'
              },
              offset: true,
              gridLines: {
                offsetGridLines: false,
                display: false
              },
              barPercentage: 0.6,
              ticks: {
                beginAtZero: false
              }
            }]
          }
        }
      });
      this.classesChart.data.labels = data.labels;
      this.classesChart.data.datasets = data.datasets;
      this.classesChart.update();
    } else {
      this.classesChart.data.labels = data.labels;
      this.classesChart.data.datasets = data.datasets;
      this.classesChart.update();
    }

  }

  ngDoCheck() {
    this.cdr.detectChanges();
  }

  ngOnChanges() {
    this.closeSidaberGroup();

    // close main heat content while adding animation
    this.innerState = 's-close';

    // check if heat data is empty
    if (this.sidebarHeatContent && (this.mainSidebarState === 's-open')) {
      //add setTimeout  for main heat content animation
      setTimeout(() => {
        this.innerState = 's-open';
        this.cdr.detectChanges();
      }, 200);
      this.lastHeatingYear = this.sidebarHeatContent.SEZONAS;
      // get data by months
      this.mapWidgetsService.queryHeatingDataByMonths(this.sidebarHeatContent.SEZONAS, this.sidebarHeatContent.ID_NAMO).then(data => {
        this.heatingMonthsData = data;
        this.heatMonthsChart && this.initHeatMonthsGraphic();
      });

      // set data by house type and heat classes
      this.mapWidgetsService.queryHeatingDataByClasses(this.sidebarHeatContent.TIPINIS_PR, this.sidebarHeatContent.REITING).then(data => {
        this.heatingClassesData = data;
        this.heatClassesChart && this.initHeatClassesGraphic();
      });
    }

  }
}
