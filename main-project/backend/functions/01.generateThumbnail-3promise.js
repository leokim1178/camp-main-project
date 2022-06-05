const { Storage } = require("@google-cloud/storage");

const sharp = require("sharp");

exports.generateThumbnails = async (img) => {
  const bucket = img.bucket;
  const imgPath = img.name;
  const storage = new Storage().bucket(bucket);
  const sizes = [320, 640, 1280];

  if (imgPath.includes("thumb/s/")) return;
  if (imgPath.includes("thumb/m/")) return;
  if (imgPath.includes("thumb/l/")) return;

  const result = await Promise.all(
    await new Promise((resolve, rejects) => {
      storage
        .file(imgPath)
        .createReadStream()
        .pipe(sharp().resize({ width: 320 }))
        .pipe(storage.file(`thumb/s/${imgPath}`).createWriteStream())
        .on("finish", () => resolve(`thumb/s/${imgPath}`))
        .on("error", () => rejects("ㅈ됐다..."));
    }),

    await new Promise((resolve, rejects) => {
      storage
        .file(imgPath)
        .createReadStream()
        .pipe(sharp().resize({ width: 640 }))
        .pipe(storage.file(`thumb/m/${imgPath}`).createWriteStream())
        .on("finish", () => resolve(`thumb/m/${imgPath}`))
        .on("error", () => rejects("ㅈ됐다..."));
    }),

    await new Promise((resolve, rejects) => {
      storage
        .file(imgPath)
        .createReadStream()
        .pipe(sharp().resize({ width: 1280 }))
        .pipe(storage.file(`thumb/l/${imgPath}`).createWriteStream())
        .on("finish", () => resolve(`thumb/l/${imgPath}`))
        .on("error", () => rejects("ㅈ됐다..."));
    })
  );
};
