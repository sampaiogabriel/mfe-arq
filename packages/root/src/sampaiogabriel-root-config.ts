import { registerApplication, start } from 'single-spa';
import {
  constructApplications,
  constructLayoutEngine,
  constructRoutes,
} from 'single-spa-layout';

import { handleAuth } from './authService';
import microfrontendLayout from './microfrontend-layout-protected.html';

const configureSingleSPA = async () => {
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
};

const main = async () => {
  const isAuthenticated = await handleAuth();
  if (isAuthenticated) {
    await configureSingleSPA();
  }
};

main();
