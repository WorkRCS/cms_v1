# Product YouTube videos and Lighthouse checklist

## Product video support

The product video field can now store either an uploaded MP4/WebM asset or a YouTube embed record.

Seller Studio supports:
- A YouTube video URL, including youtube.com/watch, youtube.com/shorts, youtube.com/embed and youtu.be links.
- An optional video title.
- Automatic format detection for /shorts/ URLs, with manual override for Shorts (9:16) or standard video (16:9).
- Existing MP4/WebM upload remains supported. Do not send a YouTube URL and an uploaded file at the same time.

Only trusted YouTube hostnames are accepted. The application extracts and validates the 11-character YouTube video ID, then constructs a youtube-nocookie.com embed URL itself. It does not store arbitrary iframe HTML or accept arbitrary iframe domains.

On a product page, the video is a selectable gallery thumbnail next to the product images. Selecting an image returns to the image viewer; selecting the video opens the iframe in the same gallery area. The iframe is created on click, not at initial page render. Local MP4/WebM videos use the same gallery control.

The homepage displays every published product with a video in two finite horizontal rails that move in opposite directions once and then stop. Shorts use a vertical 9:16 card and standard videos use a landscape 16:9 card. Each card names its product and links to the product detail page. Only thumbnails load initially; selecting Watch video creates the YouTube iframe or local MP4/WebM player. The rail pauses on hover/focus and respects reduced-motion settings. Videos are included as VideoObject information in the product structured data when the record contains YouTube metadata.

## Local demo videos

For the existing local demo products, after pulling main, run:

    php artisan db:seed --class=DemoProductVideoSeeder

This does not rerun the whole demo catalogue seeder. It updates only these two existing demo product video fields:

- Farm Fresh Vegetable Box — GetMyHarvest organic vegetable-harvest Short, displayed vertically (9:16).
- Garden Hand Trowel — FAO home vegetable garden harvest tutorial, displayed in landscape (16:9).

These are third-party demo embeds, not seller-produced content or customer testimonials. Replace them with videos you own or are authorised to embed before public launch. A video owner can disable embedding, and availability is controlled by YouTube.

## YouTube embed behaviour

The site uses https://www.youtube-nocookie.com/embed/VIDEO_ID for the privacy-enhanced embed host. Gallery playback is user-triggered. Homepage video players are click-to-play; only thumbnail images are loaded initially. Iframes have descriptive titles, fullscreen support and strict-origin referrer policy.

YouTube's official embed documentation specifies a 200px by 200px minimum player viewport. A landscape 16:9 video and a vertical 9:16 Shorts layout are styled separately. Browser support, video availability, region restrictions and the uploader's embed permissions remain controlled by YouTube.

## Accessibility and security work in this update

- Added keyboard Skip to main content link and a focusable main landmark.
- Product image/video selection exposes aria-pressed state.
- Iframes have descriptive titles.
- Increased contrast of several small-text styles and made the skip link visible on keyboard focus.
- Added X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions Policy and Cross-Origin-Opener-Policy (same-origin).
- Added a per-response nonce Content Security Policy with strict-dynamic, no inline script attributes, same-origin scripts, YouTube privacy-enhanced frames only, and a Trusted Types requirement for script sinks.
- Added DOMPurify as the default Trusted Types HTML sanitizer for dynamic HTML sinks.
- HSTS is sent only for HTTPS requests in production, with a two-year max-age. The deployment must actually serve HTTPS and configure trusted proxies correctly when TLS terminates at a reverse proxy.
- Permissions Policy explicitly allows fullscreen only for the first-party page and YouTube's privacy-enhanced embed host; camera, microphone and geolocation are disabled.
- Bootstrap 5.3.8 CSS/JS and DOMPurify are served locally. This removes the Bootstrap CDN dependency from initial page loads; YouTube remains a third-party service only when a visitor starts a video.

These protections reduce common attack surfaces but do not make a website “hacking-proof”. Keep dependencies patched, restrict database and storage access, monitor logs, rotate secrets if exposed, back up data and test the live deployment.

## Retest Lighthouse

Run the same URL, viewport, browser version and Lighthouse mode before and after changes. The summary scores alone do not show which audits failed. Open each category and inspect the red/failed audits. In particular:
- Accessibility: look at the exact contrast, name/label, landmark, heading and ARIA audit. A 94 score may be caused by one or more page-specific DOM elements or contrast pairs.
- Best Practices: check HTTPS/security, browser-console errors, deprecated API warnings, third-party iframe issues and any failed audits actually listed in that run.
- Performance: the homepage initially loads only video thumbnails (not YouTube iframes or uploaded video players). Start a player only when you explicitly test the playback path; a normal initial-page Lighthouse run should not create those third-party player requests.
- Test the homepage, one product detail page with a Shorts video, one with a standard video, shop, sign-in and seller studio separately. Lighthouse audits a page, not every route in the application.

A code change cannot guarantee 100 for every deployment. The final score depends on the exact route, data, device throttling, browser version, HTTPS configuration, hosting response, third-party video availability and the exact failed audits. Send the detailed Failed audits list (not just the four category scores) to target any remaining page-specific issues.

## Local update and test

    git pull origin main
    php artisan db:seed --class=DemoProductVideoSeeder
    php artisan optimize:clear
    php artisan serve

Then check:
- / — all published product videos, two opposing one-pass rails (then swipe-scroll), product names, and click-to-play YouTube/uploaded videos.
- /product/farm-fresh-vegetable-box — vertical Shorts thumbnail in the image gallery.
- /product/garden-hand-trowel — standard landscape video thumbnail in the image gallery.
- /admin — product edit modal, paginated products and customer directory.
- /seller — legacy seller route for adding a product with a YouTube URL or uploaded MP4/WebM.

The site must be deployed on a public HTTPS domain for a public search engine to crawl it. Local 127.0.0.1 testing cannot establish the production HTTPS result.