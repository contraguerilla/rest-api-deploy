const zod = require('zod');

const validateSquema2 = zod.object({
    title: zod.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }),
    year: zod.number().min(1900).max(2023),
    director: zod.string(),
    duration: zod.number().int(),
    poster: zod.string().url({message: 'Invalid url'}),
    rate: zod.number().min(0).max(10),
    genre: zod.array(zod.enum(['Action', 'Adventure','Drama']))
}).strict();

function validateMovies(object) {
    return validateSquema2.safeParse(object);
};

function validatePartialMovie (input) {
    return validateSquema2.partial().safeParse(input)
  }

module.exports = {
    validateMovies,
    validatePartialMovie
}