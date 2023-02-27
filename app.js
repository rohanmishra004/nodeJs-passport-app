const express = require('express');
const expressLayouts = require('express-ejs-layouts');


const app = express();

//middleware
app.use(expressLayouts);
app.set('view engine', 'ejs'); //here we are setting the type of view engine

//Routes
app.use('/',require('./routes/index'))
app.use('/',require('./routes/users'))




const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})