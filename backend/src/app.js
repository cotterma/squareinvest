// Patches
const { inject, errorHandler } = require("express-custom-error");
inject(); // Patch express in order to use async / await syntax
// Require Dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./util/logger");
const CodeError = require("./util/CodeError.js");
const status = require("http-status");
const { TOKENSECRET } = process.env;
const userModel = require("./models/users.js");
const multer = require("multer");
const jws = require("jws");
const path = require("path");
const https = require("https");
const documentModel = require("./models/documents.js");
const imageModel = require("./models/images.js");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const admins = require("./admins.js");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");
const crypto = require('crypto');

// Instantiate an Express Application
const app = express();

const credentials = {
    cert: fs.readFileSync("public.pem"),
    key: fs.readFileSync("private.pem"),
};

// // Set up the storage configuration for documents
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Set the destination directory where the file will be stored
//     cb(null, 'files');
//   },
//   filename: function (req, file, cb) {
//     // Set the new filename for the uploaded file
//     const originalExtension = path.extname(file.originalname);
//     const newFilename = Date.now() + originalExtension;
//     cb(null, newFilename);
//   }
// });

const fileCrypted =
    "986e8fe477ca2bcf41fab1a7fdace1bcf3c54e4a62fbe60b3ae1d285281cd5d6e7127e194c8c21cb011923514163ccc8bb1c992fdbe9c5c4c6ee14cfa58936118cfbdffd5246311e4807d208bdb301497e28f84e18042374f79244c5abf4d8986deedee4062d424f1cb306193b2f894433817c1be3dfbb143ad2d7773c3a66f1024c9040443c3eb605d5edc6e19156deb7dc770d63bbad9a96f306f3d6694c1777fe79dbdb07fffc2d93644f6b77983067c6b63289a5422e21436939dbb623e1b0de452af92dcaf3ee64ed29c9eb2cb450aff2829899db239a05fb14b92a980bcb0d54f206f59bef1b9d50bf3d6b3a3ca62aef376ad14479c41dd9e171b31e800473f0dc781efb8fd43009d4012fd9e233bf3403ca0442cd7e218fc69a8451a3433fb3e0570997a03429774a8ed1898d6dcfdd281976ced6814363a5d84cee8d2d295d679404700475a87e83f5925d329dc4f58da0f9a0cdf44a922129886b908e1cab8c21ad0d503705b50c4294ea208b856ad7ff13bbd2ae8581612028f38dfe1330b3b86924d54f669cc9cddb2a02c394b490704712eed7caaff1a8d44593efa9ec2b3b94a532e744c2e121b7d14f1b6fbcc21ada03c3cc76f82cb13bf3878c73171d46541b1b242699758029eaf5d93da76375ed64923dcd6ad00e6b1c4f768bd3a931580fd0134b8f78f53d0d93ca37d8e0c29d64dd968b5a2199cfa528715a18cca0bf09ec5f8588d800a84e6a1534b238ee22b2dc34aff52e53160252476ac901f8b76143775e0e6bb1f08b2b72431d15dc39a07a7d6c40e8016ae921152c8f9fecaf4f4ab7b971c9f0b5c29e48024720f3dcc59916ba058552f9452d5de357d30220bd6a1cfe7c6f79e08dbe45b569a12c24e90e189feca084232c4496645ce4ad632ee35ce978ed1aaa69914f2c4b1c49b2f39a088aa8e129385e137e36b52a421d613b59e1d7bff3ca28ed591bfbc0d8095bcb2f5521fa09d1465ad2cd5f81706909481dce5dc4a3e857702f0f05ea8677b3fa2495795b22328b7befc789515f0f075c74a27dfa1490c1adc26cef7f9295b1d16ac6af671bdc5f148aa9c50230ba9d239d5bc3a342ffabd0ec8e560ad972de25f54679dce0102bd08587a3131e660972524b93985e07a50a33bee1db448682201e6942c02400106570ab6333fc00a879b59fae5820b12bed455d326d46f646eea29befb9b877ed3595d27b02bb1554fa2247034b33ea7e177ca56099e30a39b175bae4e29ac4aeff95742cf673e2be172a4cf9626f69b0d6fd60e4781ddf939b4a26865426ae536b0928a7bd2519f33d4b46f4a68778aab224cee82d6f099bae49be1ee7f449ac87556f2f7e3529352065a706797b3e23ac88412c9d4ce795ede0b4336df116774f5f6d62874a2f111487b7be60d72e832edf4ca702c9f7ce41e744f583d680ac4141d37a2af02010ae6a7cab25176e1010c759d329ef32012504c45f16553256825575303df38b6da00520465258c6d33f1c7c5972a7c8d11eccc0b2e61d5ea24b5720fb472ceff2c7a3c786610c246c4c62a18fc26d6d262ecaf11d1e48b83722a48a7940ab53c044816c08c4772e12b497638dfbe906910ce5baad04c86f71105ea4d6c9f9ab13cb6642f94f785e01c64b4869f4ab683fe3f4a7c4d772cfa21caa6c4ea9dadeae4cf7455505d57f3390fed8d83f02ee3f5c2b89112405f045f3db90952b6ae30481afd7eb1ad90f4c95ed6a1820ca88536aee1fc60da040294b26025dec3103907ca1e9e8eda40028a2007b7c8412fd5c5b18a1923a22efbca6bb63014325974f1c4f5ad414a94ef98ceaaffd00f4427a740f4e4962a6047f15b7e52f4b3eec4b0d6cf8813d7d6e25e10fd7e578b76cde0ceafa65a6c113fa34f03f2001e7f5bbb45467d16332f13cf5617ffcd7f06c93f286d0b4104526a283f055255f8b38ade09ad1a651f0710609c28afbe72aca8afd35deed9f4c3847871451bd148b96853c32f8823dbe9177f55f72f10c3e7ee22556468e7b17d278f3b5094fab6b81cf78ba7d89a12b9104410d113ee8134b8614a74c58299bc80c4240f55807ea0499428ac3b151e337d482c0d01523b9fd7bbba70b71ed5899b2af355080bf5971db9eeb228eec16c0245fc8ff71981099212b33d17cdf0bfa20cb62d9837cdf9325c07e48acbfcc0c4613ee784ecbf6b16e0091d251cea5f942a4a13067e2ddba0416f99261bb500681b7ccd2d10c9dce760ec2c73180447490489d17d50eb64dbe5d8927b9b1c7373e27e9058e588fefeb271bdfbf0d71072a119f473dc41211093067c859af46e9aac7058d5236b11b523ea66f16df50618752da431b7797e78eca3cd76942c0133907fe5cc62b1f41789ed202c9af2c032ea03c0487b6e30fa91772f4ff134c5cff20ba1b9043086a855000fd2c60c37a17edfc3f50b60a05a1e4de952b9f636b9441d528fc584933521dca006c29dc81fc7fcaf7cbcf5b89a88ea53d0a9c4cec4ab2fd8212a8ff4322c51827cba1c38ed5f49b51ba347d2d6b40c59b091a770f383484dd0444ac17d5a2a3222cf2067a3de3760047c14d02c63c4398a0d0bce757222a6f06aafccd9a133d24ba0764240670906b671cea70f49057fbe448b733bd6427b9a00b2210d10c260d393cf7b792187c13fe728cc9de38c85c0a6b86b3b913a96d31bee6e342facf3582d6a3d7ab56a9fcb9ceb0b318231bfeaf4eb5330584d7d93013c7fcdbae35728c9e94f8e0b56858f9d0c8e4949a2fb4c821cf1100863f1b53749d346a275620560af4f0682657632f050f62283b3894aaa41b9d3c128f2d737defb63db94d22be98c77e3117039ca3308058b5795857f142a09b5bfbd1add66f45d1611536114cf4652bfd748e180d05a731861be397e8183a2094cbfe130b94fb2b6552678bff3123ef8d96b8a80472272d86df2a9ce192a78507bea984f1daaa8e873eb3ae6ff57686f94688d383ab61a3113f1ba05e68221eccddd5130bbc0dc3880010350ab89a5fbdab07f222d57ec75eb6237440b0dae0c2f1d49bb9deadc4f4c0b09048b38009f3bf2d424aaf5dec6d1b23efb71896a00fa11aeb7b0ed7883d5fd4022a4caf95fc8cd00e696986c59f1a65f048843625f5a4076e613c9dbe78c6e8132a18a1276976ebbceffe4778b4f778bac90746ad42f4f53140c2b97d81d57d0a2a7e1b81bfc4c2e37144b9d0a2e22d97c9f825407e1d1a6762c87489de9383ba7d469d7672fa811875d22177e8a29c80e7207d33525994e9b0d7f06c505b53a976355303f33c";

