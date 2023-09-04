<template>
  <div class="w-screen h-screen flex">
    <!-- Side bar -->
    <div class="w-[250px] bg-gray-200 text-white overflow-y-auto flex flex-col" v-show="showSide">
      <div class="h-[50px] bg-gray-900 flex justify-start items-center">
        <div class="px-[50px]">
          <img src="https://static.wixstatic.com/media/74d6b3_b17a2b221c7246edb6bd50376a7a7ee4~mv2.gif"
            alt="logo-blue.gif" style="width: 80px; height: 50px" />
        </div>
      </div>
      <div class="bg-gray-800 py-[20px] flex-grow">
        <div class="flex flex-col space-y-[10px]">
          <div class="flex flex-col justify-between space-y-[10px]" style="padding: 0 15px">
            <router-link :class="$route.name == 'HomePage' ? 'custom-active' : ''" to="/home"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md border-gray-200 hover:bg-gray-200 hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fas fa-home mr-5"></i>
              Home
            </router-link>
            <div>
              <div
                class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300 hover:text-gray-800 transition duration-400 ease-in-out"
                @click="toggleHomeSlider" style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                ">
                <div>
                  <i class="fa-regular fa-window-restore mr-5"></i>
                  Slides
                </div>
                <div>
                  <i v-if="showHomeSlider" class="ml-2 fas fa-angle-up text-gray-500"></i>
                  <i v-else class="ml-2 fas fa-angle-down text-gray-500"></i>
                </div>
              </div>
              <!-- Sub-link content under Slides -->
              <div v-if="showHomeSlider" class="ml-6 text-sm text-gray-500 space-y-2 cursor-pointer">
                <router-link :class="$route.name == 'Slider' ? 'custom-active' : ''" to="/slider"
                  class="block py-1 transition duration-300 white-text pl-5 rounded pt-2 pb-2">
                  Homepage Slider
                </router-link>
                <router-link :class="$route.name == 'Partner' ? 'custom-active' : ''" to="/partner"
                  class="block py-1 transition duration-300 white-text pl-5 rounded pt-2 pb-2">
                  Partner Slider
                </router-link>
                <!-- Add more sub-links as needed -->
              </div>
            </div>

            <router-link :class="$route.name == 'Service' ? 'custom-active' : ''" to="/service"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md border-gray-200 hover:bg-gray-300 hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fas fa-handshake align-middle mr-5"></i>
              Service
            </router-link>

            <router-link :class="$route.name == 'Order' ? 'custom-active' : ''" to="/order"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md border-gray-200 hover:bg-gray-300 hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fas fa-shopping-cart align-middle mr-5"></i>
              Orders
            </router-link>

            <div>
              <div
                class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300 hover:text-gray-800 transition duration-400 ease-in-out"
                @click="toggleIndustryDetail" style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                ">
                <div>
                  <i class="fas fa-industry mr-5"></i>
                  Industries
                </div>
                <div>
                  <i v-if="showIndustryDetail" class="ml-2 fas fa-angle-up text-gray-500"></i>
                  <i v-else class="ml-2 fas fa-angle-down text-gray-500"></i>
                </div>
              </div>
              <!-- Sub-link content under Industry -->
              <div v-if="showIndustryDetail" class="ml-6 text-sm text-gray-500 space-y-2 cursor-pointer">
                <router-link :class="$route.name == 'Industry' ? 'custom-active' : ''" to="/industry"
                  class="block py-1 transition duration-300 white-text pl-5 rounded pt-2 pb-2 cursor-pointer">
                  Industry
                </router-link>
                <router-link :class="$route.name == 'IndustryDetail' ? 'custom-active' : ''
                  " to="/industrydetail" class="block py-1 transition duration-300 white-text pl-5 rounded pt-2 pb-2">
                  Industry Detail
                </router-link>
                <!-- Add more sub-links as needed -->
              </div>
            </div>

            <div>
              <div
                class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg cursor-pointer hover:bg-gray-300 hover:text-gray-800 transition duration-400 ease-in-out"
                @click="toggleProductDetail" style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                ">
                <div>
                  <i class="fa-brands fa-product-hunt mr-5"></i>
                  Products
                </div>
                <div>
                  <i v-if="showProductDetail" class="ml-2 fas fa-chevron-up text-gray-500"></i>
                  <i v-else class="ml-2 fas fa-chevron-down text-gray-500"></i>
                </div>
              </div>
              <!-- Sub-link content under Product Model -->
              <div v-if="showProductDetail" class="ml-6 text-sm text-gray-500 space-y-2">
                <router-link :class="$route.name == 'Product' ? 'custom-active' : ''" to="/product"
                  class="block py-1 transition duration-300 white-text pl-5 rounded pt-2 pb-2">
                  Products Model
                </router-link>
                <router-link :class="$route.name == 'SubProduct' ? 'custom-active' : ''" to="/subproduct"
                  class="block py-1 transition duration-300 white-text pl-5 rounded pt-2 pb-2">
                  Sub Product
                </router-link>
                <router-link :class="$route.name == 'SubProductDetail' ? 'custom-active' : ''
                  " to="/subproductdetail"
                  class="block py-1 transition duration-300 white-text pl-5 rounded pt-2 pb-2">
                  Sub Product Detail
                </router-link>
                <!-- Add more sub-links as needed -->
              </div>
            </div>

            <router-link :class="$route.name == 'User' ? 'custom-active' : ''" to="/admin/users"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300 hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fas fa-users mr-5"></i>
              Users
            </router-link>

            <router-link :class="$route.name == 'Inquiry' ? 'custom-active' : ''" to="/admin/inquiry"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300 hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fa fa-commenting mr-5"></i>
              Inquiry
            </router-link>

            <router-link :class="$route.name == 'AdminUser' ? 'custom-active' : ''" to="/admin/create-admin"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300 hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fa-solid fa-user-gear mr-5"></i>
              Admin User
            </router-link>
            <router-link :class="$route.name == 'CompanyInfo' ? 'custom-active' : ''" to="/setting"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300 hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fa-solid fa-gear mr-5"></i>
              Company Info
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full h-full bg-gray-400">
      <div class="h-[50px] bg-gray-100 flex items-center shadow-sm px-[20px] w-full py-[10px] z-10 border-b">
        <!-- Hambuger menu -->
        <div class="cursor-pointer w-[30px]" @click="toggleSideBar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-[25px] h-[25px]">
            <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
          </svg>
        </div>
        <!-- Search bar -->

        <div class="w-[calc(100%-30px)] flex">
          <div class="w-[calc(100%-200px)] flex justify-center">
            <!-- Search bar -->
            <form class="flex items-center w-[500px] d-none">
              <label for="voice-search" class="sr-only">Search</label>
              <div class="relative w-full">
                <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" class="w-5 h-auto text-gray-500 dark:text-gray-400" fill="currentColor"
                    viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"></path>
                  </svg>
                </div>
                <input type="text" id="voice-search"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search..." required />
                <router-link to="/" class="flex absolute inset-y-0 right-0 items-center pr-3">
                </router-link>
              </div>
            </form>
          </div>
          <!-- User login -->
          <div class="w-[500px] flex justify-end align-items-center">
            <!-- Bell icon and badge -->
    <div @click="toggleDropNotify" id="icon" class="mt-1 mr-3">
      <i class="fa-regular fa-bell cursor-pointer" style="font-size: 22px"></i>
      <span class="button__badge">{{ unreadNotificationCount }}</span>
    </div>
            <!-- Notification dropdown -->
    <div v-show="showNotify" id="notification" class="w-[550px] max-h-[550px] overflow-y-auto border rounded-lg border-gray-300 shadow-md" style="overflow-x: hidden;">
      <ul>
        <!-- Button to mark all notifications as read -->
      <button @click="markAllAsRead" class="px-2 py-1 text-sm text-white bg-blue-500 rounded-md">
        Mark All as Read
      </button>
      <li v-for="notification in notifications" :key="notification._id">
        
                  <div @click="handleNotificationClick(notification)" class="wrapper-message flex flex-row justify-between">
                    <div class="flex">
                      <div class="img flex flex-column justify-between" style="overflow: hidden;">
  <div>
    <img
      class="rounded-full border-3"
      :class="{ 'border-gray-500': notification.isRead, 'border-green-500': !notification.isRead }"
      v-if="notification.type == 'register'"
      src="https://cdn-icons-png.flaticon.com/512/306/306232.png"
      style="cursor: pointer; width: 60%;"
    />
    <img
      class="rounded-full border-3"
      :class="{ 'border-gray-500': notification.isRead, 'border-green-500': !notification.isRead }"
      v-if="notification.type == 'order'"
      src="https://media.istockphoto.com/id/898475764/vector/shopping-trolley-cart-icon-in-green-circle-vector.jpg?s=612x612&w=0&k=20&c=W_b90qFRpj_FyLyI19xWqB6EoNSuJYwMSN9nnKkE9Hk="
      style="cursor: pointer; width: 60%;"
    />
    <img
      class="rounded-full border-3"
      :class="{ 'border-gray-500': notification.isRead, 'border-green-500': !notification.isRead }"
      v-if="notification.type == 'inquiry'"
      src="https://www.kindpng.com/picc/m/750-7507149_conversation-circle-icon-png-download-live-chat-icon.png"
      style="cursor: pointer; width: 60%;"
    />
  </div>
  <div class="wrapper-read flex justify-between align-between">
    <i
      class="fa-solid"
      :class="{ 'fa-circle': notification.isRead, 'fa-dot-circle': !notification.isRead, 'text-gray-500': notification.isRead, 'text-green-500': !notification.isRead }"
      style="font-size: 8px;"
    ></i>
  </div>
