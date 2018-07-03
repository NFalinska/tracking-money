window.onload = function () {
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            var inputString = document.getElementById('in').value;
            processEnterData(inputString);
        }
    });

    var allCurrencies = getRates();


    function processEnterData(data) {
        var allowAction = ['add', 'list', 'clear', 'total'];
        if (!data) {
            return false;
        }
        var enterData = data.split(' ');

        if (allowAction.indexOf(enterData[0]) == -1) {
            alert('Error - wrong first parameter - (allow :' + allowAction + ')');
            return false;
        }

        switch (enterData[0]) {
            case 'add' :
                if (enterData.length !=5) {
                    alert ("Please fill in the field correct: add DATE AMOUNT CURRENCY ITEM")
                    return false;
                }
				
                if (isValidDate(enterData[1])) {
                } else {
                    alert('Please fill in the correct date YYYY-MM-DD')
                    return false;
					}
				
				if (getType(enterData[2])==='string' ){
					alert ("Item must be a number");
                    return false;
                }

                  if (existCurrency(enterData[3], allCurrencies)) {
				  } else {
                    alert(enterData[3] + ' Currency does not exist');
                    return false;
                }
				if (enterData[4]==''){
					alert ('Please add item')
					return false;
				}
              
                var stored = JSON.parse(localStorage.getItem('fullList')) || [];
                var line = {
                    'date': enterData[1],
                    'amount': enterData[2],
                    'currency': enterData[3],
					 'name': enterData[4]
					
                };
                stored.push(line);
                localStorage.setItem('fullList', JSON.stringify(stored));

                document.getElementById('in').value = null;
                document.getElementById('out').innerHTML = getStorageHtml('fullList');
                break;

            case 'list' :
				   if (enterData.length != 1) {
                    alert ("Please fill in the field correct: list")
                    return false;
                }
				
                document.getElementById('in').value = null;
                document.getElementById('out').innerHTML = getStorageHtml('fullList');
                break;

            case 'clear' :
				   if (enterData.length != 2) {
                    alert ("Please fill in the field correct: clear DATE")
                    return false;
                }
                if (isValidDate(enterData[1])) {
                } else {
                    alert('Please fill in the correct date YYYY-MM-DD');
                    return false;
                }

                clearByDate('fullList', enterData[1]);

                document.getElementById('in').value = null;
                document.getElementById('out').innerHTML = getStorageHtml('fullList');
                break;

            case 'total' :
				   if (enterData.length != 2) {
                    alert ("Please fill in the field correct: total CURRENCY")
                    return false;
                }
                if (!existCurrency(enterData[1], allCurrencies)){
                    alert(enterData[1] + ' Currency does not exist!!!');
                    return false;
                }
                var rates = getRates();
                var totalsum = TotalSum('fullList', rates, enterData[1]);
                document.getElementById('in').value = null;
                document.getElementById('out').innerHTML = totalsum.toFixed(2) + ' ' + enterData[1];
                break;
        }
        return true;
    }
}

function isValidDate(dateString) {
    if (!dateString) return false;
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; 
    var d = new Date(dateString);
    if (!d.getTime() && d.getTime() !== 0) return false; 
    return true;
}

function getStorageHtml(name) {
    var List = JSON.parse(localStorage.getItem(name));
    List.sort(function (a, b) {
        return +new Date(a.date) - +new Date(b.date);
    })

    var out = '';
    var dateGroup = '';
    if (List) {
        for (var key in List) {

            if (dateGroup != List[key].date) {
                out += '<br>' + List[key].date + '<br>';
            }
            out += List[key].name + ' ' + List[key].amount + '  ' + List[key].currency + '<br>';
            dateGroup = List[key].date;
        }
    }
    return out;
}

function clearByDate(storageName, date) {
    var List = JSON.parse(localStorage.getItem(storageName));

    List = List.filter(function (obj) {
        return obj.date != date;
    });

    localStorage.setItem(storageName, JSON.stringify(List));

    return true;
}

function TotalSum(storageName, rates, resultCurrency) {
    var List = JSON.parse(localStorage.getItem(storageName));
    var sum = 0;
    if (List) {
        for (var key in List) {
            index = rates[resultCurrency] / rates[List[key].currency];
            sum += index * List[key].amount;
        }
    }
    return sum;
}


function getRates() {
    var xhr = new XMLHttpRequest();
    var currencies = [];
    xhr.open('GET', 'http://data.fixer.io/api/latest?access_key=e9c7157c2e6c56b43b8c4bbc76a5f633', false);
    xhr.send();
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText); 
    } else {
        response = JSON.parse(xhr.responseText);
        var baseCurrency = response.base;
        if (baseCurrency == 'EUR')
            currencies = response.rates;
        return currencies;
    }
}

function existCurrency(inputCurrency, allCurrencies) {
    if (inputCurrency in allCurrencies) {
        return true;
    }
    return false;
}

function getType(input) {
	if (!input) return false;
    var m = (/[\d]+(\.[\d]+)?/).exec(input);
    if (m) {
        if (m[1]) { return 'float'; }
        else { return 'int'; }
    }
    return 'string';
}