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
        this.btnListener();
        this.i = 0;
        this.cnt =0;

    }

    btnListener() {
        $("#restart, #charInput").on('click keypress' , (e) => {
            let rndSwitch = {
                allQuestion: ($('#qShuffle').is(':checked')) ? true : false,
                answer: ($('#aShuffle').is(':checked')) ? true : false
            };
            //reset
            if (e.currentTarget.id === "restart") {                
                var pName = prompt("Enter your name: ", "Player1");
                if (pName !== null || player !== "") {
                    this.player.score = 0;
                    this.player.name = pName;
                    this.view.printInfo(`${this.player.name}'s score: ${this.player.score}pts.`);
                    this.start(rndSwitch);
                    
                }
            }
            //parse next       
            if (e.which ==13) {
                
                if (this.i <= this.reader.allQuestion.length) {
                    let valid = this.validation();
                    if (!valid.excluded || this.i === 0) {
                        let pts = this.checkAnswer(valid.str, this.question.solution)                       
                        this.startCount(5);
                        let delayNext = setTimeout(()=>{
                            this.view.printSum("");
                            this.player.score += pts;
                            if (this.i !== this.reader.allQuestion.length) {
                                this.nextQ(this.shuffleQ[this.i], rndSwitch);
                                this.view.printInfo(`${this.player.name}'s score: ${this.player.score}pts.`);
                            } else {
                                this.view.printInfo(`${this.player.name}'s final score: ${this.player.score}/${this.question.maxScore}`);
                            }
                            this.i++;
                        }, 5000);
                        this.view.printSum(`Your input: ${valid.str}\nSolution: ${this.question.solution}\nPoints: ${pts}/${this.question.maxPts}`);
                       
                    } else {
                        this.view.printInfo(valid.str);
                    }
                }
                document.getElementById("charInput").focus();                
                $("#charInput").val("");
            }
        });
    }

    startCount(cnt){      
        this.view.printDelay(`Next question in: ${cnt}`);        
        if(cnt!==0){  
            setTimeout(()=>{
                this.startCount(cnt);
            }, 1000);
        }else{
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
        let pts = 0;
        let right = 0;
        let inputArr = input.split("");        
        for (let i = 0; i < inputArr.length; i++) {       
            right += (solution.includes(inputArr[i])) ? 1 : -1;
        }
        pts = .25 * right;
        if (pts < 0) {
            pts = 0;
        }
        return pts;
    }

}