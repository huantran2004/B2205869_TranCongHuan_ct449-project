const entityService = require('../services/__TEMPLATE.service'); // Replace with your service
const ApiResponse = require('../utils/ApiResponse');
const pick = require('../utils/pick');

// TEMPLATE: Replace 'entity/entities' with your actual entity name

class EntityController {
    // Create new entity
    async create(req, res) {
        const entity = await entityService.create(req.body);
        res.status(201).json(
            new ApiResponse(201, entity, 'Entity created successfully')
        );
    }

    // Get all entities
    async getAll(req, res) {
        // Example: Extract filter params if needed
        // const filter = pick(req.query, ['field1', 'field2']);
        const entities = await entityService.getAll();
        res.json(
            new ApiResponse(200, entities, 'Entities retrieved successfully')
        );
    }

    // Get entity by ID
    async getById(req, res) {
        const entity = await entityService.getById(req.params.id);
        res.json(
            new ApiResponse(200, entity, 'Entity retrieved successfully')
        );
    }

    // Update entity
    async update(req, res) {
        const entity = await entityService.update(req.params.id, req.body);
        res.json(
            new ApiResponse(200, entity, 'Entity updated successfully')
        );
    }

    // Delete entity
    async delete(req, res) {
        await entityService.delete(req.params.id);
        res.json(
            new ApiResponse(200, null, 'Entity deleted successfully')
        );
    }

    // Delete all entities
    async deleteAll(req, res) {
        const result = await entityService.deleteAll();
        res.json(
            new ApiResponse(200, result, `${result.deletedCount} entities deleted successfully`)
        );
    }
}

module.exports = new EntityController();
