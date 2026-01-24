const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: Date
  }],
  isSystemMessage: {
    type: Boolean,
    default: false
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['project', 'quotation', 'design']
    },
    reference: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  lastMessage: {
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = { Message, Conversation };

