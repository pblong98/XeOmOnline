# XeOmOnline
Đồ án môn lập trình web2

# Cấu trúc sourse
  1: FontendApplication:
  
     - Công nghệ: Angular 4
     
  2: BackendApplycation: 

     - Công nghệ: NodeJs 8 
     
     - Module sử dụng
         + Express 4.15.3
         + Firebase-admin 7.0.0,
         + Firebase-functions 2.3.0

     - Thư mục con
         + .Functions/index.js                 : Chứa các control function để export lên firebase function (hosting)
         + .Functions/Localndex.ks             : Chứa các control function để test dưới máy local
         + .Functions/ShareFunction/Share.js   : Chứa các hàm sử dụng cho cho cả 2 mục trên (local and hosting) 

# Hosting
    + Frontend:  https://xeomonline-a57d4.web.app/
    + Backend :  https://xeomonlinebackend.firebaseapp.com/ 

# Cách chạy thử:
    + Backend : CD cmd tới thư mục ./BackendApplication gõ lệnh "node Localndex.js"
    + Frontend: CD cmd tới thư mục ./BackendApplication gõ lệnh "ng serve --open"
    + Chú ý: Phải chạy backend application lên trước
    
