import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // User tier info
  currentTier: 'regular', // 'regular', 'club', 'premium'
  
  // Spending data
  currentMonthSpending: 0,
  last3MonthsSpending: [0, 0, 0], // [month1, month2, month3]
  rollingAverage: 0,
  
  // Savings data
  currentMonthSavings: 0,
  yearlyTotalSavings: 0,
  lifetimeSavings: 0,
  
  // Premium subscription
  isSubscribed: false,
  subscriptionStartDate: null,
  subscriptionEndDate: null,
  autoRenewal: false,
  nextBillingDate: null,
  
  // Free coffee tracking (Premium only)
  freeCoffeesUsedToday: 0,
  maxFreeCoffeesPerDay: 3,
  lastCoffeeTime: null,
  nextCoffeeAvailableTime: null,
  
  // Birthday
  userBirthday: null, // ISO date string
  birthdayWeekActive: false,
  birthdayWeekStart: null,
  birthdayWeekEnd: null,
  birthdayDrinkUsed: false,
  
  // Notifications
  priorityNotificationsEnabled: true,
  spendingAlerts: [],
  
  // Transaction history
  transactions: [],
  
  // Loading states
  isLoading: false,
  error: null,
};

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    // Set tier
    setTier: (state, action) => {
      state.currentTier = action.payload;
    },
    
    // Update spending
    updateSpending: (state, action) => {
      const { amount, month } = action.payload;
      
      if (month === 'current') {
        state.currentMonthSpending += amount;
        
        // Check if user qualifies for club (₹5,000 in current month)
        if (state.currentMonthSpending >= 5000 && state.currentTier === 'regular') {
          state.currentTier = 'club';
        }
      }
      
      // Update rolling average
      const total = state.last3MonthsSpending.reduce((sum, val) => sum + val, 0) + state.currentMonthSpending;
      state.rollingAverage = total / 4;
    },
    
    setSpendingHistory: (state, action) => {
      state.last3MonthsSpending = action.payload;
      const total = action.payload.reduce((sum, val) => sum + val, 0) + state.currentMonthSpending;
      state.rollingAverage = total / 4;
    },
    
    // Update savings
    addSavings: (state, action) => {
      state.currentMonthSavings += action.payload;
      state.yearlyTotalSavings += action.payload;
      state.lifetimeSavings += action.payload;
    },
    
    setSavings: (state, action) => {
      const { monthly, yearly, lifetime } = action.payload;
      state.currentMonthSavings = monthly;
      state.yearlyTotalSavings = yearly;
      state.lifetimeSavings = lifetime;
    },
    
    // Premium subscription
    activateSubscription: (state, action) => {
      const { startDate, endDate, autoRenewal } = action.payload;
      state.isSubscribed = true;
      state.currentTier = 'premium';
      state.subscriptionStartDate = startDate;
      state.subscriptionEndDate = endDate;
      state.autoRenewal = autoRenewal;
      
      // Calculate next billing date (30 days from start)
      const nextBilling = new Date(startDate);
      nextBilling.setDate(nextBilling.getDate() + 30);
      state.nextBillingDate = nextBilling.toISOString();
    },
    
    cancelSubscription: (state) => {
      state.isSubscribed = false;
      state.autoRenewal = false;
      
      // Downgrade tier based on spending
      if (state.rollingAverage >= 5000) {
        state.currentTier = 'club';
      } else {
        state.currentTier = 'regular';
      }
      
      // Reset free coffee tracking
      state.freeCoffeesUsedToday = 0;
      state.lastCoffeeTime = null;
      state.nextCoffeeAvailableTime = null;
    },
    
    toggleAutoRenewal: (state) => {
      state.autoRenewal = !state.autoRenewal;
    },
    
    // Free coffee tracking
    redeemFreeCoffee: (state) => {
      const now = new Date();
      state.freeCoffeesUsedToday += 1;
      state.lastCoffeeTime = now.toISOString();
      
      // Set next available time (3 hours from now)
      const nextAvailable = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      state.nextCoffeeAvailableTime = nextAvailable.toISOString();
    },
    
    resetDailyFreeCoffees: (state) => {
      state.freeCoffeesUsedToday = 0;
      state.nextCoffeeAvailableTime = null;
    },
    
    checkCoffeeAvailability: (state) => {
      const now = new Date();
      
      // Check if 3 hours have passed since last coffee
      if (state.nextCoffeeAvailableTime) {
        const nextAvailable = new Date(state.nextCoffeeAvailableTime);
        if (now >= nextAvailable) {
          state.nextCoffeeAvailableTime = null;
        }
      }
    },
    
    // Birthday
    setBirthday: (state, action) => {
      state.userBirthday = action.payload;
    },
    
    checkBirthdayWeek: (state) => {
      if (!state.userBirthday) return;
      
      const now = new Date();
      const birthday = new Date(state.userBirthday);
      birthday.setFullYear(now.getFullYear()); // Use current year
      
      // Birthday week: 3 days before + birthday + 3 days after
      const weekStart = new Date(birthday);
      weekStart.setDate(weekStart.getDate() - 3);
      
      const weekEnd = new Date(birthday);
      weekEnd.setDate(weekEnd.getDate() + 3);
      
      state.birthdayWeekActive = now >= weekStart && now <= weekEnd;
      
      if (state.birthdayWeekActive) {
        state.birthdayWeekStart = weekStart.toISOString();
        state.birthdayWeekEnd = weekEnd.toISOString();
      }
    },
    
    useBirthdayDrink: (state) => {
      state.birthdayDrinkUsed = true;
    },
    
    resetBirthdayDrink: (state) => {
      state.birthdayDrinkUsed = false;
    },
    
    // Notifications
    togglePriorityNotifications: (state) => {
      state.priorityNotificationsEnabled = !state.priorityNotificationsEnabled;
    },
    
    addSpendingAlert: (state, action) => {
      state.spendingAlerts.push({
        id: Date.now(),
        message: action.payload,
        timestamp: new Date().toISOString(),
        read: false,
      });
    },
    
    markAlertAsRead: (state, action) => {
      const alert = state.spendingAlerts.find(a => a.id === action.payload);
      if (alert) {
        alert.read = true;
      }
    },
    
    // Transactions
    addTransaction: (state, action) => {
      state.transactions.unshift({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    
    // Loading/Error
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTier,
  updateSpending,
  setSpendingHistory,
  addSavings,
  setSavings,
  activateSubscription,
  cancelSubscription,
  toggleAutoRenewal,
  redeemFreeCoffee,
  resetDailyFreeCoffees,
  checkCoffeeAvailability,
  setBirthday,
  checkBirthdayWeek,
  useBirthdayDrink,
  resetBirthdayDrink,
  togglePriorityNotifications,
  addSpendingAlert,
  markAlertAsRead,
  addTransaction,
  setTransactions,
  setLoading,
  setError,
  clearError,
} = loyaltySlice.actions;

export default loyaltySlice.reducer;
