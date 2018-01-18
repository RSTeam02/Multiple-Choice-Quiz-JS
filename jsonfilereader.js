/**
 * 
 * @sakaijun
 * json quizfile reader
 * 
 */

export class JSONFileReader {
    //load default quizfile
    readJSON() {
        return $.getJSON("quizfile.json").then((data) => {
            return data;
        });

    }

    //upload a json quizfile from browser
    jsonLoader(cb) {
        var file = document.querySelector('input[type=file]').files[0];
        let reader = new FileReader();      
        reader.readAsText(file);

        try {
            if (file.type !== 'application/json') {
                throw "not a json quizfile";
            } else {
                reader.onload = function() {
                    cb(reader.result);
                }
            }
        } catch (error) {
            console.log(error);
        }     
    }
    //getter/setter for all questions as json
    set allQuestion(kv) {
        this._kv = kv;
    }

    get allQuestion() {
        return this._kv;
    }
}