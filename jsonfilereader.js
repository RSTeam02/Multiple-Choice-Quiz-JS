/**
 * 
 * @sakaijun
 * json quizfile reader
 * 
 */

export class JSONFileReader {

    readJSON(rndSwitch) {
        return $.getJSON("quizfile.json").then((data) => {           
            return data;
        });

    }

    set Question(str){
        this.str = str;
    }

    get Question(){
        return this.str;
    }
}