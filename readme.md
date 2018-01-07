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
+ Controller: parse all objects via idx, print question once at time => html preformatted text
+ JSONFileReader: get json from file 
+ Shuffle: shuffle quiz, answer orders. (Yates shuffle)
+ View: print current question with answers as preformatted text in html

github testlink:
https://rsteam02.github.io/Multiple-Choice-Quiz-JS/