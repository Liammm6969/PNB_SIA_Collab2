// Utility functions for controller CRUD operations
exports.createDocument = async (Model, data, res) => {
  try {
    const doc = new Model(data);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getDocumentById = async (Model, id, res, populate = []) => {
  try {
    let query = Model.findById(id);
    populate.forEach((field) => {
      query = query.populate(field);
    });
    const doc = await query;
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listDocuments = async (Model, res, populate = []) => {
  try {
    let query = Model.find();
    populate.forEach((field) => {
      query = query.populate(field);
    });
    const docs = await query;
    res.json(docs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
