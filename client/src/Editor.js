import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-java'

const axios = require('axios')

let editor;

window.onload = function () {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/python");
}

function changeLanguage() {

    let language = $("#languages").val();

    if (language == 'python') {
        editor.session.setMode("ace/mode/python");
    }
    else if (language == 'java') {
        editor.session.setMode("ace/mode/java");
    }

}

window.addEventListener("load", function () {
    document.getElementById("languages").addEventListener("change", changeLanguage);
})

function saveCode() {

    var language = 'py';
    if ($("#languages").val() == 'python') {
        language = 'py';
    } else if ($("#languages").val() == 'java') {
        language = 'java';
    }

    axios.post('http://localhost:8000/save', {
        language: language,
        code: editor.getSession().getValue(),
        file_name: $("#file_name").val()
    })

}

window.addEventListener("load", function () {
    document.getElementById("save").addEventListener("click", saveCode);
})

function checkCode() {

    axios.post('http://localhost:8000/check', {
        text: editor.getSession().getValue()
    })
        .then(function (response) {
            console.log(response.data);
            var result = [];

            for(var i in response.data)
                result.push([i, response.data[i]]); 

            var resultOutput = [];

            console.log(result.length)
            for(let j = 0; j < result.length; j++) {
                console.log(j)
                var num = j+1;
                resultOutput.push(num + ": " + JSON.stringify(result[j][1]));
            }

            var str = ''

            resultOutput.forEach(function(resultValue) {
                str += '<div class="check-output">'+ resultValue + '</div>';
            });

            document.getElementById("check-output").innerHTML = str;

            // document.getElementById("check-output1").innerHTML = resultValue[0];
            // document.getElementById("check-output2").innerHTML = resultValue[1];
            // document.getElementById("check-output3").innerHTML = resultValue[2];
            // document.getElementById("check-output4").innerHTML = resultValue[3];
        })
        .catch(function (error) {
            console.log(error);
        });
}

window.addEventListener("load", function () {
    document.getElementById("check").addEventListener("click", checkCode);
})