<template>
  <div class="sach-card">
    <h5 class="card-title">{{ sach.TenSach }}</h5>
    <div class="card-text">
      <strong>Mã sách:</strong> {{ sach.MaSach }}<br />
      <strong>Tác giả:</strong> {{ sach.TacGia }}<br />
      <strong>Năm XB:</strong> {{ sach.NamXuatBan }}<br />
      <strong>Mã NXB:</strong> {{ sach.MaNXB }}<br />
      <strong>Đơn giá:</strong> {{ formatCurrency(sach.DonGia) }}<br />
      <strong>Số quyển:</strong> {{ sach.SoQuyen }}
    </div>
    <div class="mt-2">
      <router-link
        :to="{
          name: 'admin.sach.edit',
          params: { id: sach._id },
        }"
        class="btn btn-sm btn-warning"
      >
        <i class="fas fa-edit"></i> Sửa
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sach: { type: Object, required: true },
  },
  methods: {
    formatCurrency(value) {
      if (!value) return '0 đ';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    }
  }
};
</script>

<style scoped>
.sach-card {
  padding: 0.5rem;
}
.card-title {
  color: #007bff;
  margin-bottom: 0.5rem;
}
.card-text {
  font-size: 0.9rem;
}
</style>
