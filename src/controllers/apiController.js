const { catchAsync, AppError } = require("../utils/appError");

exports.getLastfm = catchAsync(async (req, res, next) => {
  const lastfm = new LastFmNode({
    api_key: process.env.LASTFM_KEY,
    secret: process.env.LASTFM_SECRET,
  });
  const getArtistInfo = () => {
    new Promise((resolve, reject) => {
      lastfm.request("artist.getInfo", {
        artist: "Roniit",
        handlers: {
          success: resolve,
          error: reject,
        },
      });
    });
  };

  const getArtistTopTracks = () => {
    new Promise((resolve, reject) => {
      lastfm.request("artist.getTopTracks", {
        artists: "Roniit",
        handlers: {
          success: ({ toptracks }) => {
            console.log(toptracks);
            resolve(toptracks.track.slice(0, 10));
          },
          error: reject,
        },
      });
    });
  };

  const getArtistTopAlbums = () => {
    new Promise((resolve, reject) => {
      lastfm.request("artist.getTopAlbums", {
        artist: "Roniit",
        handlers: {
          success: ({ topalbums }) => {
            resolve(topalbums.album.slice(0, 3));
          },
          error: reject,
        },
      });
    });
  };
  try {
    const { artist: artistInfo } = await getArtistInfo();
    const topTracks = await getArtistTopTracks();
    console.log(topTracks);
    const topAlbums = await getArtistTopAlbums();
    console.log(topAlbums);
    const artist = {
      name: artistInfo.name,
      image: artistInfo.image ? artistInfo.image.slice(-1)[0]["#text"] : null,
    };
    res.status(200).send({ status: "Success", data: { artist } });
  } catch (err) {
    return res.status(404).json({ status: "Fail", message: err.message });
  }
});

exports.getScraping = catchAsync((req,res,next)=>{
    axios.get('https://news.ycombinator.com/')
    .then((response=>{
        const $ = cheerio.load(response.data)
        const links = []
        $('.title a[hef^="http"],a[href^="https"]').slice(1).each((index,element)=>{
            links.push($(element))
        })
    }))
})