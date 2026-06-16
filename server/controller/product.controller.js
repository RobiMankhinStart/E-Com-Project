const categorySchema = require("../models/categorySchema");
const productSchema = require("../models/productSchema");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");
const { responseHandler } = require("../services/responseHandler");

const SIZE_ENUM = ["s", "m", "l", "xl", "2xl", "3xl"];
const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      category,
      price,
      discountPercentage,
      variants,
      tags,
      isActive,
    } = req.body;
    const thumbnail = req.files?.thumbnail;
    const images = req.files?.images;

    if (!title) return responseHandler.error(res, 400, "Title is required");
    if (!slug) return responseHandler.error(res, 400, "Slug is required");
    const isSlugExist = await productSchema.findOne({
      slug: slug.toLowerCase(),
    });
    if (isSlugExist)
      return responseHandler.error(res, 400, "Slug already exists");
    if (!description)
      return responseHandler.error(res, 400, "Description is required");
    if (!category)
      return responseHandler.error(res, 400, "Category is required");
    const isCategoryExist = await categorySchema.findById(category);
    if (!isCategoryExist)
      return responseHandler.error(res, 400, "This Category is not valid");
    if (!price) return responseHandler.error(res, 400, "Price is required");

    const variantsData = JSON.parse(variants);
    if (!Array.isArray(variantsData) || variantsData.length === 0)
      return responseHandler.error(res, 400, "Minimum required variant is 1.");

    for (const variant of variantsData) {
      if (!variant.sku)
        return responseHandler.error(res, 400, "SKU is required.");
      if (!variant.color)
        return responseHandler.error(res, 400, "Color is required.");
      if (!variant.size)
        return responseHandler.error(res, 400, "Color is required.");
      if (!SIZE_ENUM.includes(variant.size))
        return responseHandler.error(res, 400, "Invalid size");
      if (!variant.stock || variant.stock < 1)
        return responseHandler.error(
          res,
          400,
          "Stock can not be empty and Minimum required Stock is 1 ",
        );
    }

    const skus = variantsData.map((v) => v.sku);
    if (new Set(skus).size !== skus.length)
      return responseHandler.error(res, 400, "SKU must be unique");

    if (!thumbnail || thumbnail?.length === 0)
      return responseHandler.error(res, 400, "Thumbnail is required");
    if (images && images?.length > 4)
      return responseHandler.error(
        res,
        400,
        "Maximum uploading capacity for images is 4",
      );

    const thumnailUrl = await uploadToCloudinary(thumbnail[0], "products");
    let imagesUrl = [];

    if (images) {
      const resPromise = images.map(async (item) =>
        uploadToCloudinary(item, "products"),
      );
      const results = await Promise.all(resPromise);
      imagesUrl = results.map((r) => r.secure_url);
    }

    const newProduct = new productSchema({
      title,
      slug: slug.toLowerCase(),
      description,
      category,
      price,
      discountPercentage,
      variants: variantsData,
      thumbnail: thumnailUrl.secure_url,
      images: imagesUrl,
      tags,
      isActive,
    });
    newProduct.save();
    return responseHandler.success(
      res,
      201,
      newProduct,
      "Product uploaded successfully",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const getProductList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const isAdminRequest = req.query.admin === "true";
    const skip = (page - 1) * limit;

    const queryFilter = {};
    if (!isAdminRequest) {
      queryFilter.isActive = true;
    }

    const pipeline = [
      {
        $match: queryFilter,
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
    ];

    if (category) {
      pipeline.push({
        $match: {
          "category.slug": category,
        },
      });
    }

    if (search) {
      pipeline.push({
        $match: {
          title: {
            $regex: search,
            $options: "i",
          },
        },
      });
    }

    const countPipeline = [...pipeline, { $count: "totalCount" }];
    const countResult = await productSchema.aggregate(countPipeline);
    const totalProducts = countResult[0]?.totalCount || 0;

    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const productList = await productSchema.aggregate(pipeline);

    const totalPages = Math.ceil(totalProducts / limit);

    return responseHandler.success(res, 200, {
      products: productList,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const getProductDetals = async (req, res) => {
  try {
    const slug = req.params.slug?.toLowerCase();
    const isAdminRequest = req.query.admin === "true";
    const query = { slug };
    if (!isAdminRequest) {
      query.isActive = true;
    }
    const productDetails = await productSchema
      .findOne(query)
      .populate("category", "name")
      .select("-updatedAt -__v");
    if (!productDetails)
      return responseHandler.error(res, 404, "Product not found");

    return responseHandler.success(
      res,
      200,
      productDetails,
      "Product Details Fetched Successfully",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      discountPercentage,
      variants,
      tags,
      isActive,
      destroyImages = [],
    } = req.body;
    const { slug } = req.params;
    const thumbnail = req.files?.thumbnail?.[0];
    const images = req.files?.images;

    const productData = await productSchema.findOne({
      slug: slug?.toLowerCase(),
    });
    if (!productData)
      return responseHandler.error(res, 404, "Product not found");
    productData.images = Array.isArray(productData.images)
      ? productData.images
      : [];

    if (title) productData.title = title;
    if (description) productData.description = description;
    if (category) productData.category = category;
    if (price) productData.price = price;
    if (discountPercentage || discountPercentage === 0)
      productData.discountPercentage = discountPercentage;

    if (typeof isActive !== "undefined") {
      productData.isActive = isActive === "true" || isActive === true;
    }

    if (typeof tags !== "undefined") {
      if (Array.isArray(tags) && tags.length > 0) {
        productData.tags = tags.filter(Boolean);
      } else if (typeof tags === "string") {
        const parsedTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        productData.tags = parsedTags;
      }
    }

    let destroyImagesParsed = [];
    if (typeof destroyImages === "string") {
      destroyImagesParsed = [destroyImages];
    } else if (Array.isArray(destroyImages)) {
      destroyImagesParsed = destroyImages;
    }

    const variantsData = variants && JSON.parse(variants);
    if (Array.isArray(variantsData) && variantsData.length > 0) {
      for (const variant of variantsData) {
        if (!variant.sku)
          return responseHandler.error(res, 400, "SKU is required.");
        if (!variant.color)
          return responseHandler.error(res, 400, "Color is required.");
        if (!variant.size)
          return responseHandler.error(res, 400, "Color is required.");
        if (!SIZE_ENUM.includes(variant.size))
          return responseHandler.error(res, 400, "Invalid size");
        if (!variant.stock || variant.stock < 1)
          return responseHandler.error(
            res,
            400,
            "Stock is required and must be more then 0",
          );
      }

      const skus = variantsData.map((v) => v.sku);
      if (new Set(skus).size !== skus.length)
        return responseHandler.error(res, 400, "SKU must be unique");

      productData.variants = variantsData;
    }

    if (thumbnail) {
      const imgPublicId = productData.thumbnail.split("/").pop().split(".")[0];
      deleteFromCloudinary(`products/${imgPublicId}`);
      const imgRes = await uploadToCloudinary(thumbnail, "products");
      productData.thumbnail = imgRes.secure_url;
    }
    let imagesUrl = [];

    let existingImages = Array.isArray(productData.images)
      ? productData.images
      : [];
    let totalImages = existingImages.length;
    if (destroyImagesParsed.length > 0)
      totalImages -= destroyImagesParsed.length;
    if (Array.isArray(images) && images.length > 0)
      totalImages += images.length;

    if (totalImages > 4)
      return responseHandler.error(
        res,
        400,
        "Maximum 4 images can be uploaded",
      );
    if (totalImages < 1)
      return responseHandler.error(res, 400, "Minimum 1 image is required");

    if (images && images.length > 0) {
      const resPromise = images.map(async (item) =>
        uploadToCloudinary(item, "products"),
      );
      const results = await Promise.all(resPromise);
      imagesUrl = results.map((r) => r.secure_url);
    }

    if (Array.isArray(destroyImagesParsed) && destroyImagesParsed.length > 0) {
      for (const url of destroyImagesParsed) {
        const imgPublicId = url.split("/").pop().split(".")[0];
        deleteFromCloudinary(`products/${imgPublicId}`);
      }
    }

    const filteredImgs = existingImages.filter((item) => {
      return !destroyImagesParsed.includes(item);
    });

    productData.images = [...filteredImgs, ...imagesUrl];

    productData.save();

    return responseHandler.success(
      res,
      200,
      productData,
      "Product Updated Successfully",
    );
  } catch (error) {
    console.log(error);
    return responseHandler.error(res, 400, "internal server error");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productSchema.findByIdAndDelete(id);

    if (!product) return responseHandler.error(res, 404, "Product not found");

    // Delete images from Cloudinary
    if (product.thumbnail) {
      const imgPublicId = product.thumbnail.split("/").pop().split(".")[0];
      await deleteFromCloudinary(`products/${imgPublicId}`);
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const imgPublicId = imageUrl.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`products/${imgPublicId}`);
      }
    }

    return responseHandler.success(
      res,
      200,
      {},
      "Product Deleted Successfully",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

module.exports = {
  createProduct,
  getProductList,
  getProductDetals,
  updateProduct,
  deleteProduct,
};
