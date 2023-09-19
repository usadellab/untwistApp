// import React, { useEffect, useState } from 'react';
// import CircularLoader from './CircularLoader';

// const MessageWithTimer = ({ messages }) => {
//   const [timeElapsed, setTimeElapsed] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimeElapsed((prevTime) => prevTime + 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.centeredContent}>
//         <CircularLoader />
//         <div style={styles.messageBox}>
//           {messages.map((message, index) => (
//             <div key={index} style={styles.message}>
//               {message}
//             </div>
//           ))}
//         </div>
//         <div style={styles.timer}>Time elapsed: {timeElapsed} seconds</div>
//       </div>
//     </div>
//   );
// };

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw', // Cover the full viewport width
    height: '100vh', // Cover the full viewport height
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dimmed background
    zIndex: 9999, // Higher z-index to ensure it's above other content
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    textAlign: 'center',
    zIndex: 10000, // Higher z-index for content within the overlay
  },
  messageBox: {
    maxWidth: 1000, // Increased box size
    margin: '0 auto',
  },
  message: {
    fontSize: 18,
    padding: '5px 0',
    borderBottom: '1px solid #ccc',
    wordWrap: 'break-word', // Wrap long text
    textAlign: 'left', // Align text to the left
  },
  timer: {
    fontSize: 14,
    marginTop: 10,
  },
};

// export default MessageWithTimer;



import React, { useEffect, useState } from 'react';
import CircularLoader from './CircularLoader';

const MessageWithTimer = ({ messages }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.centeredContent}>
        <CircularLoader />
        <div style={styles.messageBox}>
          {messages.map((message, index) => (
            <div key={index} style={styles.message}>
              {message}
            </div>
          ))}
        </div>
        <div style={styles.timer}>Time elapsed: {timeElapsed} seconds</div>
      </div>
    </div>
  );
};

export default MessageWithTimer;
// Rest of your styles and export statement remain unchanged


