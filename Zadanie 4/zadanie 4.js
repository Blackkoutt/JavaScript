class Product{
    constructor(id, name, model, manufacture_year, price, energy_consumption){
        // Walidacja podanych danych
        this.#validateProduct(id, manufacture_year, price, energy_consumption);

        // Konwersja jeśli którąkolwiek wartość podano poprawnie ale jako string
        this.id = parseInt(id);
        this.name = name;
        this.model = model;
        this.manufacture_year= parseInt(manufacture_year);
        this.price = Number(price);
        this.energy_consumption = Number(energy_consumption);
    }
    static energy_cost = 1.14;

    // Walidacja podanych danych
    #validateProduct(id, manufacture_year, price, energy_consumption){
        if(!parseInt(id) || id<=0){
            throw new Error("ID produktu powinno być liczbą całkowitą większą od 0");
        }
        if(!parseInt(manufacture_year) || manufacture_year<=1900 || manufacture_year>new Date().getFullYear()){
            throw new Error("Data powinna być liczbą całkowitą większą niż 1799 i nie większą niż rok bieżący");
        }
        if(!Number(price)||price<=0){
            throw new Error("Cena powinna być liczbą większą od 0");
        }
        if(!Number(energy_consumption) || energy_consumption<0){
            throw new Error("Zużycie energii powinno być liczbą większą od 0");
        }
    }

    koszt(){
        return this.price + " zł";
    }

    kosztEnergii(){
        return (this.energy_consumption*Product.energy_cost).toFixed(2) + " zł";
    }

    wiekProduktu(){
        return new Date().getFullYear() - this.manufacture_year;
    }

    wiekProduktuLata(){
        /*
        const intl = new Intl.RelativeTimeFormat("pl")
        const text = intl.format(8, 'year')
        console.log(text.slice(3))
        */
        const age = this.wiekProduktu().toString();
        const numbers = ['2', '3', '4'];
        if(age==='1'){
            return `${age} rok`;
        }
        // Jeśli ostatnią cyfrą jest 2,3,4 i cyfrą tą nie jest 12, 13, 14 
        else if (numbers.includes(age[age.length-1]) && !(age >= 12 && age <= 14)){
            return `${age} lata`;
        }
        else{
            return `${age} lat`;
        }

    }
}
class ProductList{
    static max_ID = 0;
    constructor(){
        this.products_arr=[]
    }
    wypiszProdukt(id){
        let product = this.getProductById(id);

        return `ID: ${product.id}\n`+
               `Nazwa: ${product.name}\n`+
               `Model: ${product.model}\n`+
               `Rok produkcji: ${product.manufacture_year}\n`+
               `Wiek produktu: ${product.wiekProduktuLata()}\n`+
               `Cena: ${product.koszt()}\n`+
               `Zużycie energii: ${product.energy_consumption} kWh\n`+
               `Koszt energi: ${product.kosztEnergii()}\n`;          
    }
    getProductById(id){
        let p = this.products_arr.find(product => product.id === id);
        // Jeśli nie ma takiego produktu wyrzuć wyjątek
        if(!p){
            throw new Error(`Produkt o id ${id} nie istnieje.`);
        }
        return p;
    }
    wypiszWszystkieProdukty(){
        if(this.products_arr.length===0){
            throw new Error("Lista towarów jest pusta.")
        }
        // Tutaj napewno wypiszProdukt nie wyrzuci wyjątku
        return this.products_arr.map((product) =>{
            return this.wypiszProdukt(product.id);
        }).join("\n");      
    }
    dodajProdukt(produkt){
        if(this.products_arr.find(p=>p.id===produkt.id)){
            throw new Error(`Produkt o id ${produkt.id} istnieje już na liście`);
        }
        // Update maksymalnego id na liście produktów
        ProductList.max_ID = produkt.id > ProductList.max_ID ? produkt.id : ProductList.max_ID;
        
        // Dodanie produktu na liste
        this.products_arr.push(produkt);
    }

