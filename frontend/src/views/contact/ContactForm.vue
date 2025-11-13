<template>
  <div class="contact-form-page">
    <div class="card">
      <h1>{{ isEditing ? 'Edit Contact' : 'New Contact' }}</h1>

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
          <label for="email">Email *</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            placeholder="Enter email"
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            placeholder="Enter phone number"
          />
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <textarea
            id="address"
            v-model="formData.address"
            rows="3"
            placeholder="Enter address"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="formData.favorite"
              type="checkbox"
            />
            Mark as favorite
          </label>
        </div>

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
import { useContactStore } from '@/stores/contact.store';

const router = useRouter();
const route = useRoute();
const contactStore = useContactStore();

const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  favorite: false,
});

const loading = ref(false);
const error = ref(null);

const isEditing = computed(() => !!route.params.id);

const loadContact = async () => {
  if (isEditing.value) {
    try {
      loading.value = true;
      const response = await contactStore.fetchById(route.params.id);
      const contact = response.data;
      formData.value = {
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        address: contact.address || '',
        favorite: contact.favorite || false,
      };
    } catch (err) {
      error.value = 'Error loading contact';
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
      await contactStore.update(route.params.id, formData.value);
    } else {
      await contactStore.create(formData.value);
    }

    router.push('/contacts');
  } catch (err) {
    error.value = err.response?.data?.message || 'Error saving contact';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push('/contacts');
};

onMounted(() => {
  loadContact();
});
</script>

<style scoped>
.contact-form-page {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
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
