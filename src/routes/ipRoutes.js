const express = require("express");
const router = express.Router();
const os = require('os');


function getServerIp() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const interface = networkInterfaces[interfaceName];
        for (const i in interface) {
            const alias = interface[i];
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address; // Returns the server's IPv4 address
            }
        }
    }
    return '127.0.0.1'; // Fallback to localhost if no external IP is found
  }

  
router.get('/getServer', (req, res) => {
  
    const serverIp = getServerIp();

     console.log('Server IP:', serverIp);              // Logs the server's IP address

    
    res.status(200).json({messege:serverIp})
});

module.exports=router;