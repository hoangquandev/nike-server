// access db
const moogoose = require("mongoose")

moogoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true , useFindAndModify: false})
  .then(() => {
    console.log('DB connected');
  }, error => {
    console.log(error, 'error');
  })