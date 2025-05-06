let cont1 = document.getElementById('cont-1'),
cont2 = document.getElementById('cont-2'),
cont3 = document.getElementById('cont-3');
let cant1=0,cant2=0,cant3=0;



let tiempo1 = setInterval(() => {
    cont1.textContent=cant1+=1

    if(cant1 === 405 ){
        clearInterval(tiempo1)
    }
}, 7);

let tiempo2 = setInterval(() => {
    cont2.textContent=cant2+=1

    if(cant2 === 8 ){
        clearInterval(tiempo2)
    }
}, 400);

let tiempo3 = setInterval(() => {
    cont3.textContent=cant3+=1

    if(cant3 === 100 ){
        clearInterval(tiempo3)
    }
}, 30);


