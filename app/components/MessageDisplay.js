import CircularLoader from './CircularLoader';

const MessageWithTimer = ({ messages, timeElapsed }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.centeredContent}>
        <CircularLoader />
        <div style={styles.messageBox}>
          <div style={styles.scrollableContent}>
            {messages.map((message, index) => (
              <div key={index} style={styles.message}>
                {message}
              </div>
            ))}
          </div>
          <div style={{color:'blue'}} >Time Elapsed: {timeElapsed} seconds</div>
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
    width: '100vw', // Cover the full viewport width
    height: '100vh', // Cover the full viewport height
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dimmed background
    zIndex: 9999, // Higher z-index to ensure it's above other content
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    backgroundColor: 'grey',
    padding: 20,
    borderRadius: 8,
    textAlign: 'center',
    zIndex: 10000, // Higher z-index for content within the overlay
  },
  messageBox: {
    maxWidth: 1000, // Increased box size
    margin: '0 auto',
  },
  scrollableContent: {
    maxHeight: '300px', // Set a maximum height for the scrollable content
    overflow: 'auto', // Enable scrolling when content exceeds the height
  },
  message: {
    fontSize: 14,
    padding: '5px 0',
    borderBottom: '1px solid #ccc',
    wordWrap: 'break-word', // Wrap long text
    textAlign: 'left', // Align text to the left
  },
  timer: {
    fontSize: 18,
    marginTop: 10,
  },
};
