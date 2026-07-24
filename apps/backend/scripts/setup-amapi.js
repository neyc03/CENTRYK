const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function runAMAPISetup() {
  const backendDir = path.join(__dirname, '..');
  const candidateFiles = [
    path.join(backendDir, 'service-account.json'),
    path.join(backendDir, 'centryx-production-9aed930481af.json')
  ];

  let saPath = null;
  for (const f of candidateFiles) {
    if (fs.existsSync(f)) {
      saPath = f;
      break;
    }
  }

  // Buscar cualquier archivo .json con clave de cuenta de servicio si la especifica no coincide
  if (!saPath) {
    const files = fs.readdirSync(backendDir);
    const jsonKey = files.find(file => file.endsWith('.json') && file.includes('centryx'));
    if (jsonKey) saPath = path.join(backendDir, jsonKey);
  }

  if (!saPath) {
    console.log('\n❌ [ERROR]: No se encontró la clave JSON en apps/backend/\n');
    process.exit(1);
  }

  try {
    console.log(`\n📄 [CLAVE DETECTADA]: ${path.basename(saPath)}`);
    const saContent = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    const projectId = saContent.project_id;

    console.log(`📌 [PROYECTO DETECTADO]: ${projectId}`);
    console.log('🔐 [AUTENTICANDO EN GOOGLE CLOUD ANDROID MANAGEMENT API]...');

    const auth = new google.auth.GoogleAuth({
      keyFile: saPath,
      scopes: ['https://www.googleapis.com/auth/androidmanagement']
    });

    const amapi = google.androidmanagement({
      version: 'v1',
      auth: auth
    });

    console.log('🌐 [GENERANDO SIGNUP URL PARA REGISTRO ENTERPRISE EMM]...');

    const callbackUrl = 'https://centryk.vercel.app/api/v1/amapi/callback';

    const res = await amapi.signupUrls.create({
      projectId: projectId,
      callbackUrl: callbackUrl
    });

    console.log('\n======================================================');
    console.log('✅ SIGNUP URL GENERADA EXITOSAMENTE POR GOOGLE');
    console.log('======================================================');
    console.log('👉 Abra la siguiente URL en su navegador e inicie sesión con su cuenta de Google:\n');
    console.log(res.data.url);
    console.log('\n------------------------------------------------------');
    console.log('SIGNUP NAME:', res.data.name);
    console.log('======================================================\n');

  } catch (error) {
    console.error('\n❌ [ERROR EJECUTANDO AMAPI SIGNUP]:', error.message);
    if (error.response && error.response.data) {
      console.error('DETALLE:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

runAMAPISetup();
