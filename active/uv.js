importScripts('/active/uv/uv.bundle.js');
importScripts('/active/uv/uv.config.js');
importScripts('/active/uv/uv.sw.js');
importScripts('https://arc.io/arc-sw-core.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));
