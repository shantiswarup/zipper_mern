const fs = require("fs");
const path = require('path');
const archiver = require('archiver');
const db = require("../db");
const File = db.files;


const deleteZip = (dirpath, id) => {
  fs.unlink(dirpath + `/resources/zips/${id}.zip`, err => {
    if (err) throw err;
  });
  return
}

const deleteUploads = (dirpath, id) => {
  const directory = dirpath + "/resources/uploads";
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        const filePattern = new RegExp( `^${id}-`, 'i' );
        files
        .filter( f => filePattern.test( f ) )
        .forEach( f => {
            fs.unlink(path.join(directory, f), err => {
                if (err) throw err;
            })});
        });
}

const uploadFiles = async (req, res) => {
  try {
    if (req.files == undefined) {
      return res.send(`You must select a file.`);
    }
    if (req.files.some(f => f.size > 60000)) {
      console.log(res.render);
      return res.render('error', { message: 'File size limit exceeded, Please use files less than 60kb', status: 'Bad Request' }, (err, html) => {
        deleteUploads(__basedir, req.id);
        res.status(400).send(html);
      });
    }
    const output = fs.createWriteStream( __basedir + "/resources/zips/" + `${req.id}.zip`);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        res.download(__basedir + `/resources/zips/${req.id}.zip`, 'yourzip.zip', (err) => {
            if (err) {
              res.render('error', { messsage: 'Some unknown error occured while downloading zip file', status: 'Internal server error' }, (err, html) => {
                deleteZip(__basedir , req.id);
                deleteUploads(__basedir, req.id);
                res.status(500).send(html);
              });
            } else {
              File.create({
                data: fs.readFileSync(
                __basedir + `/resources/zips/${req.id}.zip`
                ),
                createdAt: Date.now(),
                updatedAt: Date.now()
            }).then((file) => {
                console.log("file saved in db");
                deleteZip(__basedir, req.id);
                deleteUploads(__basedir, req.id);
            });
            }
          });
    });
    output.on('end', function() {
        console.log('Data has been drained');
      });
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
            console.err('noent');
        } else {
            // throw error
            throw err;
        }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      console.log(err)
      return res.render('error', { messsage: 'Some unknown error occured while creating zip file', status: 'Internal server error' }, (err, html) => {
        deleteUploads(__basedir, req.id);
        res.status(500).send(html);
      });
    });

    archive.pipe(output);

    // archive.directory( __basedir + "/resources/uploads/", false);
    req.files.forEach(file => {
        archive.append(fs.createReadStream(file.path), { name: file.originalname });
    });

    archive.finalize();

  } catch (error) {
    console.log(error);
    return res.render('error', { messsage: 'Some unknown error occured while creating zip file', status: 'Internal server error' }, (err, html) => {
      deleteUploads(__basedir, req.id);
      res.status(500).send(html);
    });
  }
};

module.exports = {
  uploadFiles,
};