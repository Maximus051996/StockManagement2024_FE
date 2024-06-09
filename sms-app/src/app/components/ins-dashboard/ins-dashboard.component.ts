import { Component, OnInit } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_dumbbell from 'highcharts/modules/dumbbell';
import HC_lollipop from 'highcharts/modules/lollipop';
import HC_exporting from 'highcharts/modules/exporting';
import HC_accessibility from 'highcharts/modules/accessibility';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { SharedService } from '../../core/services/shared/shared.service';
import { Message } from '../../core/constants/messages';

HC_more(Highcharts);
HC_dumbbell(Highcharts);
HC_lollipop(Highcharts);
HC_exporting(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-ins-dashboard',
  standalone: true,
  imports: [SkeletonModule, MatCardModule, CommonModule, HighchartsChartModule],
  templateUrl: './ins-dashboard.component.html',
  styleUrl: './ins-dashboard.component.scss',
})
export class InsDashboardComponent implements OnInit {
  isLoader = true;
  activeCompanyCount = 0;
  damageProductCount = 0;
  activeUserCount = 0;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any;
  constructor(
    private dashboardService: DashboardService,
    private sharedService: SharedService
  ) {
    this.getDashboardDetails();
  }
  ngOnInit(): void {}

  async getDashboardDetails() {
    try {
      this.activeCompanyCount =
        await this.dashboardService.getTotalCompanyCountDetails();
      this.damageProductCount =
        await this.dashboardService.getDamageProductCountDetails();
      this.activeUserCount =
        await this.dashboardService.getActiveUserCountDetails();
      await this.getchartDetails();
      this.isLoader = false;
    } catch (error) {
      this.sharedService.openSnackBar(Message.errorAddeditdeleteMsg, 'OK');
      throw error;
    }
  }

  async getchartDetails() {
    try {
      let data = await this.dashboardService.chartAllCompanyDetails();
      const chartData = data.map((item: any) => ({
        name: item.companyName,
        y: item.totalQuantity,
      }));

      if (chartData) {
        this.chartOptions = {
          chart: {
            type: 'lollipop',
          },
          credits: {
            enabled: false,
          },
          accessibility: {
            point: {
              valueDescriptionFormat: '{index}. {xDescription}, {point.y}.',
            },
          },

          legend: {
            enabled: false,
          },

          subtitle: {
            text: Message.companyName,
          },

          title: {
            text: Message.dashboardBarChartTitle,
          },

          tooltip: {
            shared: true,
          },

          xAxis: {
            title: {
              text: Message.dashboardBarChartXAxisTitle,
            },
            type: 'category',
          },

          yAxis: {
            title: {
              text: Message.dashboardBarChartYAxisTitle,
            },
          },

          series: [
            {
              name: Message.dashboardBarChartSeriesName,
              data: chartData,
            },
          ],
        };
      }
    } catch (error) {}
  }
}
