<template>
  <div class="contact-list">
    <div class="header">
      <h1>Contacts</h1>
      <div class="actions">
        <button @click="showFavoritesOnly = !showFavoritesOnly" class="btn btn-secondary">
          {{ showFavoritesOnly ? 'Show All' : 'Show Favorites' }}
        </button>
        <RouterLink to="/contacts/new" class="btn btn-primary">
          Add New Contact
        </RouterLink>
        <button 
          @click="handleDeleteAll" 
          class="btn btn-danger"
          :disabled="filteredContacts.length === 0"
        >
          Delete All
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="filteredContacts.length === 0" class="empty">
      <p>No contacts found</p>
      <RouterLink to="/contacts/new" class="btn btn-primary">
        Add Your First Contact
      </RouterLink>
    </div>

    <div v-else class="contacts-grid">
      <div 
        v-for="contact in filteredContacts" 
        :key="contact._id"
        class="contact-card"
      >
        <div class="contact-header">
          <h3>{{ contact.name }}</h3>
          <button 
            @click="toggleFavorite(contact)" 
            class="favorite-btn"
            :class="{ active: contact.favorite }"
          >
            {{ contact.favorite ? '★' : '☆' }}
          </button>
        </div>
        <div class="contact-details">
          <p><strong>Email:</strong> {{ contact.email }}</p>
          <p v-if="contact.phone"><strong>Phone:</strong> {{ contact.phone }}</p>
          <p v-if="contact.address"><strong>Address:</strong> {{ contact.address }}</p>
        </div>
        <div class="contact-actions">
          <RouterLink 
            :to="`/contacts/${contact._id}/edit`" 
            class="btn btn-secondary"
          >
            Edit
          </RouterLink>
          <button 
            @click="handleDelete(contact._id)" 
            class="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      ref="confirmDialog"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="confirmAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useContactStore } from '@/stores/contact.store';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const contactStore = useContactStore();
const { contacts, loading, error } = contactStore;

const showFavoritesOnly = ref(false);
const confirmDialog = ref(null);
const confirmTitle = ref('');
const confirmMessage = ref('');
let pendingAction = null;

const filteredContacts = computed(() => {
  if (showFavoritesOnly.value) {
    return contactStore.favoriteContacts;
  }
  return contacts;
});

const toggleFavorite = async (contact) => {
  try {
    await contactStore.update(contact._id, {
      ...contact,
      favorite: !contact.favorite
    });
  } catch (err) {
    alert('Error updating contact');
  }
};

const handleDelete = (id) => {
  confirmTitle.value = 'Delete Contact';
  confirmMessage.value = 'Are you sure you want to delete this contact?';
  pendingAction = async () => {
    try {
      await contactStore.remove(id);
    } catch (err) {
      alert('Error deleting contact');
    }
  };
  confirmDialog.value.open();
};

const handleDeleteAll = () => {
  confirmTitle.value = 'Delete All Contacts';
  confirmMessage.value = 'Are you sure you want to delete all contacts? This action cannot be undone.';
  pendingAction = async () => {
    try {
      await contactStore.removeAll();
    } catch (err) {
      alert('Error deleting contacts');
    }
  };
  confirmDialog.value.open();
};

const confirmAction = () => {
  if (pendingAction) {
    pendingAction();
    pendingAction = null;
  }
};

onMounted(() => {
  contactStore.fetchAll();
});
</script>

<style scoped>
.contact-list {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #dc3545;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.contact-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.contact-header h3 {
  margin: 0;
  color: #2c3e50;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #ddd;
  cursor: pointer;
  transition: color 0.3s;
}

.favorite-btn.active {
  color: #ffc107;
}

.favorite-btn:hover {
  color: #ffc107;
}

.contact-details {
  margin-bottom: 15px;
}

.contact-details p {
  margin: 8px 0;
  color: #555;
}

.contact-actions {
  display: flex;
  gap: 10px;
}

.contact-actions .btn {
  flex: 1;
}
</style>
