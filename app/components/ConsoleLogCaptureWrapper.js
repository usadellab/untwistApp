import React, { useEffect, useState } from 'react';
import CircularLoader from './CircularLoader';
import MessageWithTimer from './MessageDisplay';

const ConsoleLogCaptureWrapper = ({ customMessages }) => {
  const [capturedLogs, setCapturedLogs]  = useState([]);

  useEffect(() => {
const originalConsoleLog = console.log;
var newLogs = []
console.log = (...args) => {
  newLogs.push(args);
  originalConsoleLog.apply(console, args);
  setCapturedLogs(newLogs)
};
  })

  return <MessageWithTimer messages={[...customMessages, ...capturedLogs]} />;
};

export default ConsoleLogCaptureWrapper;
