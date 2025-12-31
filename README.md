# 4chan-list-videos

Generate a list of webms and mp4s posted in a thread.

Here's a little [demonstration](https://www.4webm.org/) of `4chan-list-webm` in action (plz star).

## Installation

```bash
$ pnpm add @ritamoe/4chan-list-videos

# OR

$ npm install --save @ritamoe/4chan-list-videos
```

## Usage

```js
const listVideos = require('@ritamoe/4chan-list-videos')

// promise
listVideos('wsg', 2045456)
  .then(data => console.log(data))
  .catch(err => console.error('404!', err))

// async/await
async function run () {
  try {
    const data = await listVideos('http://boards.4chan.org/wsg/thread/2045456')
    console.log(data)
  } catch (err) {
    console.error('Whoa! 404! :c', err)
  }
}

run()
```

## API

#### listVideos(url)

#### listVideos(board, threadNo, config)

Returns a promise that resolves to data about videos within a thread (see payload).

#### url

Type: `String`

The URL of the thread. The thumbnail and video links will use `https` if an `https` request is made.

#### board

Type: `String`

The short-name of the board, eg. `'wsg'`, `'b'`, etc.

#### threadNo

Type: `Number`

The thread number of the target thread. For example, `2312676` is the thread number of http://boards.4chan.org/wsg/thread/2312676

#### config

Type: `Object`

A configuration object, see details below.

#### config.https

Type: `Boolean`

Property that determines whether to use `https`. Setting the key to `true` enables `https`.

## Payload

Below an example payload. Note that the subject key will be omitted if the thread has no subject.

```json
{
  "subject": "MELANCHOLY",
  "videos": [
    {
      "filename": "conspiracy-alright",
      "thumbnail": "https://i.4cdn.org/wsg/1765509046233024s.jpg",
      "url": "https://i.4cdn.org/wsg/1765509046233024.webm"
    },
    {
      "filename": "Gymnopédie No. 1",
      "thumbnail": "https://i.4cdn.org/wsg/1765509110095819s.jpg",
      "url": "https://i.4cdn.org/wsg/1765509110095819.mp4"
    },
    {
      "filename": "LoLa &amp; Hauser - Love Story",
      "thumbnail": "https://i.4cdn.org/wsg/1765509203849104s.jpg",
      "url": "https://i.4cdn.org/wsg/1765509203849104.mp4"
    }
  ]
}
```

## Miscellaneous

#### CORS, and why this doesn't work in the browser

Because CORS [is only supported](https://github.com/4chan/4chan-API/issues/35) with an origin of `http(s)://boards.4chan.org`,
this module **does not work in the browser; it only works with Node.js**. The **ONLY** exception to this is if you're creating a Chrome plugin, with `http(s)://boards.4chan.org` set as the origin.

#### Rate limits

*As stated in the [4chan API](https://github.com/4chan/4chan-API), you must ensure that you do not make more than one request per second. It is __your__ responsiblity to ensure that the request limit is respected. I recommend using [limiter](https://www.npmjs.com/package/limiter) or [bottleneck](https://www.npmjs.com/package/bottleneck).*

#### Thumbnails

You will get an `403 Forbidden error` if you try to load the thumbnails via inline linking (eg. changing the `src` attribute of an `<img>` via JavaScript, or hard-coding it). You can still download these images via a proxy server and serve them there.

## Why? 

¯\\\_(ツ)\_/¯

## Disclaimer

The creator of `4chan-list-videos` is not associated with 4chan.org in any way.
