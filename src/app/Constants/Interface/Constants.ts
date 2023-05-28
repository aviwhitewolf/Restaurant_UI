import * as moment from 'moment';
import { environment } from 'src/environments/environment';
export class Constants {
  public static readonly UI_DOMAIN = environment.uiDomain
  // public static readonly UI_DOMAIN = "http://192.168.29.228:4200"
  public static readonly BASE_URL = environment.baseUrl
  // public static BASE_URL = "http://192.168.29.228:1337"
  public static readonly LOCAL_CART = "cart"
  public static readonly LOCAL_USER = "user"
  public static readonly LOCAL_RECENT_DISHES = "recent-dishes"
  public static readonly LOCAL_RECENT_DISHES_LIMIT = 5
  public static readonly SUCCESS = "success"
  public static readonly FAILED = "failed"
  public static readonly RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'
  public static readonly RAZORPAY_KEY = environment.razorpayKey
  public static readonly CREATE_ORDER_URL = "/api/payment/createOrder"
  public static readonly ORDER_URL = "/api/orders"
  public static readonly ME_URL = "/api/users/me"
  public static readonly ME_UPDATE_URL = "/api/users"
  public static readonly RESTAURANT_URL = '/api/restaurants'
  public static readonly MENU_URL = '/api/menus'
  public static readonly LOGIN_URL = '/api/users/login'
  public static readonly VERIFY_USER_URL = '/api/users/verify'

  public static readonly ADMIN_ORDER = '/api/admin/orders'
  public static readonly ALL_ORDER_API = '/api/orders/getAllOrders'

  public static readonly ADMIN_GET_OVERVIEW = '/api/admin/getOverview'
  public static readonly ADMIN_SINGLE_ORDER = '/api/orders'
  public static readonly ADMIN_GET_ALLDISHES = '/api/admin/dishes'

  public static readonly ADMIN_USER = '/api/admin/users'
  public static readonly ADMIN_RESTAURANTS = '/api/admin/restaurants'
  public static readonly ADMIN_MENUS = '/api/admin/menus'

  public static readonly ADMIN_UI_MENU = '/api/admin-menus'

  public static readonly ADMIN_TAG = "/api/admin/tags"

  public static readonly ADMIN_DISH = "/api/admin/dishes"

  public static readonly TABLE = "/api/tables"
  public static readonly ADMIN_TABLE = "/api/admin/tables"


  public static readonly ADMIN_ADD_TAG = "/api/tags"
  public static readonly ADMIN_EMPLOYEE = '/api/employees'
  public static readonly ADMIN_SEARCH_EMPLOYEE = '/api/employee/search'
  public static readonly ADMIN_EMPLOYEE_UPDATE_IMAGE = '/api/employee/image'
  public static readonly ADMIN_EMPLOYEE_ME = '/api/employee/me'
  public static readonly ADMIN_USER_ME = '/api/admin/users/updateMe'

  public static readonly ADMIN_RESTAURANT_INFO = '/api/restaurant/info'
  public static readonly ADMIN_ALL_DESIGNATION = '/api/designations'
  public static readonly ADMIN_EMPLOYEE_UPLOAD = '/api/employee/documents'

  public static readonly ADMIN_EXPENSE = '/api/expenses'
  public static readonly ADMIN_EXPENSE_UPLOAD = '/api/expense/documents'
  public static readonly ADMIN_EXPENSE_CATEGORY = '/api/expense-categories'

  public static readonly ADMIN_WEBPUSH = '/api/subscribe/webpush'

  public static readonly ADMIN_TAX = '/api/admin/taxes'

  public static readonly POLICY = '/api/policy'

  public static readonly CHANGE_IN_CART_ITEMS = "CHANGE_IN_CART_ITEMS"
  public static readonly TITLE = "Cafe"
  public static readonly OTP_TIMER = 60
  public static RESTAURANT_SLUG = ""
  public static readonly PAYMENT_DESCRIPTION = "Payment of your order";
  public static readonly FAVICON = ""
  public static readonly THEME = [
    {
      name: 'slide',
      icon: 'swipe'
    },
    {
      name: 'grid',
      icon: 'grid_view'
    },
    {
      name: 'list',
      icon: 'format_list_bulleted'
    }]
  public static readonly MENUS = [
    {
      name: 'Home',
      slug: 'home',
      icon: 'home'
    },
    {
      name: 'Search',
      slug: 'search',
      icon: 'search'
    },
    {
      name: 'Cart',
      slug: 'cart',
      icon: 'shopping_cart'
    },
    {
      name: 'Orders',
      slug: 'orders',
      icon: 'receipt_long'
    }

  ]

