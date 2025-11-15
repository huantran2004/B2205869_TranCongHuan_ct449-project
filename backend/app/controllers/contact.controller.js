const DocGiaService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.Ten) 
        return next(new ApiError(400, "Ten can not be empty"));
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
        new ApiError(500, "An error occurred while creating the doc gia")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const { name } = req.query;
    documents = name
      ? await docGiaService.findByName(name)
      : await docGiaService.find({});
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving doc gia"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Doc gia not found"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving doc gia with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.update(req.params.id, req.body);
    if (!document) return next(new ApiError(404, "Doc gia not found"));
    return res.send({ message: "Doc gia was updated successfully" });
  } catch (error) {
    return next(new ApiError(500, `Error updating doc gia with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.delete(req.params.id);
    if (!document) 
            return next(new ApiError(404, "Doc gia not found"));
    return res.send({ message: "Doc gia was deleted successfully"});
  } catch (error) {
    return next(new ApiError(500, `Could not delete doc gia with id=${req.params.id}`));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const deletedCount = await docGiaService.deleteAll();
    return res.send({
      message: `${deletedCount} doc gia were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all doc gia"));
  }
};

exports.login = async (req, res, next) => {
  if (!req.body?.MaDocGia || !req.body?.Password) 
    return next(new ApiError(400, "MaDocGia and Password can not be empty"));
  try {
    const docGiaService = new DocGiaService(MongoDB.client);
    const document = await docGiaService.login(req.body.MaDocGia, req.body.Password);
    if (!document) 
      return next(new ApiError(401, "Invalid MaDocGia or Password"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred during login"));
  }
};
