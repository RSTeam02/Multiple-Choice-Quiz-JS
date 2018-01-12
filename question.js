export class Question {

    constructor() {
        this._answer = "";
        this._solution = "";
        this._possibility = "";
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
            this._answer += `${String.fromCodePoint(this._AtoZ).toUpperCase()}: ${answer[this._aShuffle[x]]}\n`;
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
}