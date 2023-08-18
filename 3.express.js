const express = require('express');
const app = express();
const dittoJSON = require('./ditto.json');

app.disable('x-powered-by');

app.use((req, res, next)=>{
    //trackear la request
    console.log('mi primer middleware');
    next();
})

app.get('/', (req, res) => {
    res.status(200).send('<h1>Hola crack </h1>');
});

app.get('/pokemon/ditto', (req, res) => {
    //res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(200).json(dittoJSON);
});

app.post('/pokemon', (req, res) => {
    let body = ''

    // escuchar el evento data
    req.on('data', chunk => {
        body += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(body)
        data.timestamp = Date.now();
        res.status(201).json(data);
        //res.end(JSON.stringify(data))
    })

});

//la ultima en ejecutarse
app.use((req, res)=>{
    res.status(400).send('<h1>404</h1>');
})

app.listen(1234, () => {
    console.log('server listening on port http://localhost:1234')
});

