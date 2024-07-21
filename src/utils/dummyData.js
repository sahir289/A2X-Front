const moment = require("moment");

module.exports = Object.freeze({
  CALENDAR_INITIAL_EVENTS: [
    {
      title: "Product call",
      theme: "GREEN",
      startTime: moment().add(-12, "d").startOf("day"),
      endTime: moment().add(-12, "d").endOf("day"),
    },
    {
      title: "Meeting with tech team",
      theme: "PINK",
      startTime: moment().add(-8, "d").startOf("day"),
      endTime: moment().add(-8, "d").endOf("day"),
    },
    {
      title: "Meeting with Cristina",
      theme: "PURPLE",
      startTime: moment().add(-2, "d").startOf("day"),
      endTime: moment().add(-2, "d").endOf("day"),
    },
    {
      title: "Meeting with Alex",
      theme: "BLUE",
      startTime: moment().startOf("day"),
      endTime: moment().endOf("day"),
    },
    {
      title: "Product Call",
      theme: "GREEN",
      startTime: moment().startOf("day"),
      endTime: moment().endOf("day"),
    },
    {
      title: "Client Meeting",
      theme: "PURPLE",
      startTime: moment().startOf("day"),
      endTime: moment().endOf("day"),
    },
    {
      title: "Client Meeting",
      theme: "ORANGE",
      startTime: moment().add(3, "d").startOf("day"),
      endTime: moment().add(3, "d").endOf("day"),
    },
    {
      title: "Product meeting",
      theme: "PINK",
      startTime: moment().add(5, "d").startOf("day"),
      endTime: moment().add(5, "d").endOf("day"),
    },
    {
      title: "Sales Meeting",
      theme: "GREEN",
      startTime: moment().add(8, "d").startOf("day"),
      endTime: moment().add(8, "d").endOf("day"),
    },
    {
      title: "Product Meeting",
      theme: "ORANGE",
      startTime: moment().add(8, "d").startOf("day"),
      endTime: moment().add(8, "d").endOf("day"),
    },
    {
      title: "Marketing Meeting",
      theme: "PINK",
      startTime: moment().add(8, "d").startOf("day"),
      endTime: moment().add(8, "d").endOf("day"),
    },
    {
      title: "Client Meeting",
      theme: "GREEN",
      startTime: moment().add(8, "d").startOf("day"),
      endTime: moment().add(8, "d").endOf("day"),
    },
    {
      title: "Sales meeting",
      theme: "BLUE",
      startTime: moment().add(12, "d").startOf("day"),
      endTime: moment().add(12, "d").endOf("day"),
    },
    {
      title: "Client meeting",
      theme: "PURPLE",
      startTime: moment().add(16, "d").startOf("day"),
      endTime: moment().add(16, "d").endOf("day"),
    },
  ],

  RECENT_DEPOSIT_IN_PROGRESS: [
    {
      id: 1,
      amount: 150.75,
      code: 'A123',
      status: 'Completed',
      user: 'John Doe',
      merchant: 'Amazon',
      merchantOrderId: 'M123456',
      payingUUID: 'UUID12345',
      lastUpdated: '2024-05-30T10:30:00Z'
    },
    {
      id: 2,
      amount: 89.99,
      code: 'B456',
      status: 'Pending',
      user: 'Jane Smith',
      merchant: 'Ebay',
      merchantOrderId: 'M654321',
      payingUUID: 'UUID67890',
      lastUpdated: '2024-06-01T14:45:00Z'
    },
    {
      id: 3,
      amount: 299.99,
      code: 'C789',
      status: 'Failed',
      user: 'Alice Johnson',
      merchant: 'Walmart',
      merchantOrderId: 'M112233',
      payingUUID: 'UUID11223',
      lastUpdated: '2024-06-02T09:15:00Z'
    },
    {
      id: 4,
      amount: 49.99,
      code: 'D012',
      status: 'Completed',
      user: 'Bob Brown',
      merchant: 'Best Buy',
      merchantOrderId: 'M445566',
      payingUUID: 'UUID33445',
      lastUpdated: '2024-05-29T11:30:00Z'
    },
    {
      id: 5,
      amount: 120.00,
      code: 'E345',
      status: 'Processing',
      user: 'Charlie Davis',
      merchant: 'Target',
      merchantOrderId: 'M778899',
      payingUUID: 'UUID55667',
      lastUpdated: '2024-06-03T16:00:00Z'
    }
  ]

});
