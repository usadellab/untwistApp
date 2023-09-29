const capturedLogs = [];

// Override the console.log function
const originalConsoleLog = console.log;
console.log = (...args) => {
  capturedLogs.push(args);
  originalConsoleLog.apply(console, args);
};

export default capturedLogs;
