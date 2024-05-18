// Function to calculate the monthly logged in and active users
function getMonthlyLoggedIAandActiveUsers(users, // Array of users
year, // Year for which to calculate the data
month // Month (1-12) for which to calculate the data
) {
    // Initialize sets to store unique user IDs of logged in and active users
    var loggedInUsers = new Set();
    var activeUsers = new Set();
    // Calculate the start date and end date of the given month
    var startDate = new Date(year, month - 1, 1); // First day of the month
    var endDate = new Date(year, month, 0); // Last day of the month
    // Iterate over each user to determine their logged in and active status for the month
    users.forEach(function (user) {
        var isLoggedIn = false; // Flag to indicate if the user was logged in during the month
        var isActive = false; // Flag to indicate if the user was active during the month
        // Iterate over each device of the user
        user.devices.forEach(function (device) {
            var logged_in = device.logged_in, logged_out = device.logged_out, lastSeenAt = device.lastSeenAt;
            // Check if the user was logged in at any time during the month
            if (logged_in <= endDate && // The device was logged in on or before the end of the month
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
    return { loggedInUsers: loggedInUsers, activeUsers: activeUsers };
}
// Example usage of the getMonthlyLoggedIAandActiveUsers function
var users = [
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
var _a = getMonthlyLoggedIAandActiveUsers(users, 2024, 5), loggedInUsers = _a.loggedInUsers, activeUsers = _a.activeUsers;
// Output the results to the console
console.log("Logged In Users:", Array.from(loggedInUsers)); // Expected: ['user1']
console.log("Active Users:", Array.from(activeUsers)); // Expected: ['user1']
