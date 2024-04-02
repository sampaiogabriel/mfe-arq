/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable n/handle-callback-err */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { registerApplication, start } from 'single-spa';
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from 'single-spa-layout';

import microfrontendLayout from './microfrontend-layout-protected.html';

const baseUrl = 'https://login.e-auditoria.com.br';
const realm = 'aplicacao-cliente';
const clientId = 'client-cliente';
const clientSecret = 'EldjqZ7LDThiQ0f4DuLxIIf38VyilZdP';
const redirect = 'http://localhost:9000';

const token = sessionStorage.getItem('token');

const generateRandomState = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const redirectToKeycloak = () => {
  const state = generateRandomState();
  const nonce = generateRandomState();
  const urlParams = {
    client_id: clientId,
    redirect_uri: redirect,
    response_mode: 'fragment',
    response_type: 'code',
    scope: 'openid',
    nonce,
    state,
  };
  const connectionURI = new URL(
    `${baseUrl}/realms/${realm}/protocol/openid-connect/auth`,
  );

  for (const key of Object.keys(urlParams)) {
    connectionURI.searchParams.append(key, urlParams[key]);
  }

  console.log('connectionURI', connectionURI);

  window.location.href = `${connectionURI}`;
};

export const getToken = async (code) => {
  try {
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('redirect_uri', redirect);

    const response = await fetch(
      `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to get token');
    }

    const data = await response.json();

    console.log('data', data);

    sessionStorage.setItem('token', data.access_token);
    sessionStorage.setItem('id_token', data.id_token);
    sessionStorage.setItem('refresh_token', data.refresh_token);
    sessionStorage.setItem('session_state', data.session_state);
    window.history.replaceState({}, '', '/');
    // window.location.reload();
  } catch (error) {
    console.error('Error:', error);
  }
};

const validateToken = async (refreshToken: string) => {
  console.log('refreshToken', refreshToken);

  const formData = new URLSearchParams();
  formData.append('client_id', 'client-cliente');
  formData.append('client_secret', 'EldjqZ7LDThiQ0f4DuLxIIf38VyilZdP');
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', refreshToken);

  const response = await fetch(
    `https://login.e-auditoria.com.br/realms/aplicacao-cliente/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    },
  );

  console.log('response', response);

  if (response.status === 400) {
    throw new Error();
  }
};

const urlParams = new URLSearchParams(window.location.hash.split('#')[1]);
const code = urlParams.get('code');

if (code) {
  getToken(code);
}

const refreshToken = sessionStorage.getItem('refresh_token');

if (refreshToken) {
  validateToken(refreshToken)
    .then((e) => {
      console.log('teste');

      const routes = constructRoutes(microfrontendLayout);

      const applications = constructApplications({
        routes,
        loadApp({ name }) {
          return System.import(name);
        },
      });
      const layoutEngine = constructLayoutEngine({ routes, applications });

      applications.forEach(registerApplication);
      layoutEngine.activate();
      start();
    })
    .catch((err) => {
      console.log('errsssssssssssssssssssssssssss', err);

      redirectToKeycloak();
    });
}
