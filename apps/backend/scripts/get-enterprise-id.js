const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function getEnterpriseId() {
  const saPath = path.join(__dirname, '..', 'centryx-production-9aed930481af.json');

  try {
    const saContent = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    const projectId = saContent.project_id;

    console.log(`\n📌 [PROYECTO]: ${projectId}`);
    console.log('🔍 [CONSULTANDO ENTIDAD EMPRESARIAL REGISTRADA EN GOOGLE AMAPI]...');

    const auth = new google.auth.GoogleAuth({
      keyFile: saPath,
      scopes: ['https://www.googleapis.com/auth/androidmanagement']
    });

    const amapi = google.androidmanagement({
      version: 'v1',
      auth: auth
    });

    // Consultar las empresas vinculadas al projectId
    const res = await amapi.enterprises.list({
      projectId: projectId
    });

    console.log('\n======================================================');
    console.log('🎉 REGISTRO AMAPI ENTERPRISE ENCONTRADO EN GOOGLE');
    console.log('======================================================');
    
    if (res.data.enterprises && res.data.enterprises.length > 0) {
      const enterprise = res.data.enterprises[0];
      console.log('🏢 ENTERPRISE NAME:', enterprise.name);
      console.log('🏷️  EMPRESA:', enterprise.enterpriseDisplayName);
      console.log('======================================================\n');
      return enterprise.name;
    } else {
      console.log('⚠️  No se encontraron empresas directamente con list. Intentando consulta directa...\n');
      console.log('Respuesta:', JSON.stringify(res.data, null, 2));
    }

  } catch (error) {
    console.error('\n❌ [ERROR CONSULTANDO ENTERPRISE ID]:', error.message);
    if (error.response && error.response.data) {
      console.error('DETALLE:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

getEnterpriseId();
