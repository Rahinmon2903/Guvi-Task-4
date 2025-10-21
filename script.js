// getting Element
const balance=document.querySelector('#balance');
const income =document.querySelector('#income');
const expense=document.querySelector('#expense');
const form=document.querySelector('#transaction-form');
const des=document.querySelector('#desc');
const amt=document.querySelector('#amount');
const list=document.querySelector('#transaction-list');
const filter=document.querySelectorAll('input[name="filter"]')


// const dummydata = [
//   {id:1, description:"sunflower", amount:-100},
//   {id:2, description:"groceries", amount:-250},
//   {id:3, description:"freelance", amount:1200},
//   {id:4, description:"rent", amount:-800},
//   {id:5, description:"bonus", amount:500},
//   {id:6, description:"electricity", amount:-150}
// ];

// let transaction=dummydata;
const localstoragetrans=JSON.parse(localStorage.getItem("tra"));

let transaction=localStorage.getItem("tra") != null ? localstoragetrans : [];


function loadtransaction(transaction){
    const sign=transaction.amount < 0? "-" : "+";
    const li=document.createElement('li');
    li.classList.add(transaction.amount < 0? "exp" : "inc");
    li.innerHTML = `
  <span class="desc">${transaction.description}</span>
  <div class="right">
    <span class="amount">${sign} ${Math.abs(transaction.amount)}</span>
    <button class="bt-edit" onclick="edit(${transaction.id})">
      <i class="fa-solid fa-pen-to-square fa-fade"></i>
    </button>
    <button class="bt-del" onclick="remove(${transaction.id})">
      <i class="fa-solid fa-trash fa-fade"></i>
    </button>
  </div>
`;
    list.appendChild(li);
    

}
function remove(id){
    
    
        transaction=transaction.filter((trans) =>  trans.id != id);
        updatelocalstorage();
        applyFilter();

           

        

    
}
function edit(id) {
  const trans = transaction.find(t => t.id === id);
  if (trans) {
    des.value = trans.description;
    amt.value = trans.amount;
    // Remove the old one so when resubmitted it overwrites
    transaction = transaction.filter(t => t.id !== id);
    updatelocalstorage();
    applyFilter();
  }
}
function updateamount(){
    const amount=transaction.map((trans)=> trans.amount);
    const total=amount.reduce((x,y)=> x+y,0).toFixed(2);
    balance.innerHTML=`₹ ${total}`

     const incomee=amount.filter((item) => item > 0)
     const inctotal=incomee.reduce((x,y)=> x+y,0).toFixed(2);
    income.innerHTML=`₹ ${inctotal}`

      const expe=amount.filter((item) => item < 0)
     const exptotal=Math.abs(expe.reduce((x,y)=> x+y,0).toFixed(2));
    expense.innerHTML=`₹ ${exptotal}`
}


function config(){
    list.innerHTML="";
    transaction.forEach(loadtransaction); 
    updateamount();
  

}

function addtransaction(e){
    e.preventDefault();
if (des.value.trim() === "" || amt.value.trim() === "") {
  alert("Please enter both description and amount");
  return;
}else{
    const transactions={
        id:Date.now(),
        description: des.value,
         amount: +amt.value,
    }
    transaction.push(transactions);
    loadtransaction(transactions);
    des.value="";
       amt.value="";
    updateamount();
    updatelocalstorage();


}

};




form.addEventListener('submit',addtransaction);

window.addEventListener('load',function(){
   
    config();
})

 function updatelocalstorage(){
     localStorage.setItem("tra",JSON.stringify(transaction));



}

function applyFilter(){
     const value = document.querySelector('input[name="filter"]:checked').value;
     list.innerHTML = "";
      let filtered = transaction;
      if(value === "income") filtered= transaction.filter(at => at.amount>0);
       if(value === "expense") filtered= transaction.filter(at => at.amount<0);
        filtered.forEach(loadtransaction);
        updateamount();

}
filter.forEach(f => f.addEventListener('change', applyFilter));

form.addEventListener('reset', () => {
  document.querySelector('input[value="all"]').checked = true;
  applyFilter();
});