const key = Buffer.from(process.env.KEY.trim(), "hex");

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv("aes-256-ecb", key, null);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

const decrypted = decrypt(fileCrypted);
const keyFile = JSON.parse(decrypted);
const storage = new Storage({ credentials: keyFile });
const bucket_name = "squareinvest38";

// // Set up the storage configuration for images
// const storage_image = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Set the destination directory where the file will be stored
//     cb(null, 'images');
//   },
//   filename: function (req, file, cb) {
//     // Set the new filename for the uploaded file
//     const newFilename = Date.now() + file.originalname;
//     cb(null, newFilename);
//   }
// });

// Create the multer instance with the custom storage configuration
// const upload = multer({ storage: storage });

// const upload_image = multer({ storage: storage_image });

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});

// Configure Express App Instance
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Frontend code access in static mode
// app.use('/frontend', express.static('../frontend'))

// Swagger Documentation
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger_output.json");
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Middleware that verifies the authentication for every
// request that need an authenticated user
app.use("/auth_api/*", async (req, res, next) => {
    // Token present
    if (!req.headers["x-access-token"]) {
        throw new CodeError("You don't have access rights", status.FORBIDDEN);
    }

    // Token valid
    const token = req.headers["x-access-token"];
    // if (!jws.verify(token, "HS256", TOKENSECRET)) {
    //   throw new CodeError("You don't have access rights", status.FORBIDDEN)
    // }

    // // User sending the token valid
    // const email = jws.decode(token).payload
    // const user = await userModel.findOne({ where: { email: email }, attributes: ['email'] })
    // if (!user) {
    //   throw new CodeError("You don't have access rights", status.FORBIDDEN)
    // }
    // req.authMail = user.email
    if (token != process.env.ADMIN_TOKEN) {
        throw new CodeError("Wrong token", status.FORBIDDEN);
    }

    // Everything is okay, next middleware
    next();
});

