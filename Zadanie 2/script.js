// Zadanie 1
function FizBuz(){
    let result =""
    for(let i = 1; i<=100; i++){
        switch(true){
            case (i % 2 === 0 && i % 3 === 0):{
                result += "FizBuz ";
                break;
            }
            case (i % 2 === 0):{
                result += "Fiz ";
                break;
            }
            case (i % 3 === 0):{
                result += "Buz ";
                break;
            }
            default:{
                result += i + " ";
                break;
            }
        }
    }
    return result;
}

// Zadanie 2
function CicrleAreaAndCircumference(){
    let r = prompt("Podaj długość promienia koła: ");   // Wczytanie od użytkownika promienia koła

    // Jeśli podana wartość jest liczbą
    if(!isNaN(r)){
        let circleArea = (Math.PI*Math.pow(r,2)).toFixed(2);    // Oblicz pole i zaokrąglij
        let circumference = (4*Math.PI*r).toFixed(2);   // Oblicz obwód i zaokrąglij
        let areaInfo = `Pole koła wynosi: ${circleArea}`;
        let circumferenceInfo = `Obwód koła wynosi: ${circumference}`;
        let output = `<div> ${areaInfo} </div>
                    <div> ${circumferenceInfo} </div>`
        document.querySelector(".result-task2").innerHTML=output;   // Zaktualizuj widok
        // Pokaż komunikaty
        alert(areaInfo);    
        alert(circumferenceInfo); 
    }
    // Jeśli podana wartość nie jest liczbą
    else{
        let ErrorMessage = "Podana wartość nie jest liczbą.";
        document.querySelector(".result-task2").innerHTML=ErrorMessage; // Zaktualizuj widok
        alert(ErrorMessage); // Pokaż komunikat  
    }
}

// Zadanie 3.1
function MakeArray(){
    let array = [];
    let sum=0;
    while(sum < 200){
        let random = Math.floor(Math.random() * 10) + 1;    // Wylosuj liczbę całkowitą z przedziału 1-10
        // Jeśli akutalna suma + wylosowana liczba daje wartość mniejszą od 200 
        if(sum+random <= 200){
            array.push(random); // Wstaw wylosowana liczbę do tablicy
            sum+=random;
        }
    }
    return array;
}

// Zadanie 3.2
function FindMinAndDelete(array){
    let minValue = array[0]; // Początkowa najmniejsza wartość to pierwszy element tablicy

    // Przejdź po wartościach wszytskich elementów tablicy
    for(element of array){
        // Jeśli akutalny element jest mniejszy od minimalnej wartości zaktualizuj minimalną wartość
        if(element < minValue)
        {
            minValue = element;
        }
    }
    console.log("Minimalna wartość: "+ minValue); // Zapisz informacje o minimalnej wartości w konsoli
    let indexOfMinValue = array.indexOf(minValue);  // Wyszukaj pierwszy index minimalnej wartości
    array.splice(indexOfMinValue, 1);   // Usuń z listy jeden element pod tym indexem
    return array;
}

// Zadanie 3.3
function FindMaxAndDelete(array){
    array = array.reverse();    // Odwróć tablicę

    let maxValue = array[0];   // Początkowa maksymalna wartość to ostatni element tablicy

    // Przejdź po wartościach wszystkich elementów tablicy
    for(element of array){  
        if(element > maxValue){ // Jeśli aktualny element jest większy od maksymalnej wartości zakutualizuj maksymalną wartość
            maxValue = element
        }
    }
    console.log("Maksymalna wartość: "+ maxValue); // Zapisz informację o maksymalnej wartości w konsoli

    // Znalezienie pierwszego indexu maksymalnej wartości w odwóconej tablicy
    let indexOfMaxValue = array.indexOf(maxValue);  
    array.splice(indexOfMaxValue, 1);   // Usunięcie tego elementu

    array = array.reverse();    // Ponowne odwrócenie tablicy

    return array;
}

