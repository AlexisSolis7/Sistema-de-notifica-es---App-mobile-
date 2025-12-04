let num = 2;

self.addEventListener("install", (event) => {});

self.addEventListener("activate", (event) => {});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const promiseChain = clients.openWindow("./");
  event.waitUntil(promiseChain);
});

self.addEventListener("push", function (event) {
  const data = event.data?.json() ?? {};

  const title = data.title || "Notícias App";
  const body = data.body || "Você tem uma nova notificação!";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: 'icon.png',
      badge: 'icon.png',
      tag: "noticia" + Date.now()
    })
  );
});

// talvez necessário para que seja identificável como um app e se possa instalar
self.addEventListener('fetch', function(event) {
  return;
});