  public static readonly DATE_RANGE = {
    'Today': {
      start: moment().startOf('day').toISOString(),
      end: moment().endOf('day').toISOString(),
      'x-axis': 'hours'
    },
    'Yesterday': {
      start: moment().subtract(1, 'day').startOf('day').toISOString(),
      end: moment().subtract(1, 'day').endOf('day').toISOString(),
      'x-axis': 'hours'
    },
    'This week': {
      start: moment().isoWeekday(1).startOf('day').toISOString(),
      end: moment().isoWeekday(7).endOf('day').toISOString(),
      'x-axis': 'days'
    },
    'This month': {
      start: moment().clone().startOf('month').startOf('day').toISOString(),
      end: moment().endOf('month').endOf('day').toISOString(),
      'x-axis': 'days'
    },
    'Last month': {
      start: moment().subtract(1, 'months').startOf('month').startOf('day').toISOString(),
      end: moment().subtract(1, 'months').endOf('month').endOf('day').toISOString(),
      'x-axis': 'days'
    },
    'Last 2 month': {
      start: moment().subtract(2, 'months').startOf('month').startOf('day').toISOString(),
      end: moment().subtract(1, 'months').endOf('month').endOf('day').toISOString(),
      'x-axis': 'days'
    },
    'Last 3 months': {
      start: moment().subtract(3, 'months').startOf('month').startOf('day').toISOString(),
      end: moment().subtract(1, 'months').endOf('month').endOf('day').toISOString(),
      'x-axis': 'days'
    },
    'Last 6 months': {
      start: moment().subtract(6, 'months').startOf('month').startOf('day').toISOString(),
      end: moment().subtract(1, 'months').endOf('month').endOf('day').toISOString(),
      'x-axis': 'months'
    },
    'This year': {
      start: moment().clone().startOf('year').startOf('day').toISOString(),
      end: moment().clone().endOf('year').endOf('day').toISOString(),
      'x-axis': 'months'
    },
    'Last year': {
      start: moment().subtract(1, 'year').startOf('year').startOf('day').toISOString(),
      end: moment().subtract(1, 'year').endOf('year').endOf('day').toISOString(),
      'x-axis': 'months'
    }
  }
  public static readonly DEFAULT_DATE_RANGE = 'This month'

  public static readonly ADMIN_MENU = [
    {
      name: 'Home',
      slug: 'home',
      icon: 'home',
      submenu: null,
      showSubMenu : false
    },
    {
      name: 'Orders',
      slug: 'orders',
      icon: 'receipt_long',
      submenu: null,
      showSubMenu : false
    },
    {
      name: 'Expense',
      icon: 'currency_rupee',
      slug : 'expense',
      submenu: [
        {
          name: 'Expense Category',
          slug: 'category',
        },
        {
          name: 'Overview',
          slug: 'overview',
        }
      ],
      showSubMenu : false
    },
    {
      name: 'Restaurants',
      slug: 'restaurants',
      icon: 'restaurant',
      submenu: null,
      showSubMenu : false
    },
    {
      name: 'Dishes',
      slug: 'dishes',
      icon: 'lunch_dining',
      submenu: null,
      showSubMenu : false
    },
    {
      name: 'Menu',
      slug: 'menu',
      icon: 'menu',
      submenu: null,
      showSubMenu : false
    },
    {
      name: 'Staff',
      slug: 'staff',
      icon: 'supervisor_account',
      submenu: null,
      showSubMenu : false
    },
    {
      name: 'Tables',
      slug: 'tables',
      icon: 'table_restaurant',
      submenu: null,
      showSubMenu : false
    }
  ]

  public static readonly ADMIN_DROPDOWN_ORDER_MENU = [
    {
      name: 'Payment Status',
      selectedColumn: "",
      columns: ['success', 'failed', 'pending', 'refund'],
      editable: false,
      showDropDown: false
    },
    {
      name: 'Food Status',
      selectedColumn: "",
      columns: ['cancel', 'preparing', 'ready', 'served', 'hold'],
      editable: true,
      showDropDown: false
    },
    {
      name: 'Preparation Time',
      selectedColumn: "",
      columns: ['5-10 Mins', '10-20 Mins', '20-30 Mins', '30-40 Mins', '40-50 Mins', '1 Hour'],
      editable: true,
      showDropDown: false
    }
  ]

  // If you are chaning name of ADMIN_DROPDOWN_ORDER_MENU, then change here as well
  public static readonly ADMIN_ORDER_STATUS_DROPDOWN = 'Payment Status'
  public static readonly ADMIN_FOOD_STATUS_DROPDOWN = 'Food Status'
  public static readonly ADMIN_FOOD_PREPARATION_DROPDOWN = 'Preparation Time'
  public static readonly MAX_IMAGE_SIZE_IN_MB: string = '8';

  public static readonly IMAGE_JSON_STRUCTURE_WITH_ATTRIBUTE = "WITH_ATTRIBUTE"
  public static readonly IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE = "WITHOUT_ATTRIBUTE"
  public static readonly QRCODE_SCALE =
    {
      'x-small': 2,
      'small': 3,
      'medium': 4,
      'large': 5,
      'X-large': 6,
      'XX-large': 8,
      'XXX-large': 12
    }

  public static readonly IMAGE_SIZE = {
    'thumbnail': 'THUMBNAIL',
    'small': 'SAMLL',
    'medium': 'MEDIUM',
    'normal': 'NORMAL',
    'large': 'LARGE'
  }
  public static readonly PAGE_SIZE: number = 10;

  public static readonly SOCKET_ORDER_RECIEVED = 'order::created'
  public static readonly SOCKET_ORDER_READ = 'order::read'

  public static readonly VAPID_PUBLIC_KEY = 'BD7y67C-accMahGgdG-qi6GWFsCrKq_HYUvt6ffLchiCnp2jRVXE4vGo1AfJ7Ec058VlsKYnsj_qvEr5Y49MR2I'
  public static readonly ORDER_RECIEVED_SOUND_PATH: string = environment.assestPath +  '/sounds/order_received.mp3';

}