// Zadanie 3.4
function CountValues(array){
    let counts = {}; // Deklaracja obiektu

    array.forEach((value)=>{
        if(counts[value] == undefined){ // Jeśli obiekt nie posiada atyrbutu value ustaw 1
            counts[value] = 1;
        }
        else{   // Jeśli obiekt posiada już atrybut value zwiększ go
            counts[value]++;
        }
    })
    return counts;
}

// Zadnie 3.5
function MoveToEnd(array){
    let temp_Array = array.splice(0,10); // Pobierz 10 pierwszych elementów z tablicy array i usuń je w tablicy array
    
    // Wstaw elementy pobrane z początku tablicy array na jej koniec
    for(element of temp_Array){
        array.push(element);
    }  
    return array;
}

// Zadanie 4
function EncodeNames(namesArray){
    for (let i = 0; i < namesArray.length; i++) {
        // Zmień litery w imionach odpowiednio 'a' na 4 oraz 'e' na 3
        namesArray[i] = namesArray[i].toLowerCase().replace('a', '4').replace('e', '3');
        if(namesArray[i].length>6){
            let dotsCount = namesArray[i].length - 6; // Ilość kropek
            // 3 pierwsze litery imienia, kropki powtarzaj w zależności od długości imienia i 3 ostatnie litery imienia
            namesArray[i] = namesArray[i].slice(0,3) + ".".repeat(dotsCount) + namesArray[i].slice(-3);
        }
        // Ustaw spowrotem pierwszą literę imienia jako wielką 
        namesArray[i] = namesArray[i].charAt(0).toUpperCase() + namesArray[i].slice(1);
    }
    return namesArray;
}


// Zadanie 5
function MakeObject(product){
    let price = (Math.random()*8+2).toFixed(2); // Losowa liczba rzeczywista z zakresu 2-10
    let obj ={  // Deklaracja obiektu z atrybutami
        product: product,
        price: price
    }  
    return obj;
}
function MakeShoppingCart(priceList){
    let shoppingCart = [];

    for(let i=0; i<priceList.length/2; i++){
        let randomProductIndex =  Math.floor(Math.random() * priceList.length); // Wybierz losowo index z tablicy priceList
        let randomProduct = priceList[randomProductIndex];  // Pobierz obiekt spod tego indexu
        shoppingCart.push({ // Wstaw ten obiekt do tablicy shoppingCart
                product: randomProduct.product,
                price: randomProduct.price
        });
    }
    return shoppingCart;
}
function MakePriceList(){
    const products = "jajka, mleko, masło, chleb, ser, jogurt, jabłko, marchewka, pomarańcze";

    let productArray = products.split(", ");    // Podziel string względem przecinka i spacji
    let priceList = []

    // Utwórz obiekt i dodaj do tablicy
    for(product of productArray){
        priceList.push(MakeObject(product));
    }
    return priceList;
}


// Funkcje pomocnicze

// Wypisuje daną tablicę w konsoli
function PrintArray(array){
    let result = "";
    array.forEach(Element=>{
        result+=Element+" ";
    })
    console.log(result);
}

// Wypisuje sumę elementów tablicy w konsoli
function PrintSum(array){
    let sum = 0;
    array.forEach(Element=>{
        sum+=Element;
    })
    return sum;
}

// Tworzy string dzięki któremu można wypisać informację o obiekcie w widoku strony
function PrintObjectInView(obj){
    let result=""
    for (key in obj) {
        result+=`<div> Liczba: ${key} Ilość: ${obj[key]}`;
    }
    return result;
}

// Wypisuje informacje o obiekcie w konsoli
function PrintObject(obj){
    for (key in obj) {
        console.log("Liczba: " + key +" Ilość: " + obj[key]);
    }
}

// Tworzy string dzięki któremu można wyświetlić tabelę w widoku strony
function MakeTableInView(object){
    let table_styles='style="border: 3px solid #909090; background-color: #2b2b2b; text-align:center; border-radius:5px; width:15vw"';
    let row_styles = 'style="border: 1px solid #909090"';
    let table = `<table ${table_styles} ><tr><th ${row_styles}>Nazwa</th><th ${row_styles}>Cena</th></tr>`;

    for (item of object) {
    table += `<tr><td ${row_styles}>${item.product}</td><td ${row_styles}>${item.price}</td></tr>`;
    }

    table += "</table>";
    return table
}

