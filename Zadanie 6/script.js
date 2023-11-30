let id = +FindMaxID()+1; // ID elementu
console.log("nowe id", id);

// Funkcja wyszukująca nowe nowe id dla elementu 
function FindMaxID(){
    let maxId = 0;
    for(let i=0;i<localStorage.length;i++){
        if(+localStorage.key(i)>maxId){
            maxId=+localStorage.key(i);
        }
    }
    return maxId;
}


// Klasa reprezentująca element paragonu
class Element{
    constructor(name, quantity, price){
        this.name=name;
        this.quantity=quantity;
        this.price = price;
    }
}

// Funkcja dodająca element do localStorage
function AddElementToStorage(element){
    localStorage.setItem(id, JSON.stringify(element));
    id+=1;
}


// Funkcja dodająca przykładowe elementy do paragonu
function AddDefaultElements(){
    const elements =
    [
        new Element("Jabłka", 1.5, 4.90),
        new Element("Bułka", 5, 0.49),
    ];
    elements.forEach(elem =>{
        AddElementToStorage(elem);
        AddNewNode(id-1,localStorage.getItem(id-1));
    });
}


// Funkcja dodająca element z localStorage do struktury HTML
function AddNewNode(ID,elem){
    const element = JSON.parse(elem);
    //const ID = id-1;

    // Dodanie nowego wiersza tabeli
    const row = document.createElement("TR");
    const table_body = document.querySelector(".list");
    table_body.appendChild(row);

    // Dodanie odpowiednich kolumn z wartościami
    let column = document.createElement("TD");
    column.textContent=ID;
    row.appendChild(column);

    for (const [key, value] of Object.entries(element)) {
        column = document.createElement("TD");
        if(key==='price'){
            column.textContent=`${value} zł`;
        }
        else{
            column.textContent=value;
        }
        
        row.appendChild(column);
    }
    column = document.createElement("TD");
    column.classList.add("product_sum");
    column.textContent=`${(element.quantity*element.price).toFixed(2)} zł`;
    row.appendChild(column);

    // Utworzenie przycisków "Modyfikuj" oraz "Usuń" dla nowego elementu
    CreateButtons(row);   
}


// Funkcja tworząca przyciski "Modyfikuj" oraz "Usuń" dla nowego elementu
function CreateButtons(row){  
    // Utworzenie nowej kolumny 
    let column = document.createElement("TD");
    column.classList.add("buttons");
    row.appendChild(column);

    // Utworzenie przycisku "Modyfikuj"
    let modifyButton = document.createElement("BUTTON");
    modifyButton.textContent = "Modyfikuj";
    modifyButton.classList.add("modify");
    // Dodanie obsługi zdarzenia onClick
    modifyButton.onclick = (event) => {
        ModifyProduct(event);
    };
    column.appendChild(modifyButton);

    // Utworzenie przycisku "Usuń"
    let deleteButton = document.createElement("BUTTON");
    deleteButton.textContent = "Usuń";
    deleteButton.classList.add("delete");
    // Dodanie obsługi zdarzenia onClick
    deleteButton.onclick = (event) => {
        DeleteProduct(event);
    };
    column.appendChild(deleteButton);
}


// Funkcja wyświetlająca okno dialogowe do modyfikacji wybranego produktu
function ModifyProduct(event){
    // event.target - kliknięty przycisk modyfikuj
    // event.target.parentNode - kolumna w której znajduje się ten przycisk 
    // event.target.parentNode.parentNode - wiersz w którym znajduje się ten przycisk
    const row = event.target.parentNode.parentNode;

    // Pobranie z wybranego wiersza pierwszej kolumny - id
    const id = row.querySelector("td").textContent;

    // Pobranie elementu o danym id z localStorage
    const item = JSON.parse(localStorage.getItem(id));

    // Utworzenie okna dialogowego - wpisanie wartości w pola formularza
    const dialog = document.querySelector(".add_modify");
    const p = dialog.querySelector("p");
    p.style.display="none";
    const nameInput = dialog.querySelector("input[name=name]");
    const quantityInput = dialog.querySelector("input[name=quantity]");
    const priceInput = dialog.querySelector("input[name=price]");
    nameInput.value=item.name;
    quantityInput.value=item.quantity;
    priceInput.value=item.price;
    dialog.showModal(); // Wyświetlenie okna dialogowego
  
    // Nasłuchiwanie zdarzenia onReset - kliknięcie przycisku "Anuluj"
    dialog.onreset=()=>{
        dialog.close();
    }

    // Nasłuchiwanie zdarzenia onSubmit - kliknięcie przycisku "Zatwierdź"
    dialog.onsubmit=(event)=>{
        p.style.display="none";

        // Walidacja
        try{
            FormValidate(dialog);
        }
        catch(error){
            p.style.display="block";
            p.style.color="red";
            p.textContent=error.message;
            console.log(error.message);

            // Przerwij obsługę zdarzenia onSubmit - nie przesyłaj formularza
            event.preventDefault();
            return;
        }
        
        // Jeśli walidacja pomyślna - zmień wartość w localStorage i zaktualizuj widok
        const quantity = quantityInput.value.split(".")[1]?.length>2 ? parseFloat(quantityInput.value).toFixed(2) : quantityInput.value;
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(new Element(
            nameInput.value,
            quantity,
            parseFloat(priceInput.value).toFixed(2)
        )));
        console.log("Zmodyfikowany element w localStorage", JSON.parse(localStorage.getItem(id)));
        
        // UpdateWidoku
        UpdateViewAfterModify(id, row);
    }
}


