// Flow for Setting Up GET Requests

    // SERVER => What resource(s) do I want to retrieve?
        // /books
        // /books/1
    // CLIENT => How do I want to render the requested data
    // to the DOM?
        // /books => Iterate over Array of JS Objects
            // and render each accordingly
        // /stores/1 => Invoke JS functions to render
            // individual stores info to the page 

// Flow for Setting Up POST Requests

    // SERVER => What resource do I want to create?
        // /books
        // /stores
    // CLIENT => How do I want to (if at all) render the newly created
    // data to the DOM? 
        // /books => renderBookCard
        // /stores => renderHeader / renderFooter

document.addEventListener('DOMContentLoaded', () => {

// Fetch requests 
    
    // Function for making a GET request 
    // /stores + /stores/1
    // /books + /books/1
    function fetchResource(url){
        return fetch(url)
        .then(res => res.json());
    }

    // Function for making a POST Request
    // /stores
    // /books
    function createResource(url, body) {
        return fetch(url, {
            method: 'POST',
            headers: {
                // specify the content type of the data 
                // we send in our request
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json());
    }

    // Function for making a PATCH / PUT Request
    // PATCH => Doesn't update entire record, only
        // specific attributes 
    // PUT => Update entire record

        // /stores/1
        // /books/1

    // Function for making a DELETE Request

        // /stores/1
        // /books/1

    // const newBook = {
    //     title: "My Newest Book",
    //     author: "My Newest Author",
    //     price: 15,
    //     imageUrl: "My Newest URL",
    //     inventory: 15,
    //     reviews:[]
    // }
    
    // create a new book
    // createResource('http://localhost:3000/books', newBook)
    // .then(data => console.log(data));


    // create a new store
    // createResource('http://localhost:3000/stores')

// Rendering functions
    // Renders Header
    function renderHeader(store){
        document.querySelector('h1').textContent = store.name
    }
    // Renders Footer
    function renderFooter(store){
        const footerDivs = document.querySelectorAll('footer div')
        footerDivs[0].textContent = store.name
        footerDivs[1].textContent = store.address
        footerDivs[2].textContent = store.hours
    }

    function renderBookCard(cardData) {
        const li = document.createElement('li')
        const h3 = document.createElement('h3')
        const pAuthor = document.createElement('p')
        const pPrice = document.createElement('p')
        const img = document.createElement('img')
        const btn = document.createElement('button')

        h3.textContent = cardData.title
        pAuthor.textContent = cardData.author
        pPrice.textContent = `$${cardData.price}`
        btn.textContent = 'Delete'

        img.src = cardData.imageUrl
        li.className = 'list-li'

        //Event Listeners 
        btn.addEventListener('click',()=>li.remove())
    
        li.append(h3,pAuthor,pPrice,img,btn)
        document.querySelector('#book-list').append(li)
    }

// Event Handlers
    function handleForm(e){
        
        // e => represents our submit event
        // e.target => form#book-form
        // e.target.title => form input with name of "title"
        // e.target.title.value => value within our form input w/ name of "title"
        
        e.preventDefault();

        //Builds Book
        const book = {
            title: e.target.title.value,
            author:e.target.author.value,
            price: e.target.price.value,
            imageUrl: e.target.imageUrl.value,
            inventory:e.target.inventory.value,
            reviews:[]
        }
        
        // Render new Book to page OPTIMISTICALLY
        // renderBookCard(book);

        createResource('http://localhost:3000/books', book)
        // .then(book => renderBookCard(book));
        .then(renderBookCard)
        .catch(console.error);
    }

    function handleStoreForm(e) {
        e.preventDefault();

        const store = {
            location: e.target.location.value,
            address: e.target.address.value,
            number: e.target.number.value,
            name: e.target.name.value,
            hours: e.target.hours.value
        }

        // console.log(store);

        createResource('http://localhost:3000/stores', store)
        
        // Pessimistic Rendering
        .then(store => {
            renderHeader(store);
            renderFooter(store);
        })
        .catch(console.error);
    }


// Invoking functions    
    fetchResource('http://localhost:3000/stores/1')
    .then(store => {
        renderHeader(store)
        renderFooter(store)
    })
    .catch(console.error);

    fetchResource('http://localhost:3000/books')
    .then(books => books.forEach(renderBookCard))
    .catch(console.error);

    document.querySelector('#book-form').addEventListener('submit', handleForm)
})