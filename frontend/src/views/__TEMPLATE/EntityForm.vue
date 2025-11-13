<template>
  <div class="entity-form-page">
    <div class="card">
      <h1>{{ isEditing ? 'Edit Entity' : 'New Entity' }}</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Enter name"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="4"
            placeholder="Enter description"
          ></textarea>
        </div>

        <!-- Add more form fields as needed -->

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button
            type="button"
            @click="handleCancel"
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEntityStore } from '@/stores/__TEMPLATE.store'; // Update import

const router = useRouter();
const route = useRoute();
const entityStore = useEntityStore(); // Update store name

const formData = ref({
  name: '',
  description: '',
  // Add more fields as needed
});

const loading = ref(false);
const error = ref(null);

const isEditing = computed(() => !!route.params.id);

const loadEntity = async () => {
  if (isEditing.value) {
    try {
      loading.value = true;
      const response = await entityStore.fetchById(route.params.id);
      const entity = response.data;
      formData.value = {
        name: entity.name,
        description: entity.description || '',
        // Add more fields as needed
      };
    } catch (err) {
      error.value = 'Error loading entity';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (isEditing.value) {
      await entityStore.update(route.params.id, formData.value);
    } else {
      await entityStore.create(formData.value);
    }

    router.push('/entities'); // Update route
  } catch (err) {
    error.value = err.response?.data?.message || 'Error saving entity';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push('/entities'); // Update route
};

onMounted(() => {
  loadEntity();
});
</script>

<style scoped>
.entity-form-page {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.form-actions .btn {
  min-width: 100px;
}
</style>
