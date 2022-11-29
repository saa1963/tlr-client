import { useEffect, useState } from 'react';
import { ApiClient } from './ApiClient';
import './App.css';
import AppHeader from './AppHeader/AppHeader';
import { AuthContext } from './Contexts';

function App() {
  const [authInfo, setAuthInfo] = useState({});
  useEffect(() => {
    ApiClient.getInstance().TestToken()
    .then((login) => {
      if (login) {
        const jwtToken = localStorage.getItem('tokenTL');
        const user = localStorage.getItem('userTL');
        if (jwtToken && user) {
          setAuthInfo({ jwtToken: jwtToken, user: user });
        }
      }  
    })
  }, []);
  return (
    <AuthContext.Provider value={[authInfo, setAuthInfo]}>
      <AppHeader />
    </AuthContext.Provider>
  );
}

export default App;
