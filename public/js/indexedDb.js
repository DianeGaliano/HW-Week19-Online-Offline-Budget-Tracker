let db;

const request = indexedDB.open('budget-tracker', 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore('new_transtaction', { autoIncrement: true});
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['new_transaction'], 'readWrite');
  const budgetObjectStore = transaction.objectStore('new_transaction');
  budgetObjectStore.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(['new_transaction'], 'readWrite');
  const budgetObjectStore = transaction.objectStore('new_transaction');
  const gettAll = budgetObjectStore.gettAll();


  gettAll.onsuccess = function () {
    if (gettAll.result.lenght > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(gettAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then(serverResponse => {
        if (serverResponse.message) {
            throw new Error(serverResponse);
        }
        const transaction = db.transaction(['new_transaction'], 'readWrite');
        const budgetObjectStore = transaction.objectStore('new_transaction');
        budgetObjectStore.clear();
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }
}

window.addEventListener("online", checkDatabase);