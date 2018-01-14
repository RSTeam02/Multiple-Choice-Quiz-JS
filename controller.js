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
        $("#charInput").prop("disabled",true);       
        this.readFile();
        this.summary = [];
        this.btnListener();
        this.i = 0;
        this.cnt = 0;

    }

    btnListener() {
        $("#restart, #charInput, #reset").on('click keypress', (e) => {
            let rndSwitch = {
                allQuestion: ($('#qShuffle').is(':checked')) ? true : false,
                answer: ($('#aShuffle').is(':checked')) ? true : false
            };

            //reset
            if (e.currentTarget.id === "reset") {
                if(confirm("Start a new quiz?") === true){
                    $("input[name='shuffle']").prop("disabled", false);
                    $("#restart").prop("disabled",false);
                    this.view.printQuestion("");           
                    this.view.printAnswer("");             
                    this.view.printSolution("");                 
                    this.view.printInfo("");             
                    this.view.printDelay("");            
                    this.view.printSum("");         
                    this.view.printEndRes(null);
                    $("#charInput").prop("disabled",true);                   
                }               
            }
            
            //start
            if (e.currentTarget.id === "restart") {
                $("input[name='shuffle']").prop("disabled", true);
                $("#restart").prop("disabled",true);
                var pName = prompt("Enter your name: ", "Player1");
                if (pName !== null) {                
                    this.player.score = 0;
                    this.player.name = pName;
                    $("#charInput").prop("disabled",false);
                    this.start(rndSwitch);
                    this.view.printInfo(`${this.player.name}'s score: ${this.player.score}pts.`);              
                }
            }
            //parse next       
            if (e.which == 13) {
                $("#charInput").prop("disabled",true);
                if (this.i <= this.reader.allQuestion.length) {
                    let valid = this.validation();
                    if (!valid.excluded || this.i === 0) {
                        let pts = this.checkAnswer(valid.str, this.question.solution)
                        this.startCount(5);
                        let delayNext = setTimeout(() => {
                            this.view.printSum("");
                            this.player.score += pts.pts;
                            this.summary.push({
                                input: valid.str,
                                solution: this.question.solution,
                                right: pts.right,
                                wrong: pts.wrong,
                                pts: pts.pts,
                                maxPts: this.question.maxPts,
                                sumScore: this.player.score,
                                maxScore: this.question.maxScore
                            });
                            if (this.i !== this.reader.allQuestion.length) {
                                this.nextQ(this.shuffleQ[this.i], rndSwitch);
                                $("#charInput").prop("disabled",false);
                                this.view.printInfo(`${this.player.name}'s score: ${this.player.score}pts.`);
                            } else {                               
                                this.view.printInfo(`${this.player.name}'s final score: ${this.player.score}/${this.question.maxScore}`);
                                this.view.printEndRes(this.summary);
                            }
                            this.i++;
                        }, 5000);
                        this.view.printSum(`Your input: ${valid.str}\nSolution: ${this.question.solution}\nPoints: ${pts.pts}/${this.question.maxPts}`);
                        
                    } else {
                        $("#charInput").prop("disabled",false);
                        this.view.printInfo(valid.str);
                    }
                }                
                $("#charInput").val("");
            }
        });
    }

    startCount(cnt) {
        this.view.printDelay(`Next question in: ${cnt}`);
        if (cnt !== 0) {
            setTimeout(() => {
                this.startCount(cnt);
            }, 1000);
        } else {
            document.getElementById("charInput").focus();
            this.view.printDelay("");
        }
        cnt--;
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
        this.question.maxPts = answerVal;
        this.question.maxScore = allQ;
        this.view.printQuestion(this.question.question);
        this.view.printAnswer(this.question.answer);
    }

    checkAnswer(input, solution) {
        let sum = {
            pts: 0,
            right: 0,
            wrong: 0
        }
        let inputArr = input.split("");
        for (let i = 0; i < inputArr.length; i++) {
            if (solution.includes(inputArr[i])) {
                sum.right++;
            } else {
                sum.wrong++;
            }
        }
        sum.pts = .25 * (sum.right - sum.wrong);
        if (sum.pts < 0) {
            sum.pts = 0;
        }
        return sum;
    }

}