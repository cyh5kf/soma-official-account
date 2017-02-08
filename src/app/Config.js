const environmentMap = {
   development:"ws://192.168.7.239:8090/off-wsaccess/cslogin",
   debug239:"ws://192.168.7.239:8090/off-wsaccess/cslogin",
   aliyunproduction:"wss://servicex.somaapp.com/off-wsaccess/cslogin",
   aliyundebug:"wss://servicex.somaapp.com/off-wsaccess/cslogin",
   softlayerproduction:"wss://www.somapcs.com/off-wsaccess/cslogin",
   softlayerdebug:"wss://beta.somaapp.com/off-wsaccess/cslogin",
   alitest:"ws://123.57.22.248/off-wsaccess/cslogin",
   localproduction:"wss://servicex.somaapp.com/off-wsaccess/cslogin"
}

var webSocketUrl = environmentMap[process.env.NODE_ENV];

const config = {
   webSocketUrl:webSocketUrl
}

export default config;