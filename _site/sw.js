const version = '20250718172926';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/general/external%20sources/2016/08/27/example-post-one/","/events/winlp-2025/call-for-papers/","/events/winlp-2024/call-for-submission/","/categories/","/organization/committee/","/elements/","/organization/guidelines-for-zoom-moderation/","/blog/","/events/winlp-2018/call-for-papers/","/events/winlp-2018/registration-and-accommodation/","/events/winlp-2018/poster-slides-tips/","/events/winlp-2018/accepted-papers/","/events/winlp-2018/","/events/winlp-2019/organization/","/events/winlp-2019/2nd-call-for-papers/","/events/winlp-2019/1st-early-call-for-papers/","/events/winlp-2019/sponsors/","/events/winlp-2019/accepted-papers/","/events/winlp-2019/","/events/winlp-2021/call-for-papers/","/events/winlp-2021/sponsors/","/events/winlp-2021/accepted-papers/","/events/winlp-2021/organization-2021/","/events/winlp-2021/events-for-winlp-2021/","/events/winlp-2021/","/events/winlp-2017/call-for-papers/","/events/winlp-2017/registration-and-accommodation/","/events/winlp-2017/invited-speakers/","/events/winlp-2017/sponsors/","/events/winlp-2017/history/","/events/winlp-2017/accepted-papers/","/events/winlp-2017/program/","/events/winlp-2017/posterslides-tips/","/events/winlp-2017/","/events/winlp-2021-panel-acl/","/events/winlp-2021-statellite-workshop-eacl/","/events/winlp-2024/sponsors/","/events/winlp-2024/","/events/winlp-2023/winlp-2023-sponsors/","/events/winlp-2023/winlp-2023-call-for-submissions/","/events/winlp-2023/accepted-papers/","/events/winlp-2023/winlp-2023-workshop/","/events/winlp-2022-satellite-workshop-naacl/","/events/winlp-2022/winlp-2022-sponsors/","/events/winlp-2022/accepted-papers/","/events/winlp-2022/winlp-2022-workshop/","/events/winlp-2022/winlp22-call-for-papers/","/events/winlp-2021-satellite-workshop-naacl/","/events/winlp-2020/call-for-papers/","/events/winlp-2020/sponsors/","/events/winlp-2020/accepted-papers/","/events/winlp-2020/registration-and-membership/","/events/winlp-2020/","/events/winlp-2018/organization/","/events/winlp-2020-statellite-workshop-aacl-ijcnlp/","/","/manifest.json","/events/winlp-2024/organization/","/events/past-events/","/events/winlp-2025/program/","/assets/search.json","/search/","/organization/slack-community-standards/","/organization/sponsor-policy/","/events/winlp-2025/sponsors/","/stories/spotlights/","/assets/styles.css","/redirects.json","/sitemap.xml","/robots.txt","/feed.xml","/assets/styles.css.map","/assets/logos/cropped-WideningNLP-h-250x100.png", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
  ]
}

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    // Remove caches whose name is no longer valid.
    return Promise.all(
      keys
        .filter(key => {
          return key !== cacheName;
        })
        .map(key => {
          console.log(`Service Worker: removing cache ${key}`);
          return caches.delete(key);
        })
    );
  });
};

self.addEventListener("install", event => {
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  // Only deal with requests from the same domain.
  if (url.origin !== location.origin) {
    return;
  }

  // Always fetch non-GET requests from the network.
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Default url returned if page isn't cached
  let offlineAsset = "/offline/";

  if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    // If url requested is an image and isn't cached, return default offline image
    offlineAsset = "/assets/default-offline-image.png";
  }

  // For all urls request image from network, then fallback to cache, then fallback to offline page
  event.respondWith(
    fetch(request).catch(async () => {
      return (await caches.match(request)) || caches.match(offlineAsset);
    })
  );
  return;
});
