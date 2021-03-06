let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore('new_transtaction', { autoIncrement: true});
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    addTransaction();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['new_transaction'], 'readwrite');
  const budgetObjectStore = transaction.objectStore('new_transaction');
  budgetObjectStore.add(record);
}

function addTransaction() {
  const transaction = db.transaction(['new_transaction'], 'readwrite');
  const budgetObjectStore = transaction.objectStore('new_transaction');
  const gettAll = budgetObjectStore.gettAll();


  gettAll.onsuccess = function () {
    if (gettAll.result.lenght > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(gettAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then(() => {
      
        const transaction = db.transaction(['new_transaction'], 'readwrite');
        const budgetObjectStore = transaction.objectStore('new_transaction');
        budgetObjectStore.clear();

        alert("All saved transactions has been submitted!");
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };
}

window.addEventListener("online", addTransaction);