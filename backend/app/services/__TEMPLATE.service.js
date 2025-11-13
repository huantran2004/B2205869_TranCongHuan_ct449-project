const { Entity } = require('../models'); // Replace Entity with your model name
const ApiError = require('../utils/ApiError');

// TEMPLATE: Replace 'Entity' and 'entity' with your actual entity name

class EntityService {
    // Create a new entity
    async create(entityData) {
        try {
            const entity = await Entity.create(entityData);
            return entity;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApiError(400, error.message);
            }
            throw new ApiError(500, 'Error creating entity');
        }
    }

    // Get all entities with optional filters
    async getAll(filter = {}) {
        try {
            const entities = await Entity.find(filter).sort({ createdAt: -1 });
            return entities;
        } catch (error) {
            throw new ApiError(500, 'Error retrieving entities');
        }
    }

    // Get entity by ID
    async getById(id) {
        try {
            const entity = await Entity.findById(id);
            if (!entity) {
                throw new ApiError(404, 'Entity not found');
            }
            return entity;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new ApiError(400, 'Invalid entity ID');
            }
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, 'Error retrieving entity');
        }
    }

    // Update entity by ID
    async update(id, updateData) {
        try {
            const entity = await Entity.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!entity) {
                throw new ApiError(404, 'Entity not found');
            }
            return entity;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApiError(400, error.message);
            }
            if (error.name === 'CastError') {
                throw new ApiError(400, 'Invalid entity ID');
            }
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, 'Error updating entity');
        }
    }

    // Delete entity by ID
    async delete(id) {
        try {
            const entity = await Entity.findByIdAndDelete(id);
            if (!entity) {
                throw new ApiError(404, 'Entity not found');
            }
            return entity;
        } catch (error) {
            if (error.name === 'CastError') {
                throw new ApiError(400, 'Invalid entity ID');
            }
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, 'Error deleting entity');
        }
    }

    // Delete all entities (optional - use with caution)
    async deleteAll() {
        try {
            const result = await Entity.deleteMany({});
            return result;
        } catch (error) {
            throw new ApiError(500, 'Error deleting all entities');
        }
    }
}

module.exports = new EntityService();
