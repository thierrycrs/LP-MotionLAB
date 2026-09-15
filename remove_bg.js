import { Jimp } from 'jimp';

async function removeBg() {
  try {
    const image = await Jimp.read('./cliente-logo/logotipo-cocacola.jpg');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      if (r > 200 && g > 200 && b > 200) {
        this.bitmap.data[idx + 3] = 0;
      }
    });
    image.write('./cliente-logo/logotipo-cocacola.png');
    console.log('Successfully created PNG without background');
  } catch (err) {
    console.error(err);
  }
}

removeBg();
