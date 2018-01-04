/**
 * 
 * @sakaijun
 * json quizfile reader
 * 
 */

import { Shuffle } from "./shuffle.js";

export class JSONFileReader {

    readJSON(rndSwitch, callback) {
        let quizStr = "";
        let rnd = new Shuffle();

        $.getJSON("quizfile.json", (data) => {
            let shuffleQ = rnd.randPos(data.length, rndSwitch.question);
            for (let i = 0; i < data.length; i++) {
                let l, m;
                l = m = 0x0061;
                let quiz = data[shuffleQ[i]].quiz;
                let answer = data[shuffleQ[i]].answer;
                quizStr += `${quiz}\n`;
                let answerKey = Object.keys(answer);
                let answerVal = Object.values(answer);
                let shuffleA = rnd.randPos(answerKey.length, rndSwitch.answer);
                for (let k = 0; k < answerKey.length; k++) {
                    quizStr += `${String.fromCodePoint(l).toUpperCase()}: ${answerKey[shuffleA[k]]}\n`;
                    l++;
                }
                quizStr += "Solution: ";
                for (let l = 0; l < answerVal.length; l++) {
                    if (answerVal[shuffleA[l]] === '+') {
                        quizStr += String.fromCodePoint(m).toUpperCase();
                    }
                    m++;
                }
                quizStr += "\n\n";
            }
            callback(quizStr);
        });

    }
}