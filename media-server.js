const NodeMediaServer = require('node-media-server')
const config = require('./config-nms/default.js')

const nms = new NodeMediaServer(config)

nms.on('prePublish', async (id, StreamPath, args) => {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});
 
const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    let returnMe = parts[parts.length - 1];
    console.log('--getting stream key--')
    console.log(returnMe)
    console.log('---end stream key---')
    return returnMe
};
 
module.exports = nms;