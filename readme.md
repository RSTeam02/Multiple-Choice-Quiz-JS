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

14.1.:
+ player input triggered on input text with enter (keycode 13)
+ after every answered question show result: player input/solution and achieved/max points with a delay of ~5secs, then goto next quiz
+ summarize player's score with player's achieved/max achievable score 

classes:
+ Player: set/get player name and score (12.1)
+ Question: question object with question, answer, solution possibilities attributes as string (12.1)
+ Controller: create new question instance for each question loaded from json fileloader, create player with name and current score, input validation: check if certain char is in solution string, prevent double chars DDDAAABBB => ABD, score rules: 0.25 points per right answer, -0.25 points per wrong answer, 0 pts per no answer (12.1)
+ JSONFileReader: get json from file 
+ Shuffle: shuffle quiz, answer orders. (Yates shuffle)
+ View: print current question with answers as preformatted text in html

github testlink:
https://rsteam02.github.io/Multiple-Choice-Quiz-JS/