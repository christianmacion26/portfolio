# Image / proof-of-work research — scratchpad

Status: in progress. Two background agents running in parallel:

| Agent               | Mission                                                                                                                            | Location                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `a3190655713c887be` | Discover online images of Christian (LinkedIn, GH, OJP, SpeakerDeck, SlideShare, YouTube, alumni newsletters, conference archives) | `twin: discover-online-images`    |
| `ab69451f14db89319` | Catalogue local proof-of-work files (Downloads, Pictures, Contingency subtree, photos, PDFs, videos)                               | `twin: catalog-local-proof-files` |

This folder is a staging area. After both agents return:

1. Their raw findings land here as `01-online-inventory.md` and `02-local-catalogue.md`
2. User reviews.
3. We then run strategy: which assets get used where on the site.

Provisional buckets the synthesis will likely want to fill:

| Bucket                                | Use on site                                             |
| ------------------------------------- | ------------------------------------------------------- |
| Hero headshot (square, ~640px+)       | `public/headshot.jpg`, referenced on `/` and `/about`   |
| Banner / cover (wide, ~1600×900)      | `public/banner.jpg`, used in og:image + hero background |
| Webinar / F2F class screenshots       | new `/speaking` page or `/proof` page                   |
| PSHS-SMC alumni talk (Sep 2024)       | proof moment on `/` or `/experience`                    |
| USeP lecture (March 2025)             | proof moment                                            |
| STA Philippines graduation (Dec 2025) | certification proof                                     |
| Resume / CV PDFs (all variants)       | linked from `/resume`                                   |

NDA constraints to enforce on whatever we pull in:

- 19V Capital: photos taken at the 19V office or using 19V brand are NOT public-safe. Reject / blur.
- Quantivo brand any logo NOT public-safe.
- Calendar screenshots with client names: redact.
- "Currently at 19V" banner / cover-art text: skip.

User instruction to remember: "put it in the folder I will take a look at it before we strategize how we will use it in the website portfolio." → do NOT pre-edit the site; just deliver the inventory.
