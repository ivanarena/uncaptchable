const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

class CaptchaFactory {
    getIdList() {
        fs.readFile('./res/idList.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                throw err;
            } else {
                const idList = JSON.parse(data);
                return idList;
            }
        });
    }

    getRandomId() {
        const idList = this.getIdList();
        console.log(idList)
        return idList;
    }


    async generateImagesFromDataset() {
        // 2d array: [folder, file]
        const files = this.getAllPaths('./res/dataset/')

        let backgroundIndex = 0;
        let overlayIndex = 1;
        while (backgroundIndex < files.length) { // pick every background folder
            for (let backgroundImage of files[backgroundIndex]) { // pick every image in background folder
                while (overlayIndex < files.length) { // loop through every other folder
                    for (let overlayImage of files[overlayIndex]) { // overlay every image in overlay folder
                        await this.overlayImages(
                            backgroundImage,
                            overlayImage,
                            0.5,
                            './res/generated/'
                        );
                    }
                    overlayIndex++;
                }
                overlayIndex = backgroundIndex + 1;
            }
            backgroundIndex++;
            overlayIndex = backgroundIndex + 1;
        }
    }

    convertToBinary(imagePath) {
        return fs.readFileSync(imagePath);
    }

    extractNamesFromFileName(fileName) {
        fileName = this.getFileName(fileName);
        const regex = /([^_]+)_\d+\w\+([^_]+)_\d+\w/;
        const matches = fileName.match(regex);

        if (matches && matches.length === 3) {
            const answer1 = matches[1];
            const answer2 = matches[2];
            return [answer1, answer2];
        }

        return [];
    }

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

    getFileName(filePath) {
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
        const generatedImageFileName = this.getFileName(backgroundImagePath) + '+' + this.getFileName(overlayImagePath);
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
