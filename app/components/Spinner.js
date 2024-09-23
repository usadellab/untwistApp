# This file is part of [untwistApp], copyright (C) 2024 [ataul haleem].

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
