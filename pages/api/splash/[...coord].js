import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

// Splash image creation is based on this guide:
// https://flaviocopes.com/canvas-node-generate-image/

export default async function(req, res) {
    const { coord: [qHeight, qWidth] } = req.query;
    const height = parseInt(qHeight);
    const width = parseInt(qWidth);
    const isVertical = height > width;

    const currentBranch = serverRuntimeConfig.GIT_BRANCH;

    console.log("Height:", height, "Width:", width, "Vertical:", isVertical, "Current Branch:", currentBranch);

    if (isNaN(height) || isNaN(width)) {
        return res.status(400).end();
    }

    registerFont(getFullImageURL("fonts/AvenirLTStd-Light.otf"), { family: "Avenir" });

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    // Background
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, width, height);

    // Logo and app name
    if (isVertical) {
        const logo = await loadImage(getFullImageURL("marker.png"));
        const pbText = await loadImage(getFullImageURL("parkingbase.png"));
    
        const logoWidth = Math.floor(width / 2);
        context.drawImage(logo, Math.floor(width / 2 - logoWidth / 2), Math.floor(height * 0.4 - logoWidth / 2), logoWidth, logoWidth);
        context.drawImage(pbText, 0, Math.floor(height * 0.4 - logoWidth / 2 + logoWidth), width, width * 1094 / 3810);
    } else {
        const logo = await loadImage(getFullImageURL("logo.png"));

        context.drawImage(logo, Math.floor(width / 4), Math.floor(height * 0.3), Math.floor(width / 2), Math.floor(width / 2 * 1291 / 3794));
    }

    // Development Text
    if (currentBranch !== "main") {
        const fontSize = Math.floor((isVertical ? height : width) * 0.02);

        context.font = `${fontSize}pt Avenir`;
        context.textAlign = "center";

        context.fillStyle = "#FEBC11";
        context.fillText("Development Build", width / 2, height * 0.8);
        
        context.fillStyle = "#3D4952";
        context.fillText(currentBranch, width / 2, height * 0.8 + fontSize * 1.5);
    }

    const buffer = canvas.toBuffer("image/png");
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(buffer);
}

function getFullImageURL(filename) {
    console.log("Vercel:", process.env.VERCEL)
    if (process.env.VERCEL === "1") {
        return `https://${process.env.VERCEL_URL}/${filename}`;
    } else {
        return path.join(serverRuntimeConfig.PROJECT_ROOT, `./public/${filename}`)
    }
}