// Patches
const { inject, errorHandler } = require('express-custom-error')
inject() // Patch express in order to use async / await syntax
// Require Dependencies
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('./util/logger')
const CodeError = require('./util/CodeError.js')
const status = require('http-status')
const { TOKENSECRET } = process.env
const userModel = require('./models/users.js')
const multer = require('multer');
const jws = require('jws')
const path = require('path')
const https = require('https')
const documentModel = require('./models/documents.js')
const imageModel = require('./models/images.js')
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const admins = require('./admins.js')
const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');
require("mandatoryenv").load(["GOOGLE_CLOUD"]);

// Instantiate an Express Application
const app = express()

const credentials = {
  cert: fs.readFileSync('public.pem'),
  key: fs.readFileSync('private.pem')
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

const keyFile = JSON.parse(process.env.GOOGLE_CLOUD);
const storage = new Storage({ credentials: keyFile });
const bucket_name = 'squareinvest38'

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
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Configure custom logger middleware
app.use(logger.dev, logger.combined)
app.use(cookieParser())
app.use(cors())
app.use(helmet())

// Frontend code access in static mode
// app.use('/frontend', express.static('../frontend'))

// Swagger Documentation
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Middleware that verifies the authentication for every 
// request that need an authenticated user
app.use('/auth_api/*', async (req, res, next) => {
  // Token present
  if (!req.headers["x-access-token"]) {
      throw new CodeError("You don't have access rights", status.FORBIDDEN)
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
  if (token != process.env.ADMIN_TOKEN){
    throw new CodeError("Wrong token", status.FORBIDDEN)
  }

  // Everything is okay, next middleware
  next()
})

// Middleware that verifies the authentication for every
// request to access documents
app.get('*/files/:path', async (req, res, next) => {
  const path = "files/" + req.params.path
  const document = await documentModel.findOne({ where: {email: req.authMail, path: path }})
  if (!document) {
    if (!admins.includes(req.authMail)){
      throw new CodeError("You don't have access rights", status.FORBIDDEN)
    }
  }
  try {
    const bucket = storage.bucket(bucket_name);
    const file = bucket.file(path);
    const fileExists = await file.exists();

    if (!fileExists[0]) {
      throw new CodeError('File not found', status.NOT_FOUND);
    }

    const [metadata] = await file.getMetadata();
    const fileStream = file.createReadStream();

    res.set({
      'Content-Type': metadata.contentType,
      'Content-Length': metadata.size,
      'Content-Disposition': `attachment; filename="${req.params.filename}"`,
    });

    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
  }
)

app.get('*/images/:filename', async (req, res, next) => {
  try {
    const bucket = storage.bucket(bucket_name);
    const file = bucket.file('images/' + req.params.filename);
    const fileExists = await file.exists();

    if (!fileExists[0]) {
      throw new CodeError('Image not found', status.NOT_FOUND);
    }

    const [metadata] = await file.getMetadata();
    const fileStream = file.createReadStream();

    res.set({
      'Content-Type': metadata.contentType,
      'Content-Length': metadata.size,
    });

    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
});

// app.use('/images', express.static('images'));
// app.use('/auth_api/files', express.static('files'));


// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

// Function that verifies the validity of the data sent (must be a JSON)
let jsonVerifFunction = async (req, res, next) => {

    let bodyData
    try { 
        bodyData = JSON.parse(req.body.data) 
    } 
    catch(e) {
        throw new CodeError('Request body is not a valid JSON', status.BAD_REQUEST)
    }

    req.data = bodyData
    next()
}

// Middleware that parses the JSON data field of the request
app.post(['/register', '/login', '/confirmMail', '/auth'], async (req, res, next) => {
    await jsonVerifFunction(req, res, next)
})

app.post(['*/msg', '/demande'], upload.none(), function (req, res, next) {
  // Access the form data fields via req.body
  next()
});

// Same for put
app.put(['*/user/*'], async (req, res, next) => {
    await jsonVerifFunction(req, res, next)
})

app.put('*/annonce/*', upload.array('image'), async function (req, res, next) {
  const files = req.files; // Array of uploaded files

  if (!files || files.length === 0) {
    return next(new CodeError('No files uploaded', status.BAD_REQUEST));
  }

  const bucket = storage.bucket(bucket_name);
  const uploadPromises = [];
  req.filesPath = [];

  // Process each uploaded file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const newFilename = Date.now() + file.originalname;
    const fileDestination = 'images/' + newFilename;
    const gcsFile = bucket.file(fileDestination);
    const fileExists = await gcsFile.exists();
    if(!fileExists[0]){
      await compressImage(file);
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = gcsFile.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        stream.on('error', (err) => {
          console.error(err);
          reject(new CodeError('Failed to upload the file', status.INTERNAL_SERVER_ERROR));
        });

        stream.on('finish', () => {
          // Perform any necessary actions after file upload
          // You can store the file path or update the document model here
          req.filesPath.push(fileDestination);
          resolve();
        });

        stream.end(file.buffer);
      });

      uploadPromises.push(uploadPromise);

    }
    else{
      req.filesPath.push(fileDestination);
    }

  }

  try {
    await Promise.all(uploadPromises);
    next();
  } catch (error) {
    return next(error);
  }
})

// Middleware that handle the send of documents
app.post('*/upload_doc', upload.single('document'), async (req, res, next) => {
  if (!req.file) {
    return next(new CodeError('No file uploaded', status.BAD_REQUEST));
  }

  const bucket = storage.bucket(bucket_name);
  const originalExtension = path.extname(req.file.originalname);
  const newFilename = Date.now() + originalExtension;
  const file = bucket.file('files/' + newFilename);

  // Compress the PDF
  // const compressedBuffer = await compressPDF(req.file.buffer);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on('error', (err) => {
    console.error(err);
    return next(new CodeError('Failed to upload the file', status.INTERNAL_SERVER_ERROR));
  });

  stream.on('finish', () => {
    // Update the file path in the document model or perform any other necessary actions
    req.filePath = 'files/' + newFilename;
    next();
  });

  stream.end(req.file.buffer);
})

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

