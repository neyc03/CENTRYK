const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function testUserAndTerms() {
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

    console.log(`\n👤 [PROBANDO CREACIÓN DE USUARIO EN ENTERPRISE]: ${enterpriseId}...`);

    // 1. Crear un User en AMAPI
    let userRes;
    try {
      userRes = await amapi.enterprises.users.create({
        parent: enterpriseId,
        requestBody: {
          accountIdentifier: 'device-001@centryx.internal'
        }
      });
      console.log('✅ USUARIO CREADO:', userRes.data.name);
    } catch (uErr) {
      console.log('⚠️ Error creando usuario o ya existe:', uErr.message);
    }

    const userName = userRes ? userRes.data.name : `${enterpriseId}/users/u1`;

    // 2. Generar Token de Enrolamiento asociado explícitamente al Usuario y con la Política Corporativa
    console.log(`🎟️ [GENERANDO ENROLLMENT TOKEN VINCULADO A USUARIO ${userName}]...`);

    const tokenRes = await amapi.enterprises.enrollmentTokens.create({
      parent: enterpriseId,
      requestBody: {
        policyName: `${enterpriseId}/policies/centryx-unlimited-policy`,
        user: {
          accountIdentifier: 'device-001@centryx.internal'
        },
        duration: '2592000s'
      }
    });

    console.log('\n======================================================');
    console.log('🎉 TOKEN CON USUARIO ASOCIADO GENERADO CON ÉXITO');
    console.log('======================================================');
    console.log('TOKEN VALUE:', tokenRes.data.value);
    console.log('\nPAYLOAD QR CON USUARIO:');
    console.log(tokenRes.data.qrCode);
    console.log('======================================================\n');

  } catch (error) {
    console.error('\n❌ [ERROR]:', error.message);
    if (error.response && error.response.data) {
      console.error('DETALLE:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testUserAndTerms();
