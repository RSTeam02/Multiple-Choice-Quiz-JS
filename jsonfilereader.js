/**
 * 
 * @sakaijun
 * json quizfile reader
 * 
 */

export class JSONFileReader {

    readJSON() {
        return $.getJSON("quizfile.json").then((data) => {           
            return data;
        });

    }

    set allQuestion(kv){
        this._kv = kv;
    }

    get allQuestion(){
        return this._kv;
    }
}