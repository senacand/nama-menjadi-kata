const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

String.prototype.hashCode = function(){
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var character = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

document.addEventListener("DOMContentLoaded", event => {
    const nameTextField = document.querySelector("#name_textfield");
    const answerDiv = document.querySelector("#answer");
    const definitionDiv = document.querySelector("#definition");

    let words = [];

    fetch("contents/daftar_kata.txt")
        .then(response => response.text())
        .then(text => {
            words = text.split("\n");
            showWord(nameTextField.value);
            console.log(words.length);
        });

    nameTextField.addEventListener("input", event => {
        showWord(nameTextField.value);
    });

    const getWord = name => {
        const totalWords = words.length;
        const nameWordNumber = Math.abs(name.toLowerCase().trim().hashCode()) % words.length;
        console.log(nameWordNumber);
        const nameWordIndex = (((nameWordNumber % Math.floor(totalWords/26)) * Math.floor(totalWords/26)) + Math.floor(nameWordNumber / Math.floor(totalWords/26))) % totalWords; // Spreads the value throughout the word list so the result will not only show the first few words in the list.
        
        if(name == "" || totalWords == 0) {
            return ""
        }
        return words[nameWordIndex];
    };

    const showWord = name => {
        definitionDiv.innerHTML = "<img src=\"images/Rolling-1s-31px.svg\" />";
        if(name == "") {
            answerDiv.innerHTML = "🤔";
            definitionDiv.style.display = "none";
        } else {
            const word = getWord(name);
            const kategloEntryURL = `https://kateglo.com/?mod=dictionary&action=view&phrase=${encodeURIComponent(word)}`;
            answerDiv.innerHTML = `Kata dari nama <b>${name}</b> adalah <b><a href="${kategloEntryURL}" target="_blank">${word}</a></b>.`;
            definitionDiv.style.display = "block";
            showWordDefinition(word);
        }
    };

    const showWordDefinition = debounce(word => {
        getWordDefinition(word)
            .then(definitions => {
                const definitionsList = definitions
                    .map(definition => `<li>${definition.definition}</li>`)
                    .join("");
                
                definitionDiv.innerHTML = `Definisi dari kata <b>${word}</b>:<ul>${definitionsList}</ul>`;
            })
            .catch(e => {
                const kbbiEntryUrl = `https://kbbi.kemdikbud.go.id/entri/${encodeURIComponent(word)}`;
                definitionDiv.innerHTML = `<a href="${kbbiEntryUrl}" target="_blank">Lihat definisi kata <b>${word}</b> di situs KBBI</a>`
            });
    }, 1000);

    const getWordDefinition = word => fetch(`https://jsonp.afeld.me/?url=${encodeURIComponent("https://kateglo.com/api.php?format=json&phrase="+word)}`)
        .then(response => response.json())
        .then(json => json.kateglo.definition.map(definition => {
            return {
                "phrase": definition["phrase"],
                "definition": definition["def_text"]
            }
        }));
});