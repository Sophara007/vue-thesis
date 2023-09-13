<template>

    <h1 class="mb-4 text-center">Dashboard</h1>

    <div class="row row-cols-1 row-cols-md-3 g-4 mt-4">
      <!-- Other dashboard items go here -->
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
          <canvas id="salesChart"></canvas>
        </div>
      </div>
    </div>

</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      dashboardItems: [],
      salesData: {
        labels: ['Weekly', 'Monthly', 'Yearly'],
        datasets: [
          {
            label: 'Sales',
            data: [50, 250, 3000], // Update with your actual sales data
            backgroundColor: ['#007bff', '#28a745', '#ffc107'], // Customize the colors
          },
        ],
      },
    };
  },
  methods: {
    async getDashboard() {
      const dashboard = await axios.get('/dashboard').then((res) => res.data.data);
      this.dashboardItems = [
        { title: 'Products', count: dashboard.count_product, iconClasses: 'fas fa-box' },
        { title: 'Services', count: dashboard.count_service, iconClasses: 'fas fa-handshake' },
        { title: 'Users', count: dashboard.count_user, iconClasses: 'fas fa-users' },
        { title: 'Inquiries', count: dashboard.count_inquiry, iconClasses: 'fa fa-commenting' },
        { title: 'Partners', count: dashboard.count_partner, iconClasses: 'fa-regular fa-window-restore' },
        { title: 'Industries', count: dashboard.count_industry, iconClasses: 'fas fa-industry' },
      ];

      // After fetching sales data, update the chart
      this.updateSalesChart();
    },
    updateSalesChart() {
      const ctx = document.getElementById('salesChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar', // Use a bar chart
        data: this.salesData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
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
  max-width: 300px; /* Adjust the size as needed */
  margin: 0 auto;
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
