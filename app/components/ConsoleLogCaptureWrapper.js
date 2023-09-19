import React, { useEffect, useState } from 'react';
import CircularLoader from './CircularLoader';
import MessageWithTimer from './MessageDisplay';

const ConsoleLogCaptureWrapper = ({ customMessages }) => {
  const [consoleLogs, setConsoleLogs] = useState([]);

  useEffect(() => {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      setConsoleLogs(prevLogs => [...prevLogs, args.join(' ')]);
      originalConsoleLog(...args);
    };
  }, []);

  return <MessageWithTimer messages={[...customMessages, ...consoleLogs]} />;
};

export default ConsoleLogCaptureWrapper;
