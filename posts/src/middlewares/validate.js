const Joi = require("joi");

// Create validation strategy. Use Joi package to check 
const schemas = {
    postSchema: Joi.object().keys({
        title: Joi.string(),
        lead: Joi.string(),
        categoryId: Joi.string(),
        thumbnailUrl: Joi.string(),
        content: Joi.string(),
        slug: Joi.string()
    }),
    categorySchema: Joi.object().keys({
        slug: Joi.string(),
        name: Joi.string(),
        parentId: Joi.string(),
    })
};

// Function to check body
const validateBody = (name) => {
    return (req, res, next) => {
        const validatorResult = schemas[name].validate(req.body);

        if (validatorResult.error) {
            // Filter error message
            const errorList = validatorResult.error.details.map((e) => {
                let path = e.path;
                return { message: e.message, path: e.context.value };
            });

            return res.status(400).json(errorList);
        } else {
            req.body = validatorResult.value;
            next();
        }
    };
};
module.exports = {
    validateBody,
};