</div>

                      <div class="flex flex-column w-[350px]">
                        <div>
                          <p style="font-weight: bold; padding-bottom: 10px; font-size: 14px;">{{notification.title}}</p>
                        </div>
                        <div>
                          <p style="font-size: 13px; margin-bottom: 10px;">{{ notification.message }}</p>
                        </div>
                        <div>
                          <p style="font-size: 12px;"><span style="padding-right: 10px;">{{ formatDate(notification.createdAt) }}</span></p>
                        </div>
                      </div>
                    
                  </div>
                    <div class="action flex flex-row">
                      <i @click="deleteNotification(notification, $event)" class="fa-solid fa-xmark cursor-pointer" style="font-size: 127%;"></i>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="flex items-center justify-end space-x-4" @click="toggleDrop">
              <img class="w-10 h-10 rounded-full border-2 border-gray-500"
                src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                style="cursor: pointer" />
              <div class="font-semibold dark:text-gray text-left" v-if="userDetails.fullname && userDetails.email" >
                <div style="cursor: pointer">{{ userDetails.fullname }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ userDetails.email }}
                </div>
              </div>
            </div>
            <!-- Drop down -->
            <div v-show="showDropDown"
              class="absolute right-[15px] top-[47px] z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
              <div class="py-1 text-left" role="none">
                <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                <router-link to="/admin/setting">
                  <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1"
                    id="menu-item-0">Account settings</a>
                </router-link>
                <button @click="logout" class="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem"
                  tabindex="-1" id="menu-item-3">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h-[calc(100vh-50px)] bg-gray-50 p-[20px] overflow-auto">
        <div class="">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <!-- Main  -->
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      unreadNotificationCount: 0,
      notifications: {
        title: '',
        message: '',
        type:'',
        isRead: '',
        moduleId:'',
        createdAt: '',
      },
      accessToken: localStorage.getItem('token'), // Get token from local storage
      userDetails: {
        fullname: '',
        email: ''
      },
      showDropDown: false,
      showNotify: false,
      showSide: true,
      showIndustryDetail: false, // Add this new data property
      showHomeSlider: false,
      showProductDetail: false,
    };
  },
  methods: {
    async handleNotificationClick(notification) {
    try {
      // Mark the notification as read locally
      if (!notification.isRead) {
        notification.isRead = true;

        // Get the token from local storage
        const accessToken = localStorage.getItem('token');

        // Make a request to mark the notification as read on the server-side with the Authorization header
        const markOneReadEndpoint = `notifications/mark-one-read/${notification._id}`;
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        await axios.put(markOneReadEndpoint, null, config);

        // Update the unreadNotificationCount
        this.unreadNotificationCount--;

        // Optionally, you can fetch updated notifications here
        this.fetchNotification();
      }

      // Redirect based on the moduleId (if available)
      if (notification.moduleId) {
        // Generate the route path based on the module type
        let routePath = '';

        switch (notification.type) {
          case 'register':
            routePath = `/admin/users`;
            // the original given to me i don't know how to use it routePath = `/admin/users/${notification.moduleId}`;
            break;
          case 'order':
            routePath = `/order`;
            break;
          case 'inquiry':
            routePath = `/admin/inquiry`;
            break;
          // Handle other notification types as needed
        }

        // Redirect to the generated route path
        if (routePath) {
          this.$router.push(routePath);
        }
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  },
  deleteNotification(notification, event) {
  event.stopPropagation(); 
      // Get the token from local storage
      const accessToken = localStorage.getItem('token');

      // Make a request to delete the notification by its ID on the server-side with the Authorization header
      const deleteNotificationEndpoint = `notifications/delete/${notification._id}`;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios
        .delete(deleteNotificationEndpoint, config)
        .then(response => {
          // Handle success
          console.log('Notification deleted:', response.data);

          // Remove the deleted notification from the local list
          const index = this.notifications.indexOf(notification);
          if (index !== -1) {
            this.notifications.splice(index, 1);
          }
        })
        .catch(error => {
          // Handle error
          console.error('Error deleting notification:', error);
        });
    },
    markAllAsRead() {
    // Get the token from local storage
    const accessToken = localStorage.getItem('token');

    // Make a request to mark all notifications as read on the server-side with the Authorization header
    const markAllReadEndpoint = 'notifications/mark-all-read';
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios.put(markAllReadEndpoint, null, config)
      .then(response => {
        // Handle success
        console.log('All notifications marked as read:', response.data);

        // Update the unreadNotificationCount
        this.unreadNotificationCount = 0;

        // Mark all notifications as read locally
        this.notifications.forEach(notification => {
          notification.isRead = true;
        });
      })
      .catch(error => {
        // Handle error
        console.error('Error marking all notifications as read:', error);
      });
  },
    // Method to fetch notifications (using Long Polling)
    fetchNotification() {
      const notificationEndpoint = '/notifications'; // Replace with your endpoint
      
      // Make a request to the server
      axios.get(notificationEndpoint, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })
      .then(response => {
        // Handle the response and update the UI with new notifications
        const newNotifications = response.data.data.items;
        this.notifications = newNotifications;
        this.unreadNotificationCount = newNotifications.filter(notification => !notification.isRead).length;
        
        // Set up the next Long Polling request (recursive)
        setTimeout(() => {
          this.fetchNotification();
        }, 5000); // Poll every 5 seconds (adjust as needed)
      })
      .catch(error => {
        console.error('Error fetching notification:', error);
        // Handle errors here
        
        // Retry the Long Polling request (recursive) after a delay
        setTimeout(() => {
          this.fetchNotification();
        }, 5000); // Retry after 5 seconds (adjust as needed)
      });
    },
    // Method to mark a notification as read
    markAsRead(notification) {
  if (!notification.isRead) {
    // Mark the notification as read locally
    notification.isRead = true;

   

    // Get the token from local storage
    const accessToken = localStorage.getItem('token');

    // Make a request to mark the notification as read on the server-side with the Authorization header
    const markOneReadEndpoint = `notifications/mark-one-read/${notification._id}`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios.put(markOneReadEndpoint, null, config).then(response => {
      // Handle success or error
      console.log('Notification marked as read:', response.data);

      // Update the unreadNotificationCount
      this.unreadNotificationCount--;

      // Optionally, you can fetch updated notifications here
       this.fetchNotification();
    }).catch(error => {
      // Handle error
      console.error('Error marking notification as read:', error);
    });
  }
},


    formatDate(isoDate) {
      const date = new Date(isoDate);
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
      };
      return date.toLocaleDateString('en-US', options);
    },
    
    toggleDropNotify() {
      this.showNotify = !this.showNotify;
    },
    fetchUserDetails() {
      const userDetailsEndpoint = '/admin/profile';

      const config = {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      };

      axios.get(userDetailsEndpoint, config)
        .then(response => {
          this.userDetails = response.data.data.user;
          this.isLoading = false;
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          this.isLoading = false;
          this.error = error;
        });
    },

    toggleProductDetail() {
      this.showProductDetail = !this.showProductDetail;
    },
    toggleHomeSlider() {
      this.showHomeSlider = !this.showHomeSlider;
    },
    toggleIndustryDetail() {
      this.showIndustryDetail = !this.showIndustryDetail;
    },
    toggleSideBar() {
      this.showSide = !this.showSide;
    },
    toggleDrop() {
      this.showDropDown = !this.showDropDown;
    },
    logout() {
      // Call the logout action in the Vuex store
      this.$store.dispatch("logout"); // Dispatch the logout action
      // Redirect to the login page after logout
      this.$router.push("/");
    },
  },
  created() {
    this.fetchUserDetails();
    this.fetchNotification();
  }
};
</script>

