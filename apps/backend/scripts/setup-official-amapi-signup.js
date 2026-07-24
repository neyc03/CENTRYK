const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function generateOfficialSignupUrl() {
  const saPath = path.join(__dirname, '..', 'centryx-production-9aed930481af.json');

  try {
    const saContent = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    const projectId = saContent.project_id;

    console.log(`\n📌 [PROYECTO GOOGLE CLOUD]: ${projectId}`);
    console.log('🔐 [AUTENTICANDO CON GOOGLE ANDROID MANAGEMENT API]...');

    const auth = new google.auth.GoogleAuth({
      keyFile: saPath,
      scopes: ['https://www.googleapis.com/auth/androidmanagement']
    });

    const amapi = google.androidmanagement({
      version: 'v1',
      auth: auth
    });

    console.log('🌐 [GENERANDO SIGNUP URL OFICIAL SIN LÍMITES DE ORGANIZACIÓN]...');

    // Callback URL oficial de retorno
    const callbackUrl = 'https://centryk.vercel.app/api/v1/amapi/callback';

    const signupRes = await amapi.signupUrls.create({
      projectId: projectId,
      callbackUrl: callbackUrl
    });

    const signupUrl = signupRes.data.url;
    const signupName = signupRes.data.name;

    console.log('\n======================================================');
    console.log('✅ SIGNUP URL OFICIAL SIN LÍMITES GENERADA POR GOOGLE');
    console.log('======================================================');
    console.log('👉 URL DE REGISTRO FORMAL (ABRIR EN NAVEGADOR):\n');
    console.log(signupUrl);
    console.log('\n------------------------------------------------------');
    console.log('SIGNUP NAME:', signupName);
    console.log('CALLBACK URL REQUERIDA:', callbackUrl);
    console.log('======================================================\n');

    fs.writeFileSync(
      path.join(__dirname, '..', 'amapi-signup-info.json'),
      JSON.stringify({
        projectId,
        signupName,
        signupUrl,
        callbackUrl
      }, null, 2)
    );

    return { signupUrl, signupName };

  } catch (error) {
    console.error('\n❌ [ERROR GENERANDO SIGNUP URL]:', error.message);
    if (error.response && error.response.data) {
      console.error('DETALLE:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

generateOfficialSignupUrl();
