# multiList
MultiList allows you to customize a selector(Use Select2(4.0.0)), wherein the selected traits are in a sortable list (Use Nestable2)

## Dependences
* https://select2.github.io/
* http://ramonsmit.github.io/Nestable/

## Getting started 
you can create a MultiList in two ways:
* 1) passing a query of an element 
```
$('#asigned_terms3').multiList();
```
* 2) passing a query multiple $('select').MultiMultiList().
```
$('.classAllSelect').multiMultiList();
$('select').multiMultiList();
```

## Params
MultiList moment only accepts two parameters:
* orientation: Vertical or Horizontal (Vertical mues)
* placeholder: String

Vertical lists ordering them selected from the top down. Horizontal shows another type of styles that allow you to sort horizontally.


Example: 
```
$('#asigned_terms3').multiList({
  orientation: 'horizontal',
  placeholder: 'Select options'
});
```
## multiMultiList
If you create multiple MultiList with multiMultiList all would have the same options.


## Order Result
The result of ordering the selected list is saved in the native switch to the attribute data-order

Example Native Select Result:
```
<select style="width:250px;" multiple="" id="asigned_terms3" tabindex="-1" class="select2-hidden-accessible" aria-hidden="true">
      <option value="24" data-order="1" data-multilist-id="15">Prueba creacion de termino 1</option>
      <option value="25" data-order="2" data-multilist-id="16">Prueba creacion de termino 2</option>
      <option value="26" data-order="3" data-multilist-id="17">Prueba creacion de termino 3</option>
      <option value="27" data-order="4" data-multilist-id="18">Destacado1_es</option>
      <option value="28" data-order="5" data-multilist-id="19">Destacado2_es</option>
      <option value="29" data-order="6" data-multilist-id="20">Destacado3_es</option>
  </select>
```

