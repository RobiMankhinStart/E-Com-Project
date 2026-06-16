const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async (file, folder) => {
  const base64String = file.buffer.toString("base64");
  const dataUrl = `data:${file.mimetype};base64,${base64String}`;
  return await cloudinary.uploader.upload(dataUrl, { folder });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok") {
      console.warn(`Cloudinary delete warning for ${publicId}:`, result);
    }
    return result;
  } catch (error) {
    console.error(`Cloudinary delete error for ${publicId}:`, error.message);
    throw error;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
