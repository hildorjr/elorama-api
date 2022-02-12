import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SimpleEncryptor from 'simple-encryptor';

dotenv.config();

const encryptor = SimpleEncryptor(process.env.SALT);

const LinkSchema = new mongoose.Schema({
  url: String,
  label: String,
});
const LinkTreeSchema = new mongoose.Schema({
  userId:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  buttonColor: {
    type: String,
    required: false,
  },
  buttonTextColor: {
    type: String,
    required: false,
  },
  links: {
    type: [LinkSchema],
    required: false,
  },
}, { timestamps: true });

LinkTreeSchema.pre('save', function(next) {
  var linkTree = this;
  linkTree.title = encryptor.encrypt(linkTree.title);
  linkTree.description = encryptor.encrypt(linkTree.description);
  next();
});

LinkTreeSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    ret.title = encryptor.decrypt(ret.title);
    ret.description = encryptor.decrypt(ret.description);
  }
});

const LinkTree = mongoose.model('linkTrees', LinkTreeSchema);

export default LinkTree;
