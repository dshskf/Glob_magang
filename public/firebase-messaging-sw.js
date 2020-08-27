importScripts("https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.17.1/firebase-messaging.js");
// importScripts('https://www.gstatic.com/firebasejs/7.17.1/init.js');

const config = {
    apiKey: "AIzaSyD3ONndJma3pdNlQgHCKH36TsjEhKRrKl0",
    authDomain: "gcm-marketplace.firebaseapp.com",
    databaseURL: "https://gcm-marketplace.firebaseio.com",
    projectId: "gcm-marketplace",
    storageBucket: "gcm-marketplace.appspot.com",
    messagingSenderId: "1000116117931",
    appId: "1:1000116117931:web:ab5c02e3ee473d7d15b2ee",
    measurementId: "G-FGBJDF82GG"

};

firebase.initializeApp(config)

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(payload => {
    const title = payload.notification.title;
    console.log('payload', payload.notification.icon);    
    const options = {
        body: "payload.notification.body",
        icon: payload.notification.icon
    }
    return self.registration.showNotification("GOtcha", options);
})