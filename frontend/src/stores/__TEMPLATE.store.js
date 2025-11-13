import { defineStore } from 'pinia';
import { ref } from 'vue';
import http from '@/api/http';

// TEMPLATE: Replace 'entity' with your actual entity name (e.g., 'user', 'product')
// Replace '/entities' with your actual API endpoint

export const useEntityStore = defineStore('entity', () => {
  const entities = ref([]);
  const entity = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Fetch all entities
  const fetchAll = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await http.get('/entities', { params });
      entities.value = response.data;
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching entities';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch entity by ID
  const fetchById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await http.get(`/entities/${id}`);
      entity.value = response.data;
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching entity';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create new entity
  const create = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await http.post('/entities', data);
      entities.value.unshift(response.data);
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creating entity';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update entity
  const update = async (id, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await http.put(`/entities/${id}`, data);
      const index = entities.value.findIndex(e => e._id === id);
      if (index !== -1) {
        entities.value[index] = response.data;
      }
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error updating entity';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete entity
  const remove = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await http.delete(`/entities/${id}`);
      entities.value = entities.value.filter(e => e._id !== id);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting entity';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete all entities
  const removeAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      await http.delete('/entities');
      entities.value = [];
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting all entities';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    entities,
    entity,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    removeAll,
  };
});
