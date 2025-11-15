<template>
  <div v-if="sach" class="page">
    <h4>{{ isAddMode ? 'Thêm sách mới' : 'Hiệu chỉnh Sách' }}</h4>
    <SachForm :sach="sach" @submit:sach="saveSach" @delete:sach="deleteSach" />
    <p>{{ message }}</p>
  </div>
</template>

<script>
import SachForm from "@/components/SachForm.vue";
import SachService from "@/services/sach.service";

export default {
  components: {
    SachForm,
  },
  props: {
    id: { type: String, required: false },
  },
  data() {
    return {
      sach: null,
      message: "",
    };
  },
  computed: {
    isAddMode() {
      return !this.id;
    }
  },
  methods: {
    async getSach(id) {
      try {
        this.sach = await SachService.get(id);
      } catch (error) {
        console.log(error);
        this.$router.push({ name: "notfound" });
      }
    },
    async saveSach(data) {
      try {
        if (this.isAddMode) {
          await SachService.create(data);
          this.message = "Sách được thêm thành công.";
        } else {
          await SachService.update(this.sach._id, data);
          this.message = "Sách được cập nhật thành công.";
        }
        setTimeout(() => {
          this.$router.push({ name: "sachbook" });
        }, 1000);
      } catch (error) {
        console.log(error);
        this.message = "Có lỗi xảy ra: " + error.message;
      }
    },
    async deleteSach() {
      if (confirm("Bạn muốn xóa Sách này?")) {
        try {
          await SachService.delete(this.sach._id);
          this.$router.push({ name: "sachbook" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    if (!this.isAddMode) {
      this.getSach(this.id);
    } else {
      this.sach = {
        MaSach: '',
        TenSach: '',
        DonGia: 0,
        SoQuyen: 0,
        NamXuatBan: new Date().getFullYear(),
        MaNXB: '',
        NguonGoc: '',
        TacGia: ''
      };
    }
  },
};
</script>

<style scoped>
.page {
  max-width: 600px;
  margin: auto;
}
</style>
