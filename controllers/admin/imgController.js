const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { server } = require("../../store/index");

// 保存为webp格式
const compressAndSave = async (buffer, outputPath, options = {}) => {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    await image
      .resize(
        options.width || metadata.width,
        options.height || metadata.height
      )
      .webp({
        quality: options.quality || 100,
      })
      .toFile(outputPath);
  } catch (error) {
    throw new Error(`图片处理失败: ${error.message}`);
  }
};

// 切片
const sliceImage = async (
  buffer,
  ImgSavePath,
  options = {},
  TILE_SIZE = 256
) => {
  try {
    // 开始切片;
    // 获取图片元数据
    const image = sharp(buffer);
    const slicePath = path.join(ImgSavePath, "slice");
    await fs.promises.mkdir(slicePath, { recursive: true });
    // 循环切片
    for (let y = 0; y < 380; y += TILE_SIZE) {
      for (let x = 0; x < 920; x += TILE_SIZE) {
        let width = TILE_SIZE;
        let height = TILE_SIZE;
        if (y + TILE_SIZE > 380) {
          height = 380 - y;
        }
        if (x + TILE_SIZE > 920) {
          width = 920 - x;
        }
        const tileName = `${options.filename}-${x}_${y}.webp`;
        const outputPath = path.join(slicePath, tileName);
        image
          .resize(920, 380)
          .extract({ left: x, top: y, width, height })
          .webp({
            quality: 100,
          })
          // 保存路径
          .toFile(outputPath);
      }
    }
    return true;
  } catch (error) {
    throw new Error(`图片处理失败: ${error.message}`);
  }
};
// 缩略图
const thumbnails = async (buffer, outputPath, options = {}) => {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    switch (options.controls) {
      case 1:
        await image
          .resize({
            width: options.width || metadata.width,
            height: options.height || metadata.height,
          }) // 调整尺寸
          .webp({ quality: options.quality || 80 }) // 设置 WebP 压缩质量
          .toFile(outputPath);
        break;
      case 2:
        let quality = 100; // 初始质量
        let fileSizeInKB = Infinity;
        while (fileSizeInKB > 2 && quality > 1) {
          await image
            .resize({
              width: options.width || metadata.width,
              height: options.height || metadata.height,
            }) // 调整尺寸
            .webp({ quality }) // 设置 WebP 压缩质量
            .toFile(outputPath);
          fileSizeInKB = fs.statSync(outputPath).size / 1024;
          quality -= 14; // 逐步降低质量
        }
        break;
      default:
        break;
    }
  } catch (error) {
    throw new Error(`图片处理失败: ${error.message}`);
  }
};

// 自定义存储引擎：直接处理文件不保存原始文件
const memoryStorage = multer.memoryStorage();
// 生成 Multer 中间件
const multers = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("仅支持图片文件"), false);
    }
  },
});

// 上传封面图片文件----一半缩略图+小缩略图
const uplode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "未上传图片" });
    }
    // 保存文件夹
    const filename = `articles_${Date.now()}`;
    const ImgSavePath = path.join(process.cwd(), "/public/articles", filename);
    if (!fs.existsSync(ImgSavePath))
      await fs.promises.mkdir(ImgSavePath, { recursive: true });
    // 保存为 webp
    const outputwebpPath = path.join(ImgSavePath, filename + ".webp");
    await compressAndSave(req.file.buffer, outputwebpPath);
    // 半缩图
    const thumbnailfilename = `${filename}-thumbnail.webp`;
    const outputPath = path.join(ImgSavePath, thumbnailfilename);
    await thumbnails(req.file.buffer, outputPath, { controls: 1 });
    // 全缩图
    const minthumbnailfilename = `${filename}-minthumbnail.webp`;
    const outputPathmin = path.join(ImgSavePath, minthumbnailfilename);
    await thumbnails(req.file.buffer, outputPathmin, { controls: 2 });
    const url = `${server}/articles/${filename}/${thumbnailfilename}`;
    res.status(200).json({
      success: true,
      message: {
        url: url,
        name: filename,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 轮播图
const uplodeBanner = async (req, res) => {
  try {
    const filename = `banner_${Date.now()}`;
    const ImgSavePath = path.join(process.cwd(), "/public/banner", filename);
    // 创建存储文件夹
    if (!fs.existsSync(ImgSavePath))
      await fs.promises.mkdir(ImgSavePath, { recursive: true });
    // 保存为 webp
    const outputwebpPath = path.join(ImgSavePath, filename + ".webp");
    await compressAndSave(req.file.buffer, outputwebpPath);
    // 切片
    await sliceImage(req.file.buffer, ImgSavePath, {
      filename: filename,
    });
    const url = `${server}/banner/${filename}/${filename}.webp`;
    res.status(200).json({
      success: true,
      message: {
        url: url,
        name: filename,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 用户头像
const uplodeUser = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "未上传图片" });
    }
    const filename = `user_${Date.now()}.webp`;
    const outputPath = path.join(process.cwd(), "/public/user", filename);
    await compressAndSave(req.file.buffer, outputPath, {
      quality: 100,
      width: 300,
      height: 300,
    });
    const url = `${server}/user/` + filename;
    res.status(200).json({
      success: true,
      message: {
        url: url,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 自动清理临时文件
// const cleanupOldFiles = async (dirPath, maxAgeHours = 24) => {
//   const files = await fs.readdir(dirPath);
//   const now = Date.now();
//   const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

//   await Promise.all(
//     files.map(async (file) => {
//       const filePath = path.join(dirPath, file);
//       const stats = await fs.stat(filePath);
//       if (now - stats.mtimeMs > maxAgeMs) {
//         await fs.unlink(filePath);
//       }
//     })
//   );
// };

// // 每天执行一次清理
// setInterval(() => {
//   cleanupOldFiles(path.join(__dirname, "../uploads"), 24);
// }, 24 * 60 * 60 * 1000);
module.exports = { multers, uplode, uplodeBanner, uplodeUser };
