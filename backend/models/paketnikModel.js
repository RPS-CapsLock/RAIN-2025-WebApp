const mongoose = require('mongoose');
const { Schema } = mongoose;

const paketnikSchema = new mongoose.Schema({
    'number': { type: Number, required: true, unique: true },
    'owner': [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    'location': { type: String, required: true },
    'status': { 
        type: String, 
        enum: ['available', 'occupied', 'out_of_service'], 
        default: 'available' 
    },
    'open_logs': [{
        dateTime: { type: Date, default: Date.now },
        status: { 
            type: String, 
            enum: ['opened', 'closed', 'failed'], 
            required: true 
        }
    }]
});

module.exports = mongoose.model('Paketnik', paketnikSchema);