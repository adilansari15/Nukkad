import "dotenv/config";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
function hasImageKitConfig() {
    return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}


function createFileName(originalName = "upload") {
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return `chat-${Date.now()}-${safeName}`;
}

async function uploadChatMedia(file) {
    const fileName = createFileName(file.originalName);
    const result = await imagekit.files.upload({
        file: await toFile(file.buffer, createFileName, { type: file.mimetype }),
        fileName,
        folder: "/chat",
    });

    return result.url;

}
export {uploadChatMedia, hasImageKitConfig };