async function compressImage(file){
  // Vérifier le format de l'image
  if (file.mimetype === 'image/jpeg') {
    // Compression pour les images JPEG avec imagemin-mozjpeg
    const compressedImage = await sharp(file.buffer)
    .jpeg({ quality: 80 }).rotate() // Adjust the compression quality as needed (between 0 and 100)
    .toBuffer();

    // Utiliser le fichier compressé dans la suite du traitement
    file.buffer = compressedImage;
  } else if (file.mimetype === 'image/png') {
    // Compression pour les images PNG avec imagemin-pngquant
    const compressedImage = await sharp(file.buffer)
    .png({ quality: 80 }).rotate() // Adjust the compression quality as needed (between 0 and 100)
    .toBuffer();

    // Utiliser le fichier compressé dans la suite du traitement
    file.buffer = compressedImage;
  }
}

// Middleware that handle the send of images
app.post('*/annonce', upload.array('image'), async (req, res, next) => {
  const files = req.files; // Array of uploaded files

  if (!files || files.length === 0) {
    return next(new CodeError('No files uploaded', status.BAD_REQUEST));
  }

  const bucket = storage.bucket(bucket_name);
  const uploadPromises = [];
  req.filesPath = [];

  // Process each uploaded file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const newFilename = Date.now() + file.originalname;
    const fileDestination = 'images/' + newFilename;
    const gcsFile = bucket.file(fileDestination);
    const fileExists = await gcsFile.exists();
    if(!fileExists[0]){
      await compressImage(file);
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = gcsFile.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        stream.on('error', (err) => {
          console.error(err);
          reject(new CodeError('Failed to upload the file', status.INTERNAL_SERVER_ERROR));
        });

        stream.on('finish', () => {
          // Perform any necessary actions after file upload
          // You can store the file path or update the document model here
          req.filesPath.push(fileDestination);
          resolve();
        });

        stream.end(file.buffer);
      });

      uploadPromises.push(uploadPromise);

    }
    else{
      req.filesPath.push(fileDestination);
    }

  }

  try {
    await Promise.all(uploadPromises);
    next();
  } catch (error) {
    return next(error);
  }
})

app.delete('*/annonce/:id', async (req, res, next) => {
  try {
    const images = await imageModel.findAll({ where: {id_annonce: req.params.id }})
    const bucket = storage.bucket(bucket_name);
    for (let i = 0; i < images.length; i++) {
      const file = bucket.file(images[i].path);
      const fileExists = await file.exists();
      if(fileExists[0]){
        await file.delete();
      }
    }

    next();
  } catch (err) {
    next(err);
  }
})

app.delete('*/user/:email', async (req, res, next) => {
  try {
    const docs = await documentModel.findAll({ where: {email: req.params.email }})
    const bucket = storage.bucket(bucket_name);
    for (let i = 0; i < docs.length; i++) {
      const file = bucket.file(docs[i].path);
      await file.delete();
    }

    next();
  } catch (err) {
    next(err);
  }
})

app.delete('*/files/:path', async (req, res, next) => {
  try {
    req.filePath = 'files/' + req.params.path
    const bucket = storage.bucket(bucket_name);
    const file = bucket.file(req.filePath);
    await file.delete();
    
    next();
  } catch (err) {
    next(err);
  }
})

// Assign Routes
app.use('/', require('./routes/router.js'))
// Handle errors
app.use(errorHandler())
// Handle not valid route
app.use('*', (req, res) => {
  res
    .status(404)
    .json({ status: false, message: 'Endpoint Not Found' })
})

// Create an HTTPS server
// const httpsServer = https.createServer(credentials, app);

module.exports = app
