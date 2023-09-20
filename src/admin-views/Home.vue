<template>
  <div>
    <!-- Dashboard Title -->
    <h1 class="mb-4 text-center">Dashboard</h1>

    <!-- Dashboard Items -->
    <div class="row row-cols-1 row-cols-md-3 g-4 mt-4">
      <div v-for="(item, index) in dashboardItems" :key="index" class="col">
        <div class="card shadow-lg">
          <div class="card-body text-center">
            <i :class="item.iconClasses" class="display-4 text-primary mb-3"></i>
            <h3 class="card-title fs-2">{{ item.count }}</h3>
            <p class="card-text text-muted">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Report -->
    <div class="card shadow-lg mt-4">
      <div class="card-body text-center">
        <h3 class="card-title fs-2">Sales Report</h3>
        <div class="chart-container">
          <canvas id="salesChart" width="800" height="400"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { format, parseISO } from 'date-fns';

export default {
  data() {
    return {
      dashboardItems: [],
      salesData: {
        labels: [],
        datasets: [
          {
            label: 'Sales', // Change label to 'Number of Sales'
            data: [], // Initialize data as an empty array
            borderColor: 'rgba(0, 123, 255, 1)',
             backgroundColor: 'rgba(0, 123, 255, 0.3)', // Add a background color
            borderWidth: 2,
            fill: {
              target: 'origin',
              above: 'rgba(0, 123, 255, 0.3)',
            },
          },
        ],
      },
    };
  },
  methods: {
    async getDashboard() {
      try {
        const dashboardResponse = await axios.get('/dashboard');
        const dashboardData = dashboardResponse.data.data;

        this.dashboardItems = [
          { title: 'Products', count: dashboardData.count_product, iconClasses: 'fas fa-box' },
          { title: 'Services', count: dashboardData.count_service, iconClasses: 'fas fa-handshake' },
          { title: 'Users', count: dashboardData.count_user, iconClasses: 'fas fa-users' },
          { title: 'Inquiries', count: dashboardData.count_inquiry, iconClasses: 'fa fa-commenting' },
          { title: 'Partners', count: dashboardData.count_partner, iconClasses: 'fa-regular fa-window-restore' },
          { title: 'Industries', count: dashboardData.count_industry, iconClasses: 'fas fa-industry' },
        ];

        // After fetching dashboard data, create the chart
        this.createSalesChart();
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },
    async fetchSalesData() {
  try {
    const today = new Date(); // Get the current date
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const salesResponse = await axios.get('/reports?limit=1000');
    const salesData = salesResponse.data.data;

    // Filter sales data where isPaid is true and createdAt is within the current month
    const filteredSalesData = salesData.items.filter((item) => {
      const saleDate = new Date(item.createdAt);
      return item.isPaid && saleDate >= firstDayOfMonth && saleDate <= today;
    });

    // Create an object to store sales counts by date
    const salesCountsByDate = {};

    // Process each sale to aggregate sales counts by date
    filteredSalesData.forEach((item) => {
      const saleDate = new Date(item.createdAt).toLocaleDateString();

      if (salesCountsByDate[saleDate]) {
        salesCountsByDate[saleDate]++;
      } else {
        salesCountsByDate[saleDate] = 1;
      }
    });

    // Extract date labels and sales counts from the aggregated data
    const saleDates = Object.keys(salesCountsByDate);
    const saleCounts = Object.values(salesCountsByDate);

    // Update the salesData object
    this.salesData.labels = saleDates; // Use saleDates as the X-axis labels
    this.salesData.datasets[0].data = saleCounts; // Use saleCounts as the Y-axis data

    // After fetching data and updating the salesData object, create the chart
    this.createSalesChart();
  } catch (error) {
    console.error('Error fetching sales data:', error);
  }
},


    createSalesChart() {
      const ctx = document.getElementById('salesChart').getContext('2d');

      // Destroy the existing chart if it exists
      if (this.salesChart) {
        this.salesChart.destroy();
      }

      this.salesChart = new Chart(ctx, {
        type: 'bar',
        data: this.salesData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              suggestedMin: 0,
            },
            y: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: Math.max(...this.salesData.datasets[0].data) + 1,
              title: {
                display: true,
                text: 'Sales',
              },
            },
          },
          plugins: {
            tooltip: {
              intersect: false,
              mode: 'index',
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  if (label) {
                    return label + ': ' + context.parsed.y;
                  }
                  return null;
                },
              },
            },
          },
          legend: {
            display: false,
          },
        },
      });
    },

  },
  async mounted() {
    await this.getDashboard();
    await this.fetchSalesData();
    this.createSalesChart(); // Call createSalesChart after fetching data
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  height: 400px;
}
h1 {
  font-size: 28px;
  font-weight: bold;
  text-transform: uppercase;
  color: #333;
}

.card {
  border: none;
  border-radius: 10px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}
.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
i {
  font-size: 48px;
}
.card-title {
  font-size: 28px;
  font-weight: bold;
}
.card-text {
  font-size: 16px;
}
</style>
