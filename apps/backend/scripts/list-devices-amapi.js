const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function listDevicesAMAPI() {
  const saPath = path.join(__dirname, '..', 'centryx-production-9aed930481af.json');
  const enterpriseIds = ['enterprises/LC03x661ny', 'enterprises/LC00lhcqu0'];

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: saPath,
      scopes: ['https://www.googleapis.com/auth/androidmanagement']
    });

    const amapi = google.androidmanagement({
      version: 'v1',
      auth: auth
    });

    for (const entId of enterpriseIds) {
      console.log(`\n🔍 [CONSULTANDO DISPOSITIVOS EN ${entId}]...`);
      try {
        const res = await amapi.enterprises.devices.list({
          parent: entId
        });

        const devices = res.data.devices || [];
        console.log(`📱 CANTIDAD DE DISPOSITIVOS EN ${entId}:`, devices.length);
        if (devices.length > 0) {
          devices.forEach(d => {
            console.log(` - ID: ${d.name} | Estado: ${d.state} | Modelo: ${d.hardwareInfo ? d.hardwareInfo.modelHeader : 'N/A'}`);
          });
        }
      } catch (err) {
        console.log(`⚠️ Error consultando ${entId}:`, err.message);
      }
    }

  } catch (error) {
    console.error('\n❌ [ERROR]:', error.message);
  }
}

listDevicesAMAPI();
