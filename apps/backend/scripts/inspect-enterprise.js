const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function inspectEnterprise() {
  const saPath = path.join(__dirname, '..', 'centryx-production-9aed930481af.json');
  const enterpriseId = 'enterprises/LC03x661ny';

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: saPath,
      scopes: ['https://www.googleapis.com/auth/androidmanagement']
    });

    const amapi = google.androidmanagement({
      version: 'v1',
      auth: auth
    });

    console.log(`\n🔍 [INSPECCIONANDO ENTERPRISE]: ${enterpriseId}...`);

    const res = await amapi.enterprises.get({
      name: enterpriseId
    });

    console.log('\n======================================================');
    console.log('📄 DETALLES DE LA ENTERPRISE RETORNADOS POR GOOGLE:');
    console.log('======================================================');
    console.log(JSON.stringify(res.data, null, 2));
    console.log('======================================================\n');

    // Probar crear un token especificando el campo user o sin allowPersonalUsage
    console.log('🧪 [PROBANDO CREACIÓN DE TOKEN CON VARIACIONES DE PARÁMETROS]...');

    const tokenRes1 = await amapi.enterprises.enrollmentTokens.create({
      parent: enterpriseId,
      requestBody: {
        policyName: `${enterpriseId}/policies/centryx-unlimited-policy`,
        duration: '2592000s'
      }
    });

    console.log('\n--- TOKEN VARIACIÓN 1 (Sin allowPersonalUsage) ---');
    console.log('TOKEN VALUE:', tokenRes1.data.value);
    console.log('QR CODE:', tokenRes1.data.qrCode);

  } catch (error) {
    console.error('\n❌ [ERROR INSPECCIONANDO ENTERPRISE]:', error.message);
    if (error.response && error.response.data) {
      console.error('DETALLE:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

inspectEnterprise();
