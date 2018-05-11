'use strict';

const STORE = [
  {name: "apples", checked: false},
  {name: "oranges", checked: false},
  {name: "milk", checked: true},
  {name: "bread", checked: false}
];


function generateItemElement(item, itemIndex, template) {
  let checkboxValue = $('.js-shopping-list-display-checkbox').prop("checked");
  return `
    <li class="js-item-index-element${checkboxValue && item.checked ? " hidden" : ""}" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <input type="text" class="js-edit-item-input hidden" value="${item.name}">
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join("");
}


function renderShoppingList() {

  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function renderShoppingListPassed(theList) {

  // render the shopping list passed in to the DOM
  const shoppingListItemsString = generateShoppingItemsString(theList);
  // insert the produced HTML into the DOM
  shoppingListItemsString !== "" ? $('.js-shopping-list').html(shoppingListItemsString) : $('.js-shopping-list').html(STORE);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', `.js-item-delete`, event => {
  console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.splice(itemIndex,1);
    renderShoppingList();
    console.log(STORE);
  });
  
}

function handleToggleCheckedDisplay() {
  $('.js-shopping-list-display-checkbox').click(function(event) {
    console.log("in click event");
    renderShoppingList();
  });
}

function handleSearchButton() {
  $('.js-search-button').click(function(event) {
    const searchValue = $('.js-search-box').val();
    const found = STORE.filter(function(element) {
      return element.name.includes(searchValue);
    });
    console.log("in search event");
    renderShoppingListPassed(found);
  });
}

function handleItemEditClicked() {
  $('.js-shopping-list').on('click', `.js-item-edit`, event => {
    $(event.currentTarget).closest('li').find('span.js-shopping-item').hide();//.toggleClass("hidden");
    $(event.currentTarget).closest('li').find('input').toggleClass("hidden");
    $(event.currentTarget).closest('li').find('input').focus();
  });
}

function handleEditItemFocusOut() {
  $('.js-shopping-list').on('focusout', `.js-edit-item-input`, event => {
    $(event.currentTarget).closest('li').find('span.js-shopping-item').show();
    $(event.currentTarget).closest('li').find('input').toggleClass("hidden");
    const newName = $(event.currentTarget).closest('li').find('input').val();
    const index = $(event.currentTarget).closest('li').attr('data-item-index');
    STORE[index].name = newName;
    renderShoppingList();
    // $(event.currentTarget).closest('li').find('span.js-shopping-item').html();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleSearchButton();
  handleToggleCheckedDisplay();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleItemEditClicked();
  handleEditItemFocusOut();
  handleDeleteItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);