import { useSelector } from "react-redux";

const Notification = () => {
  const { message, color } = useSelector((state) => state.notification);

  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: color,
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    width: "95%",
    textAlign: "center",
    margin: "auto",
    marginBottom: 10,
  };

  return (
    <div className="notification" style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
