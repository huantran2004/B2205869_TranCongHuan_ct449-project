const mongoose = require('mongoose');

// TEMPLATE: Replace 'EntityName' with your actual entity name
const entitySchema = new mongoose.Schema(
    {
        // Example fields - customize based on your entity
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        // Add more fields as needed
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Add indexes if needed
// entitySchema.index({ name: 1 });

// Add virtual properties if needed
// entitySchema.virtual('fullName').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

// Add instance methods if needed
// entitySchema.methods.methodName = function() {
//     // method implementation
// };

// Add static methods if needed
// entitySchema.statics.staticMethodName = function() {
//     // static method implementation
// };

const Entity = mongoose.model('Entity', entitySchema);

module.exports = Entity;
