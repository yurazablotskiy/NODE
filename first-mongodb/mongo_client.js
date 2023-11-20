const mongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2';

mongoClient.connect(url, (err, db) => {
  if (err) throw err
  console.log('Мы подключись')

  let dbo = db.db("node_js")
  dbo.collection("users").insertOne(
    { "_id": 2, "name": "Bob", "login": "BobMarley", "pass": "123456" },
    (err, res) => {
      if (err) throw err
      console.log('Пользователь добавлен')
      db.close() // !!!!
    }
  )

  // let coll = dbo.collection("users")
  // coll.findOne({ "name": "Bob", "_id": 2 }, (err, res) => {
  //     if (err) throw err

  //     console.log(res.name)

  //     db.close()
  // })
})