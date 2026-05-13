exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 1) {
    return res.status(403).json({
      success: false,
      message: "Không có quyền truy cập"
    });
  }
  next();
};