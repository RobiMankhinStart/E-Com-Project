const categorySchema = require("../models/categorySchema");
const { uploadToCloudinary } = require("../services/cloudinaryService");
const { responseHandler } = require("../services/responseHandler");

const createNewCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name)
      return responseHandler.error(res, 400, "Category name is required");
    if (!slug) return responseHandler.error(res, 400, "Slug is required");
    if (!req.file)
      return responseHandler.error(res, 400, "Category Thumnail is required");

    const existingSlug = await categorySchema.findOne({ slug });
    if (existingSlug)
      return responseHandler.error(
        res,
        400,
        "This category slug already exists",
      );

    const imgRes = await uploadToCloudinary(req.file, "categories");

    const category = new categorySchema({
      name,
      slug,
      description,
      thumbnail: imgRes.secure_url,
    });

    await category.save();
    return responseHandler.success(
      res,
      201,
      category,
      "Category Created Successfully",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categorySchema.find({});
    return responseHandler.success(
      res,
      200,
      categories,
      "Categories Fetched Successfully",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

module.exports = { createNewCategory, getAllCategories };
