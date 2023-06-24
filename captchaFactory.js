const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

class CaptchaFactory {

    getAllPaths(directoryPath) {
        const absolutePath = path.resolve(directoryPath);
        const fileNames = fs.readdirSync(absolutePath);
        const paths = [];

        fileNames.forEach((fileName) => {
            const filePath = path.join(absolutePath, fileName);
            const relativePath = './' + path.relative('.', filePath);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                const subPaths = this.getAllPaths(relativePath);
                paths.push([...subPaths]);
            } else { // if subpath
                paths.push(relativePath);
            }
        });

        return paths;
    }

    getFilename(filePath) {
        const fileNameWithExtension = path.basename(filePath);
        const fileName = path.parse(fileNameWithExtension).name;
        return fileName;
    }

    async overlayImages(backgroundImagePath, overlayImagePath, opacity, outputDirectory) {
        console.log(backgroundImagePath, '\t\t\t', overlayImagePath);
        const canvas = createCanvas(400, 400);
        const ctx = canvas.getContext('2d');

        // Load the background image
        const background = await loadImage(backgroundImagePath);
        ctx.drawImage(background, 0, 0, 400, 400);

        // Load the overlay image
        const overlay = await loadImage(overlayImagePath);

        // Set the global alpha (opacity) value
        ctx.globalAlpha = opacity;

        // Calculate the scaled dimensions of the overlay image
        const scaleFactor = Math.min(400 / overlay.width, 400 / overlay.height);
        const scaledWidth = overlay.width * scaleFactor;
        const scaledHeight = overlay.height * scaleFactor;

        // Calculate the position to center the overlay image on the canvas
        const x = (400 - scaledWidth) / 2;
        const y = (400 - scaledHeight) / 2;

        // Draw the overlay image on top of the background image
        ctx.drawImage(overlay, x, y, scaledWidth, scaledHeight);

        // Output the result to a file
        const generatedImageFileName = this.getFilename(backgroundImagePath) + '+' + this.getFilename(overlayImagePath);
        const outputPath = outputDirectory + generatedImageFileName + '.jpg'
        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createJPEGStream();
        stream.pipe(out);

        out.on('finish', () => {
            console.log(generatedImageFileName + ' generated');
        });
    }
}


module.exports = CaptchaFactory;