// Middleware that verifies the authentication for every
// request to access documents
app.get("*/files/:path", async (req, res, next) => {
    const path = "files/" + req.params.path;
    const document = await documentModel.findOne({
        where: { email: req.authMail, path: path },
    });
    if (!document) {
        if (!admins.includes(req.authMail)) {
            throw new CodeError(
                "You don't have access rights",
                status.FORBIDDEN
            );
        }
    }
    try {
        const bucket = storage.bucket(bucket_name);
        const file = bucket.file(path);
        const fileExists = await file.exists();

        if (!fileExists[0]) {
            throw new CodeError("File not found", status.NOT_FOUND);
        }

        const [metadata] = await file.getMetadata();
        const fileStream = file.createReadStream();

        res.set({
            "Content-Type": metadata.contentType,
            "Content-Length": metadata.size,
            "Content-Disposition": `attachment; filename="${req.params.filename}"`,
        });

        fileStream.pipe(res);
    } catch (err) {
        next(err);
    }
});

app.get("*/images/:filename", async (req, res, next) => {
    try {
        const bucket = storage.bucket(bucket_name);
        const file = bucket.file("images/" + req.params.filename);
        const fileExists = await file.exists();

        if (!fileExists[0]) {
            throw new CodeError("Image not found", status.NOT_FOUND);
        }

        const [metadata] = await file.getMetadata();
        const fileStream = file.createReadStream();

        res.set({
            "Content-Type": metadata.contentType,
            "Content-Length": metadata.size,
        });

        fileStream.pipe(res);
    } catch (err) {
        next(err);
    }
});

