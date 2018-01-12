/**
 * 
 * @sakaijun
 * controller
 * 
 */

import { JSONFileReader } from "./jsonfilereader.js";
import { View } from "./view.js";
import { Shuffle } from "./shuffle.js";
import { Player } from "./player.js";
import { Question } from "./question.js";

export class Controller {
    constructor() {

        this.reader = new JSONFileReader();
        this.view = new View();
        this.rnd = new Shuffle();
        this.player = new Player();
        this.readFile();
        $("#ok").hide();
        this.btnListener();
        this.i = 0;

    }

    btnListener() {
        $("#restart, #ok").on('click', (e) => {
            let rndSwitch = {
                allQuestion: ($('#qShuffle').is(':checked')) ? true : false,
                answer: ($('#aShuffle').is(':checked')) ? true : false
            };

            //rewind
            if (e.currentTarget.id === "restart") {
                $("#ok").show();
                var pName = prompt("Enter your name: ", "Player1");
                if (pName !== null || player !== "") {
                    this.player.score = 0;
                    this.player.name = pName;
                    this.view.printInfo(`${this.player.name}'s score: ${this.player.score}pts.`);
                    this.start(rndSwitch);
                }

            }
            //parse next
            if (e.currentTarget.id === "ok") {
                if (this.i <= this.reader.allQuestion.length) {
                    let valid = this.validation();
                    if (!valid.excluded || this.i === 0) {
                        this.player.score += this.checkAnswer(valid.str, this.question.solution);
                        if (this.i !== this.reader.allQuestion.length) {
                            this.nextQ(this.shuffleQ[this.i], rndSwitch);
                            this.view.printInfo(`${this.player.name}'s score: ${this.player.score}pts.`);
                        } else {
                            this.view.printInfo(`${this.player.name}'s final score: ${this.player.score}pts.`);
                        }
                    } else {
                        this.view.printInfo(valid.str);
                    }
                }
                this.i++;
                $("#charInput").val("");
            }
        });
    }

    start(rndSwitch) {
        this.i = 0;
        this.shuffleQ = this.rnd.randPos(this.reader.allQuestion.length, rndSwitch.allQuestion);
        this.nextQ(this.shuffleQ[this.i++], rndSwitch);
    }

    readFile() {
        this.reader.readJSON().done((res) => {
            this.reader.allQuestion = res;
        });
    }

    validation() {
        let plInput = document.getElementById("charInput").value;
        let charInput = plInput.toUpperCase().split("").sort();
        let res = {
            str: "",
            excluded: false
        }
        for (let i = 0; i < charInput.length; i++) {
            if (!this.question._possibility.includes(charInput[i])) {
                res.str += charInput[i];
                if (charInput.length - 1 === i) {
                    res.str += ` not in ${this.question._possibility}, repeat input`;
                }
                res.excluded = true;
            }

        }
        if (!res.excluded) {
            for (let i = 0; i < charInput.length; i++) {
                if (charInput[i] !== charInput[i + 1]) {
                    res.str += charInput[i];
                }
            }
        }
        return res;
    }

    //parse answer, solution from json via index, shuffle position if true
    nextQ(qNo, rndSwitch) {
        let allQ = this.reader.allQuestion;
        let answerPos = "";
        let solution = "";
        let question = allQ[qNo].quiz;
        let answer = allQ[qNo].answer;
        let answerKey = Object.keys(answer);
        let answerVal = Object.values(answer);
        this.question = new Question();
        this.question.aShuffle = this.rnd.randPos(answerKey.length, rndSwitch.answer);
        this.question.question = question;
        this.question.answer = answerKey;
        this.question.possibility = answerKey.length;
        this.question.solution = answerVal;
        this.view.printQuestion(this.question.question);
        this.view.printAnswer(this.question.answer);
    }

    checkAnswer(input, solution) {
        let pts = 0;
        let right = 0;
        let inputArr = input.split("");
        console.log(input)
        console.log(solution)
        for (let i = 0; i < inputArr.length; i++) {
            if (solution.includes(inputArr[i])) {
                right++;
            } else {
                right--;
            }
        }
        pts = .25 * right;
        if (pts < 0) {
            pts = 0;
        }

        return pts;

    }

}