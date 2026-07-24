const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function generateAMAPIEnrollmentQR() {
  const saPath = path.join(__dirname, '..', 'centryx-production-9aed930481af.json');
  const enterpriseId = 'enterprises/LC03x661ny';

  try {
    console.log(`\n📌 [ENTERPRISE ID DEFINITIVO UNLIMITED]: ${enterpriseId}`);
    console.log('🔐 [AUTENTICANDO CON GOOGLE ANDROID MANAGEMENT API]...');

    const auth = new google.auth.GoogleAuth({
      keyFile: saPath,
      scopes: ['https://www.googleapis.com/auth/androidmanagement']
    });

    const amapi = google.androidmanagement({
      version: 'v1',
      auth: auth
    });

    // 1. Crear una Politica Corporativa por Defecto en el Enterprise Definitivo
    const policyId = `${enterpriseId}/policies/centryx-unlimited-policy`;
    console.log(`📋 [CREANDO/ACTUALIZANDO POLÍTICA UNLIMITED EN GOOGLE AMAPI]: ${policyId}...`);

    await amapi.enterprises.policies.patch({
      name: policyId,
      requestBody: {
        cameraDisabled: false,
        locationMode: 'LOCATION_USER_CHOICE',
        systemUpdate: {
          type: 'AUTOMATIC'
        },
        applications: [
          {
            packageName: 'com.whatsapp',
            installType: 'AVAILABLE'
          },
          {
            packageName: 'com.waze',
            installType: 'AVAILABLE'
          }
        ]
      }
    });

    console.log('✅ [POLÍTICA CONFIGURADA EXITOSAMENTE EN LA ENTIDAD ENTERPRISE DEFINITIVA]');

    // 2. Generar Enrollment Token Oficial en Google AMAPI sin Limite de Dispositivos
    console.log('🎟️ [GENERANDO ENROLLMENT TOKEN UNLIMITED EN GOOGLE]...');
    const tokenRes = await amapi.enterprises.enrollmentTokens.create({
      parent: enterpriseId,
      requestBody: {
        policyName: policyId,
        duration: '2592000s', // 30 dias de validez
        allowPersonalUsage: 'PERSONAL_USAGE_DISALLOWED'
      }
    });

    const enrollmentToken = tokenRes.data.value;
    const qrCodeValue = tokenRes.data.qrCode;

    console.log('\n======================================================');
    console.log('🎉 TOKEN DE APROVISIONAMIENTO DEFINITIVO UNLIMITED GENERADO');
    console.log('======================================================');
    console.log('ENTERPRISE ID:', enterpriseId);
    console.log('TOKEN VALUE:', enrollmentToken);
    console.log('EXPIRATION:', tokenRes.data.expirationTimestamp);
    console.log('\nPAYLOAD QR OFICIAL AMAPI UNLIMITED DE GOOGLE:');
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
    console.error('\n❌ [ERROR GENERANDO AMAPI TOKEN]:', error.message);
    if (error.response && error.response.data) {
      console.error('DETALLE:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

generateAMAPIEnrollmentQR();
