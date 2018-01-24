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
        this.resetInput = false;
        this.reader = new JSONFileReader();
        this.view = new View();
        this.rnd = new Shuffle();
        this.player = new Player();
        $("#charInput").prop("disabled", true);
        this.readFile();
        this.summary = [];
        this.firstInit();
        this.btnListener();
        this.i = 0;
        this.cnt = 0;
        this.letterStr = "";

    }

    firstInit() {
        this.letterStr = "";
        $("input[name='shuffle']").prop("disabled", false);
        $("#restart").prop("disabled", false);
        $("#charInput, #ok").prop("disabled", true);
        $("#readFile").prop("disabled", false);
        this.summary = [];
        this.view.printQuestion("");
        this.view.printAnswer("");
        this.view.printSolution("");
        this.view.printInfo("");
        this.view.printDelay("");
        this.view.printSum("");
        this.view.printEndRes(undefined);
    }

    btnListener() {

        $("#reset").on('click keypress', () => {
            if (confirm("Start a new quiz?") === true) {
                this.firstInit();
            }
        });
        //browse file to upload
        $("#readFile").on('change', () => {
            this.reader.jsonLoader((res) => {
                this.reader.allQuestion = JSON.parse(res);
            });
        });

        $("#ok, #charInput").on('click keypress', (e) => {
            this.view.errInfo("");
            if (e.keyCode === 13 || e.currentTarget.id === "ok") {
                this.parseNext();
            }
            $("#charInput").focus();
        });

        $("#charInput").on('click keyup', (e) => {
            this.enterAns();
        }).on('keypress', ()=>{
            if($("#charInput").val().length === 1 && this.question.solution.length === 1){
                $("#charInput").val("");
            }
        });

        $("#restart").on('click keypress', () => {
            this.view.errInfo("");
            //(re)start           
            var pName = prompt("Enter your name: ", "Player1");
            if (pName !== null) {
                $("#readFile").prop("disabled", true);
                $("input[name='shuffle']").prop("disabled", true);
                $("#restart").prop("disabled", true);
                this.avgPercent = 0;
                this.sumPercent = 0;
                this.player.score = 0;
                this.player.name = pName;
                $("#charInput, #ok").prop("disabled", false);
                this.start();
                this.view.printInfo(`${this.player.name}'s score: ${this.player.score}pts.`);
            }
        });
    }

    parseNext() {
        this.letterStr = "";
        $("#reset, #ok, #charInput").prop("disabled", true);
        if (this.i <= this.reader.allQuestion.length) {
            let valid = this.validation();
            if (!valid.excluded || this.i === 0) {
                let pts = this.checkAnswer(valid.str, this.question.solution, this.question.maxPts);
                $(".ansPos").off('click');
                this.startCount(5);
                let delayNext = setTimeout(() => {
                    this.view.printSum("");
                    this.player.score += pts.pts;
                    this.sumPercent += pts.percent;
                    this.avgPercent = this.sumPercent / this.reader.allQuestion.length;
                    this.summary.push({
                        input: valid.str,
                        solution: this.question.solution,
                        right: pts.right,
                        wrong: pts.wrong,
                        pts: pts.pts,
                        maxPts: this.question.maxPts,
                        percent: pts.percent,
                        avgPercent: this.avgPercent,
                        sumScore: this.player.score,
                        maxScore: this.question.maxScore
                    });
                    if (this.i !== this.reader.allQuestion.length) {
                        this.nextQ(this.shuffleQ[this.i]);
                        $("#reset, #ok, #charInput").prop("disabled", false);
                        this.view.printInfo(`${this.player.name}'s score: ${Math.round(this.player.score * 100) / 100}pts.`);
                    } else {
                        $("#reset").prop("disabled", false);
                        this.view.printInfo(`${this.player.name}'s final score: ${Math.round(this.player.score * 100) / 100}/${this.question.maxScore}`);
                        this.view.printEndRes(this.summary);
                    }
                    this.i++;
                }, 5000);
                this.view.printSum(`Your input: ${valid.str}\nSolution: ${this.question.solution}\nPoints: ${Math.round(pts.pts * 100) / 100}/${this.question.maxPts}`);
            } else {
                $("#reset, #ok, #charInput").prop("disabled", false);
                $(".ansPos").css("background-color", "transparent");
                this.view.errInfo(valid.str);
            }
        }
        $("#charInput").val("");
    }

    //highlight answers when using keyboard
    enterAns() {
        this.resetInput = true;        
        $(".ansPos").css("background-color", "transparent");
        for (let i = 0; i < this.question.solution.length; i++) {
            for (let j = 0; j < $("#charInput").val().length; j++) {
                if (this.question.possibility.includes($("#charInput").val()[j].toUpperCase())) {
                    $("#" + $("#charInput").val()[j].toUpperCase()).css("background-color", "lightgreen");
                }
            }
        }
    }

    //highlight answers when using mouse, reset input if keyboard used before
    clickAns(target) {
        if (this.resetInput) {
            $(".ansPos").css("background-color", "transparent");
            $("#charInput").val("");
            this.resetInput = false;
            this.letterStr = "";
        }  
        if(this.question.solution.length !== 1){
            if (this.letterStr.includes(target.getAttribute("value"))) {
                this.letterStr = this.letterStr.replace(new RegExp(target.getAttribute("value"), "g"), "");
                $(target).css("background-color", "transparent");
            } else {
                this.letterStr += target.getAttribute("value");
                $(target).css("background-color", "lightgreen");
            }
        }else{
            $(".ansPos").css("background-color", "transparent");  
            this.letterStr = target.getAttribute("value");
            $(target).css("background-color", "lightgreen");            
        }       
        $("#charInput").val(this.letterStr.split("").sort().join(""));
    }

    startCount(cnt) {
        this.view.printDelay(`Next question in: ${cnt}`);
        if (cnt !== 0) {
            setTimeout(() => {
                this.startCount(cnt);
            }, 1000);
        } else {
            this.view.printDelay("");
            $("#charInput").focus();
        }
        cnt--;
    }

    start() {
        this.i = 0;
        this.shuffleQ = this.rnd.randPos(this.reader.allQuestion.length, ($('#qShuffle').is(':checked')) ? true : false);
        this.nextQ(this.shuffleQ[this.i++]);
    }

    readFile() {
        this.reader.readJSON().done((res) => {
            this.reader.allQuestion = res;
        });
    }

    /**    
     * check if one or many char(s) from user is in the set of char(s) assigned to answers, else repeat input
     * filter double entered chars (aeeae => AE)    
     */
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

    //parse question, answer, solution from json via index, shuffle position if true
    nextQ(qNo) {
        let allQ = this.reader.allQuestion;
        let answerPos = "";
        let solution = "";
        let question = allQ[qNo].quiz;
        let answer = allQ[qNo].answer;
        let answerKey = Object.keys(answer);
        let answerVal = Object.values(answer);
        this.question = new Question();
        this.question.aShuffle = this.rnd.randPos(answerKey.length, ($('#aShuffle').is(':checked')) ? true : false);
        this.question.question = question;
        this.question.answer = answerKey;
        this.question.possibility = answerKey.length;
        this.question.solution = answerVal;
        this.question.maxPts = allQ[qNo].points;
        this.question.maxScore = allQ;
        this.view.printQuestion(this.question.question);
        this.view.printAnswer(this.question.answer);
        $(".ansPos").on('click', (e) => {
            this.clickAns(e.currentTarget);
            this.view.errInfo("");
        });
    }

    /**
     * grading system:
     * 
     * 100%: number of solutions
     * max. achievable pts per question: defined in quizfile
     * percentage per right answer (percentage/right answer): 100/number of solutions
     *  
     * per right answer: increment right
     * per wrong answer: increment wrong        
     * non-answered = no increment
     * 
     * sum = (percentage/right answer*(right - wrong)/100) * maxPts
     *  
     */
    checkAnswer(input, solution, maxPts) {
        let sum = {
            pts: 0,
            percent: 0,
            right: 0,
            wrong: 0
        }
        let perAnswer = 100 / solution.length;
        let inputArr = input.split("");
        for (let i = 0; i < inputArr.length; i++) {
            if (solution.includes(inputArr[i])) {
                sum.right++;
            } else {
                sum.wrong++;
            }
        }
        sum.percent = perAnswer * (sum.right - sum.wrong);
        sum.pts = sum.percent / 100 * maxPts;

        if (sum.pts < 0 || sum.percent < 0) {
            sum.percent = sum.pts = 0;
        }


        return sum;
    }

}