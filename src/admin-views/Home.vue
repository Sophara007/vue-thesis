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
            label: 'Price',
            data: [],
            borderColor: 'rgba(0, 123, 255, 1)',
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
    const salesResponse = await axios.get('/reports');
    const salesData = salesResponse.data.data;

    // Filter sales data where isPaid is true
    const filteredSalesData = salesData.items.filter((item) => item.isPaid);

    // Extract createdAt dates from the filtered sales data
    const saleDates = filteredSalesData.map((item) => parseISO(item.createdAt)); // Parse date string to Date object

    // Extract prices from the filtered sales data
    const salePrices = filteredSalesData.map((item) => item.price);

    // Format saleDates for chart labels
    const formattedSaleDates = saleDates.map((date) => format(date, 'yyyy-MM-dd HH:mm:ss')); // Format date with time

    // Update the salesData object
    this.salesData.labels = formattedSaleDates;
    this.salesData.datasets[0].data = salePrices;

    // After fetching data and updating the salesData object, create the chart
    this.createSalesChart();
  } catch (error) {
    console.error('Error fetching sales data:', error);
  }
},

createSalesChart() {
  const ctx = document.getElementById('salesChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line', // Use only the 'line' chart type
    data: this.salesData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'month',
            tooltipFormat: 'yyyy-MM-dd',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Price',
          },
          ticks: {
            stepSize: 1,
            precision: 0,
            callback: (value) => {
              return value === 0 || value === 1 ? '' : value.toFixed(0); // Format as integer, hide 0 and 1
            },
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
                return label + ': ' + (context.parsed.y === 0 || context.parsed.y === 1 ? '' : context.parsed.y.toFixed(0)); // Format tooltip value as integer, hide 0 and 1
              }
              return null;
            },
          },
        },
      },
      legend: {
        display: false,
      },
      interaction: {
        // Remove interaction options to disable switching between chart types
        mode: 'index',
        intersect: false,
      },
    },
  });
  chart.update();
},





  },
  async mounted() {
    await this.getDashboard();
    await this.fetchSalesData();
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