    zmienProdukt(idProduktu, produkt){
        let p = this.getProductById(idProduktu);
        p.name = produkt.name;
        p.model = produkt.model;
        p.manufacture_year = produkt.manufacture_year;
        p.price = produkt.price;
        p.energy_consumption = produkt.energy_consumption;
            
    }
}
class Warehouse extends ProductList{
    constructor(productsList){
        super(); // wywołuje konstruktor klasy nadrzędnej, ale to niezbędne
        this.quantity_arr = [];
        // Magazyn powinien pracować na już utworzonej liście produktów a nie tworzyć własną
        if (productsList instanceof ProductList) {
            this.products_arr = productsList.products_arr;
        }
    }
    #kopiuj(p){
        return new Product(p.product.id,
                           p.product.name,
                           p.product.model,
                           p.product.manufacture_year,
                           p.product.price,
                           p.product.energy_consumption);
    }
    dodajProdukt(produkt, ilość=1){
        if(this.products_arr.find(p=>p===produkt)){
            this.quantity_arr.push({product:produkt, quantity: ilość});
        }
        else{
            // Jeśli nie ma takiego produktu dodaj go też na listę produktów
            super.dodajProdukt(produkt);
            this.quantity_arr.push({product:produkt, quantity: ilość})
        }
    }
    wyswietlMagazyn(){
        if(this.quantity_arr.length===0){
            throw new Error("Lista magazynowa jest pusta.");
        }
        this.quantity_arr.forEach(p=>{
            console.log(`ID: ${p.product.id}\n`+
                        `Nazwa: ${p.product.name}\n`+
                        `Model: ${p.product.model}\n`+
                        `Ilość: ${p.quantity}`);
        })
    }
    
    zabranieProduktu(search_value){
        // Podaną opcją jest ID
        let product = this.quantity_arr.find(p=>p.product.id===search_value);
        if(product){
            // Jeśli ilość = 1 => usuń obiekt z magazynu i listy produktów
            if(product.quantity===1){
                const indexInQuantityArr = this.quantity_arr.indexOf(product);
                this.quantity_arr.splice(indexInQuantityArr, 1);
                const indexInProductsArr = super.products_arr.indexOf(product);
                super.products_arr.splice(indexInProductsArr, 1);
            }
            else{
                product.quantity--;
            }            
            return this.#kopiuj(product);
        }

        const temp_arr = search_value.toString().split(' ');
        let product1 = this.quantity_arr.find(p=>(p.product.name === temp_arr[0]&&p.product.model===temp_arr[1]));
        
        // Podaną opcją jest nazwa+model
        if(product1){
            // Jeśli ilość = 1 => usuń obiekt z magazynu i listy produktów
            if(product1.quantity===1){
                const indexInQuantityArr = this.quantity_arr.indexOf(product1);
                this.quantity_arr.splice(indexInQuantityArr, 1);
                const indexInProductsArr = super.products_arr.indexOf(product1);
                super.products_arr.splice(indexInProductsArr, 1);
            }
            else{
                product1.quantity--;
            }
            return this.#kopiuj(product1); // zwrócenie kopii obiektu
        }
        if(!product && !product1){
            throw new Error(`Nie udało się odnaleźć produktu o podanych atrybutach: ${search_value}`);
        }
    }
}
class Shop extends ProductList{
    constructor(productsList){
        super();    // wywołuje konstruktor klasy nadrzędnej (tworzy nową instancję ProductList) ale to niezbędne
        this.order = [];
        // Sklep powinien pracować na już utworzonej liście produktów a nie tworzyć własną
        if (productsList instanceof ProductList) {
            this.products_arr = productsList.products_arr;
        }
    }
    dodajProdukt(idProduktu, nazwa, model, cena, zuzycieEnergii){
        // Jeśli nie podano idProduktu
       if(arguments.length===4){
            let new_id = ProductList.max_ID+1;  // Pobierz nowe ID
            // Przesuń parametry o 1 w prawo (tak aby id nie było nazwą)
            zuzycieEnergii = cena;
            cena = model;
            model = nazwa;
            nazwa = idProduktu; 
            super.dodajProdukt(
                new Product(
                    new_id,
                    nazwa,
                    model,
                    Math.floor(Math.random() * (new Date().getFullYear() - 1800 + 1)) + 1800,
                    cena,
                    zuzycieEnergii
                )
            );
       }
        // Jeśli podano idProduktu
       else{
            super.dodajProdukt(
                new Product(
                    idProduktu,
                    nazwa,
                    model,
                    Math.floor(Math.random() * (new Date().getFullYear() - 1900 + 1)) + 1900,
                    cena,
                    zuzycieEnergii
                )
            )
       }; 
    }
    
