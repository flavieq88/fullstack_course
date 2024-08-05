const Notification = ({ text, color }) => {
  if (text === null) {
    return null;
  }

  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  };

  return (
    <div className='notification' style={notificationStyle}>
      {text}
    </div>
  );
};

export default Notification;
