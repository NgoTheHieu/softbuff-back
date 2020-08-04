const upload = require("../utils/upload");
const { loadData, saveData } = require("../utils/data");
const { loadMemeData, saveMemeData } = require("../utils/memesData");
const { catchAsync, AppError } = require("../utils/appError");
const Jimp = require("jimp");
const path = require("path");

const pathToUpload = path.join(__dirname, "../public/uploads/originals");
const pathToMemes = path.join(__dirname, "../public/uploads/memes");

exports.browseImage = (req, res, next) => {
  const data = loadData();
  return res.status(200).send("allImages", { status: "ok", images: data });
};

exports.uploadImage = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(200).send("Upload", { error: "No image uploaded here" });
  }

  await Jimp.read(`${pathToUpload}/${file.originalName}`)
    .then((item) => {
      console.log("item", item);
      return item
        .resize(Jimp.AUTO, 800, Jimp.RESIZE_NEAREST_NEIGHBOR)
        .quality(60)
        .write(`${pathToUpload}/${file.originalName}`);
    })
    .catch((err) => {
      console.log(err);
    });

  console.log("file in index:", file);
  const data = loadData();

  if (
    data.some(
      (item) =>
        item.originalname === file.originalname || item.size === file.size
    )
  ) {
    return res.render({
      title: "MEMEMAKER",
      error: "File already existed. Please choose another file.",
    });
  }

  file.id = data.length === 0 ? 1 : data[0].id + 1;

  data.unshift(file);
  saveData(data);

  return res.send({ images: data });
};

exports.getMemes = async (req, res, next) => {
  const dataMeme = await loadMemeData();
  return res.send({ status: "ok", memes: dataMeme });
};

exports.postMemes = async (req, res, next) => {
  const query = req.body;
  console.log("query", query);
  console.log("memes id", query.id);
  const data = loadData();
  let found = data.find((item) => item.id === parseInt(query.id));

  console.log("Found", found);

  let loadedImage;
  let time = Data.now().toString();
  let suffix = time.substring(time.length - 4);
  let name = found.originalname.split(".")[0];

  await Jimp.read(`${pathToUpload}/${found.originalname}`)
    .then(function (image) {
      loadedImage = image;

      console.log("loadedImage.bitmap", loadedImage.bitmap);
      return Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    })
    .then(function (font) {
      let maxWidth = loadedImage.bitmap.width;
      let maxHeight = loadedImage.bitmap.height;
      loadedImage.print(
        font,
        0,
        0,
        {
          text: query.top,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_TOP,
        },
        maxWidth,
        maxHeight
      );
      loadedImage.print(
        font,
        0,
        0,
        {
          text: query.bottom,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
        },
        maxWidth,
        maxHeight
      ).write(`${pathToMemes}/meme-${name}-${suffix}.jpg`);

      const dataMeme = loadMemeData()
      console.log("data-meme",dataMeme)
      loadedImage.path = `meme-${name}-${suffix}.jpg`
      loadedImage.id = dataMeme.length === 0?1: dataMeme[0].id + 1
      console.log("loadedImage 2", loadedImage)
      let imageData = {id:loadedImage.id,path:loadedImage.path,name:`meme-${name}-${suffix}`}
      dataMeme.unshift(imageData)
      saveMemeData(dataMeme)
      return res.status(200).send({status:"ok",memes:dataMeme})
    })
    .catch(function(err){
        console.error(err)
    });

    console.log('loadedImage after Jimp',loadedImage)
};

exports.getUpload = (req,res,next)=>{
    try{
        res.status(200).send({status:"Ok",data:""})
    }catch(err){
        res.status(404).json({status:"Failed",error:err.message})
    }
}