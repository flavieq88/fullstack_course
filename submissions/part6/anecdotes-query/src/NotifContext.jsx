import { createContext, useReducer, useContext } from 'react';

const notifReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIF':
      return action.payload;
    case 'CLEAR_NOTIF':
      return '';
    default:
      return state;
  };
};

const NotifContext = createContext();

export const NotifContextProvider = (props) => {
  const [notif, notifDispatch] = useReducer(notifReducer, '');

  return (
    <NotifContext.Provider value={[notif, notifDispatch]}>
      {props.children}
    </NotifContext.Provider>
  );
};

export const useNotifValue = () => {
  const notifAndDispatch = useContext(NotifContext);
  return notifAndDispatch[0];
};

export const useNotifDispatch = () => {
  const notifAndDispatch = useContext(NotifContext);
  return notifAndDispatch[1];
};

export default NotifContext;
