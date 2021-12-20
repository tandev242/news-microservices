const auth_role = (permission) => {
  return (req, res, next) => {
    try {
      if (permission.includes(req.user.role)) next();
      else {
        return res
          .status(401)
          .json({ msg: "You do not have permission to access this content" });
      }
    } catch (error) {
      return res.status(401).json({ msg: err.message });
    }
  };
};

module.exports = auth_role;
