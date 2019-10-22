const { remote } = require('electron');

const webContents = remote.getCurrentWebContents();
const { session } = webContents;

setTimeout(() => {
  const elem = document.querySelector('#af-error-container');
  if (elem && elem.innerText.toLowerCase().includes('the requested url was not found on this server')) {
    window.location.reload();
  }
}, 1000);

window.addEventListener('beforeunload', async () => {
  try {
    session.flushStorageData();
    session.clearStorageData({
      storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
    });

    const registrations = await window.navigator.serviceWorker.getRegistrations();

    registrations.forEach((r) => {
      r.unregister();
      console.log('ServiceWorker unregistered');
    });
  } catch (err) {
    console.err(err);
  }
});

module.exports = (Franz) => {
  function getMessages() {
    const messages = document.querySelectorAll('.text-content.unread').length;

    // set Franz badge
    Franz.setBadge(messages);
  }

  // check for new messages every second and update Franz badge
  Franz.loop(getMessages);
};
