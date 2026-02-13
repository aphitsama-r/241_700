const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const port = 8000;

let users = [];
let counter = 1;

/**
GET /users - ดึงข้อมูลผู้ใช้ทั้งหมด
POST /user - เพิ่มผู้ใช้ใหม่
GET /user/:id - ดึงข้อมูลผู้ใช้ตาม ID
PUT /user/:id - แก้ไขข้อมูลผู้ใช้ตาม ID ที่บันทึก
DELETE /user/:id - ลบผู้ใช้ตาม ID ที่บันทึก
 */

//path: = /
app.get('/users', (req, res) => {
    res.json(users);
});

// apth: = POST /user
app.post('/user', (req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1;

    users.push(user);
    res.json({ 
    message: "User added successfully", 
    user: user
    });
});

// path: = PUT /user/:id
app.patch('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;

    // หา user จาก id ที่ส่งมา
    let selectedIndex = users.findIndex(user => user.id == id);

    // อัพเดทข้อมูล users
    users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstName;
    users[selectedIndex].lastname = updatedser.lastname || users[selectedIndex].lastName;

    if(updateUser.firstname){
        users[selectedIndex].firstname = updateUser.firstname;
    }
    if(updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname;
    }

    res.json({
        message: "User updated successfully",
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
        }
    });
    // ส่ง users ที่อัพเดทแล้วกลับไป
})

app.delete('/users/:id', (req, res) => {
    let id = req.params.id;

    // หา index จาก id ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => user.id == id);
    
    // ลบ user ออกจาก users

    users.splice(selectedIndex,1);

    res.json({
        message: "User deleted successfully",
        indexDelete: selectedIndex
    });
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})