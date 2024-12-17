import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

// self.addEventListener("push", (event) => {
//   if (event.data) {
//     const data = event.data.json();
//     const options = {
//       body: data.body,
//       icon: data.icon || "/android-chrome-512x512.png",
//       badge: "/android-chrome-192x192.png",
//       vibrate: [50, 100, 50],
//       data: {
//         url: data.data.url ?? "",
//         dateOfArrival: Date.now(),
//         primaryKey: "2",
//       },
//     };
//     event.waitUntil(self.registration.showNotification(data.title, options));
//   }
// });

// self.addEventListener("notificationclick", (event) => {
//   const baseUrl = "https://loops-dev-woad.vercel.app/";
//   const url = baseUrl + event.notification.data.url;

//   event.notification.close();
//   event.waitUntil(
//     self.clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((clientList) => {
//         if (clientList.length > 0) {
//           let client = clientList[0];
//           for (let i = 0; i < clientList.length; i++) {
//             if (clientList[i].focused) {
//               client = clientList[i];
//             }
//           }
//           return client.focus();
//         }
//         return self.clients.openWindow(url);
//       })
//   );
// });

serwist.addEventListeners();
