var settings = {
  public:
    "BFu9p2BpKPjoasXh5nQcKDfrN61XQ7sOu05kaSTvrEduodpGMb6nmEUeJFm2ANruWW3Ik2_JVd0s5JPAW87DO54",
  pushSubscription: "",
};

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Mostrar botão de instalar
  const btn = document.getElementById("btn-install");
  btn.style.display = "block";

  btn.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        console.log("Usuário aceitou instalar o app");
      } else {
        console.log("Usuário recusou instalar");
      }
      deferredPrompt = null;
    });
  });
});

function determineAppServerKey() {
  var vapidPublicKey = settings.public;
  return urlBase64ToUint8Array(vapidPublicKey);
}

function inicia() {
  Notification.requestPermission().then((p) => console.log("Permissão:", p));
}

function saveContent(){
  // antes de realizar o push deve-se ler os dados colocados pelo usuário
  let idUsuario = document.getElementById("id_usuario");
  idUsuario = idUsuario.value.trim();

  const checkboxes = document.querySelectorAll("input[name='categoria']:checked");
  const categorias = Array.from(checkboxes).map(j => j.value);

  if (!idUsuario) {
    alert("Por favor, digite seu usuário.");
    return;
  }
  if (categorias.length === 0) {
    alert("Selecione pelo menos uma categoria.");
    return;
  }
  navigator.serviceWorker.ready.then((registration) => {
    console.log("Service Worker pronto e ativo:");
    usaPush(registration, settings, idUsuario, categorias);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  Notification.requestPermission();
  const btnSave = document.getElementById("btn-save");
  if (btnSave) {
      btnSave.addEventListener("click", saveContent);
  }

  // Se o navegador suportar, instala o SW
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(function () {
        console.log("Registrou o service worker");
      })
      .catch(function (err) {
        console.log("Registro do service worker:", err);
      });
  } else {
    console.log("ServiceWorker não é suportado.");
  }
});
