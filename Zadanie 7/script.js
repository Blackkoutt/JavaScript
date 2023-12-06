let ID = 0;

// Klasa reprezentująca element paragonu
class Element{
    constructor(id, name, quantity, price){
        this.id=id;
        this.name=name;
        this.quantity=quantity;
        this.price = price;
    }
}


// Funkcja dodająca element do db.json
function AddNewNode(element){

    // Dodanie nowego wiersza tabeli
    const row = document.createElement("TR");
    const table_body = document.querySelector(".list");
    table_body.appendChild(row);

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
    const id = row.querySelector("td");
    // Pobranie kolejnych kolumn
    const name = id.nextElementSibling;
    const quantity = name.nextElementSibling;
    const price = quantity.nextElementSibling;

    // Utworzenie okna dialogowego - wpisanie wartości w pola formularza
    const dialog = document.querySelector(".add_modify");
    const p = dialog.querySelector("p");
    p.style.display="none";
    const nameInput = dialog.querySelector("input[name=name]");
    const quantityInput = dialog.querySelector("input[name=quantity]");
    const priceInput = dialog.querySelector("input[name=price]");
    nameInput.value=name.textContent;
    quantityInput.value=quantity.textContent;
    priceInput.value=price.textContent.slice(0,-3); // bez "zł"

    dialog.showModal(); // Wyświetlenie okna dialogowego
  
    // Nasłuchiwanie zdarzenia onReset - kliknięcie przycisku "Anuluj"
    dialog.onreset=()=>{
        dialog.close();
    }

    // Nasłuchiwanie zdarzenia onSubmit - kliknięcie przycisku "Zatwierdź"
    dialog.onsubmit=async(event)=>{
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
        
        // Jeśli walidacja pomyślna - zmień wartość w db.json i zaktualizuj widok
        const quantity = quantityInput.value.split(".")[1]?.length>2 ? parseFloat(quantityInput.value).toFixed(2) : quantityInput.value;
        const editProduct = new Element(
            id.textContent,
            nameInput.value,
            parseFloat(quantity),
            parseFloat(parseFloat(priceInput.value).toFixed(2))
        );

        
        try{
            // Zmiana wartości w db.json
            await Update(editProduct);
        
            // UpdateWidoku
            UpdateViewAfterModify(editProduct, row);
        }
        catch(error){
            console.log("Błąd: ", error)
            const error_div = document.querySelector(".error_message");
            error_div.firstChild.textContent = "Wystąpił błąd podczas modyfikacji elementu. Sprawdź logi konsoli aby uzyskać więcej informacji."
            error_div.style = "display:block;";
            setTimeout(()=>{
                error_div.style = "display:none;";
            },5000);
        }
        
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
function UpdateViewAfterModify(editProduct, row){
    const columns = row.querySelectorAll("td");
    
    columns[1].textContent=editProduct.name;
    columns[2].textContent=editProduct.quantity;
    columns[3].textContent=`${editProduct.price} zł`;
    columns[4].textContent=`${(editProduct.quantity*editProduct.price).toFixed(2)} zł`;

    SetSum(); // Obliczenie całkowitej sumy
}


// Funkcja usuwająca dany element paragonu
function DeleteProduct(event){
    // Dostosowanie okna dialogowego
    const dialog = document.querySelector(".delete_dialog");
    const info = dialog.querySelector("p"); 
    const row = event.target.parentNode.parentNode;
    let id = row.querySelector("td");
    let name = id.nextElementSibling.textContent;
    id=id.textContent;
    
    info.textContent=`Czy napewno chcesz usunąć produkt "${name}" o id ${id} ?`;
    dialog.showModal();

    // Nasłuchiwanie zdarzenia onReset - zamknięcie okna dialogowego "Anuluj"
    dialog.onreset=()=>{
        dialog.close();
    }

    // Nasłuchiwanie zdarzenia onSubmit - usunięcie elementu "Usuń"
    dialog.onsubmit=async()=>{
        
        try{
            await Delete(id); // Usunięcie elementu z db.json
            // Jeśli jest to ostatni element listy zmiejsz ID o 1
            if(+id===ID){
                ID--;
            }
            row.remove(); // Usunięcie elementu z HTML
            SetSum();   // Aktualizacja całkowitej sumy
        }
        catch(error){
            console.log("Błąd: ", error)
            const error_div = document.querySelector(".error_message");
            error_div.firstChild.textContent = "Wystąpił błąd podczas usuwania elementu. Sprawdź logi konsoli aby uzyskać więcej informacji."
            error_div.style = "display:block;";
            setTimeout(()=>{
                error_div.style = "display:none;";
            },5000);
        }
        
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
    dialog.onsubmit=async (event)=>{
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
        SetNewID(); // Ustawienie nowego ID
        const elem = new Element(
            ID,
            nameInput.value,
            parseFloat(quantity),
            parseFloat(parseFloat(priceInput.value).toFixed(2))
        );
        try{
            await AddNew(elem); // Dodanie nowego elementu do db.json
            AddNewNode(elem); // Dodanie nowego elementu do HTML
            SetSum(); // Podliczenie całkowitej sumy
        }
        catch(error){
            console.log("Błąd: ", error)
            const error_div = document.querySelector(".error_message");
            error_div.firstChild.textContent = "Wystąpił błąd podczas dodawania elementu. Sprawdź logi konsoli aby uzyskać więcej informacji."
            error_div.style = "display:block;";
            setTimeout(()=>{
                error_div.style = "display:none;";
            },5000);
        }
        
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


// Przy załadowaniu okna
window.onload = async function(){
    CreateAddButton(); // Dodaj przycisk Add
    
    try{
        await GetAll();
    }
    catch(error){
        console.log("Błąd: ", error);
        const error_div = document.querySelector(".error_message");
        error_div.firstChild.textContent = "Wystąpił błąd podczas ładowania zasobu. Sprawdź logi konsoli aby uzyskać więcej informacji."
        error_div.style = "display:block;";
    }
    SetSum(); // Dodaj całkowitą sumę paragonu
}


function GetAll(){
    // Try przechwytuje wyjątek w przypadku gdy nie ma dostępu do zasobu (serwera)
    try{
        return fetch("http://localhost:3000/products")
        .then(response => response.json())
        .then(json => {
                for(let elem of json){
                    AddNewNode(elem);
                }
                SetNewID(json);
            }
        )
        // catch przechwytuje wyjątek który wystąpił w czasie pobierania zasobów z serwera
        .catch(error=>{
            throw error;
        });
    }
    catch(error){
        throw error;
    }
    
}
function SetNewID(arr){
    if(Array.isArray(arr)&&arr.length!==0){
        ID = arr[arr.length-1].id;
    }
    else if(arr === undefined){
        ID+=1;
    }
}
function AddNew(newProduct){
    // Try przechwytuje wyjątek w przypadku gdy nie ma dostępu do zasobu (serwera)
    try{
        return fetch("http://localhost:3000/products",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newProduct)
        })
        .then(response=>response.json())
        .then(result => console.log(result))
        // catch przechwytuje wyjątek który wystąpił w czasie dodawania elementu do bazy
        .catch(error=>{
            throw error;
        });
    }
    catch(error){
        throw error;
    }
    
}
function Delete(id){
    // Try przechwytuje wyjątek w przypadku gdy nie ma dostępu do zasobu (serwera)
    try{
        return fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        })
        .then(response => response.json())
        .then(result => console.log(result))
        // catch przechwytuje wyjątek który wystąpił w czasie usuwania elementu z bazy
        .catch(error=>{
            throw error;
        });
    }
    catch(error){
        throw error;
    }
    
}
function Update(editProduct){
    // Try przechwytuje wyjątek w przypadku gdy nie ma dostępu do zasobu (serwera)
    try{
        return fetch(`http://localhost:3000/products/${editProduct.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(editProduct)
        })
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error=>{
            throw error;
        })
    }
    catch(error){
        throw error;
    }
    
}