// Funkcja walidująca formularz
function FormValidate(dialog){
    const nameInput = dialog.querySelector("input[name=name]").value;
    const quantityInput = dialog.querySelector("input[name=quantity]").value;
    const priceInput = dialog.querySelector("input[name=price]").value;

    if(nameInput.trim()===''){
        throw Error("Nazwa nie może być pusta.");
    }
    if(!Number(quantityInput)||quantityInput<=0){
        throw Error("Ilość musi być wartością liczbową różną od zera.");
    }
    if(!Number(priceInput)||priceInput<=0){
        throw Error("Cena musi być wartością liczbową różną od zera.");
    }
}


// Funkcja aktualizująca widok paragonu po wykonanej modyfikacji
function UpdateViewAfterModify(id, row){
    const columns = row.querySelectorAll("td");
    const element = JSON.parse(localStorage.getItem(id));
    
    columns[1].textContent=element.name;
    columns[2].textContent=element.quantity;
    columns[3].textContent=`${element.price} zł`;
    columns[4].textContent=`${(element.quantity*element.price).toFixed(2)} zł`;

    SetSum(); // Obliczenie całkowitej sumy
}


// Funkcja usuwająca dany element paragonu
function DeleteProduct(event){
    // Dostosowanie okna dialogowego
    const dialog = document.querySelector(".delete_dialog");
    const info = dialog.querySelector("p"); 
    const row = event.target.parentNode.parentNode;
    const id = row.querySelector("td").textContent;
    const item = JSON.parse(localStorage.getItem(id));
    info.textContent=`Czy napewno chcesz usunąć produkt "${item.name}" o id ${id} ?`;
    dialog.showModal();

    // Nasłuchiwanie zdarzenia onReset - zamknięcie okna dialogowego "Anuluj"
    dialog.onreset=()=>{
        dialog.close();
    }

    // Nasłuchiwanie zdarzenia onSubmit - usunięcie elementu "Usuń"
    dialog.onsubmit=()=>{
        console.log("Element usuwany z localStorage: ", JSON.parse(localStorage.getItem(id)));
        console.log("Ilość elementów w localStorage przed usunięciem ", localStorage.length);
        localStorage.removeItem(id); // Usunięcie elementu z localStorage
        console.log("Ilość elementów w localStorage po usunięciu ", localStorage.length);
        row.remove(); // Usunięcie elementu z HTML
        SetSum();   // Aktualizacja całkowitej sumy
    }
}


// Funkcja dodająca przycisk "Dodaj" do HTML
function CreateAddButton(){
    const button = document.createElement("BUTTON");
    button.textContent="Dodaj";
    button.classList.add("add_button")
    const div = document.querySelector(".button_div");
    div.appendChild(button);

    // Nasłuchiwanie zdarzenia onClick 
    button.onclick=()=>{
        AddNewElement();
    }
}

// Funkcja wyświetlająca okno dialogowe do dodania nowego elementu
function AddNewElement(){
    // Pobranie elementów okna dialogowego
    const dialog = document.querySelector(".add_modify");
    const p = dialog.querySelector("p");
    p.style.display="none";
    const nameInput = dialog.querySelector("input[name=name]");
    const quantityInput = dialog.querySelector("input[name=quantity]");
    const priceInput = dialog.querySelector("input[name=price]");
    dialog.showModal();
  
    // Nasłuchiwanie zdarzenia onReset - zamknięcie okna dialogowego "Anuluj"
    dialog.onreset=()=>{
        dialog.close();
    }
    // Nasłuchiwanie zdarzenia onSubmit - przesłanie formularza "Zatwierdź"
    dialog.onsubmit=(event)=>{
        p.style.display="none";

        // Walidacja formularza
        try{
            FormValidate(dialog);
        }
        catch(error){
            p.style.display="block";
            p.style.color="red";
            p.textContent=error.message;
            // Przerwanie obsługi zdarzenia onClick w przypadku niepoprawnych danych
            event.preventDefault();
            return;
        }
        const quantity = quantityInput.value.split(".")[1]?.length>2 ? parseFloat(quantityInput.value).toFixed(2) : quantityInput.value;
        // Dodanie nowego elementu do localStorage
        AddElementToStorage(new Element(
            nameInput.value,
            quantity,
            parseFloat(priceInput.value).toFixed(2)
        ));
        console.log("Element dodany do localStorage:", localStorage.getItem(id-1))
        AddNewNode(id-1,localStorage.getItem(id-1)); // Dodanie nowego elementu do HTML
        SetSum(); // Podliczenie całkowitej sumy
    }
}


// Funkcja obliczająca całkowitą sumę paragonu
function SetSum(){
    // Pobranie wszytkich sum częściowych
    const elements_sum = document.querySelectorAll(".product_sum");

    let total_sum = 0;
    elements_sum.forEach(sum=>{
        let element_sum = +sum.textContent.slice(0,-2); // Bez końcówki "zł"
        total_sum+=element_sum;
    });

    // Aktualizacja całkowitej sumy
    const total_sum_elem = document.querySelector("#total_sum");
    total_sum_elem.textContent=`${total_sum.toFixed(2)} zł`;
}

// Funkcja pobierająca wszytskie elementy z localStorage
function GetAllElements(){
    console.log("Początkowa zawartość localStorage: ");
    for(let i=0;i<localStorage.length;i++){
        console.log(JSON.parse(localStorage.getItem(localStorage.key(i))));
        AddNewNode(localStorage.key(i),localStorage.getItem(localStorage.key(i)));
    }
}

// Przy załadowaniu okna
window.onload = ()=>{
    //localStorage.clear();
    CreateAddButton(); // Dodaj przycisk Add
    GetAllElements();
    // AddDefaultElements();
    SetSum(); // Dodaj całkowitą sumę paragonu
}