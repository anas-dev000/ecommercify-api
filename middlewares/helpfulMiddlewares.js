// Nested route
// @Ex: GET /api/categories/:category/subCategories
// DOCS   Filter all documents that belong to a specific category
//        In case of GET request

const createFilterObject = (paramName) => (req, res, next) => {
  let filterObject = {};
  if (req.params[paramName]) {
    filterObject = { [paramName]: req.params[paramName] };
  }
  req.filterObject = filterObject;
  next();
};

const jsonFormatHandler = (req, res, next) => {
  if (req.body.subCategories) {
    try {
      req.body.subCategories = JSON.parse(req.body.subCategories);
    } catch (err) {
      return res
        .status(400)
        .json({ msg: "Invalid JSON format in subCategories" });
    }
  }
  next();
};

const editUserActivity = (req, res, next) => {
  const isActive = false;
  req.body.isActive = isActive;
  next();
};

module.exports = {
  createFilterObject,
  jsonFormatHandler,
  editUserActivity,
};
