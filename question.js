export class Question {

    constructor() {
        this._answer = "";
        this._solution = "";
        this._possibility = "";
        this._maxPts = 0;
        this._maxScore = 0;
    }


    set aShuffle(aShuffle) {
        this._aShuffle = aShuffle;
    }

    set question(question) {
        this._question = question;
    }

    get question() {
        return this._question;
    }

    set answer(answer) {
        this._AtoZ = 0x0061;
        for (let x = 0; x < answer.length; x++) {
            let decodeAZ = String.fromCodePoint(this._AtoZ).toUpperCase();
            this._answer += `<tr><td class="ansPos" value="${decodeAZ}">${decodeAZ}: ${answer[this._aShuffle[x]]}</td><tr>`;
            this._AtoZ++;
        }
    }

    get answer() {
        return this._answer;
    }

    set possibility(answerLen) {
        this._AtoZ = 0x0061;
        for (let x = 0; x < answerLen; x++) {
            this._possibility += String.fromCodePoint(this._AtoZ).toUpperCase();
            this._AtoZ++;
        }
    }

    get possibility() {
        return this._possibility;
    }
    set solution(solution) {
        this._AtoZ = 0x0061;
        for (let x = 0; x < solution.length; x++) {
            if (solution[this._aShuffle[x]] === '+') {
                this._solution += String.fromCodePoint(this._AtoZ).toUpperCase();
            }
            this._AtoZ++;
        }
    }

    get solution() {
        return this._solution;
    }

    set maxPts(solution) {
        for (let x = 0; x < solution.length; x++) {
            if (solution[this._aShuffle[x]] === '+') {
                this._maxPts += .25;
            }
        }
    }

    get maxPts() {
        return this._maxPts;
    }

    set maxScore(allQ) {        
        for (let x = 0; x < allQ.length; x++) {
            let answerVal = Object.values(allQ[x].answer);                     
            for (let y = 0; y < answerVal.length; y++) {           
                if (answerVal[y] === '+') {
                    this._maxScore += .25;                   
                }
            }
        }
    }

    get maxScore() {
        return this._maxScore;
    }
}