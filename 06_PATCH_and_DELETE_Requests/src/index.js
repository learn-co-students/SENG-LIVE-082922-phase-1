// C => Create (POST)
// R = Read (GET)
// U => Update (PATCH / PUT)
// D => Delete (DELETE)

document.addEventListener('DOMContentLoaded', () => {
    // Fetch requests 
        // Function for making a GET request 
        function fetchResource(url){
            return fetch(url)
            .then(res => res.json())
        }

        // /books + /stores => Adding New Individual Records
        function createResource(url, body){
            return fetch(url,{
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
            .then(res => res.json())
        }

        // /books/:id => Update Individual Records
        function updateResource(url, body) {
            return fetch(url, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })

            // res.json() => Parsing JSON to JS
            // JSON.stringify(obj) => Parsing JS to JSON

            .then(res => res.json())
        }

        function deleteResource(id, li) {
            return fetch(`http://localhost:3000/books/${id}`, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(() => li.remove());
        }

        // function handleDelete(id) {
        //     deleteResource(id)
        //     .then(data => console.log(data))
        //     .catch(error => console.error(error))
        // }

        function handleUpdate(newVal, id) {
            updateResource(
                `http://localhost:3000/books/${id}`, 
                { inventory: newVal }
            )
            .then(book => console.log(book))
            .catch(e => console.error(e))
        }

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
            const updateBtn = document.createElement('button')
            const pInventory = document.createElement('input')
    
            h3.textContent = cardData.title
            pAuthor.textContent = cardData.author
            pPrice.textContent = `$${cardData.price}`
            btn.textContent = 'Delete'
            updateBtn.textContent = 'Update'
            pInventory.value = cardData.inventory
    
            img.src = cardData.imageUrl
            li.className = 'list-li'
            pInventory.type = 'number'
            pInventory.id = `inventory-${cardData.id}`
    
            //Event Listeners 
            btn.addEventListener('click', () =>  deleteResource(cardData.id, li))
        
            li.append(h3,pAuthor,pPrice,pInventory,img,btn,updateBtn)
            document.querySelector('#book-list').append(li)

            // console.log(cardData.id)
            
            // e.target.value => inventory input value
            // cardData.id => unique id of book card in question
            // handleUpdate(newVal, id)
            
            
            // Tie UPDATE Fetch Requests to 'click' Event
            updateBtn.addEventListener('click', () => { 
                const newInventory = document.querySelector(`#inventory-${cardData.id}`).value
                
                handleUpdate(newInventory, cardData.id)
            });

            // Tie UPDATE Fetch Requests to 'change' Event
            // pInventory.addEventListener('change', e => handleUpdate(e.target.value, cardData.id))
        }
    
    // Event Handlers
        function handleForm(e){
            e.preventDefault()
            //Builds Book
            const book = {
                title: e.target.title.value,
                author:e.target.author.value,
                price: e.target.price.value,
                imageUrl: e.target.imageUrl.value,
                inventory:e.target.inventory.value,
                reviews:[]
            }
            createResource('http://localhost:3000/books', book)
            .then(renderBookCard)
            .catch(e => console.error(e))

        }
    
    
    // Invoking functions    
        fetchResource('http://localhost:3000/stores/1')
        .then(store => {
            renderHeader(store)
            renderFooter(store)
        })
        .catch(e => console.error(e))
    
        fetchResource('http://localhost:3000/books')
        .then(books => books.forEach(renderBookCard))
        .catch(e => console.error(e))
    
        document.querySelector('#book-form').addEventListener('submit', handleForm)
})