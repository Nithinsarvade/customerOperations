const express = require("express");
const database = require("./connect");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

database.connect(function (err) {
  if (err) {
    console.log("Not connected", err);
  } else {
    console.log("Connected");
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}.....`)
    );
  }
});

app.post("/addcustomer", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;

  database.query("insert into customers (id, name, email) values (?, ?, ?)",[id, name, email],(err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error occurred while creating customer.");
      } else {
        res.status(200).send("Customer created successfully.");
      }
    }
  );
});

app.put("/updatecustomer/:id", (req, res) => {
  const updateid = req.params.id;
  const name = req.body.name;
  const email = req.body.email;

  database.query("update customers set name =?, email =? where id =?",[name, email, updateid],(e, result) => {
      if (e) {
        console.log(e);
        res.status(500).send("Error occurred while updating customer.");
      } else {
        res.status(200).send("Customer updated successfully.");
      }
    }
  );
})

app.get("/allcustomers", (req, res) => {
  database.query('select * from customers', function (e, result) {
    if (e) {
      console.log(e);
    } else {
      res.send(result)
    }
  })
}); 

app.get('/customers', (req, res) => {
  let { page = 1, limit = 10, sort_by = 'id', order = 'ASC' } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  
  const validColumns = ['id', 'name', 'email'];
  const validOrders = ['ASC', 'DESC'];
  
  if (!validColumns.includes(sort_by) || !validOrders.includes(order.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid sortby or order parameter' });
  }
  
  const offset = (page - 1) * limit;
  const sql = `SELECT * FROM customers ORDER BY ${sort_by} ${order.toUpperCase()} LIMIT ?, ?`;

  database.query(sql, [offset, limit], (err, results, fields) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.send(results);
  });
});
;



