import express from 'express';


const app = express();
//express work is to route and serve
app.get('/api/jokes', (req, res) => {

    const jokes=[
        {
            id: "1",
            title : "Joke",
            content : "this is a joke"
        },
        {
            id: "2",
            title : "Another joke",
            content : "this is a Another joke"
        },
        {
            id: "3",
            title : "Third joke",
            content : "this is a Third joke"
        },
        {
            id: "4",
            title : "Forth joke",
            content : "this is a Forth joke"
        },
        {
            id: "5",
            title : "Fivth joke",
            content : "this is a Fivth joke"
        },
    ];
    res.send(jokes);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`);
});

//backend part done now create an application in frontend 
 