# epyd.js
Epyd (Easy Playlist Youtube Downloadr) vous permet de télécharger vos vidéos et playlists Youtube directement en MP3 avec les tags ID3 remplis correctement (Titre, Artiste, Pochette).

![epyd.js - Landing](http://i.imgur.com/0lH1zEa.jpg)
![epyd.js - Toolbar](http://i.imgur.com/en4fzXY.png)
![epyd.js - Empty Placholder](http://i.imgur.com/K5eU6Uq.png)
![epyd.js - List](http://i.imgur.com/bXCDXna.png)

## Tags ID3
* La pochette est définis par le Thumbnail de la vidéo
* L'artiste (Si le titre de la vidéo est au format "Artiste * Titre")
* Le titre (Toujours pareil, si le titre est au format "Artiste * Titre")

## Usage
Vous pouvez au choix, télécharger juste une vidéo au format MP3, ou en sélectionner plusieurs (si vous checkez une playlist par exemple) et télécharger un zip de toutes ces vidéos en MP3.

## Config
```js
// move or duplicate `src/config.default.js` to `src/config.js`
export default {
  // WARNING : security breach, this api key will be readable in user browser,
  // because it will be used by client, the API Key should not be secured by IP or domain,
  // so be aware and careful, anyone who would look closely will be able to use it as they want
  apiKey: 'YOUTUBE_API_KEY',
  // WARNING : if universal, all epyd process will be executed in user browser and proxified by server (CORS policy)
  // download entire (possibly HD) video on client side, just to extract audio, could be painful for user with small bandwidth
  // therefore, in production, you'll should prefer to let the server handle epyd process and set this to `false`
  universal: true
}
```

## Handleable links
```js
/* PLAYLIST :
  youtube.com/watch?v=jmjx1r1omgY&index=1&list=FLj9CxlpVDiacX7ZlzuLuGiQ
  youtube.com/playlist?list=FLj9CxlpVDiacX7ZlzuLuGiQ
  youtube.com/watch?v=jmjx1r1omgY&index=1&list=PLOPWbKuLde8-uCnMXP4Z08POSJTyosuTD
  youtube.com/playlist?list=PLOPWbKuLde8-uCnMXP4Z08POSJTyosuTD
*/
var p = /(youtube\.com\/)(watch|playlist)(.*?list=)([^#\&\?\=]{24,34})/

/* VIDEO :
  youtu.be/gdPpp6X6lGk
  youtube.com/watch?v=gdPpp6X6lGk
  youtube.com/watch?param=true&v=gdPpp6X6lGk
  youtube.com/embed/gdPpp6X6lGk
  youtube.com/v/gdPpp6X6lGk
*/
var v = /(youtu\.?be(\.com)?\/)(watch|embed|v)?(\/|\?)?(.*?v=)?([^#\&\?\=]{11})/
```

## Structure
```
{
  analyze: {
    id: 'FLj9CxlpVDiacX7ZlzuLuGiQ', // defaul null
    kind: 'p', // default null
    pause: false,
    total: 10, // default null
    token: 'CAUQAA' // default null
  },
  errors: [
    {
      id: 1,
      children: 'Hello World !' // or simply JSX !
    }
  ],
  videos: [
    {
      id: 'Y2vVjlT306s',
      selected: false,
      details: {
        title: 'Hello - World',
        author: 'helloWorld',
        channel: 'UCj9CxlpVDiacX7ZlzuLuGiQ',
        description: 'Hello by World',
        thumbnail: 'https://i.ytimg.com/vi/ryti_lCKleA/sddefault.jpg',
        duration: 'PT3M11S'
      },
      statistics: {
        views: 0,
        likes: 0,
        dislikes: 0
      },
      id3: {
        song: 'Hello',
        artist: 'World',
        cover: [object ArrayBuffer]
      }
    }
  ]
}
```

## Customize
* background image
* colors

## TODO
* [ ] virtual loading for performances
  * you can select all before all videos are loaded
  * useless to load all videos if you don't want to edit all id3 tags
  * how ? set total + set state.videos to null data (for scroll item heigh) + get videos on scroll
* [ ] polish `containers/videos/capitalize()`
  * specials words : feat, dj, prod
  * cut specials chars : ()...
  * use regex ? (/\w+/ -> capitalize($1))
  * move in `utils`
* [ ] polish `state.analyze` by adding an `error` key
  * and move link analyze outside the component
  * handle `videoId` or `playlistId` error (API errors in short)
* [ ] require `resources` (img, svg...)
  * why ? because it's in the webpack philosophy
  * and (normally), when resource is update, webpack will refresh-it
* [ ] develop server side (universal ? - should be configurable)
  * [x] video download
    * unavailable for client (no CORS on youtube.com)
      * not a good idea, client would need to download large video files for just audio
      * security gap if i use a cors proxy and difficult to filter by url (youtube.com/ytimg.com/googlevideo.com ?)
        * [ ] add a little bit of security like an Ajax header
  * [x] ffmpeg audio extract (if necessary)
    * improve by using `stream`, faster solution, but `ffmpeg.js` may not be the best solution, look at `audiocogs` (`mp4.js` demuxer and `mp3.js`) repositories
      * stream can't be implemented, cause we need to edit id3 tags before zipping
    * convert aren't parallelized
      * `ffmpeg.js` should be implemented as a webworker ?
      * is working on main thread, ui is unreachable
  * [ ] dynamic zip archive
    * is zip necessary ?
      * i can use `saveAs()` foreach video on fly
    * show progress ? how in a good ux way ?
      * send zip headers before launching epyd.js handling so progress will be the download itself
        * impossible with `saveAs()` ?
* [ ] check performances (playlist with 1k videos ? memory ? cpu ? time ?)
  * each part of app
  * yapi `videos` or `playlist`
  * React array push `Video`
  * epyd `process` time (each method, global)
* [ ] make diagrams (cf. [RxJS Github](https://github.com/ReactiveX/rxjs#generating-png-marble-diagrams)) for README.md
* [ ] remove `Aphrodite` and use [react-with-styles](https://github.com/airbnb/react-with-styles)
* [ ] smooth scroll to `.resume` when click on `.landing .search button`
  * necessary ? videos don't shows up instantly
  * yes, but i've a placeholder
* [ ] refacto `utils` folder (aka THE GARBAGE !)
* [ ] fix responsive design
  * [ ] specific ux for mobile
* [ ] fix `virtualList` (is rendered each time a new item is added)
* [ ] fix `ffmpeg` synchronous process
* [ ] logs
* [ ] yaml config
* [ ] on analyze, set unique params (playlist or video id) to url
  * is it React route ?
* [ ] handle initial state params
  * analyze if okay
* [ ] on `epyd.process` error(s), suggest to submit an issue with preseted data
  * algorithm decoding fail for some videos
  * [x] retry too ? (yes, 2 times, thanks RxJS !)
* [ ] find a good ux way to handle thumbnail update from user (url or file)
  * file : drop/down ? and what about copy/paste ?
  * url : ?
* [ ] fix `Heading` texts (polish epyd process : grab, melt, bestest...)

## Helpful
* [Three Ways to Title Case a Sentence in JavaScript](https://medium.freecodecamp.com/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27#.cqak4s9ps)
* [Making a case for letter case](https://medium.com/@jsaito/making-a-case-for-letter-case-19d09f653c98#.1gt8kw4l3)
  * Or, "Which words I should ignore when capitalize a string ?"
* [RxJS 5 pausableBuffered implementation](http://codepen.io/elhigu/pen/jqZmpV)

## Design
* [inVision](https://www.invisionapp.com/)
  * Header
  * Button
* [SeatGeek](https://seatgeek.com/)
  * Form
* [Soundy](https://www.soundy.top/sounds/new)
  * Button
  * Logo animation (auto)
  * Form

## Alternatives
* [VideoGrabby](http://www.videograbby.com/)

## Thanks
* [Logo from iconmonstr](http://iconmonstr.com/sound-wave-1/)
* [Inspiration for logo animation](http://tobiasahlin.com/spinkit/)
* [SVG logo animation](http://codepen.io/anon/pen/ojgwr)
* [Background picture from Amaryllis Liampoti](https://unsplash.com/photos/TDsEBM46YLA)
* [Empty placeholder](https://thenounproject.com)
  * Checkout `/resources/placeholder/*.svg` for artists
* [CORS Proxy from now.sh](https://cors.now.sh/)
