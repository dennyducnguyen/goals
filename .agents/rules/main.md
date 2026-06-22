# Project Rules & Architecture
- Loại dự án: Laravel (PHP)
- Frontend: Blade, Vite, TailwindCSS (có thể có Vue/React tuỳ cấu hình nội bộ)
- Database: MySQL/SQLite (được cấu hình trong .env)
- Các ghi chú kiến trúc hoặc quy tắc riêng sẽ được cập nhật ở đây khi có thay đổi.
- **Tiêu đề trang (Title)**: Dự án sử dụng Inertia React. Logic đặt tiêu đề (fallback và suffix) được quản lý tập trung ở `resources/js/app.jsx` và cấu hình qua `APP_NAME` trong `.env`. Tiêu đề ban đầu chưa render React được cấu hình ở `resources/views/app.blade.php`.

## Quy trình Kiểm tra & Phục hồi (Check & Fix) sau khi Deploy
Dự án được cấu hình deploy tự động qua GitHub Actions lên server `171.244.29.124`. Khi người dùng yêu cầu "kiểm tra server", "kiểm tra deploy", AI phải thực hiện các bước sau:
1. Dùng lệnh SSH kết nối vào server (`ssh -i "d:\laragon\www\goals\.ssh\ssh" -p 1579 -o StrictHostKeyChecking=no root@171.244.29.124`).
2. Di chuyển vào thư mục `/var/www/goals.imgroup.vn/htdocs`.
3. Đọc 100 dòng cuối của file `storage/logs/laravel.log` để tìm xem có lỗi nào xuất hiện gần đây không (e.g. `tail -n 100 storage/logs/laravel.log`).
4. Nếu phát hiện lỗi (ví dụ chưa migrate, thiếu file `.env`, lỗi build npm), tự động đề xuất lệnh chạy sửa lỗi qua SSH hoặc tự động sửa nếu lỗi đơn giản.
5. Nếu không có lỗi, báo cáo cho người dùng là "Hệ thống hoạt động bình thường, deploy thành công".

## Quy trình Deploy và Tự động hoá
- **Deploy tự động (BẮT BUỘC):** Khi nhận được bất kỳ yêu cầu tạo tính năng mới, chỉnh sửa code hoặc fix bug nào, sau khi hoàn thành thay đổi ở môi trường local, Agent **phải tự động thực hiện chuỗi deploy** (bao gồm `git add`, `git commit`, `git push` và SSH vào server chạy các lệnh tương ứng như `migrate`, `storage:link` nếu cần) mà **không cần hỏi xác nhận** (trừ khi liên quan đến thay đổi database rất lớn có nguy cơ hỏng hóc hoặc breaking changes).
- Dự án được cấu hình deploy tự động qua GitHub Actions lên server `171.244.29.124`.
- **CI/CD tự động**: Mọi thay đổi code khi được `git push` lên nhánh `main` sẽ kích hoạt GitHub Actions. Action này sẽ SSH tự động vào server, sau đó gọi file `/var/www/goals.imgroup.vn/htdocs/deploy.sh` để tiến hành cài dependencies (`npm run build`, `composer install`), dọn cache và chạy route cache.

## Quy trình Kiểm tra & Phục hồi (Check & Fix) sau khi Deploy
