import React from 'react';

const MessageWithTimer = ({ messages, timeElapsed }) => {
  // Check if any message includes the text parsing output
  const includesParsingOutput = messages.some(message => message.includes('Parsing output'));

  // Filter the last five messages and remove empty strings
  const lastFiveMessages = messages.filter(message => message.trim() !== '').slice(Math.max(messages.length - 5, 0));

  // Calculate the percentage of time elapsed
  const progressPercentage = includesParsingOutput ? 99 : (timeElapsed / 60) * 100; // If parsing output is included, set progress to 99%

  return (
    <div style={styles.overlay}>
      <div style={styles.centeredContent}>
        <div style={styles.messageBox}>
          <div style={styles.scrollableContent}>
            {lastFiveMessages.map((message, index) => (
              <div key={index} style={index === lastFiveMessages.length - 1 ? styles.boldMessage : styles.message}>
                {message}
              </div>
            ))}
          </div>
          <div style={{ color: 'blue', marginBottom: 10 }}>Time Elapsed: {timeElapsed} seconds</div>
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: `${progressPercentage}%`, backgroundColor: includesParsingOutput ? 'green' : 'blue' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageWithTimer;

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    zIndex: 10000,
  },
  messageBox: {
    height: 240, // Fixed height for the message box
    overflow: 'hidden', // Hide overflow content
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    textAlign: 'center',
    margin: '0 auto',
  },
  scrollableContent: {
    maxHeight: 330, // Maximum height for the scrollable content
    overflowY: 'auto', // Enable vertical scrolling
    marginBottom: 10, // Space for time elapsed message
  },
  message: {
    fontSize: 16,
    padding: '5px 0',
    borderBottom: '1px solid #ccc',
    wordWrap: 'break-word', // Wrap long text
    textAlign: 'left', // Align text to the left
    opacity: 0.5, // Make other messages appear faded
  },
  boldMessage: {
    fontWeight: 'bold', // Make the latest message bold
    fontSize: 18,
    padding: '5px 0',
    borderBottom: '1px solid #ccc',
    wordWrap: 'break-word', // Wrap long text
    textAlign: 'left', // Align text to the left
  },
  progressBarContainer: {
    width: '100%',
    height: 20, // Thicker height for the progress bar
    backgroundColor: '#ddd',
    borderRadius: 0, // Square corners
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'blue',
    transition: 'width 1s linear',
  },
};
