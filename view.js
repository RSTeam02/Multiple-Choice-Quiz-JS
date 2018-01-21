export class View {

    printQuestion(str) {
        $("#question").html(str);
    }


    printAnswer(str) {
        $("#answer").html(str);
    }

    printSolution(str) {
        $("#solution").html(str);
    }

    printInfo(str) {
        $("#info").html(str);
    }

    errInfo(str) {
        $("#errInfo").html(str);
    }

    printDelay(str) {
        $("#cntDelay").html(str);
    }

    printSum(str) {
        $("#summary").html(str);
    }

    printEndRes(strArr) {
        let str = "";
        if (strArr !== undefined) {
            str += `<tr>
            <th>Question</th>
            <th>Input</th> 
            <th>Solution</th> 
            <th>Right</th> 
            <th>Wrong</th>
            <th>Solved</th>
            <th>Score</th>
        </tr>`;

            for (let i = 0; i < strArr.length; i++) {
                str += `<tr>
                    <td>Q${i + 1}</td>
                    <td>${strArr[i].input}</td> 
                    <td>${strArr[i].solution}</td> 
                    <td>${strArr[i].right}/${strArr[i].solution.length}</td> 
                    <td>${strArr[i].wrong}</td>
                    <td>${Math.round(strArr[i].percent * 100) / 100}%</td>
                    <td>${Math.round(strArr[i].pts * 100) / 100}/${strArr[i].maxPts}</td>
                </tr>`;
                if (i === strArr.length - 1) {
                    str += `<tr>                
                        <td>Total</td>
                        <td colspan="4%"></td>
                        <td>${Math.round(strArr[i].avgPercent * 100) / 100}%</td>
                        <td>${Math.round(strArr[i].sumScore * 100) / 100}/${strArr[i].maxScore}</td>
                    </tr>`;
                }
            }
        }

        $("#endResult").html(str);
    }

}