// Ze względu na brak responsywności wyświetlanej tablicy
function GetArrayString(array){
    let result="";
    for(item of array)
    {
        result+=item+", ";
    }
    return result;
}





// Zadadnie 1
console.log(FizBuz())
// Zmiana wewnętrznej zawartości elementu o klasie result-task1 w index.html
document.querySelector(".result-task1").innerHTML=FizBuz(); 


// Zadnie 2
// Wywołanie funkcji CicrleAreaAndCircumference przy wczytaniu strony
window.onload = CicrleAreaAndCircumference;

// Zadanie 3.1
let array = MakeArray();
console.log("\nTablica po utworzeniu: ");
PrintArray(array);
PrintSum(array);
// Zmiana wewnętrznej zawartości elementu o klasie result-task-3-1 w index.html
document.querySelector(".result-task-3-1").innerHTML=GetArrayString(array);//array.toString();

// Zadanie 3.2
console.log("\nTablica po usunięciu pierwszej najmniejszej wartości: ");
array = FindMinAndDelete(array);
PrintArray(array);
PrintSum(array);
// Zmiana wewnętrznej zawartości elementu o klasie result-task-3-2 w index.html
document.querySelector(".result-task-3-2").innerHTML=GetArrayString(array);//array.toString();


// Zadanie 3.3
console.log("\nTablica po usunięciu ostatniej największej wartości: ");
array = FindMaxAndDelete(array);
PrintArray(array);
PrintSum(array);
// Zmiana wewnętrznej zawartości elementu o klasie result-task-3-3 w index.html
document.querySelector(".result-task-3-3").innerHTML=GetArrayString(array);//array.toString();


// Zadanie 3.4
console.log("\nIlość poszczególnych wartości w tablicy: ");
let counts = CountValues(array);
PrintObject(counts);
// Zmiana wewnętrznej zawartości elementu o klasie result-task-3-4 w index.html
document.querySelector(".result-task-3-4").innerHTML=PrintObjectInView(counts).toString();


// Zadanie 3.5
console.log("\nTablica po przeniesieniu 10 pierwszych elementów na koniec: ");
array=MoveToEnd(array);
PrintArray(array);
PrintSum(array);
// Zmiana wewnętrznej zawartości elementu o klasie result-task-3-5 w index.html
document.querySelector(".result-task-3-5").innerHTML=GetArrayString(array);//array.toString();


// Zadanie 4
const namesArray = []
namesArray.push("Jan");
namesArray.push("Kazimierz");
namesArray.push("Mateusz");
namesArray.push("Katarzyna");
namesArray.push("Aleksander");

console.log("\nImiona przed zakodowaniem: ");
PrintArray(namesArray);
// Zmiana wewnętrznej zawartości elementu o klasie result-task-4-1 w index.html
document.querySelector(".result-task-4-1").innerHTML=GetArrayString(namesArray);//namesArray;

console.log("\nImiona po zakodowaniu: ");
let encoded_names = EncodeNames(namesArray);
PrintArray(encoded_names);
// Zmiana wewnętrznej zawartości elementu o klasie result-task-4-2 w index.html
document.querySelector(".result-task-4-2").innerHTML=GetArrayString(encoded_names);//encoded_names;



// Zadanie 5
let priceList = MakePriceList();
let shoppingCart = MakeShoppingCart(priceList);
console.log("\nCennik: ");
console.table(priceList);
// Zmiana wewnętrznej zawartości elementu o klasie result-task-5-1 w index.html
document.querySelector(".result-task-5-1").innerHTML=MakeTableInView(priceList);

console.log("\nLista zakupów: ");
console.table(shoppingCart);
// Zmiana wewnętrznej zawartości elementu o klasie result-task-5-2 w index.html
document.querySelector(".result-task-5-2").innerHTML=MakeTableInView(shoppingCart);
















