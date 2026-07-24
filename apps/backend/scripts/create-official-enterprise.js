const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function createOfficialEnterprise() {
  const saPath = path.join(__dirname, '..', 'centryx-production-9aed930481af.json');
  const enterpriseToken = 'EABBn3pPdkUNSn27TQ9D643oq2MqN3dI167WzWglxJs-h7izvprDJHjhxVqqTZhLkVOAkOp_7oiNfudDKC8XpWYNRovTiMgOul-0eU_3r-yAJYpxMY0QgSz4';

  try {
    const saContent = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    const projectId = saContent.project_id;

    console.log(`\n📌 [PROYECTO DETECTADO]: ${projectId}`);
    console.log('🔐 [AUTENTICANDO CON GOOGLE ANDROID MANAGEMENT API]...');

    const auth = new google.auth.GoogleAuth({
      keyFile: saPath,
      scopes: ['https://www.googleapis.com/auth/androidmanagement']
    });

    const amapi = google.androidmanagement({
      version: 'v1',
      auth: auth
    });

    console.log('🏛️ [EJECUTANDO ENTERPRISES.CREATE EN GOOGLE CLOUD CON EL ENTERPRISE TOKEN UNLIMITED]...');

    const enterpriseRes = await amapi.enterprises.create({
      projectId: projectId,
      signupUrlName: 'signupUrls/C17ebd227273a53ef',
      enterpriseToken: enterpriseToken,
      requestBody: {
        enterpriseDisplayName: 'Centryx MDM Unlimited Enterprise'
      }
    });

    const officialEnterprise = enterpriseRes.data;

    console.log('\n======================================================');
    console.log('🎉 ¡ENTIDAD EMPRESARIAL DEFINITIVA CREADA EN GOOGLE CLOUD!');
    console.log('======================================================');
    console.log('🏢 ENTERPRISE ID DEFINITIVO:', officialEnterprise.name);
    console.log('🏷️  DISPLAY NAME:', officialEnterprise.enterpriseDisplayName);
    console.log('======================================================\n');

    // Guardar el Enterprise ID definitivo en el backend
    fs.writeFileSync(
      path.join(__dirname, '..', 'amapi-official-enterprise.json'),
      JSON.stringify(officialEnterprise, null, 2)
    );

    return officialEnterprise;

  } catch (error) {
    console.error('\n❌ [ERROR CREANDO ENTERPRISE DEFINITIVA]:', error.message);
    if (error.response && error.response.data) {
      console.error('DETALLE:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

createOfficialEnterprise();
