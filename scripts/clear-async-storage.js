#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  // Para iOS
  console.log('📱 Limpiando datos de iOS...');
  try {
    execSync('xcrun simctl get_app_container booted host.exp.Exponent data', { stdio: 'pipe' });
    execSync('xcrun simctl privacy booted reset all host.exp.Exponent', { stdio: 'inherit' });
    console.log('✅ Datos de iOS limpiados');
  } catch (err) {
    console.log('⚠️  No se pudo limpiar iOS (simulador no ejecutándose o no disponible)');
  }

  // Para Android
  console.log('\n📱 Limpiando datos de Android...');
  try {
    execSync('adb shell pm clear host.exp.exponent', { stdio: 'inherit' });
    console.log('✅ Datos de Android limpiados');
  } catch (err) {
    console.log('⚠️  No se pudo limpiar Android (emulador no ejecutándose o no disponible)');
  }

  console.log('\n✨ Proceso completado');
  console.log('\n💡 Nota: También puedes reiniciar la app y ejecutar el siguiente comando en la consola de desarrollo:');
  console.log('   AsyncStorage.clear()');
  console.log('\n💡 O agrega esto temporalmente en tu código:');
  console.log('   import AsyncStorage from "@react-native-async-storage/async-storage";');
  console.log('   AsyncStorage.clear().then(() => console.log("AsyncStorage limpiado"));');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

