const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise')
const app = express();

app.use(bodyParser.json());

const port = 8000;

let conn = null;
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8700
    });
    console.log('Connected to MQSQL database');
}

// path: = GET /users สำหรับดึงข้อมูล users ทั้งหมด
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);
})

//path: = POST /users สำหรับเพิ่ม user ใหม่
app.post('/users', async (req, res) => {
    try {
        let user = req.body;
        const results = await conn.query('INSERT INTO users SET ? ', user);
        console.log(results);
        res.json({
            message: 'User added successfully',
            data: results[0]
        });

    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ message: 'Error adding user' });
    }

})

//path: = GET /users/:id สำหรับดึงข้อมูล user ตาม id
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?',id);
        if (results[0].length === 0){
            throw {statusCode: 404, message: 'User not found'};
        }
        res.json(results[0]);

    } catch(error){
        console.error('Error fetching user:', error);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({message: error.message || 'Error fetching user'});
    }

})

//path: = PUT /users/:id สำหรับแก้ไขข้อมูล user ตาม id
app.put('/users/:id', async (req,res) => {
    try {
        let id = req.params.id;
    let updateUser = req.body;
    const results = await conn.querry('UPDATE users SET ? WHERE id = ?', [updateUser, id]);
    res.json({
        message: 'User updated successfully',
        data: results[0]
    });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user'});
    }
})
//path: = DELETE /users/:id สำหรับลบ user ตาม id
app.delete('/users/:id', async (req,res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('DELETE FROM users WHERE id = ?', id);
        res.json({
            message: 'User deleted successfully',
            data: results[0]
        });
    }catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({message: 'Error deleting user'});
    }
})


app.get('/testdb-new', async (req, res) => {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'webdb',
            port: 8700
        });
        const results = await conn.query('SELECT * FROM users');
        res.json(results[0]);

    } catch (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }


});

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

    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname;
    }
    if (updateUser.lastname) {
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

    users.splice(selectedIndex, 1);

    res.json({
        message: "User deleted successfully",
        indexDelete: selectedIndex
    });
})


app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on http://localhost:${port}`);
})