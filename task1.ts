// Define an interface for Device, which includes timestamps for logged_in, logged_out, and lastSeenAt
interface Device {
  logged_in: Date;
  logged_out: Date | null; // logged_out can be null if the user is still logged in
  lastSeenAt: Date; // the last time the user was seen using this device
}

// Define an interface for User, which includes a userId and an array of devices
interface User {
  userId: string;
  devices: Device[];
}

// Function to calculate the monthly logged in and active users
function getMonthlyLoggedIAandActiveUsers(
  users: User[], // Array of users
  year: number, // Year for which to calculate the data
  month: number // Month (1-12) for which to calculate the data
): { loggedInUsers: Set<string>; activeUsers: Set<string> } {
  // Initialize sets to store unique user IDs of logged in and active users
  const loggedInUsers = new Set<string>();
  const activeUsers = new Set<string>();

  // Calculate the start date and end date of the given month
  const startDate = new Date(year, month - 1, 1); // First day of the month
  const endDate = new Date(year, month, 0); // Last day of the month

  // Iterate over each user to determine their logged in and active status for the month
  users.forEach((user) => {
    let isLoggedIn = false; // Flag to indicate if the user was logged in during the month
    let isActive = false; // Flag to indicate if the user was active during the month

    // Iterate over each device of the user
    user.devices.forEach((device) => {
      const { logged_in, logged_out, lastSeenAt } = device;

      // Check if the user was logged in at any time during the month
      if (
        logged_in <= endDate && // The device was logged in on or before the end of the month
        (logged_out === null || logged_out >= startDate) // The device was not logged out or logged out after the start of the month
      ) {
        isLoggedIn = true; // Mark the user as logged in
      }
      // Check if the user was active (last seen) at any time during the month
      if (lastSeenAt >= startDate && lastSeenAt <= endDate) {
        isActive = true; // Mark the user as active
      }
    });

    // Add the user to the loggedInUsers set if they were logged in during the month
    if (isLoggedIn) {
      loggedInUsers.add(user.userId);
    }
    // Add the user to the activeUsers set if they were active during the month
    if (isActive) {
      activeUsers.add(user.userId);
    }
  });

  // Return an object containing the sets of logged in and active users
  return { loggedInUsers, activeUsers };
}

// Example usage of the getMonthlyLoggedIAandActiveUsers function

const users: User[] = [
  {
    userId: "user1",
    devices: [
      {
        logged_in: new Date("2024-04-15"),
        logged_out: new Date("2024-05-20"),
        lastSeenAt: new Date("2024-05-10"),
      },
      {
        logged_in: new Date("2024-05-01"),
        logged_out: null,
        lastSeenAt: new Date("2024-05-15"),
      },
    ],
  },
  {
    userId: "user2",
    devices: [
      {
        logged_in: new Date("2023-11-01"),
        logged_out: null,
        lastSeenAt: new Date("2024-04-05"),
      },
    ],
  },
  {
    userId: "user3",
    devices: [
      {
        logged_in: new Date("2023-11-01"),
        logged_out: new Date("2024-02-05"),
        lastSeenAt: new Date("2024-02-05"),
      },
    ],
  },
];

// Calculate the logged in and active users for May 2024
const { loggedInUsers, activeUsers } = getMonthlyLoggedIAandActiveUsers(
  users,
  2024,
  5
);

// Output the results to the console
console.log("Logged In Users:", Array.from(loggedInUsers)); // Expected: ['user1', 'user2'] since 'user3' is logged out
console.log("Active Users:", Array.from(activeUsers)); // Expected: ['user1']
