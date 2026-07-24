const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function generateAMAPIUserQR() {
  const saPath = path.join(__dirname, '..', 'centryx-production-9aed930481af.json');
  const enterpriseId = 'enterprises/LC03x661ny';

  try {
    console.log(`\n📌 [ENTERPRISE ID UNLIMITED]: ${enterpriseId}`);
    console.log('🔐 [AUTENTICANDO CON GOOGLE ANDROID MANAGEMENT API]...');

    const auth = new google.auth.GoogleAuth({
      keyFile: saPath,
      scopes: ['https://www.googleapis.com/auth/androidmanagement']
    });

    const amapi = google.androidmanagement({
      version: 'v1',
      auth: auth
    });

    const policyId = `${enterpriseId}/policies/centryx-unlimited-policy`;

    // Generar Enrollment Token con Usuario Asociado y Politica Corporativa
    console.log('🎟️ [GENERANDO ENROLLMENT TOKEN CON USUARIO DEDICADO EN GOOGLE]...');
    const tokenRes = await amapi.enterprises.enrollmentTokens.create({
      parent: enterpriseId,
      requestBody: {
        policyName: policyId,
        user: {
          accountIdentifier: 'usuario-01-centryx'
        },
        duration: '2592000s' // 30 dias
      }
    });

    const enrollmentToken = tokenRes.data.value;
    const qrCodeValue = tokenRes.data.qrCode;

    console.log('\n======================================================');
    console.log('🎉 TOKEN CON USUARIO DEDICADO GENERADO EXITOSAMENTE');
    console.log('======================================================');
    console.log('TOKEN VALUE:', enrollmentToken);
    console.log('EXPIRATION:', tokenRes.data.expirationTimestamp);
    console.log('\nPAYLOAD QR AMAPI:');
    console.log(qrCodeValue);
    console.log('======================================================\n');

    const payloadObj = {
      enterpriseId,
      policyId,
      enrollmentToken,
      qrCodeValue,
      expirationTimestamp: tokenRes.data.expirationTimestamp
    };

    fs.writeFileSync(
      path.join(__dirname, '..', 'amapi-latest-qr-payload.json'),
      JSON.stringify(payloadObj, null, 2)
    );

    const frontendPublicPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'amapi-qr.json');
    fs.writeFileSync(frontendPublicPath, JSON.stringify(payloadObj, null, 2));

    return payloadObj;

  } catch (error) {
    console.error('\n❌ [ERROR GENERANDO TOKEN]:', error.message);
    if (error.response && error.response.data) {
      console.error('DETALLE:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

generateAMAPIUserQR();