    // Można podać listę id produktów
    dodajDoZamowienia(ids){
        // W przypadku braku jakiegoś produktu o id podanym z listy wypisze się błąd,
        // ale nie przerwie to działania funkcji
        ids.forEach(id=>{           
            try{
                let p = super.getProductById(id);
                let order_item = this.order.find(o => o.product==p)

                // Jeśli produktu nie ma na liście dodaj z ilością = 1
                if(!order_item){
                    this.order.push({product: p, quantity: 1});
                }
                // Jeśli produkt jest na liście zwiększ ilość o 1
                else{
                    this.order = this.order.map((item) => {
                        if (item.product === p) {
                            return { ...item, quantity: item.quantity + 1 };
                        }
                        return item;
                    });
                }
                
            }
            catch(error){
                console.log("Błąd: "+ error.message);
            }          
        })      
    }

    wyswietlZamowienie(){
        return this.order.map((item) =>{
            return  `ID: ${item.product.id}\n`+
                    `Nazwa: ${item.product.name}\n`+
                    `Model: ${item.product.model}\n`+
                    `Ilość: ${item.quantity}\n`+
                    `Cena: ${item.quantity*item.product.price} zł\n`
        }).join("\n")+
        "\nCałkowita cena: " + (()=> {
            let sum = 0;
            this.order.forEach(item => {
                sum += item.quantity * item.product.price;
            });
            return sum+" zł";
        })()
    }

    // Zmniejsza stan magazynowy wszystkich produktów bedących na liście order
    zlozZamowienie(warehouse){
        if(this.order.length===0){
            throw new Error("Zamowienie jest puste");
        }
        this.order.forEach(item=>{
            try{
                for(let i=0;i<item.quantity;i++){
                    warehouse.zabranieProduktu(item.product.id);
                }         
            }
            catch(error){
                console.log("Błąd: "+ error.message);
            }           
        });

        // Czyszczenie listy order
        this.order.length = 0;

    }
}


const printHeader = (header) => {
    console.log("\n------------------------------------------------------");
    console.log(header);
    console.log("------------------------------------------------------");
}

const tryCreateProduct = (id, name, model, manufacture_year, price, energy_consumption) =>{
    try{
        return new Product(id, name, model, manufacture_year, price, energy_consumption);
    }
    catch(error){
        console.log("Błąd: "+ error.message);
    }   
}



// TESTS
// W tablicy mogą znajdować się wartości undefined
// Wszystkie wartości mogą być podane w stringu ale odpowiednie wartości muszą być liczbami
printHeader("               Tworzenie obiektów produtków");
const products = [];
products.push(
    // Działa
    tryCreateProduct('1', "Telewizor", "ABC123", 1978, 1000, 100),
    tryCreateProduct(2, "Laptop", "XYZ456", '1995', 1500, 80),
    tryCreateProduct(3, "Smartphone", "123ABC", 2019, '800', 50),
    tryCreateProduct(4, "Komputer", "456DEF", 2022, 1100, '280'),
    tryCreateProduct(5, "Kamera", "789GHI", 2021, 1200, 30),
    tryCreateProduct(5, "Monitor", "YZA678", 2015, 700, 80),
    tryCreateProduct(6, "Głośniki", "BCD901", 2014, 150, 20),

    // Wyrzuca wyjątki
    tryCreateProduct('a', "Słuchawki", "JKL321", 2018, 200, 10),    // złe id
    tryCreateProduct(7, "Tablet", "MNO456", 2025, 600, 40), // zła data
    tryCreateProduct(8, "Myszka", "PQR789", 1670, 50, 5),   // zła data
    tryCreateProduct(9, "Klawiatura", "STU012", 2017, 0, 15), // zła cena
    tryCreateProduct(10, "Drukarka", "VWX345", 2016, 300, -1), // złe zużycie energi
)

