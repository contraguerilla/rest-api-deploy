const express = require('express');
const app = express();
const movies = require('./movies.json');
const cryto = require('node:crypto');
const { validateMovies, validatePartialMovie } = require('./squemas/movies');

app.disable('x-powered-by');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('<h1>Hola crack </h1>');
});

app.get('/movies', (req, res) => {
    res.header('Access-Control-Allow-Origin','*');  //para evitar error CORS al solicitar este recurso desde otro dominio
    const { genre } = req.query;
    console.log(genre);
    

    if (genre) {
        const filterMovies = movies.filter(
            movie => movie.genre.includes(genre)
        )
        return res.json(filterMovies)
    }

    res.json(movies);

});

app.get('/movies/:id', (req, res) => { //path-to-regexp
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(400).json({ message: 'Movie not found' });
});

app.post('/movies', (req, res) => {

    const result = validateMovies(req.body);
    console.warn(result)
    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }


    const newMovie = {
        id: cryto.randomUUID(),
        ...result.data
    };

    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {

    const result = validatePartialMovie(req.body);
    console.warn(result)
    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    };

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);


    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie);
})

//la ultima en ejecutarse
app.use((req, res) => {
    res.status(400).send('<h1>404</h1>');
});

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
});
/*
app.listen(1234, () => {
    console.log('server listening on port http://localhost:1234')
});*/



