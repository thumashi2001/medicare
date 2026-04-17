const { RtcTokenBuilder, RtcRole } = require('agora-token');

exports.getAgoraToken = (req, res) => {
    const { channelName } = req.query;

    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }

    const APP_ID = process.env.APP_ID;
    const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
    const uid = 0; 
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    try {
        const token = RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            channelName,
            uid,
            role,
            privilegeExpiredTs
        );
        res.json({ rtcToken: token });
    } catch (err) {
        res.status(500).json({ error: 'Token generation failed' });
    }
};