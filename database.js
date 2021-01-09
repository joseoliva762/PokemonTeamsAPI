const mongoose = require('mongoose');
const password= process.env.PASSWORD_KEY;
let databaseName = 'db'
if(process.env.NODE_ENV === 'test') {
    databaseName = 'testdb';
}
mongoose.connect(`mongodb+srv://admin:${password}@cluster0.jsjzl.mongodb.net/${databaseName}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));