const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    const u = result.user.toJSON ? result.user.toJSON() : result.user;
    const { Password, ...safeUser } = u;

    res.json({
      success: true,
      token: result.token,
      user: safeUser,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

/** GET /api/auth/me — cần header Authorization: Bearer <token> */
exports.getInfo = async (req, res) => {
  try {
    const user = await authService.getInfo(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Thiếu thông tin" });
    const result = await authService.changePassword(req.user.id, oldPassword, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};