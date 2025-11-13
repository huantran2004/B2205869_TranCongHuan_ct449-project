const NhanVienService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.HoTenNV || !req.body?.Password) 
        return next(new ApiError(400, "HoTenNV and Password can not be empty"));
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
        new ApiError(500, "An error occurred while creating the nhan vien")
    );
  }
};

exports.login = async (req, res, next) => {
  if (!req.body?.MSNV || !req.body?.Password) 
        return next(new ApiError(400, "MSNV and Password can not be empty"));
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.login(req.body.MSNV, req.body.Password);
    if (!document) return next(new ApiError(401, "Invalid MSNV or Password"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred during login"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    documents = await nhanVienService.find({});
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving nhan vien"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Nhan vien not found"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving nhan vien with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.update(req.params.id, req.body);
    if (!document) return next(new ApiError(404, "Nhan vien not found"));
    return res.send({ message: "Nhan vien was updated successfully" });
  } catch (error) {
    return next(new ApiError(500, `Error updating nhan vien with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const document = await nhanVienService.delete(req.params.id);
    if (!document) 
            return next(new ApiError(404, "Nhan vien not found"));
    return res.send({ message: "Nhan vien was deleted successfully"});
  } catch (error) {
    return next(new ApiError(500, `Could not delete nhan vien with id=${req.params.id}`));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const nhanVienService = new NhanVienService(MongoDB.client);
    const deletedCount = await nhanVienService.deleteAll();
    return res.send({
      message: `${deletedCount} nhan vien were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all nhan vien"));
  }
};
