const SachService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.TenSach) 
        return next(new ApiError(400, "TenSach can not be empty"));
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.error("Create sach error:", error);
    return next(
        new ApiError(400, error.message || "An error occurred while creating the sach")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const sachService = new SachService(MongoDB.client);
    const { name } = req.query;
    documents = name
      ? await sachService.findByName(name)
      : await sachService.find({});
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving sach"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Sach not found"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving sach with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.update(req.params.id, req.body);
    // Luôn trả về success message vì nếu có lỗi sẽ throw exception
    return res.send({ 
      message: "Sach was updated successfully",
      data: document 
    });
  } catch (error) {
    console.error("Update sach error:", error);
    return next(new ApiError(400, error.message || `Error updating sach with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const document = await sachService.delete(req.params.id);
    if (!document) 
            return next(new ApiError(404, "Sach not found"));
    return res.send({ message: "Sach was deleted successfully"});
  } catch (error) {
    return next(new ApiError(500, `Could not delete sach with id=${req.params.id}`));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const sachService = new SachService(MongoDB.client);
    const deletedCount = await sachService.deleteAll();
    return res.send({
      message: `${deletedCount} sach were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all sach"));
  }
};
