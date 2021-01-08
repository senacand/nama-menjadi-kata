document.addEventListener("DOMContentLoaded", event => {
    const nameTextField = document.querySelector("#name_textfield");
    const answerDiv = document.querySelector("#answer");

    let words = [];

    fetch("contents/daftar_kata.txt")
        .then(response => response.text())
        .then(text => {
            words = text.split("\n");
            showWord(nameTextField.value);
        });

    nameTextField.addEventListener("input", event => {
        showWord(nameTextField.value);
    });

    const getWord = name => {
        const totalWords = words.length;
        const nameWordNumber = wordToNumber(name.toLowerCase());
        const nameWordIndex = (((nameWordNumber % Math.floor(totalWords/26)) * Math.floor(totalWords/26)) + Math.floor(nameWordNumber / Math.floor(totalWords/26))) % totalWords; // Spreads the value throughout the word list so the result will not only show the first few words in the list.
        
        if(name == "" || totalWords == 0) {
            return ""
        }
        return words[nameWordIndex];
    };

    const showWord = name => {
        if(name == "") {
            answerDiv.innerHTML = "<b>🤔</b>"
        } else {
            const word = getWord(name);
            const kbbiEntryURL = `https://kbbi.kemdikbud.go.id/entri/${word}`;
            answerDiv.innerHTML = `Kata dari nama <b>${name}</b> adalah <b><a href="${kbbiEntryURL}" target="_blank">${word}</a></b>.`;
        }
    };

    const wordToNumber = word => 
        word
            .split("")
            .map(c => c.charCodeAt(0))
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
});