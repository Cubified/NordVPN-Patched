! function() {
   function t(t) {
      let e = document.getElementById("nvpn_position_meta");
      e || ((e = document.createElement("meta")).id = "nvpn_position_meta", e.setAttribute("name", "nvpn_chrome_extension"), (document.body || document.documentElement).appendChild(e)), e.setAttribute("content", JSON.stringify(t))
   }
   if("html" === document.documentElement.tagName.toLowerCase()) {
      const e = document.createElement("script");
      e.appendChild(document.createTextNode("(" + function() {
         function t(t, e, n, o) {
            const i = JSON.parse(o);
            i.isEnabled ? t({
               coords: {
                  latitude: i.lat,
                  longitude: i.lng,
                  accuracy: i.accuracy
               },
               timestamp: (new Date).getTime()
            }) : navigator.geolocation.getCurrentPosition_(t, e, n)
         }

         function e(e, n, o) {
            return function() {
               let i = document.getElementById("nvpn_position_meta"),
                  a = null;
               i ? t(e, n, o, i.getAttribute("content")) : a = setInterval(function() {
                  (i = document.getElementById("nvpn_position_meta")) && (clearInterval(a), t(e, n, o, i.getAttribute("content")))
               }, 200)
            }
         }
         let n = null;
         navigator.geolocation && (navigator.geolocation.getCurrentPosition_ = navigator.geolocation.getCurrentPosition, navigator.geolocation.watchPosition_ = navigator.geolocation.watchPosition, navigator.geolocation.clearWatch_ = navigator.geolocation.clearWatch, navigator.geolocation.clearWatch = function(t) {
            window.clearInterval(t)
         }, navigator.geolocation.getCurrentPosition = function(t, n, o) {
            e(t, n, o)()
         }, navigator.geolocation.watchPosition = function(t, o, i) {
            const a = e(t, o, i);
            return a(), n && window.clearInterval(n), n = window.setInterval(a, 5e3)
         })
      } + ")();"));
      const n = document.head || document.body || document.documentElement,
         o = n.childNodes && n.childNodes.length > 0 ? n.childNodes[0] : null;
      o ? n.insertBefore(e, o) : n.appendChild(e), chrome.extension.sendRequest({
         type: "fakegeo"
      }, function(e) {
         t(e)
      }), chrome.extension.onRequest.addListener(function(e, n, o) {
         e.type && "updateFakeGeo" === e.type && t(e)
      })
   }
}();

