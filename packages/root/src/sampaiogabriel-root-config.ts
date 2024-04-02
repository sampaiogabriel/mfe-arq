import { start } from 'single-spa';

function handleVerifyAuth() {
  const token = JSON.parse(
    sessionStorage.getItem(
      'oidc.user:https://login.e-auditoria.com.br/realms/aplicacao-cliente:client-cliente',
    ),
  );

  return [(location) => location.pathname === '/' && token];
}

System.import('single-spa').then(({ registerApplication, start }) => {
  registerApplication({
    name: '@sampaiogabriel/parcel-auth',
    app: () => System.import('@sampaiogabriel/parcel-auth'),
    activeWhen: ['/'],
  });

  registerApplication({
    name: '@sampaiogabriel/parcel-loading',
    app: () => System.import('@sampaiogabriel/parcel-loading'),
    activeWhen: ['/'],
  });

  registerApplication({
    name: '@sampaiogabriel/parcel-navbar',
    app: () => System.import('@sampaiogabriel/parcel-navbar'),
    activeWhen: handleVerifyAuth(),
  });

  registerApplication({
    name: '@sampaiogabriel/app-demo',
    app: () => System.import('@sampaiogabriel/app-demo'),
    activeWhen: handleVerifyAuth(),
  });

  registerApplication({
    name: '@sampaiogabriel/parcel-footer',
    app: () => System.import('@sampaiogabriel/parcel-footer'),
    activeWhen: handleVerifyAuth(),
  });

  start({
    urlRerouteOnly: true,
  });
});

start();
