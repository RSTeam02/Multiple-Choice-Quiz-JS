/**
 * 
 * @sakaijun
 * controller
 * 
 */

import { JSONFileReader } from "./jsonfilereader.js";
import { View } from "./view.js";
import { Shuffle } from "./shuffle.js";

export class Controller {
    constructor() {
        this.reader = new JSONFileReader();
        this.view = new View();
        this.rnd = new Shuffle();
        this.readFile();
        $("#next").hide();
        this.btnListener();
        this.i = 0;
    }

    btnListener() {
        $("#next, #restart").on('click', (e) => {
            let rndSwitch = {
                question: ($('#qShuffle').is(':checked')) ? true : false,
                answer: ($('#aShuffle').is(':checked')) ? true : false
            };
            //rewind
            if (e.currentTarget.id === "restart") {
                $("#next").show();
                this.start(rndSwitch);
            }
            //parse next
            if (e.currentTarget.id === "next") {
                if (this.i < this.reader.question.length) {
                    this.nextQ(this.shuffleQ[this.i++], rndSwitch);
                }
            }
        });
    }

    start(rndSwitch) {
        this.i = 0;
        this.shuffleQ = this.rnd.randPos(this.reader.question.length, rndSwitch.question);
        this.nextQ(this.shuffleQ[this.i++], rndSwitch);
    }

    readFile() {
        this.reader.readJSON().done((res) => {
            this.reader.question = res;
        });
    }
    //parse answer, solution from json via index, shuffle position if true
    nextQ(qNo, rndSwitch) {
        let res = this.reader.question;
        let quizStr = "";
        let l, m;
        l = m = 0x0061;
        let quiz = res[qNo].quiz;
        let answer = res[qNo].answer;
        quizStr += `${quiz}\n`;
        let answerKey = Object.keys(answer);
        let answerVal = Object.values(answer);
        let shuffleA = this.rnd.randPos(answerKey.length, rndSwitch.answer);
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
        this.view.printQuestion(quizStr);
    }

}