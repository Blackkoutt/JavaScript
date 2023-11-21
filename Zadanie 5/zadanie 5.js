// Zadanie 1
function RandomColor(){
    const colors_tab = [
        "red",
        "orange",
        "green",
        "cyan",
        "pink",
        "yellow",
        "brown"
    ]
    let color_index = Math.floor(Math.random()*(colors_tab.length-1));
    return colors_tab[color_index];
}

function SetParagraphColor(p){
    p.style.color=RandomColor();
}

// Zadanie 2
function SetParagraphAtribute(p, i){
    p.setAttribute("title",`To ${i+1} paragraf. Długość: ${p.textContent.length}`)
}




// Zadanie 3
function resetClick(){
    let paragraphs = document.querySelectorAll(".outer_div > p");
    paragraphs.forEach(p=>{
        p.style.border="none";
        p.style.backgroundColor="rgb(43, 42, 102)";
    })
}
function SetParagraphOnClickListener(node, i, div){
    node.onclick=()=>{
        resetClick();
        node.style.border="3px solid green";

        let nextNode = node.nextElementSibling;
        while (nextNode && nextNode.tagName !== "P") {
            nextNode = nextNode.nextElementSibling;
        }
        if(node!==div.lastElementChild){
            nextNode.style.border="3px solid blue"
        }   
        if(node!==div.firstElementChild.nextElementSibling){
            let prevNode = node.previousElementSibling;
            while (prevNode && prevNode.tagName !== "P") {
                prevNode = prevNode.previousElementSibling;
            }
            prevNode.style.border="3px solid orange"
        }

        if(i%2==0){
            node.style.backgroundColor="#4f4e4f";
        }
        else{
            node.style.backgroundColor="#949494"
            
        }
        
    }
}


// Zadanie 4
function AddParagraphHeader(p, i, div){
    let header = document.createElement("H3");
    header.textContent=`Paragraf ${i+1}`;
    div.insertBefore(header, p);
}


// Zadanie 5
function AddHeaderOnClickListener(h){
    h.onclick=()=>{
        if (h.nextElementSibling.style.display === "none") {
            h.nextElementSibling.style.display = "block";
        } else {
            h.nextElementSibling.style.display = "none";
        }
    }
}


// Zadanie 6
function AddForm(){
    const form_div = document.querySelector(".form-div")
    let label_header = document.createElement("label");
    label_header.textContent="Nagłówek: ";
    let input_header = document.createElement("input");
    let label_paragraph = document.createElement("label");
    label_paragraph.textContent="Paragraf: ";
    let input_paragraph = document.createElement("input");
    form_div.appendChild(label_header);
    form_div.appendChild(input_header);
    form_div.appendChild(label_paragraph);
    form_div.appendChild(input_paragraph);
    let submit = document.createElement("button");
    submit.textContent="Utwórz";
    form_div.appendChild(submit);
    submit.onclick=()=>{
        if(input_header.value.trim()===""||input_paragraph.value.trim()===""){
            PrintError();
        }
        else{
            AddNewParagraph(input_header.value, input_paragraph.value);
            input_header.value ="";
            input_paragraph.value="";
        }
    }
}
function PrintError(){
    const error = document.querySelector(".error");
    error.textContent = "Błąd! Nie można dodać pustego nagłówka lub paragrafu.";
        setTimeout(() => {
            error.textContent = "";
        }, 1500);
}
function AddNewParagraph(input_header, input_paragraph){
    const div = document.querySelector(".outer_div");
    let paragraphs = document.querySelectorAll(".outer_div > p");

    let header = document.createElement("H3");
    header.textContent=input_header; 
    div.appendChild(header);  
    let paragraph = document.createElement("P");
    paragraph.textContent=input_paragraph;   
    div.appendChild(paragraph);

    
    SetParagraphColor(paragraph);
    SetParagraphAtribute(paragraph, paragraphs.length);
    SetParagraphOnClickListener(paragraph, paragraphs.length, div);
    AddHeaderOnClickListener(header);
}


window.onload=()=>{
    let paragraphs = document.querySelectorAll(".outer_div > p");
    const div = document.querySelector(".outer_div");
    paragraphs.forEach((p, i)=>{
        SetParagraphColor(p);
        SetParagraphAtribute(p, i);
        SetParagraphOnClickListener(p, i, div);
        AddParagraphHeader(p, i, div);
    })
    const headers = document.querySelectorAll("h3");
    headers.forEach(h=>{
        AddHeaderOnClickListener(h);
    });
    AddForm();
}
