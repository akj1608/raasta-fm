<p align="center">
  <strong>🛣️ Raasta Radio</strong><br>
  <em>Nostalgic Indian highway nights — Bollywood road-trip radio for the nights before you became fancy.</em>
</p>

<p align="center">
  <a href="https://raasta-fm.vercel.app"><strong>▶ raasta-fm.vercel.app</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/tracks-215-orange?style=flat-square" alt="215 tracks">
  <img src="https://img.shields.io/badge/stack-vanilla-111?style=flat-square" alt="Vanilla stack">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License">
</p>

---

## What is this?

Raasta Radio is a single-page ambient music player inspired by [saloon.wtf](https://saloon.wtf). Open the link and you're on a moonlit national highway — painted truck rolling past, dhaba glowing roadside, NH milestone fading into the dark — with 200+ classic Bollywood tracks autoplaying in the background.

No login. No app install. Just vibes.

## Features

- **Autoplay on open** — hits play the moment the page loads (no tap needed on desktop)
- **215 curated tracks** — 90s/00s Bollywood road-trip, travel, and highway hits
- **Immersive scene** — animated truck, dhaba shack, billboard, film grain, starry sky
- **Truck muhawaras** — rotating Hindi highway poetry on the truck, billboard, and hero quote
- **Full player** — spinning vinyl, seek bar, prev/play/next, IST clock
- **Zero backend** — static HTML/CSS/JS, deploys anywhere in seconds

## Preview

Open **[raasta-fm.vercel.app](https://raasta-fm.vercel.app)** — music should start on its own. Hard-refresh (`Cmd+Shift+R`) if you visited an older build.

## Tech stack

| | |
|---|---|
| **Frontend** | HTML5, CSS3, vanilla JavaScript |
| **Audio** | [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference) |
| **Fonts** | DM Sans · Playfair Display · Tiro Devanagari Hindi |
| **Hosting** | [Vercel](https://vercel.com) |

No build step. No framework. No `npm install`.

## Project structure

```
raasta-fm/
├── index.html      # Scene + player UI
├── styles.css      # Highway night aesthetic
├── app.js          # Player, autoplay, muhawaras, clock
├── playlist.js     # 215 embeddable YouTube tracks
├── vercel.json     # Security headers + cache rules
└── README.md
```

## Run locally

```bash
git clone https://github.com/akj1608/raasta-fm.git
cd raasta-fm
python3 -m http.server 8080
```

Open **http://localhost:8080** — YouTube embeds need a real origin, so `file://` won't work.

## Deploy

**Vercel** (one command):

```bash
npx vercel deploy --prod
```

Or connect this repo in the [Vercel dashboard](https://vercel.com) for auto-deploys on push to `main`.

Works on any static host — Netlify, Cloudflare Pages, GitHub Pages, S3, etc. No build command required.

## Playlist

Tracks are defined in `playlist.js`:

```js
const PLAYLIST = [
  { id: "VIDEO_ID", title: "Song Title", artist: "Channel" },
  // ...
];
```

After editing the playlist, bump the `?v=` query on script tags in `index.html` so browsers pick up the new file.

## Autoplay

Browsers block unmuted autoplay without user interaction. Raasta Radio:

1. Starts muted with `autoplay: 1` (allowed everywhere)
2. Begins playback on player ready
3. Auto-unmutes once audio is playing (desktop Chrome/Firefox)

On **iOS Safari**, sound may need one tap — that's an OS restriction with YouTube embeds.

## Customize

| Change | File |
|--------|------|
| Truck slogans | `TRUCK_MUHAWARAS` in `app.js` |
| Visuals & colors | `styles.css` |
| External links | `index.html` |
| Cache / headers | `vercel.json` |

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / pause |
| `Shift` + `←` | Previous track |
| `Shift` + `→` | Next track |

## Credits

- Music streamed via YouTube — rights belong to respective labels and artists
- Built by **[Abhishek Jha](https://github.com/akj1608)** · [Ko-fi](https://ko-fi.com/akj1608)

## License

[MIT](LICENSE) — fork it, remix it, build your own nostalgic corner of the internet.
