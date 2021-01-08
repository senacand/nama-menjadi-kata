document.addEventListener("DOMContentLoaded", function(event) {
    const nameTextField = document.querySelector("#name_textfield");
    const answerDiv = document.querySelector("#answer");

    let words = [];

    fetch("daftar_kata.txt")
        .then(response => response.text())
        .then(text => {
            words = text.split("\n");
        });

    nameTextField.addEventListener("input", function(event) {
        showWord(nameTextField.value);
    });

    const getWord = name => {
        const totalWords = words.length;
        const nameWordNumber = wordToNumber(name);
        const nameWordIndex = (((nameWordNumber % Math.floor(totalWords/26)) * Math.floor(totalWords/26)) + Math.floor(nameWordNumber / Math.floor(totalWords/26))) % totalWords;
        
        if(name == "" || totalWords == 0) {
            return ""
        }
        return words[nameWordIndex];
    };

    const showWord = name => {
        answerDiv.innerHTML = `Kata dari nama <b>${name}</b> adalah <b>${getWord(name)}</b>`;
    };

    const wordToNumber = word => 
        word
            .split("")
            .map(c => c.charCodeAt(0))
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
});