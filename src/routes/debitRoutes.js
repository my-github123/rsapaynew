const express = require("express");
const router = express.Router();
const debitController = require("../controller/debitController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/rsaAddDebit",
  upload.single("image"),
  debitController.createTransaction
);

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