// app.use('/images', express.static('images'));
// app.use('/auth_api/files', express.static('files'));

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

// Function that verifies the validity of the data sent (must be a JSON)
let jsonVerifFunction = async (req, res, next) => {
    let bodyData;
    try {
        bodyData = JSON.parse(req.body.data);
    } catch (e) {
        throw new CodeError(
            "Request body is not a valid JSON",
            status.BAD_REQUEST
        );
    }

    req.data = bodyData;
    next();
};

// Middleware that parses the JSON data field of the request
app.post(
    ["/register", "/login", "/confirmMail", "/auth"],
    async (req, res, next) => {
        await jsonVerifFunction(req, res, next);
    }
);

app.post(["*/msg", "/demande"], upload.none(), function (req, res, next) {
    // Access the form data fields via req.body
    next();
});

// Same for put
app.put(["*/user/*"], async (req, res, next) => {
    await jsonVerifFunction(req, res, next);
});

app.put("*/annonce/*", upload.array("image"), async function (req, res, next) {
    const files = req.files; // Array of uploaded files

    if (!files || files.length === 0) {
        return next(new CodeError("No files uploaded", status.BAD_REQUEST));
    }

    const bucket = storage.bucket(bucket_name);
    const uploadPromises = [];
    req.filesPath = [];

    // Process each uploaded file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newFilename = Date.now() + file.originalname;
        const fileDestination = "images/" + newFilename;
        const gcsFile = bucket.file(fileDestination);
        const fileExists = await gcsFile.exists();
        if (!fileExists[0]) {
            await compressImage(file);
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = gcsFile.createWriteStream({
                    metadata: {
                        contentType: file.mimetype,
                    },
                });

                stream.on("error", (err) => {
                    console.error(err);
                    reject(
                        new CodeError(
                            "Failed to upload the file",
                            status.INTERNAL_SERVER_ERROR
                        )
                    );
                });

                stream.on("finish", () => {
                    // Perform any necessary actions after file upload
                    // You can store the file path or update the document model here
                    req.filesPath.push(fileDestination);
                    resolve();
                });

                stream.end(file.buffer);
            });

            uploadPromises.push(uploadPromise);
        } else {
            req.filesPath.push(fileDestination);
        }
    }

    try {
        await Promise.all(uploadPromises);
        next();
    } catch (error) {
        return next(error);
    }
});

// Middleware that handle the send of documents
app.post("*/upload_doc", upload.single("document"), async (req, res, next) => {
    if (!req.file) {
        return next(new CodeError("No file uploaded", status.BAD_REQUEST));
    }

    const bucket = storage.bucket(bucket_name);
    const originalExtension = path.extname(req.file.originalname);
    const newFilename = Date.now() + originalExtension;
    const file = bucket.file("files/" + newFilename);

    // Compress the PDF
    // const compressedBuffer = await compressPDF(req.file.buffer);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });

    stream.on("error", (err) => {
        console.error(err);
        return next(
            new CodeError(
                "Failed to upload the file",
                status.INTERNAL_SERVER_ERROR
            )
        );
    });

    stream.on("finish", () => {
        // Update the file path in the document model or perform any other necessary actions
        req.filePath = "files/" + newFilename;
        next();
    });

    stream.end(req.file.buffer);
});

// async function compressPDF(buffer) {
//   const pdfDoc = await PDFDocument.load(buffer);
//   const pages = pdfDoc.getPages();
//   const compressionQuality = 0.5;
//   // Iterate over each page of the PDF
//   for (let i = 0; i < pages.length; i++) {
//     const page = pages[i];
//     // Compress the images on the page
//     page.getResources().map.Images.forEach((image) => {
//       image.xObject.compress(compressionQuality);
//     });
//   }

