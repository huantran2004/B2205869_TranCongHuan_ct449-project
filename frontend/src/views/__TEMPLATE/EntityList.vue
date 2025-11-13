<template>
  <div class="entity-list">
    <div class="header">
      <h1>Entities</h1>
      <div class="actions">
        <RouterLink to="/entities/new" class="btn btn-primary">
          Add New Entity
        </RouterLink>
        <button 
          @click="handleDeleteAll" 
          class="btn btn-danger"
          :disabled="entities.length === 0"
        >
          Delete All
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="entities.length === 0" class="empty">
      <p>No entities found</p>
      <RouterLink to="/entities/new" class="btn btn-primary">
        Add Your First Entity
      </RouterLink>
    </div>

    <div v-else class="entities-grid">
      <div 
        v-for="entity in entities" 
        :key="entity._id"
        class="entity-card"
      >
        <div class="entity-header">
          <h3>{{ entity.name }}</h3>
        </div>
        <div class="entity-details">
          <p v-if="entity.description">{{ entity.description }}</p>
          <!-- Add more fields as needed -->
        </div>
        <div class="entity-actions">
          <RouterLink 
            :to="`/entities/${entity._id}/edit`" 
            class="btn btn-secondary"
          >
            Edit
          </RouterLink>
          <button 
            @click="handleDelete(entity._id)" 
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
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useEntityStore } from '@/stores/__TEMPLATE.store'; // Update import
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const entityStore = useEntityStore(); // Update store name
const { entities, loading, error } = entityStore;

const confirmDialog = ref(null);
const confirmTitle = ref('');
const confirmMessage = ref('');
let pendingAction = null;

const handleDelete = (id) => {
  confirmTitle.value = 'Delete Entity';
  confirmMessage.value = 'Are you sure you want to delete this entity?';
  pendingAction = async () => {
    try {
      await entityStore.remove(id);
    } catch (err) {
      alert('Error deleting entity');
    }
  };
  confirmDialog.value.open();
};

const handleDeleteAll = () => {
  confirmTitle.value = 'Delete All Entities';
  confirmMessage.value = 'Are you sure you want to delete all entities? This action cannot be undone.';
  pendingAction = async () => {
    try {
      await entityStore.removeAll();
    } catch (err) {
      alert('Error deleting entities');
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
  entityStore.fetchAll();
});
</script>

<style scoped>
.entity-list {
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

.entities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.entity-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.entity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.entity-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.entity-header h3 {
  margin: 0;
  color: #2c3e50;
}

.entity-details {
  margin-bottom: 15px;
}

.entity-details p {
  margin: 8px 0;
  color: #555;
}

.entity-actions {
  display: flex;
  gap: 10px;
}

.entity-actions .btn {
  flex: 1;
}
</style>
