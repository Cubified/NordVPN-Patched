! function() {
   "use strict";

   function e() {
      document.createElement("img").src = "https://www.google.com/favicon.ico?_" + Math.floor(1e9 * Math.random())
   }
   const o = "assets/images/icons",
      n = `${o}/nordvpn-48-on.png`,
      t = `${o}/nordvpn-48-off.png`,
      r = `${o}/nordvpn-48-active.png`;
   window.app = Object.freeze({
      window: window,
      util: {
         storage: window.localStorage,
         icon: {
            enable: () => chrome.browserAction.setIcon({
               path: n
            }),
            disable: () => chrome.browserAction.setIcon({
               path: t
            }),
            active: () => chrome.browserAction.setIcon({
               path: r
            })
         },
         webrtc: {
            enable: () => {},
            disable: () => {}
         },
         geo: {
            fakeGeo: e => e.connected ? {
               isEnabled: e.connected,
               lat: e.server.location.lat,
               lng: e.server.location.long,
               accuracy: 1
            } : {},
            activeChanged(e) {
               chrome.windows.getAll({
                  populate: !0
               }, function(o) {
                  for(let n = 0; n < o.length; ++n) {
                     const t = o[n];
                     for(let o = 0; o < t.tabs.length; ++o) {
                        const n = t.tabs[o];
                        chrome.tabs.sendRequest(n.id, {
                           type: "updateFakeGeo",
                           isEnabled: e.connected,
                           lat: e.connected ? e.server.location.lat : 0,
                           lng: e.connected ? e.server.location.long : 0,
                           accuracy: 1
                        }, null)
                     }
                  }
               })
            }
         },
         proxy: {
            levelOfControl: {},
            read: () => (chrome.proxy.settings.get({}, function(e) {
               return window.app.util.proxy.ensure(e)
            }), window.app.util.proxy.levelOfControl),
            ensure(e) {
               const o = {
                  uncontrollableByAll: "not_controllable" === e.levelOfControl,
                  controlledByOther: "controlled_by_other_extensions" === e.levelOfControl,
                  controlledByNVPN: "controlled_by_this_extension" === e.levelOfControl,
                  controllableByNVPN: "controllable_by_this_extension" === e.levelOfControl
               };
               return o.underNVPNControl = o.controlledByNVPN || o.controllableByNVPN, window.app.util.proxy.levelOfControl = o, window.app.util.proxy.levelOfControl
            }
         }
      }
   }), chrome.webRequest.onAuthRequired.addListener(function(e) {
      if(e.isProxy && "nordvpn" === e.realm.toLowerCase()) {
         const e = JSON.parse(window.app.util.storage.getItem("nvpn.globals")) || {};
         return {
            authCredentials: {
               username: e.currentUser.username,
               password: e.currentUser.password
            }
         }
      }
   }, {
      urls: ["<all_urls>"]
   }, ["blocking"]), (JSON.parse(window.app.util.storage.getItem("nvpn.globals")) || {}).currentUser && window.app.util.icon.enable();
   let l = JSON.parse(window.app.util.storage.getItem("nvpn.connection")) || {};
   l.connected && (window.app.util.icon.active(), (JSON.parse(window.app.util.storage.getItem("nvpn.settings")) || {}).webrtc && window.app.util.webrtc.enable()), chrome.extension.onRequest.addListener(function(e, o, n) {
      switch(e.connection && (l = e.connection), e.type) {
         case "fakegeo":
            n(window.app.util.geo.fakeGeo(l));
            break;
         case "activeChanged":
            window.app.util.geo.activeChanged(l, e)
      }
   }), chrome.runtime.onMessage.addListener(function(o, n, t) {
      switch(o.type) {
         case "nvpn.proxy.enabled":
            e()
      }
   }), window.app.util.proxy.read(), chrome.proxy.settings.onChange.addListener(window.app.util.proxy.ensure)
}();

