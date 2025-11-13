const express = require("express"); 
const cors = require("cors");
const docgiaRouter = require("./app/routes/contact.route");
const sachRouter = require("./app/routes/sach.route");
const nhaxuatbanRouter = require("./app/routes/nhaxuatban.route");
const theodoimuonsachRouter = require("./app/routes/theodoimuonsach.route");
const nhanvienRouter = require("./app/routes/nhanvien.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/docgia", docgiaRouter);
app.use("/api/sach", sachRouter);
app.use("/api/nhaxuatban", nhaxuatbanRouter);
app.use("/api/theodoimuonsach", theodoimuonsachRouter);
app.use("/api/nhanvien", nhanvienRouter);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

app.get("/", (req, res) => {
    res.json({message: "Welcome to library management application."});
});

module.exports = app;
