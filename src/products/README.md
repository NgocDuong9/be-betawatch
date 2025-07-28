# Module Products

Module quản lý sản phẩm với đầy đủ tính năng CRUD, tìm kiếm, phân trang và validation.

## Tính năng chính

- ✅ Tạo, đọc, cập nhật, xóa sản phẩm (CRUD)
- ✅ Validation dữ liệu chặt chẽ
- ✅ Phân trang và sắp xếp
- ✅ Tìm kiếm theo từ khóa
- ✅ Lọc theo danh mục, tags, trạng thái
- ✅ Authentication với JWT
- ✅ Soft delete (không xóa thật)
- ✅ Populate thông tin category và user
- ✅ Text search với MongoDB

## API Endpoints

### 1. Lấy danh sách sản phẩm

```
GET /products
```

**Query Parameters:**

- `page`: Trang hiện tại (mặc định: 1)
- `limit`: Số lượng sản phẩm mỗi trang (mặc định: 10)
- `category`: ID danh mục
- `tags`: Tags phân cách bằng dấu phẩy
- `isActive`: Trạng thái hoạt động (true/false)
- `search`: Từ khóa tìm kiếm

**Response:**

```json
{
  "message": "Lấy danh sách sản phẩm thành công",
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "statusCode": 200
}
```

### 2. Tìm kiếm sản phẩm

```
GET /products/search?q=từ khóa
```

### 3. Lấy chi tiết sản phẩm

```
GET /products/:id
```

### 4. Tạo sản phẩm mới

```
POST /products
Authorization: Bearer <token>
```

**Body:**

```json
{
  "name": "Tên sản phẩm",
  "description": "Mô tả sản phẩm",
  "price": 299000,
  "images": ["url1", "url2"],
  "category": "category_id",
  "stock": 50,
  "isActive": true,
  "tags": ["tag1", "tag2"],
  "attributes": [
    {
      "key": "color",
      "value": "red"
    }
  ]
}
```

### 5. Cập nhật sản phẩm

```
PATCH /products/:id
Authorization: Bearer <token>
```

### 6. Xóa sản phẩm (Soft delete)

```
DELETE /products/:id
Authorization: Bearer <token>
```

### 7. Lấy sản phẩm theo danh mục

```
GET /products/category/:categoryId
```

### 8. Lấy sản phẩm theo tags

```
POST /products/tags
Body: { "tags": ["tag1", "tag2"] }
```

## Validation Rules

### CreateProductDto

- `name`: Bắt buộc, tối đa 200 ký tự
- `description`: Tùy chọn, tối đa 1000 ký tự
- `price`: Bắt buộc, số dương
- `images`: Tùy chọn, mảng URL, ít nhất 1 ảnh
- `category`: Bắt buộc, MongoDB ObjectId hợp lệ
- `stock`: Tùy chọn, số không âm
- `isActive`: Tùy chọn, boolean
- `tags`: Tùy chọn, mảng string, ít nhất 1 tag
- `attributes`: Tùy chọn, mảng object với key/value

## Database Schema

```typescript
{
  name: string;                    // Tên sản phẩm
  description?: string;            // Mô tả
  price: number;                   // Giá
  images: string[];                // Danh sách ảnh
  category: ObjectId;              // ID danh mục
  stock: number;                   // Số lượng tồn kho
  isActive: boolean;               // Trạng thái hoạt động
  tags: string[];                  // Tags
  createdBy?: ObjectId;            // ID người tạo
  isDeleted: boolean;              // Trạng thái xóa
  attributes: { key: string; value: string }[]; // Thuộc tính
  createdAt: Date;                 // Ngày tạo
  updatedAt: Date;                 // Ngày cập nhật
}
```

## Indexes

- `name`: Text index cho tìm kiếm
- `description`: Text index cho tìm kiếm
- `category`: Index cho filter
- `isActive`: Index cho filter
- `isDeleted`: Index cho filter
- `createdBy`: Index cho filter
- `tags`: Index cho filter

## Error Handling

- `BadRequestException`: Dữ liệu không hợp lệ
- `NotFoundException`: Không tìm thấy sản phẩm
- `InternalServerErrorException`: Lỗi hệ thống

## Security

- Tạo, cập nhật, xóa sản phẩm yêu cầu JWT token
- Validation chặt chẽ tất cả input
- Soft delete để bảo toàn dữ liệu
- Kiểm tra quyền truy cập

## Example Usage

Xem file `example-create-product.json` để có ví dụ dữ liệu tạo sản phẩm.