<style lang="scss" scoped>
#icon {
  display: inline-block;
  position: relative;
  padding: 2px 5px;
}

.button__badge {
  background-color: #fa3e3e;
  border-radius: 3px;
  color: white;
  padding: 0px 4px;
  font-size: 10px;
  cursor: pointer;

  position: absolute;
  /* Position the badge within the relatively positioned button */
  top: 0;
  right: 0;
}

#notification {
  position: absolute;
  right: 1%;
  top: 6%;
  z-index: 1;
  padding: 15px;
  // box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 5px;
  background-color: #E8E8E8;
}

.wrapper-message {
  width: 520px;
  display: flex;
  flex-direction: row;
  padding: 15px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 10px;
  z-index: 1;
  cursor: pointer;
  margin: 10px 0;
  background-color: white;
}
#notification .wrapper-message .text p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.img {
  width: 80px;
  // margin-right: 15px;
  padding-left: 10px;

}

body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.white-text {
  color: white;
}

/* Hide the default scrollbar */
::-webkit-scrollbar {
  width: 6px;
  /* Width of the scrollbar */
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
  /* Background of the scrollbar track */
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  /* Color of the scrollbar handle */
  border-radius: 3px;
  /* Rounded corners for the scrollbar handle */
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
  /* Color of the scrollbar handle on hover */
}

/* Handle when actively dragging */
::-webkit-scrollbar-thumb:active {
  background: rgba(0, 0, 0, 0.7);
  /* Color of the scrollbar handle when dragging */
}

.custom-active {
  color: black;
  background-color: white;
}</style>
