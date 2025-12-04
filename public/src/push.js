var settings = {
  public:
    "BFu9p2BpKPjoasXh5nQcKDfrN61XQ7sOu05kaSTvrEduodpGMb6nmEUeJFm2ANruWW3Ik2_JVd0s5JPAW87DO54", // agora a nossa chave
  pushSubscription: "",
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function cadastraPWAservidor(id, categorias) {
  console.log("Cadastrando PWA no servidor");
  let subscription = settings.pushSubscription;

  await fetch("/api/registrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      categorias: categorias,
      subscription: subscription
    }),
  });
}

function determineAppServerKey() {
  var vapidPublicKey = settings.public;
  return urlBase64ToUint8Array(vapidPublicKey);
}

function usaPush(registration, settings, id, categorias) {
  return registration.pushManager
    .getSubscription()
    .then(function (subscription) {
      // se o usuário já tiver inscrito
      if (subscription) {
        // ele deve ser atualizado com suas novas categorias
        settings.pushSubscription = subscription;
        cadastraPWAservidor(id, categorias);
        return;
      }

      // se for usuário novo, o registramos caso o usuário permita
      return registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: determineAppServerKey(),
        })
        .then(function (subscription) {
          settings.pushSubscription = subscription;
          if (Notification.permission === "denied") {
            console.log("Notificações bloqueadas");
            return;
          } else console.log("Notificações habilitadas");
          cadastraPWAservidor(id, categorias);
        });
    });
}
