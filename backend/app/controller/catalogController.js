import catalog from '../models/catalogModel'

exports.get = async (req, res) => {
    const data = await catalog.findAll();
    res.send(data)
}