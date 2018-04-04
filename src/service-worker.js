/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function() {
  'use strict';

  /*
   * TODO 1 - CACHE THE APPLICATION SHELL
   */

  // Beware that index.html may also be requested as /
  var filesToCache = [
    '/memepearl/',
    '/memepearl/index.html',
    '/memepearl/pages/offline.html',
    '/memepearl/pages/404.html',

    '/memepearl/js/site.js',

    '/memepearl/css/style.css',
    
    '/memepearl/images/logo.svg',
    '/memepearl/images/placeholder.jpg',
    '/memepearl/images/triangle.svg'
  ];

  var  staticCacheName = 'memepearl-cache';

  // When the service worker is registered, an 'install' event is triggered the
  // first time the user visits the page
  self.addEventListener('install', function(event) {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
      caches.open(staticCacheName)
      .then(function(cache) {
        // Takes a list of URLs, then fetches them from the server and adds the
        // response to the cache. This method is atomic and if any of the files
        // fail, the entire cache step fails
        return cache.addAll(filesToCache);
      })
    );
  });

  /*
   * TODO 2 - INTERCEPT NETWORK REQUESTS
   */

  // The fetch event listener intercepts all requests. 
  self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        // TODO 2.1 - ADD NETWORK RESPONSES TO THE CACHE
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(function(response) {
          // TODO 2.2 - RESPOND WITH CUSTOM 404 PAGE
          if (response.status === 404) {
            console.log("Page not found");
            return caches.match('pages/404.html');
          }
          return caches.open(staticCacheName).then(function(cache) {
            if (event.request.url.indexOf('test') < 0) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          });
        });
      }).catch(function(error) {
        // TODO 2.3 - RESPOND WITH CUSTOM OFFLINE PAGE
        console.log('Error, ', error);
        return caches.match('pages/offline.html');
      })
    );
  });


  /*
   * TODO 3 - DELETE UNUSED CACHES
   */

  // The 'activate' event is fired when the service worker starts up
  self.addEventListener('activate', function(event) {
    console.log('Activating new service worker...');

    var cacheWhitelist = [staticCacheName];

    // Logic to update the cache whenever any of the app shell files change
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

})();
