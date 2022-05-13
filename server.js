const express = require('express');

const app = express();

const connectionDB = require('./config/db');

connectionDB();

app.get('/',(req, res)=>{
    res.send('Hello World');
})

app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}.`);
})