QUnit.test( "getStorageHtml exist", function(assert) {
 assert.ok(getStorageHtml, "getStorageHtml exist")
})

QUnit.test( "getStorageHtml is a function yes!!!", function(assert) {
 assert.ok(typeof getStorageHtml === 'function' , "getStorageHtml is a function")
})

QUnit.test( "existCurrency exist", function(assert) {
    assert.ok(existCurrency, "existCurrency exist")
})

QUnit.test( "existCurrency is a function", function(assert) {
    assert.ok(typeof existCurrency === 'function' , "existCurrency is a function")
})

QUnit.test( "existCurrency return", function(assert) {
   var allCurrencies = {AED: 4.293543, AFN: 84.872424, ALL: 125.905786, AMD: 563.174129, ANG: 2.130577};
    assert.equal(existCurrency('AED', allCurrencies), true , " return existCurrency");
    assert.equal(existCurrency('23S', allCurrencies), false , " return existCurrency");
    assert.equal(existCurrency(function(){}, allCurrencies), false , " return existCurrency");
    assert.equal(existCurrency([], allCurrencies), false , " return existCurrency");
    assert.equal(existCurrency({}, allCurrencies), false , " return existCurrency");
})