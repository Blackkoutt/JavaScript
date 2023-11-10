// ZADANIE 1
function combine(operation, arr1, arr2){
    const result_arr = [];
    for(let i=0;i<arr1.length;i++){
        result_arr.push(operation(arr1[i], arr2[i]));
    }
    return result_arr;
}

console.log("\n[Zadanie 1]");
let wynik = combine((a, b) => a + b, [4, 5, 6], [10, 20, 30]);
console.log("2 scalone tablice: "+wynik);

let points_arr = combine((x, y) => ({x, y}), [1, 2, 3], [7, 8, 9]);
console.log("Tablica punktów:");
console.log(JSON.stringify(points_arr, null, 2));

// ***
function combine(operation, ...rest){
    const result_arr = [];
    for(let i=0;i<rest[0].length;i++){
        let values = rest.map((arr)=>arr[i]);
        result_arr.push(operation(...values));
    }
    return result_arr;
}
let result = combine((a,b,c)=>a+b+c, [1, 2, 3], [5, 6, 7], [10, 20, 30]);
console.log("Dowolna ilość tablic po scaleniu: "+ result);



// ZADANIE 2
console.log("\n[Zadanie 2]");
function skarbonka(name, state=0){
    return function(value){
        if(arguments.length === 0){
            console.log(`${name} get ${state}`);
            return state;
        }
        else{
            state+=value;
            console.log(`${name} set ${state}`);
        }
    }
}
let s = skarbonka("Piotr",100);
s(20);
let ile = s();
console.log(ile);

let s1 = skarbonka("Paweł",40);
s1(50);
let ile1 = s1();
console.log(ile1);

let s2 = skarbonka("Maciej",150);
s2(30);
let ile2 = s2();
console.log(ile2);


// ZADANIE 3
console.log("\n[Zadanie 3]");
let arr = [ { imię: "Piotr", nazwisko: "Nowak", punkty: 63 },
            { imię: "Tomasz", nazwisko: "Kowalski", punkty: 88 },
            { imię: "Julia", nazwisko: "Bagińska", punkty: 75 },
            { imię: "Krzysztof", nazwisko: "Dąbrowski", punkty: 90 },
            { imię: "Łukasz", nazwisko: "Nowicki", punkty: 55 },
            { imię: "Joanna", nazwisko: "Tomczak", punkty: 71 },
            { imię: "Sylwia", nazwisko: "Gajewska", punkty: 82 },]

const avg = (arr.map(obj=>obj.punkty).reduce((last, curr)=>{return last+curr})/arr.length).toFixed(2);
console.log("Średnia: "+avg);

const names = arr.filter(obj=>obj.punkty>avg).map(obj=>({imię: obj.imię, nazwisko: obj.nazwisko}));
console.log("Imiona i nazwiska osób które uzyskały więcej niż średnia: ");
console.log(names);

const best = arr.toSorted((a,b)=>a.punkty-b.punkty).toReversed().slice(0,3).map(obj=>({imię: obj.imię, nazwisko: obj.nazwisko}));
console.log("Imiona i nazwiska 3 osób które uzyskały najwięcej punktów: ");
console.log(best);

function Ocena(nazwa, punkty){
    this.nazwa = nazwa;
    this.punkty = punkty;
};

const oceny = 
[
    new Ocena("dst", 50),
    new Ocena("dst+", 60),
    new Ocena("db", 70),
    new Ocena("db+", 80),
    new Ocena("bdb", 90),
]
console.log("Lista nazwisk z ocenami posortowana alfabetycznie: ");
const sorted = arr.map(obj=>{
    const ocena = oceny.filter(ocena => parseInt(obj.punkty/10) === parseInt(ocena.punkty/10));
    return {nazwisko: obj.nazwisko, ocena: ocena.map(o=>o.nazwa).toString()}
}).toSorted((a,b)=>a.nazwisko.localeCompare(b.nazwisko));
console.log(sorted);

console.log("Ile osób zdobyło jaki stopień: ")
const stopnie = {
    "dst": sorted.filter(obj => obj.ocena==="dst").length,
    "dst+": sorted.filter(obj => obj.ocena==="dst+").length,
    "db": sorted.filter(obj => obj.ocena==="db").length,
    "db+": sorted.filter(obj => obj.ocena==="db+").length,
    "bdb": sorted.filter(obj => obj.ocena==="bdb").length,
}
console.log(stopnie);