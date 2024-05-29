const mockky = require("../models/mock");

const getMocks =  (req, res,next) => {
    mockky.find({}).then(data=>{

    })
    res.status(200).send('data')
}

const addMock = (req, res, next) => {
  let { prop1, prop2, prop3 } = req.body;
  console.log("request-body", req.body);
  let mockDocument = new mockky({ prop1, prop2, prop3 });
  let saved = mockDocument.save().then(data=>{
    console.log("saved", data);
    res.send(JSON.stringify(data));
  })
}

module.exports = {
  getMocks,
  addMock,
};
