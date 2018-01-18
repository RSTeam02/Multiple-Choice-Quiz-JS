# Multiple Choice Quiz in JavaScript (ECMAScript)

The same task is already implemented in C/C++, now written in an OO language like JS (ECMAScript). The questions are now stored in an array of structured JSON objects as *.json.

structure:
```
[
    {
        "quiz": "99 is equal to:",
        "answer": {
            "3*30+3²": "+",
            "2*33": "-",
            "11*9": "+"
        }
    },...
]  
```

progress:

18.1.:
+ browse/load custom json quizfile from local disk 
+ structure (see above of quizfile.json)  

16.1.:
+ include click listener with tracking devices (mouse, touchscreen)
+ answer possibilities now as clickable table row elements
+ repeat click of same element like a switch to include/exclude given answer

14.1.:
+ trigger player input text with enter (keycode 13)
+ return result after each answered question: player input/solution and achieved/max points with a delay of ~5secs, then goto next quiz
+ resume input, achieved points of every question and compare with solution (15.1)
+ compare sum of achieved score with max achievable score at the end of game (15.1)

classes:
+ Player: set/get player name and score (12.1)
+ Question: question object with question, answer, solution possibilities attributes as string (12.1)
+ Controller: create new question instance for each question loaded from json fileloader, create player with name and current score, input validation: check if certain char is in solution string, prevent double chars DDDAAABBB => ABD, score rules: 0.25 points per right answer, -0.25 points per wrong answer, 0 pts per no answer (12.1)
+ JSONFileReader: get json from file 
+ Shuffle: shuffle quiz, answer orders. (Yates shuffle)
+ View: print current question with answers as preformatted text in html

github testlink:
https://rsteam02.github.io/Multiple-Choice-Quiz-JS/