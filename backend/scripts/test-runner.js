#!/usr/bin/env node

/**
 * Script para executar testes com diferentes configurações
 */

const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🚀 ${description}`, 'cyan');
  
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} - Concluído`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} - Falhou`, 'red');
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  log('🧪 UniAgendas Test Runner', 'cyan');

  switch (command) {
    case 'unit':
      runCommand('npm run test:unit', 'Testes Unitários');
      break;
      
    case 'integration':
      runCommand('npm run test:integration', 'Testes de Integração');
      break;
      
    case 'all':
    default:
      const success = [
        runCommand('npm run test:unit', 'Testes Unitários'),
        runCommand('npm run test:integration', 'Testes de Integração'),
        runCommand('npm run test:coverage', 'Cobertura')
      ].every(Boolean);
      
      if (success) {
        log('\n🏆 TODOS OS TESTES PASSARAM!', 'green');
      } else {
        log('\n💥 ALGUNS TESTES FALHARAM!', 'red');
        process.exit(1);
      }
      break;
  }
}

if (require.main === module) {
  main();
}