import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MainService } from 'src/app/main.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  fill?: ApexFill;
  title?: ApexTitleSubtitle;
  grid: ApexGrid;
  colors: string[];
};

@Component({
  selector: 'app-expense-chart',
  templateUrl: './expense-chart.component.html',
  styleUrls: ['./expense-chart.component.css']
})
export class ExpenseChartComponent implements OnInit {


  @Input()
  data: any

  @Input()
  start!: string

  @Input()
  end!: string

  @ViewChild("chart") chart: ChartComponent | any;
  public expenseChartOptions: Partial<ChartOptions> | any;
  public category: string = ""

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
    if (this.data?.length > 0)
      this.renderChart(this.data, this.start, this.end)
  }

  changeCategoryAndRenderChart(category: string) {
    if (this.data?.length > 0)
      this.renderChart(this.data, this.start, this.end, category)
  }

  renderChart(data: any, start: string, end: string, category: string = "") {

    const chartData = this.formatExpense(data, start, end, category)
    if (chartData.credit?.length > 0 || chartData.debit?.length > 0)
      this.expenseChartOptions = {
        series: [
          {
            name: "Credit",
            data: chartData.credit
          },
          {
            name: "Debit",
            data: chartData.debit
          }
        ],
        chart: {
          type: 'area',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.70,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100]
          }
        },
        yaxis: {
          title: {
            text: 'Amount'
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false
          },
        },
        grid: {
          row: {
            colors: ['#fff', '#f2f2f2']
          }
        },
        colors: ["#00e396", "#FF0000"],
        xaxis: {
          categories: chartData.categories
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false
        },
      };

  }

  formatExpense(data: any, pStart: string, pEnd: string, type: string = "") {
    const credit: { [key: string]: number } = {}; // Specify credit as an object with string keys and number values
    const debit: { [key: string]: number } = {};  // Specify debit as an object with string keys and number values
    const start = moment(pStart);
    const end = moment(pEnd);
    const diffhours = end.diff(start, 'hours');
    const diffdays = end.diff(start, 'days');
    const diffMonth = end.diff(start, 'months');
    const diffYears = end.diff(start, 'years');
  
    if (type === '' ? (diffYears > 0) : (diffYears > 0 && type === 'years')) {
      data.reduce((acc: any, curr: any) => {
        const year = moment(curr.date).year().toString(); // Convert year to string for indexing
        acc.credit[year] = (acc.credit[year] || 0) + parseFloat(curr.credit || 0);
        acc.debit[year] = (acc.debit[year] || 0) + parseFloat(curr.debit || 0);
        return acc;
      }, { credit, debit });
      this.category = "years";
    } else if (type === '' ? (diffMonth > 4) : (diffMonth > 4 && type === 'months')) {
      data.reduce((acc: any, curr: any) => {
        const month = moment(curr.date).format('MMM'); // Use string keys for months
        acc.credit[month] = (acc.credit[month] || 0) + parseFloat(curr.credit || 0);
        acc.debit[month] = (acc.debit[month] || 0) + parseFloat(curr.debit || 0);
        return acc;
      }, { credit, debit });
      this.category = "months";
    } else if (type === '' ? (diffdays > 0) : (diffdays > 0 && type === 'days')) {
      data.reduce((acc: any, curr: any) => {
        const day = moment(curr.date).format('DD MMM'); // Use string keys for days
        acc.credit[day] = (acc.credit[day] || 0) + parseFloat(curr.credit || 0);
        acc.debit[day] = (acc.debit[day] || 0) + parseFloat(curr.debit || 0);
        return acc;
      }, { credit, debit });
      this.category = "days";
    } else if (type === '' ? (diffhours > 0) : (diffhours > 0 && type === 'hours')) {
      data.reduce((acc: any, curr: any) => {
        const hour = moment(curr.date).format('DD MMM hh:mm A'); // Use string keys for hours
        acc.credit[hour] = (acc.credit[hour] || 0) + parseFloat(curr.credit || 0);
        acc.debit[hour] = (acc.debit[hour] || 0) + parseFloat(curr.debit || 0);
        return acc;
      }, { credit, debit });
      this.category = "hours";
    } else {
      this.mainService.openDialog("Error", "Not possible to plot a graph for a given selection.", "E");
      return { credit: [], debit: [], categories: [] }; // Return empty arrays if no valid type is provided
    }
  
    // Ensure both credit and debit arrays have the same length and align with categories
    const categories = Object.keys(credit);
    const creditValues = categories.map(category => credit[category]);
    const debitValues = categories.map(category => debit[category] || 0); // Fill missing debit with 0
  
    return {
      credit: creditValues,
      debit: debitValues,
      categories: categories
    };
  }
  
  

}
