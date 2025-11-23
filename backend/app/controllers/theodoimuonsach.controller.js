const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.MaDocGia || !req.body?.MaSach) 
        return next(new ApiError(400, "MaDocGia and MaSach can not be empty"));
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await tdmsService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
        new ApiError(500, "An error occurred while creating the theo doi muon sach")
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const { MaDocGia, MaSach } = req.query;
    if (MaDocGia) {
      documents = await tdmsService.findByDocGia(MaDocGia);
    } else if (MaSach) {
      documents = await tdmsService.findBySach(MaSach);
    } else {
      documents = await tdmsService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving theo doi muon sach"));
  }
  return res.send(documents);
};

exports.findChuaTra = async (req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const documents = await tdmsService.findChuaTra();
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving unreturned books"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await tdmsService.findById(req.params.id);
    if (!document) return next(new ApiError(404, "Theo doi muon sach not found"));
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Error retrieving theo doi muon sach with id=${req.params.id}`));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await tdmsService.update(req.params.id, req.body);
    // Luôn trả về success message vì nếu có lỗi sẽ throw exception
    return res.send({ 
      message: "Theo doi muon sach was updated successfully",
      data: document
    });
  } catch (error) {
    console.error("Update theo doi muon sach error:", error);
    return next(new ApiError(400, error.message || `Error updating theo doi muon sach with id=${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await tdmsService.delete(req.params.id);
    if (!document) 
            return next(new ApiError(404, "Theo doi muon sach not found"));
    return res.send({ message: "Theo doi muon sach was deleted successfully"});
  } catch (error) {
    return next(new ApiError(500, `Could not delete theo doi muon sach with id=${req.params.id}`));
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const deletedCount = await tdmsService.deleteAll();
    return res.send({
      message: `${deletedCount} theo doi muon sach were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all theo doi muon sach"));
  }
};

exports.duyetMuonSach = async (req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await tdmsService.duyetMuonSach(req.params.id);
    return res.send({ message: "Duyệt yêu cầu mượn sách thành công", data: document });
  } catch (error) {
    console.error("Duyet muon sach error:", error);
    return next(new ApiError(400, error.message || `Error approving borrow request with id=${req.params.id}`));
  }
};

exports.traSach = async (req, res, next) => {
  try {
    const tdmsService = new TheoDoiMuonSachService(MongoDB.client);
    const document = await tdmsService.traSach(req.params.id);
    return res.send({ message: "Sách đã được trả thành công", data: document });
  } catch (error) {
    console.error("Tra sach error:", error);
    return next(new ApiError(400, error.message || `Error returning book with id=${req.params.id}`));
  }
};
