const express = require("express");
const cors = require("cors");
const fs = require("fs").promises; // Using fs.promises for async file operations

const app = express();
const PORT = process.env.PORT || 3000;

// Define CORS options
const corsOptions = {
  origin: "*", // Replace with your allowed origin or '*' for any origin
  methods: "GET,POST", // Specify allowed HTTP methods
};

// Middleware
app.use(cors(corsOptions)); // Use CORS middleware with specified options
app.use(express.json()); // Middleware to parse JSON request body

// Define path to JSON file
const filePath = "data.json";

// Async handler function
const asyncHandler = async (req, res, next) => {
  try {
    // Read data from JSON file
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    // Return JSON data
    res.json(jsonData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Route to get all users
app.get("/api/app-data", asyncHandler);

// Route to add a new user
app.post("/api/app-data", async (req, res) => {
  try {
    // Read existing data from the JSON file
    const data = await fs.readFile(filePath, "utf8");
    const users = JSON.parse(data);

    // Extract new user data from request body
    const newUser = req.body;

    // Assign a unique ID to the new user
    const newUserId = users.length > 0 ? users[users.length - 1].ID + 1 : 1;
    newUser.ID = newUserId;

    // Add the new user to the existing list
    users.push(newUser);

    // Write the updated data back to the JSON file
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));

    // Send response with the newly added user
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding new user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "hi from server" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
