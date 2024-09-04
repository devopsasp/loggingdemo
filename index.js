// Import required modules
const express = require("express");
const app = express();

// Create a simple logger function
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

// Create a simple monitoring object to store request metrics
const metrics = {
  requests: 0,
  responseTimes: {},
};

// Middleware to log requests and update metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    metrics.requests++;
    if (!metrics.responseTimes[req.method]) {
      metrics.responseTimes[req.method] = {};
    }
    if (!metrics.responseTimes[req.method][req.path]) {
      metrics.responseTimes[req.method][req.path] = [];
    }
    metrics.responseTimes[req.method][req.path].push(duration);
  });
  next();
});

// Use the logger middleware
app.use(logger);

// Example route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Expose metrics endpoint
app.get("/metrics", (req, res) => {
  res.json(metrics);
});
