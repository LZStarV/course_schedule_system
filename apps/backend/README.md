示例调用

Auth.Login

curl -s -X POST http://localhost:3001/rpc \
 -H 'Content-Type: application/json' \
 -d '{"id":"1","method":"Auth.Login","params":{"username":"superadmin","password":"admin123"}}'

Course.ListForStudent

curl -s -X POST http://localhost:3001/rpc \
 -H 'Content-Type: application/json' \
 -d '{"id":"2","method":"Course.ListForStudent","params":{"page":1,"page_size":20}}'

Enrollment.Add

curl -s -X POST http://localhost:3001/rpc \
 -H 'Content-Type: application/json' \
 -d '{"id":"3","method":"Enrollment.Add","params":{"courseId":"00000000-0000-0000-0000-000000000004"}}'

Admin.SetSelectTime

curl -s -X POST http://localhost:3001/rpc \
 -H 'Content-Type: application/json' \
 -d '{"id":"4","method":"Admin.SetSelectTime","params":{"startTime":"2025-09-01 08:00","endTime":"2025-09-07 20:00"}}'
