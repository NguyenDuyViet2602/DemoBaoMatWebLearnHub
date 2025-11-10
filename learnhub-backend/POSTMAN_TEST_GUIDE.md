# Hướng dẫn Test API Upload Ảnh bằng Postman

## Bước 1: Đăng nhập để lấy Token

### Request 1: Đăng nhập
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "your_email@example.com",
    "password": "your_password"
  }
  ```
- **Response:** Sẽ trả về token trong field `data.token` hoặc `token`
- **Lưu ý:** Bạn cần đăng nhập bằng tài khoản có role **Teacher** hoặc **Admin**, hoặc là chủ sở hữu của khóa học

---

## Bước 2: Lấy danh sách khóa học (để biết Course ID)

### Request 2: Lấy danh sách khóa học
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/courses`
- **Headers:** Không cần (public endpoint)
- **Response:** Sẽ trả về danh sách khóa học, lấy `courseid` của một khóa học

**Hoặc nếu bạn đã biết Course ID, bỏ qua bước này.**

---

## Bước 3: Upload ảnh cho khóa học

### Request 3: Upload ảnh
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/courses/{courseId}/upload-image`
  - Thay `{courseId}` bằng ID khóa học thực tế (ví dụ: `1`, `2`, `3`...)
  - Ví dụ: `http://localhost:3000/api/v1/courses/1/upload-image`

- **Headers:**
  ```
  Authorization: Bearer {your_token_here}
  ```
  - Thay `{your_token_here}` bằng token bạn lấy được từ Bước 1
  - **Lưu ý:** Không thêm `Content-Type` header, Postman sẽ tự động set khi chọn form-data

- **Body:**
  - Chọn tab **Body**
  - Chọn **form-data** (không phải raw, không phải x-www-form-urlencoded)
  - Thêm một field:
    - **Key:** `image` (chọn type là **File** từ dropdown bên cạnh key)
    - **Value:** Click **Select Files** và chọn file ảnh của bạn
      - File của bạn: `C:/Users/Laptop/Downloads/kinhdoanh.jdg` (hoặc .jpg/.jpeg)
      - Chỉ chấp nhận: jpg, jpeg, png, gif, webp
      - Max size: 5MB

### Ví dụ trong Postman:

```
POST http://localhost:3000/api/v1/courses/1/upload-image

Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Body (form-data):
  image: [File] C:/Users/Laptop/Downloads/kinhdoanh.jpg
```

---

## Response thành công:

```json
{
  "message": "Upload ảnh khóa học thành công",
  "data": {
    "courseId": 1,
    "imageUrl": "https://res.cloudinary.com/dbmeizuiq/image/upload/v1234567890/courses/..."
  }
}
```

---

## Các lỗi có thể gặp:

### 1. Lỗi 401 Unauthorized
- **Nguyên nhân:** Token không hợp lệ hoặc chưa đăng nhập
- **Giải pháp:** Đăng nhập lại và lấy token mới

### 2. Lỗi 403 Forbidden
- **Nguyên nhân:** Bạn không có quyền upload ảnh cho khóa học này
- **Giải pháp:** Đảm bảo bạn là Admin hoặc chủ sở hữu khóa học

### 3. Lỗi 404 Not Found
- **Nguyên nhân:** Khóa học không tồn tại
- **Giải pháp:** Kiểm tra lại Course ID

### 4. Lỗi 400 Bad Request - "Vui lòng chọn file ảnh để upload"
- **Nguyên nhân:** Chưa chọn file hoặc field name không đúng
- **Giải pháp:** Đảm bảo field name là `image` và đã chọn file

### 5. Lỗi 400 - "Chỉ chấp nhận file ảnh"
- **Nguyên nhân:** File không phải là ảnh hoặc extension không hợp lệ
- **Giải pháp:** Chọn file có extension: jpg, jpeg, png, gif, webp

### 6. Lỗi 500 - Cloudinary error
- **Nguyên nhân:** Thông tin Cloudinary trong .env chưa đúng
- **Giải pháp:** Kiểm tra lại CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

---

## Lưu ý:

1. **File extension:** File `kinhdoanh.jdg` có vẻ là typo, nên là `.jpg` hoặc `.jpeg`
2. **Server phải đang chạy:** Đảm bảo backend server đang chạy ở port 3000
3. **Token có thời hạn:** Nếu token hết hạn, đăng nhập lại để lấy token mới
4. **Quyền truy cập:** Chỉ Admin hoặc chủ sở hữu khóa học mới upload được

---

## Quick Test Checklist:

- [ ] Backend server đang chạy (port 3000)
- [ ] Đã đăng nhập và có token
- [ ] Token được thêm vào header Authorization
- [ ] Đã chọn đúng method POST
- [ ] URL có đúng courseId
- [ ] Body chọn form-data (không phải raw)
- [ ] Field name là `image` (type: File)
- [ ] Đã chọn file ảnh hợp lệ
- [ ] File size < 5MB

