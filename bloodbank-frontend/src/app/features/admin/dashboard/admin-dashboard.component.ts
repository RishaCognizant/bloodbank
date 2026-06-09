import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStats } from '../../../models/dashboard.model';
import { BLOOD_GROUPS } from '../../../models/blood-inventory.model';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  bloodGroups = BLOOD_GROUPS;
  today = new Date();

  inventoryChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  requestsChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe({
      next: data => {
        this.stats = data;
        this.buildCharts(data);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  buildCharts(data: DashboardStats) {
    const groups = BLOOD_GROUPS;
    const units = groups.map(g => data.bloodInventory[g] ?? 0 as number);
    this.inventoryChartData = {
      labels: groups,
      datasets: [{
        data: units,
        backgroundColor: groups.map((_, i) => `hsl(${i * 45}, 70%, 60%)`),
        label: 'Units',
      }],
    };

    this.requestsChartData = {
      labels: ['Pending', 'Approved', 'Rejected'],
      datasets: [{
        data: [data.pendingRequests, data.approvedRequests, data.rejectedRequests],
        backgroundColor: ['#f39c12', '#27ae60', '#e74c3c'],
      }],
    };
  }

  getStockClass(units: number): string {
    if (units === 0) return 'stock-empty';
    if (units <= 10) return 'stock-low';
    return 'stock-good';
  }
}
