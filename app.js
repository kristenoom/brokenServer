require('dotenv').config();
let express = require('express');
let app = express();
let sequelize = require('./db');
let user = require('./controllers/usercontroller');
let game = require('./controllers/gamecontroller')

sequelize.sync();
//sequalize.sync({force:true});
//app.use(require('body-parser'));

app.use(express.json());

app.use('/api/auth', user);

app.use(require('./middleware/validate-session'))

app.use('/api/game', game);

app.listen(4000, function() {
    console.log("App is listening on 4000");
})