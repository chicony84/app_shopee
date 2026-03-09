const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('--- TESTE DE AMBIENTE VPS ---');
console.log('Pasta Atual:', process.cwd());

const envPath = path.resolve(process.cwd(), '.env');
console.log('Caminho do .env:', envPath);

if (fs.existsSync(envPath)) {
    console.log('✅ Arquivo .env encontrado!');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    console.log('DATABASE_URL no arquivo:', envConfig.DATABASE_URL ? 'DEFINIDA (OK)' : 'NÃO ENCONTRADA (ERRO)');
    console.log('NEXTAUTH_SECRET no arquivo:', envConfig.NEXTAUTH_SECRET ? 'DEFINIDA (OK)' : 'NÃO ENCONTRADA (ERRO)');
} else {
    console.log('❌ Arquivo .env NÃO ENCONTRADO na raiz!');
}

console.log('--- VARIÁVEIS NO PROCESSO ---');
console.log('process.env.DATABASE_URL:', process.env.DATABASE_URL ? 'DEFINIDA' : 'FALTANDO');
console.log('-----------------------------');
