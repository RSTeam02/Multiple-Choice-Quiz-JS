export class View{

    printQuestion(str){
        $("#question").html(str);
    }


    printAnswer(str){
        $("#answer").html(str);
    }

    printSolution(str){
        $("#solution").html(str);
    }

    printInfo(str){
        $("#info").html(str);
    }

    printDelay(str){
        $("#cntDelay").html(str);
    }

    printSum(str){
        $("#summary").html(str);
    }

}