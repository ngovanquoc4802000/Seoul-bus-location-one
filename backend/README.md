 - Nhiệm vụ cần làm: thời gian 
 - 1: Vị trí xe
 - 2: Xe bắt đầu chạy ( start )
 - 3: Xe dừng (thời điểm dừng: dừng lại giao hàng hoặc làm gì đó ) , dừng trong bao lâu.
 - 4: Xe đến điểm đích.

 clean code đặt tên : 
 - vị trí xe (default_lat, Longitude) 
 - vị trí đích đến (Latitude, Longitude)

MQTT: đây là 1 giao thức nhắn tin rất nhẹ , chuyên dùng cho IOT , nó hoạt động theo mô hình Publish/Subscribe.
MQTT: rất phù hợp để sử dụng cho thiết bị (xe bus) gửi dữ liệu vị trí đến Backend (server của bạn).
MQTT: Các thiết bị trên xe bus sẽ là "Publisher", chúng sẽ gửi (publish) dữ liệu vị trí lên một "topic" trên MQTT Broker (một máy chủ MQTT).
MQTT: Backend của bạn sẽ là "Subscriber", nó sẽ lắng nghe (subscribe) "topic" đó để nhận dữ liệu vị trí ngay khi thiết bị gửi lên.
MQTT: Sau đó, Backend của bạn sẽ dùng Socket.IO để "đẩy" dữ liệu vị trí này đến Frontend (trình duyệt của người dùng) để cập nhật bản đồ theo thời gian thực.
Kết luận: Bạn có thể sử dụng cả hai: MQTT để kết nối các thiết bị (xe bus) và Socket.IO để kết nối Backend với Frontend.


object car : 
 - busId: ID của xe bus.
 - status: Trạng thái hiện tại của xe (ví dụ: "moving", "stopped", "at_destination").
 - currentPosition: Đối tượng chứa vĩ độ (latitude) và kinh độ (longitude) hiện tại.
 - stopStartTime: Thời điểm xe bắt đầu dừng (để tính thời gian dừng).
 - stopDuration: Thời gian dừng (tính bằng giây hoặc phút).
 - destination: Vị trí điểm đến cuối cùng của xe.


router : 
 - update status start (vị trí xe bắt đầu)
 - update status stop(vị trí xe dừng : dừng vào thời điểm nào + dừng trong bao lâu)
 - update status đích đến 