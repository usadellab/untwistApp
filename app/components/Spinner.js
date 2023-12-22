import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { RotateLoader } from 'react-spinners';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '50%', // Adjust the width as needed
    maxHeight: '70vh', // Limit the maximum height
    padding: '20px',
    overflowY: 'auto', // Allow scrolling if the content exceeds the modal's height
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  appElement: window.document.getElementById('your-app-root'), // Replace with your app's root element
};

const ConsoleLogViewer = () => {
  const [capturedLogs, setCapturedLogs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const originalConsoleLog = console.log;

    console.log = (...args) => {
      setCapturedLogs((prevLogs) => [...prevLogs, JSON.stringify(args)]);
      originalConsoleLog.apply(console, args);
    };

    return () => {
      // Reset the console.log function to the original
      console.log = originalConsoleLog;
    };
  }, []);

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Console Log Viewer"
      >
        <h2>Console Log Viewer</h2>
        {capturedLogs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
        <RotateLoader color="#36D7B7" loading={true} size={20} />
      </Modal>
    </div>
  );
};

export default ConsoleLogViewer;