const productList = new ProductList();
const wh = new Warehouse(productList);
const shop = new Shop(productList);



// Dodawanie produktów do listy produktów
printHeader("               Dodawanie do listy produktów");
products.forEach(p=>{
    if(p!==undefined){
        try{
            productList.dodajProdukt(p);
        }
        catch(error){
            console.log("Błąd: "+ error.message)
        }
    }   
})




// Wypisywanie listy produktów
printHeader("                   Lista produktów");
try{
    console.log(productList.wypiszWszystkieProdukty())
}
catch(error){
    console.log("Błąd: "+ error.message)
}

printHeader("   Próba wypisania produktu którego nie ma na liście");
try{
    console.log(productList.wypiszProdukt(7));
}
catch(error){
    console.log("Błąd: "+ error.message)
}




// Zmiana produktu
printHeader("               Zmiana produktu");
// Poprzednia wartość: '1', "Telewizor", "ABC123", 1978, 1000, 100
const new_product = new Product(17, "Skaner", "RST456", 2021, 120, 15)
try{
    productList.zmienProdukt(1, new_product);
    productList.zmienProdukt(7, new_product); // takiego produktu nie ma na liście
}
catch(error){
    console.log("Błąd:"+ error.message);
}


// Wyświetlenie produktu po zmianie
printHeader("               Produkt po zmianie");
try{
    console.log(productList.wypiszProdukt(1));
}
catch(error){
    console.log("Błąd: "+ error.message)
}




// Dodanie produktów do magazynu
printHeader("           Dodanie produktów do magazynu");
let quantity=10;
products.forEach(p=>{
    if(p!==undefined){
        try{
            wh.dodajProdukt(p, quantity);
            quantity+=10;
        }
        catch(error){
            console.log("Błąd: "+ error.message)
        }
    }   
});




// Wyświetlenie listy magazynowej po dodaniu produktów
printHeader("           Lista magazynowa po dodaniu produktów");
wh.wyswietlMagazyn();




// Zabranie produktu z magazynu
printHeader("       Zabranie produktu z magazynu");
try{
    console.log("Pobrany produkt:");
    console.log(wh.zabranieProduktu("Telewizor ABC123")); // ten produkt został zmieniony więc to nie zadziała
}
catch(error){
    console.log("Błąd: "+ error.message);
}
try{
    console.log("Pobrany produkt:");
    console.log(wh.zabranieProduktu("Laptop XYZ456"));
}
catch(error){
    console.log("Błąd: "+ error.message);
}
try{
    console.log("Pobrany produkt:");
    console.log(wh.zabranieProduktu(1));
}
catch(error){
    console.log("Błąd: "+ error.message);
}



// Wyświetlenie listy magazynowej po zabraniu produktu
printHeader("       Lista magazynowa po zabraniu produktów");
wh.wyswietlMagazyn();




printHeader("       Sklep dodanie produktu bez ID");
shop.dodajProdukt("Product A", "FSD454", 89, 45);
console.log(shop.wypiszWszystkieProdukty());


printHeader("       Sklep dodanie produktu z ID");
shop.dodajProdukt(8,"Product B", "GDW483", 59, 34);
console.log(productList.wypiszWszystkieProdukty());


printHeader("           Zamówienie");
shop.dodajDoZamowienia([1,1,1,3,3,3,3,3,4,5,5,6]);
console.log(shop.wyswietlZamowienie());

printHeader("       Stan magazunu po złożeniu zamówienia");
try{
    shop.zlozZamowienie(wh);
}
catch(error){
    console.log("Błąd: "+error.message);
}
wh.wyswietlMagazyn();

