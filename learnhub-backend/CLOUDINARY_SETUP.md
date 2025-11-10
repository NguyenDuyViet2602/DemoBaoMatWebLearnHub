# Hướng dẫn Setup Cloudinary

## Bước 1: Đăng ký tài khoản Cloudinary (Miễn phí)

1. Truy cập: https://cloudinary.com/users/register/free
2. Đăng ký tài khoản miễn phí
3. Sau khi đăng ký, bạn sẽ được chuyển đến Dashboard

## Bước 2: Lấy thông tin API

1. Trong Dashboard, click vào **Settings** (biểu tượng bánh răng)
2. Scroll xuống phần **Product Environment Credentials**
3. Copy 3 thông tin sau:
   - **Cloud name**
   - **API Key**
   - **API Secret**

## Bước 3: Thêm vào file .env

Tạo hoặc mở file `.env` trong thư mục `learnhub-backend/` và thêm:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Lưu ý:** 
- Thay `your_cloud_name_here`, `your_api_key_here`, `your_api_secret_here` bằng giá trị thực tế từ Cloudinary Dashboard
- **KHÔNG** commit file `.env` lên Git (đã có trong .gitignore)

## Bước 4: Test API

Sau khi setup xong, bạn có thể test API upload ảnh:

**Endpoint:** `POST /api/v1/courses/:id/upload-image`

**Headers:**
```
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- Key: `image`
- Value: Chọn file ảnh (jpg, jpeg, png, gif, webp)
- Max size: 5MB

**Response thành công:**
```json
{
  "message": "Upload ảnh khóa học thành công",
  "data": {
    "courseId": 1,
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/courses/..."
  }
}
```

## Lưu ý

- Free tier: 25GB storage, 25GB bandwidth/tháng
- Ảnh sẽ được tự động resize và optimize
- URL ảnh sẽ được lưu vào database trong trường `imageurl`

