const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function diagnoseAMAPIQuota() {
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

    console.log(`\n🔍 [DIAGNÓSTICO COMPLETO DE ENTERPRISE]: ${enterpriseId}...`);

    const entRes = await amapi.enterprises.get({ name: enterpriseId });
    console.log('\n--- ENTERPRISE DATA ---');
    console.log(JSON.stringify(entRes.data, null, 2));

    const policiesRes = await amapi.enterprises.policies.list({ parent: enterpriseId });
    console.log('\n--- POLICIES LIST ---');
    console.log(JSON.stringify(policiesRes.data, null, 2));

    // Probar generar 3 tipos de tokens para evaluar comportamientos de Google AMAPI
    console.log('\n🧪 [GENERANDO 3 VARIACIONES DE TOKENS DE ENROLAMIENTO AMAPI]...');

    // Token 1: Kiosko / Fully Managed por Defecto
    const token1 = await amapi.enterprises.enrollmentTokens.create({
      parent: enterpriseId,
      requestBody: {
        policyName: `${enterpriseId}/policies/centryx-unlimited-policy`,
        duration: '2592000s'
      }
    });

    console.log('\n✅ TOKEN 1 (Estándar AMAPI):', token1.data.value);
    console.log('QR 1:', token1.data.qrCode);

    // Token 2: Con OneTimeUserName
    const token2 = await amapi.enterprises.enrollmentTokens.create({
      parent: enterpriseId,
      requestBody: {
        policyName: `${enterpriseId}/policies/centryx-unlimited-policy`,
        oneTimeUserName: 'Operador Centryx 01',
        duration: '2592000s'
      }
    });

    console.log('\n✅ TOKEN 2 (Con OneTimeUserName):', token2.data.value);
    console.log('QR 2:', token2.data.qrCode);

  } catch (error) {
    console.error('\n❌ [ERROR DIAGNÓSTICO]:', error.message);
    if (error.response && error.response.data) {
      console.error('DETALLE:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

diagnoseAMAPIQuota();
