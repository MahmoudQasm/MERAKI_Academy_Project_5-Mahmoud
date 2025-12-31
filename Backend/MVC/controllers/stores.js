const { pool } = require("../models/db");

const addNewStore = async (req, res) => {
  const { title, logo, description, owner_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO store (title,logo,description,owner_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [title, logo, description, owner_id]
    );
    res.status(201).json({
      success: true,
      message: "New store created",
      result: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error",
      err: err.message,
    });
  }
};

const getStoreById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM store WHERE id = $1`, [id]);
    if (result.rows == 0) {
      res.status(404).json({
        success: false,
        message: "There is no store with this id",
      });
    }
    res.status(200).json({
      success: true,
      result: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const updateStoreById = async (req, res) => {
  const { id } = req.params;
  const { title, description, logo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE store 
    SET title=$1, 
    description=$2, 
    logo=$3
    WHERE id=$4
    RETURNING *;
    `,
      [title, description, logo, id]
    );
    res.status(200).json({
      success: true,
      result: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const deleteStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
            DELETE FROM store WHERE id=$1
            RETURNING *`,
      [id]
    );
    if (result.rows == 0) {
      res.status(404).json({
        success: false,
        message: "There is no store at this path",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Store deleted",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const getAllStores = async(req,res)=>{
  try {
    const result = await pool.query(`SELECT * FROM store`)
    res.status(200).json({
      success:true,
      result:result.rows
    })
  }catch(err){
    console.log(err);
  }
}

const getProductsInStore = async(req,res)=>{
  const {id} = req.params
  try{
    const result = await pool.query(`
       SELECT products.id,products.imgsrc,products.title,products.rate
        FROM products
       FULL OUTER JOIN store 
       ON products.store_id = store.id WHERE store.id =$1 `,[id])
       res.status(200).json({
        success:true,
        result:result.rows
       })
  }catch(err){
    console.log(err);
  }
}

const addNewProductInStore = async(req,res)=>{
    const { imgsrc, title, description, price, rate, categories_id,store_id } = req.body;

  try{
    const result = await pool.query(`
      INSERT INTO products (imgsrc, title, description, price, rate, categories_id,store_id)
    VALUES ($1, $2, $3, $4, $5, $6,$7)
    RETURNING *
      `,
    [imgsrc, title, description, price, rate, categories_id,store_id]
    )
    res.status(201).json({
      success:true,
      result:result.rows
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"server error",
      message:err.message
    })
  }
}

module.exports = {
  addNewStore,
  getStoreById,
  updateStoreById,
  deleteStoreById,
  getAllStores,
  getProductsInStore,
  addNewProductInStore,
};
