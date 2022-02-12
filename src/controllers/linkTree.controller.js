import LinkTree from  '../models/linkTree.model';

class LinkTreeController {

  constructor() { }

  async getAll(req, res) {
    let linkTrees = await LinkTree.find({ userId: req.userId });
    return res.status(200).send(linkTrees);
  }

  async get(req, res) {
    let linkTree = await LinkTree.findOne({ userId: req.userId, _id: req.params.id });
    if (!linkTree)
      res.status(404).send({ error: 'LinkTree not found' });
      
    return res.status(200).send(linkTree);
  }

  async getPublic(req, res) {
    let linkTree;
    if (req.params.id.length == 24)
      linkTree = await LinkTree.findOne({ _id: req.params.id });
    if (!linkTree)
      res.status(404).send({ error: 'LinkTree not found' });
      
    return res.status(200).send(linkTree);
  }

  async create(req, res) {
    let linkTree = await LinkTree.create({ ...req.body, userId: req.userId });
    return res.status(200).send(linkTree);
  }

  async update(req, res) {
    let linkTree = await LinkTree.findOne({ userId: req.userId, _id: req.params.id });
    if (!linkTree)
      res.status(404).send({ error: 'LinkTree not found' });

    linkTree.title = req.body.title;
    linkTree.description = req.body.description;
    linkTree.buttonColor = req.body.buttonColor;
    linkTree.buttonTextColor = req.body.buttonTextColor;
    linkTree.links = req.body.links;
    linkTree = await linkTree.save();

    return res.status(200).send(linkTree);
  }

  async delete(req, res) {
    let linkTree = await LinkTree.findOne({ userId: req.userId, _id: req.params.id });
    if (!linkTree)
      res.status(404).send({ error: 'LinkTree not found' });

    linkTree = await linkTree.remove();
    return res.status(200).send(linkTree);
  }

}

export default new LinkTreeController();
