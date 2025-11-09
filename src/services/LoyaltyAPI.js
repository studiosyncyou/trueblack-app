// Mock API for Loyalty Program
// Replace with real backend endpoints later

const BASE_URL = 'https://api.trueblack.com'; // Replace with your backend URL

// Mock delay to simulate network request
const mockDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data (replace with real user ID from auth)
const MOCK_USER_ID = 'user123';

const LoyaltyAPI = {
  // Check user's current tier based on spending
  checkTier: async (userId = MOCK_USER_ID) => {
    await mockDelay();
    
    // Mock response - replace with real API call
    return {
      success: true,
      data: {
        tier: 'club', // 'regular', 'club', 'premium'
        currentMonthSpending: 6500,
        rollingAverage: 5200,
        qualifiedForClub: true,
        isSubscribed: true,
      },
    };
    
    // Real API call (uncomment when backend ready):
    // const response = await fetch(`${BASE_URL}/api/loyalty/check-tier`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId }),
    // });
    // return response.json();
  },

  // Get savings summary
  getSavings: async (userId = MOCK_USER_ID) => {
    await mockDelay();
    
    // Mock response
    return {
      success: true,
      data: {
        monthly: 325,
        yearly: 3200,
        lifetime: 8450,
      },
    };
  },

  // Get spending history (last 3 months + current)
  getSpendingHistory: async (userId = MOCK_USER_ID) => {
    await mockDelay();
    
    // Mock response
    return {
      success: true,
      data: {
        currentMonth: 6500,
        last3Months: [5200, 4800, 5100],
        rollingAverage: 5400,
        transactions: [
          {
            id: 1,
            date: '2025-11-05',
            amount: 450,
            items: ['Latte', 'Croissant'],
            discount: 23,
          },
          {
            id: 2,
            date: '2025-11-03',
            amount: 890,
            items: ['Espresso', 'Tiramisu', 'Cappuccino'],
            discount: 45,
          },
        ],
      },
    };
  },

  // Subscribe to Premium
  subscribeToPremium: async (userId = MOCK_USER_ID, paymentDetails) => {
    await mockDelay(1500);
    
    // Mock PhonePe payment success
    // In real app, integrate PhonePe SDK here
    
    return {
      success: true,
      data: {
        subscriptionId: 'sub_' + Date.now(),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 10000,
        paymentMethod: 'PhonePe UPI',
        transactionId: 'txn_' + Date.now(),
      },
    };
  },

  // Cancel subscription
  cancelSubscription: async (userId = MOCK_USER_ID) => {
    await mockDelay();
    
    return {
      success: true,
      message: 'Subscription cancelled successfully',
    };
  },

  // Toggle auto-renewal
  updateAutoRenewal: async (userId = MOCK_USER_ID, enabled) => {
    await mockDelay();
    
    return {
      success: true,
      data: {
        autoRenewal: enabled,
      },
    };
  },

  // Redeem free coffee (Premium only)
  redeemFreeCoffee: async (userId = MOCK_USER_ID, coffeeId) => {
    await mockDelay();
    
    // Check eligibility (3-hour rule, daily limit)
    // This should be validated on backend
    
    return {
      success: true,
      data: {
        coffeesUsedToday: 1,
        maxPerDay: 3,
        nextAvailableTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      },
    };
  },

  // Check coffee availability
  getCoffeeStatus: async (userId = MOCK_USER_ID) => {
    await mockDelay(300);
    
    const now = new Date();
    const lastCoffeeTime = new Date(now.getTime() - 4 * 60 * 60 * 1000); // 4 hours ago
    
    return {
      success: true,
      data: {
        coffeesUsedToday: 0,
        maxPerDay: 3,
        available: true, // Based on 3-hour rule
        lastCoffeeTime: lastCoffeeTime.toISOString(),
        nextAvailableTime: null, // null means available now
      },
    };
  },

  // Check birthday week status
  getBirthdayWeek: async (userId = MOCK_USER_ID) => {
    await mockDelay(300);
    
    return {
      success: true,
      data: {
        birthday: '1990-05-15',
        birthdayWeekActive: false,
        birthdayWeekStart: null,
        birthdayWeekEnd: null,
        birthdayDrinkUsed: false,
      },
    };
  },

  // Send priority notification (admin only)
  sendPriorityNotification: async (message, targetTier = 'premium') => {
    await mockDelay();
    
    return {
      success: true,
      message: 'Notification sent to ' + targetTier + ' members',
    };
  },

  // Calculate discount for order
  calculateDiscount: (orderTotal, foodTotal, tier, isPremium) => {
    let discount = 0;
    
    if (tier === 'club' || tier === 'premium') {
      // Club members get 5% off everything
      discount = orderTotal * 0.05;
    }
    
    if (isPremium && foodTotal > 0) {
      // Premium gets 10% on food instead of 5%
      // Remove the 5% food discount and add 10%
      const foodDiscount = foodTotal * 0.05;
      const premiumFoodDiscount = foodTotal * 0.10;
      discount = discount - foodDiscount + premiumFoodDiscount;
    }
    
    return Math.round(discount);
  },

  // Get spending alert (if user is at risk of losing club status)
  getSpendingAlert: async (userId = MOCK_USER_ID) => {
    await mockDelay();
    
    const rollingAverage = 4200;
    const needed = 5000 - rollingAverage;
    
    if (rollingAverage < 5000) {
      return {
        success: true,
        alert: {
          type: 'warning',
          title: 'Club Status Alert',
          message: `Your 3-month average: ₹${rollingAverage}/month`,
          action: `Spend ₹${needed} more to maintain Drink Black Club status`,
          savings: 1240, // Amount saved in last 3 months
        },
      };
    }
    
    return {
      success: true,
      alert: null,
    };
  },
};

export default LoyaltyAPI;
