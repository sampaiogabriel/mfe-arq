import React, { useEffect, useState } from 'react';
import { decodeJWT, getToken, redirectToKeycloak } from './keycloak';

const root = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const result = decodeJWT(token);

      console.log('result', result);
    }

    // const urlParams = new URLSearchParams(window.location.hash.split("#")[1]);
    // const code = urlParams.get("code");

    // if (code) {
    //   getToken(code);
    // }

    if (!token) {
      const urlParams = new URLSearchParams(window.location.hash.split("#")[1]);
      const code = urlParams.get("code");

      if (code) {
        getToken(code);
      } else {
        redirectToKeycloak();
      }
    } else {
      setLoading(false);
    }
  }, []);

  return null
};

export default root;