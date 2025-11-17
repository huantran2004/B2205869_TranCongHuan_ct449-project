const NhaXuatBanService = require("../services/nhaxuatban.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.TenNXB) 
        return next(new ApiError(400, "TenNXB can not be empty"));
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
        new ApiError(500, "An error occurred while creating the nha xuat ban")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    documents = await nxbService.find({});
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving nha xuat ban"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Nha xuat ban not found"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving nha xuat ban with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.update(req.params.id, req.body);
    // Luôn trả về success message vì nếu có lỗi sẽ throw exception
    return res.send({ 
      message: "Nha xuat ban was updated successfully",
      data: document
    });
  } catch (error) {
    console.error("Update nha xuat ban error:", error);
    return next(new ApiError(400, error.message || `Error updating nha xuat ban with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const document = await nxbService.delete(req.params.id);
    if (!document) 
            return next(new ApiError(404, "Nha xuat ban not found"));
    return res.send({ message: "Nha xuat ban was deleted successfully"});
  } catch (error) {
    return next(new ApiError(500, `Could not delete nha xuat ban with id=${req.params.id}`));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const nxbService = new NhaXuatBanService(MongoDB.client);
    const deletedCount = await nxbService.deleteAll();
    return res.send({
      message: `${deletedCount} nha xuat ban were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all nha xuat ban"));
  }
};
