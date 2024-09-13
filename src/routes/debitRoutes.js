const express = require("express");
const router = express.Router();
const debitController = require("../controller/debitController");
const multer = require("multer");
const path=require("path")
// Define storage options for Multer




// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${path.basename(file.originalname)}`);
  },
});

// Set up Multer middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpg, jpeg, png)'));
    }
  },
});

// Route for transaction creation with image upload
router.post("/rsaAddDebit", upload.single('image'), debitController.createTransaction);

router.get("/rsaGetDebit", debitController.getTransactionByUserAndAdmin);

router.delete("/rsaDeleteAllDebit", debitController.deleteAllDebit);

module.exports = router;




// [nodemon] 3.1.4
// [nodemon] to restart at any time, enter `rs`
// [nodemon] watching path(s): *.*
// [nodemon] watching extensions: js,mjs,cjs,json
// [nodemon] starting `node App.js`
// node:internal/modules/cjs/loader:1282
//   return process.dlopen(module, path.toNamespacedPath(filename));
//                  ^

// Error: /lib64/libstdc++.so.6: version `CXXABI_1.3.8' not found (required by /data/var/www/asp/portal for backend/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node)
//     at Object.Module._extensions.