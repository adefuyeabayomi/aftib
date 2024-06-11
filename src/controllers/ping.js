const ping =  (req, res) => {
    res.status(200).send('awake')
}

module.exports = {
  ping
}
