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
// const client_secret = 'EldjqZ7LDThiQ0f4DuLxIIf38VyilZdP';
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
  sessionStorage.clear();
  localStorage.clear();

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
  window.location.href = `${connectionURI}`;
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

const refreshToken = sessionStorage.getItem('refresh_token');

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
