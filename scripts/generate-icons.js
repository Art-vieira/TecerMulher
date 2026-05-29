/**
 * generate-icons.js
 * Gera os ícones do app TecerMulher a partir do SVG "Group.svg"
 * 
 * Execute com: node scripts/generate-icons.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets', 'images');
const SVG_PATH = path.join(ASSETS_DIR, 'Group.svg');

// Cor roxa principal do app
const BG_COLOR = '#391A65';

// Tamanhos dos ícones
const ICON_SIZE = 1024;
const SPLASH_SIZE = 512;
const FAVICON_SIZE = 48;

async function generateIcons() {
  console.log('🎨 Gerando ícones do TecerMulher a partir de Group.svg...\n');

  try {
    if (!fs.existsSync(SVG_PATH)) {
      throw new Error(`Arquivo de origem não encontrado: ${SVG_PATH}`);
    }

    const svgContent = fs.readFileSync(SVG_PATH, 'utf8');

    // 1. icon.png (1024x1024) - iOS + geral (com fundo quadrado)
    console.log('⏳ Gerando icon.png (1024x1024)...');
    // Para torná-lo um quadrado perfeito, removemos o rx/ry de cantos arredondados do SVG de origem
    const squareSvg = Buffer.from(
      svgContent
        .replace(/rx="50"/g, 'rx="0"')
        .replace(/ry="50"/g, 'ry="0"')
    );
    await sharp(squareSvg)
      .resize(ICON_SIZE, ICON_SIZE, {
        fit: 'contain',
        background: BG_COLOR
      })
      .png()
      .toFile(path.join(ASSETS_DIR, 'icon.png'));
    console.log('✅ icon.png gerado!');

    // 2. android-icon-foreground.png (1024x1024) - foreground do adaptive icon (fundo transparente)
    console.log('⏳ Gerando android-icon-foreground.png...');
    // Removemos a cor de fundo do rect no SVG para deixá-lo transparente
    const fgSvg = Buffer.from(
      svgContent.replace(/fill="#391A65"/g, 'fill="none"')
    );
    await sharp(fgSvg)
      .resize(ICON_SIZE, ICON_SIZE, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(ASSETS_DIR, 'android-icon-foreground.png'));
    console.log('✅ android-icon-foreground.png gerado!');

    // 3. android-icon-background.png (1024x1024) - fundo roxo sólido
    console.log('⏳ Gerando android-icon-background.png...');
    await sharp({
      create: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        channels: 4,
        background: { r: 57, g: 26, b: 101, alpha: 1 } // #391A65
      }
    })
      .png()
      .toFile(path.join(ASSETS_DIR, 'android-icon-background.png'));
    console.log('✅ android-icon-background.png gerado!');

    // 4. android-icon-monochrome.png (1024x1024) - ícone monocromático (branco)
    console.log('⏳ Gerando android-icon-monochrome.png...');
    const monoSvgStr = svgContent
      .replace(/fill="#391A65"/g, 'fill="none"')
      .replace(/#CF96D5/g, '#FFFFFF')
      .replace(/#F8F8F8/g, '#FFFFFF')
      .replace(/#F6F6F6/g, '#FFFFFF');
    const monoSvg = Buffer.from(monoSvgStr);
    await sharp(monoSvg)
      .resize(ICON_SIZE, ICON_SIZE, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(ASSETS_DIR, 'android-icon-monochrome.png'));
    console.log('✅ android-icon-monochrome.png gerado!');

    // 5. splash-icon.png (512x512) - splash screen
    console.log('⏳ Gerando splash-icon.png (512x512)...');
    await sharp(fgSvg)
      .resize(SPLASH_SIZE, SPLASH_SIZE, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));
    console.log('✅ splash-icon.png gerado!');

    // 6. favicon.png (48x48) - Web
    console.log('⏳ Gerando favicon.png (48x48)...');
    await sharp(squareSvg)
      .resize(FAVICON_SIZE, FAVICON_SIZE, {
        fit: 'contain',
        background: BG_COLOR
      })
      .png()
      .toFile(path.join(ASSETS_DIR, 'favicon.png'));
    console.log('✅ favicon.png gerado!');

    console.log('\n🎉 Todos os ícones foram gerados com sucesso a partir do Group.svg!');
    console.log('📁 Arquivos salvos em:', ASSETS_DIR);

  } catch (err) {
    console.error('\n❌ Erro ao gerar ícones:', err.message);
    if (err.message.includes("Cannot find module 'sharp'")) {
      console.log('\n💡 Instale o sharp primeiro:');
      console.log('   npm install --save-dev sharp');
      console.log('\nDepois execute novamente:');
      console.log('   node scripts/generate-icons.js');
    }
  }
}

generateIcons();
