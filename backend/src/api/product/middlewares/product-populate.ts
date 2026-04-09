const populate = {
    image: {
        populate: true,
    },
    category: {
        populate: true,
    },
    localizations: {
        fields: ["slug", "locale"],
    },
};

export default (config, { strapi }) => {
    return async (ctx, next) => {
        const existingPopulate =
            ctx.query.populate && typeof ctx.query.populate === "object"
                ? ctx.query.populate
                : {};

        ctx.query = {
            ...ctx.query,
            populate: {
                ...existingPopulate,
                ...populate,
            },
        };

        await next();
    };
};
