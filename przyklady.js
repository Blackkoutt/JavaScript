const obj = {
    a:8,
    b:42,
    c:21
}
const {b,c} = obj; // 41,21


const arr =[7,42,89,21];

const [x,y,z] = arr // 7,42,89


/*const fn=()={
    return [rseult, error]
}*/
// const[result, error] = fn()

/*
=>{
    const wynik=8
    const blad=4
    return{
        wynik, lub wynik:wynik
        blad
    }

}

const{blad} = fun(); - wypakowanie wartosci bledu
*/ 

const a = [7,2,3] 
const d = [1,2,3];

a.push(...d); // a.push(d[0], d[1], d[2])
a.concat(d); // mdyfikuje a
[...a,...b] // nowy array a+b
[a,b].flat() // 2 wymiarowy array do 1 wymiarowego

o={
    nazwa:"Czarnek",
    waga:130,
    cena:Infinity,

}
fn=(osoba)=>{
    nowa_osoba={}
    for(const [key,val] of Object.entries(osoba)){
        nowa_osoba[key]=val; // nowy obiekt na podstawie podanego
    }
    nowa_osoba.przydatnosc = 0;
}
/*
nowa_osoba={
    ...osoba,
    przydatność = 0
}
*/
/*
nowa_osoba={
    waga:80 nadpisze wage
    ...osoba
}
*/
fn(o);
/*
o={}
b={...o} kopia płytka
*/

let aa = 0
let bb = 8
[a,b]=[b,a] // zamiana wartosci zmiennych
