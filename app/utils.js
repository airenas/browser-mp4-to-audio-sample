function GetFileData(file) {
    return new Promise(function (done, failed) {
        var reader = new FileReader();
        reader.onload = function () {
            done(reader.result);
        }
        reader.onerror = err => failed(err);
        reader.readAsArrayBuffer(file);
    });
}

module.exports = GetFileData;