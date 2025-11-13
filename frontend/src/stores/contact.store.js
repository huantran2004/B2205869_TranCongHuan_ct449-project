import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import http from '@/api/http';

export const useContactStore = defineStore('contact', () => {
  const contacts = ref([]);
  const contact = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Computed
  const favoriteContacts = computed(() => 
    contacts.value.filter(c => c.favorite)
  );

  // Fetch all contacts
  const fetchAll = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await http.get('/contacts', { params });
      contacts.value = response.data;
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching contacts';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch favorite contacts
  const fetchFavorites = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await http.get('/contacts/favorites');
      contacts.value = response.data;
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching favorite contacts';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch contact by ID
  const fetchById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await http.get(`/contacts/${id}`);
      contact.value = response.data;
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error fetching contact';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create new contact
  const create = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await http.post('/contacts', data);
      contacts.value.unshift(response.data);
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error creating contact';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update contact
  const update = async (id, data) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await http.put(`/contacts/${id}`, data);
      const index = contacts.value.findIndex(c => c._id === id);
      if (index !== -1) {
        contacts.value[index] = response.data;
      }
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Error updating contact';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete contact
  const remove = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await http.delete(`/contacts/${id}`);
      contacts.value = contacts.value.filter(c => c._id !== id);
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting contact';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete all contacts
  const removeAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      await http.delete('/contacts');
      contacts.value = [];
    } catch (err) {
      error.value = err.response?.data?.message || 'Error deleting all contacts';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    contacts,
    contact,
    loading,
    error,
    favoriteContacts,
    fetchAll,
    fetchFavorites,
    fetchById,
    create,
    update,
    remove,
    removeAll,
  };
});
