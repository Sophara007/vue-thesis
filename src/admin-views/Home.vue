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

export default {
  data() {
    return {
      dashboardItems: [],
      salesData: {
        labels: [
       
          '2023-01-08', // Weekly point
          '2023-01-15', // Weekly point
          '2023-01-22', // Weekly point
          '2023-01-29', // Weekly point
        
          '2023-02-08', // Weekly point
          '2023-02-15', // Weekly point
          '2023-02-22', // Weekly point
          '2023-02-28', // Weekly point
        
          '2023-03-08', // Weekly point
          '2023-03-15', // Weekly point
          '2023-03-22', // Weekly point
          '2023-03-29', // Weekly point
       
          '2023-04-08', // Weekly point
          '2023-04-15', // Weekly point
          '2023-04-22', // Weekly point
          '2023-04-29', // Weekly point
        
          '2023-05-08', // Weekly point
          '2023-05-15', // Weekly point
          '2023-05-22', // Weekly point
          '2023-05-29', // Weekly point
        
          '2023-06-08', // Weekly point
          '2023-06-15', // Weekly point
          '2023-06-22', // Weekly point
          '2023-06-29', // Weekly point
         
          '2023-07-08', // Weekly point
          '2023-07-15', // Weekly point
          '2023-07-22', // Weekly point
          '2023-07-29', // Weekly point
        
          '2023-08-08', // Weekly point
          '2023-08-15', // Weekly point
          '2023-08-22', // Weekly point
          '2023-08-29', // Weekly point
       
          '2023-09-08', // Weekly point
          '2023-09-15', // Weekly point
          '2023-09-22', // Weekly point
          '2023-09-29', // Weekly point
          
          '2023-10-08', // Weekly point
          '2023-10-15', // Weekly point
          '2023-10-22', // Weekly point
          '2023-10-29', // Weekly point
        
          '2023-11-08', // Weekly point
          '2023-11-15', // Weekly point
          '2023-11-22', // Weekly point
          '2023-11-29', // Weekly point
         
          '2023-12-08', // Weekly point
          '2023-12-15', // Weekly point
          '2023-12-22', // Weekly point
          '2023-12-29', // Weekly point
        ],
        datasets: [
          {
            label: 'Sales',
            data: [
  0, 1300, 1400, 1500, 1600,
  1700, 1900, 1800, 1700, 1600,
  1500, 1400, 1300, 1200, 1100,
  1000, 950, 900, 850, 800,
  750, 700, 650, 600, 550,
  500, 450, 400, 350, 300,
  

],

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
      // Simulate fetching dashboard data from an API (replace with actual API call)
      const dashboardData = await this.fetchDashboardData();

      // Map fetched data to dashboardItems
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
    },
    async fetchDashboardData() {
      // Simulate fetching data from an API (replace with your actual API endpoint)
      const response = await axios.get('/dashboard');
      return response.data.data;
    },
    createSalesChart() {
      const ctx = document.getElementById('salesChart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
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
        },
      });
      chart.update();
    },
  },
  async mounted() {
    await this.getDashboard();
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 1000px; /* Adjust the size as needed */
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
