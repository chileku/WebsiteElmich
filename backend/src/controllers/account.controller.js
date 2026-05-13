const accountService = require("../services/account.service");

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const result = await accountService.getAll(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const result = await accountService.create(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const result = await accountService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await accountService.remove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Xóa thành công",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
