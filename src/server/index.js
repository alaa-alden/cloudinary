import express from 'express'
//import fileUpload from 'express-fileupload'
//import bodyParser from 'body-parser'
import multer from 'multer'
import path from 'path'
import cloudinary from 'cloudinary'
import rimraf from 'rimraf'

//import ejs from 'ejs'

// use cloudinary
cloudinary.config({
    cloud_name: "dg2jsfnut",
    api_key: '311688659182425',
    api_secret: 'aA2I9ncwCq7QjpuGxFOqnk29gdk'
})

// end process with cloudinary
var app = express()
//app.use(bodyParser())
//app.use(fileUpload())
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// Init Upload
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads/'),
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


// get 
app.get('/', (req, res) => { res.sendfile(path.resolve(__dirname, "../views/index.html")) })
app.get('/win', (req, res) => { res.sendfile(path.resolve(__dirname, "../views/win.html")) })
// post , in here process
app.post('/', (req, res) => {
    upload(req, res, (err) => {
        console.log(req.file.path)
        let name=req.file.filename
	let end =name.length-path.extname(name).toLowerCase().length
	console.log(end)
        cloudinary.v2.uploader.upload(req.file.path, { public_id: name.substr(0,end)}, (error, result) => {
            console.log("success and " + result)
        }).then((res) => {
            console.log(res.url);
        }).catch((err) => {
            console.log("error is " + err)
        })
        res.redirect('/')
        setTimeout(() => { rimraf(path.resolve(__dirname, '../../public/uploads/*'), function () { console.log('done'); }) }, 5000);
    })
    /*if (req.files.foo.path)
        cloudinary.v2.uploader.upload(req.files.foo.path, (error, result) => {
            console.log("success and " + result)
        })
        */

})
//setInterval(() => { rimraf(path.resolve(__dirname, '../../public/uploads/*'), function () { console.log('done'); })}, 10000);

app.post('/win',(req,res)=>{
    cloudinary.v2.uploader.destroy('happy-kids-slide', function (error, result) { console.log(result) });
    res.redirect('/')

})
app.listen(process.env.PORT||8080, () => console.log("listen from 8080"))
