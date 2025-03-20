import { createServer, Model } from "miragejs";

export const setupServer = () => {
  createServer({
    models: {
      car: Model,
    },

    routes() {
      this.namespace = "/api"; // Tất cả route sẽ bắt đầu bằng "/api"

      // Lấy danh sách xe
      this.get("/cars", (schema) => {
        return schema.cars.all().models || [];
      });

      // Thêm xe mới
      this.post("/cars", (schema, request) => {
        const attrs = JSON.parse(request.requestBody); // Chuyển dữ liệu JSON thành object
        return schema.cars.create(attrs); // Lưu vào DB giả lập
      });
    },
  });
};
