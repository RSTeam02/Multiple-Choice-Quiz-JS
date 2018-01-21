export class Player{


    set score(score){
        this._score = score;
    }

    get score(){
        return Math.round(this._score * 100)/100;
    }

    set name(name){
        this._name = name;
    }

    get name(){
        return this._name;
    }


}