//   const compressedBuffer = await pdfDoc.save();

//   return compressedBuffer;
// }

async function compressImage(file) {
    // Vérifier le format de l'image
    if (file.mimetype === "image/jpeg") {
        // Compression pour les images JPEG avec imagemin-mozjpeg
        const compressedImage = await sharp(file.buffer)
            .jpeg({ quality: 80 })
            .rotate() // Adjust the compression quality as needed (between 0 and 100)
            .toBuffer();

        // Utiliser le fichier compressé dans la suite du traitement
        file.buffer = compressedImage;
    } else if (file.mimetype === "image/png") {
        // Compression pour les images PNG avec imagemin-pngquant
        const compressedImage = await sharp(file.buffer)
            .png({ quality: 80 })
            .rotate() // Adjust the compression quality as needed (between 0 and 100)
            .toBuffer();

        // Utiliser le fichier compressé dans la suite du traitement
        file.buffer = compressedImage;
    }
}

// Middleware that handle the send of images
app.post("*/annonce", upload.array("image"), async (req, res, next) => {
    const files = req.files; // Array of uploaded files

    if (!files || files.length === 0) {
        return next(new CodeError("No files uploaded", status.BAD_REQUEST));
    }

    const bucket = storage.bucket(bucket_name);
    const uploadPromises = [];
    req.filesPath = [];

    // Process each uploaded file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newFilename = Date.now() + file.originalname;
        const fileDestination = "images/" + newFilename;
        const gcsFile = bucket.file(fileDestination);
        const fileExists = await gcsFile.exists();
        if (!fileExists[0]) {
            await compressImage(file);
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = gcsFile.createWriteStream({
                    metadata: {
                        contentType: file.mimetype,
                    },
                });

                stream.on("error", (err) => {
                    console.error(err);
                    reject(
                        new CodeError(
                            "Failed to upload the file",
                            status.INTERNAL_SERVER_ERROR
                        )
                    );
                });

                stream.on("finish", () => {
                    // Perform any necessary actions after file upload
                    // You can store the file path or update the document model here
                    req.filesPath.push(fileDestination);
                    resolve();
                });

                stream.end(file.buffer);
            });

            uploadPromises.push(uploadPromise);
        } else {
            req.filesPath.push(fileDestination);
        }
    }

    try {
        await Promise.all(uploadPromises);
        next();
    } catch (error) {
        return next(error);
    }
});

app.delete("*/annonce/:id", async (req, res, next) => {
    try {
        const images = await imageModel.findAll({
            where: { id_annonce: req.params.id },
        });
        const bucket = storage.bucket(bucket_name);
        for (let i = 0; i < images.length; i++) {
            const file = bucket.file(images[i].path);
            const fileExists = await file.exists();
            if (fileExists[0]) {
                await file.delete();
            }
        }

        next();
    } catch (err) {
        next(err);
    }
});

app.delete("*/user/:email", async (req, res, next) => {
    try {
        const docs = await documentModel.findAll({
            where: { email: req.params.email },
        });
        const bucket = storage.bucket(bucket_name);
        for (let i = 0; i < docs.length; i++) {
            const file = bucket.file(docs[i].path);
            await file.delete();
        }

        next();
    } catch (err) {
        next(err);
    }
});

app.delete("*/files/:path", async (req, res, next) => {
    try {
        req.filePath = "files/" + req.params.path;
        const bucket = storage.bucket(bucket_name);
        const file = bucket.file(req.filePath);
        await file.delete();

        next();
    } catch (err) {
        next(err);
    }
});

// Assign Routes
app.use("/", require("./routes/router.js"));
// Handle errors
app.use(errorHandler());
// Handle not valid route
app.use("*", (req, res) => {
    res.status(404).json({ status: false, message: "Endpoint Not Found" });
});

// Create an HTTPS server
// const httpsServer = https.createServer(credentials, app);

module.exports = app;
