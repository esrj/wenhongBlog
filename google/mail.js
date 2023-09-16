const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const CLIENT_ID = '347464423661-u9qfvmc2v1n053j9u3lmakadbgc6o7pl.apps.googleusercontent.com';
const CLIENT_SECRET = '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'
const REFRESH_TOKEN  = '1//04eBagKSCpBsGCgYIARAAGAQSNwF-L9IrQrSuQgCcS0p8cOpp44PFh1ZOsei_a6UeupKUmXqdZncw6hEa6qPv3feoZcQsTAHh3Ls';
const ACCESS_TOKEN = "ya29.a0AfB_byC7m3377SFkv9StbPl57ES1rs2zu7PV3hc61n0gbu8TgqY9q6yiJtfdEdTriuGXzb3aIP_WXL4hckWIcgXhRUmw3AFpSQRcDGg2vqQu11azW7T7Wou7D9yCnoWKA8aZ6s1_eNyAO0a-xdbjcrAwLm--Wi3UPBZ0aCgYKAfsSARASFQGOcNnCvTQVGKsigW9yhIdnIVYRpw0171"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: 'wenhongli0510@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: ACCESS_TOKEN,
    }
});

module.exports = transporter
