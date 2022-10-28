const fs = require("fs");
const path = require("path");

if (process.argv.length > 3) {
  const bin =  path.join(__dirname, "builder", "exe.bin");
  const dest = process.argv[2].trim();
  const src = process.argv[3].trim();

  fs.copyFile(bin, dest, err => {
    if (err) throw err;
    const output = fs.createWriteStream(dest, { 'flags': 'a' });
    const input = fs.createReadStream(src);
    input.pipe(output);

    console.info("done.");
  });
}