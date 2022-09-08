document.addEventListener('DOMContentLoaded', () => {
    
    // Fetch Requests 
        // Function for making a GET request 
        // /books + /books/:id
        // /stores + /stores/:id 
        function getResource(url){
            return fetch(url)
            .then(res => res.json());
        }

        // Function for making a POST request 
        // /books + /stores => Add New Individual Records
        function createResource(url, body){
            return fetch(url,{
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
            .then(res => res.json());
        }

        // Function for making a PATCH request 
        // /books/:id + /stores/:id => Update Individual Records
        function updateResource(url, newInventory) {
            return fetch(url, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inventory: newInventory })
            })

            // res.json() => Parsing JSON to JS
            // JSON.stringify(obj) => Parsing JS to JSON

            .then(res => res.json());
        }

        // Function for making a DELETE request
        // /books/:id + /stores/:id => Delete Individual Records
        function deleteResource(id) {
            return fetch(`http://localhost:3000/books/${id}`, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

    // Functions for Handling DOM Rendering
        function handleDelete(id, li) {
            deleteResource(id)
            .then(() => li.remove())
            .catch(console.error);
        }

        function handleUpdate(newInventory, id) {
            updateResource(`http://localhost:3000/books/${id}`, newInventory)
            .then(console.log)
            .catch(console.error);
        }

    // Rendering functions
        // Render Header
        function renderHeader(store){
            document.querySelector('h1').textContent = store.name;
        }
        // Render Footer
        function renderFooter(store){
            const footerDivs = document.querySelectorAll('footer div');
            footerDivs[0].textContent = store.name;
            footerDivs[1].textContent = store.address;
            footerDivs[2].textContent = store.hours;
        }
    
        // Render Each Book Card
        function renderBookCard(cardData) {
            const li = document.createElement('li');
            const h3 = document.createElement('h3');
            const pAuthor = document.createElement('p');
            const pPrice = document.createElement('p');
            const img = document.createElement('img');
            const deleteBtn = document.createElement('button');
            const updateBtn = document.createElement('button');
            const pInventory = document.createElement('input');
    
            h3.textContent = cardData.title;
            pAuthor.textContent = cardData.author;
            pPrice.textContent = `$${cardData.price}`;
            deleteBtn.textContent = 'Delete';
            updateBtn.textContent = 'Update';
            pInventory.value = cardData.inventory;
    
            img.src = cardData.imageUrl;;
            li.className = 'list-li';
            pInventory.type = 'number';
            pInventory.id = `inventory-${cardData.id}`;
    
            //Event Listeners 
            deleteBtn.addEventListener('click', () =>  handleDelete(cardData.id, li));

            // Tie UPDATE Fetch Requests to 'click' Event
            updateBtn.addEventListener('click', () => { 
                const newInventory = document.querySelector(`#inventory-${cardData.id}`).value;;
                
                handleUpdate(newInventory, cardData.id);
            });

            // Tie UPDATE Fetch Requests to 'change' Event
            // pInventory.addEventListener('change', e => handleUpdate(e.target.value, cardData.id))
        
            li.append(h3,pAuthor,pPrice,pInventory,img,updateBtn,deleteBtn);
            document.querySelector('#book-list').append(li);
        }
    
    // Event Handlers
        function handleForm(e){
            e.preventDefault();
            
            // Build new book object using form values, parsing
            // as necessary to keep new and existing data aligned
            const book = {
                title: e.target.title.value,
                author: e.target.author.value,
                price: parseFloat(e.target.price.value),
                imageUrl: e.target.imageUrl.value,
                inventory: parseInt(e.target.inventory.value),
                reviews:[]
            };

            createResource('http://localhost:3000/books', book)
            .then(renderBookCard)
            .catch(e => console.error(e));
        }

        function handleRenderHome() {
            document.querySelector('main').innerHTML = `
            <div id="form-wrapper">
                <div id="api-search"></div>
                <form id="book-form">
                
                    <label for="title">Title:</label>
                    <input type="text" id="form-title" name="title">
        
                    <label for="author">Author:</label>
                    <input type="text" id="form-author" name="author">
                
                    <label for="price">Price:</label>
                    <input type="number" id="form-price" name="price">
                
                    <label for="imageUrl">Image url:</label>
                    <input type="text" id="form-imageUrl" name="imageUrl">
                
                    <label for="inventory">Inventory:</label>
                    <input type="text" id="inventory" name="inventory">
                    
                    <input type="submit" value="ADD BOOK"/>
                </form>
            </div>
            <div class="list">
                <ul id="book-list">
                </ul>
            </div>
            `
            
            loadPage();
        }

        function handleRenderSearch(){
            document.querySelector('main').innerHTML = `
            <form id="api-Search">
                <label>API Search<label>
                <input type="text" name="search"></input>
                <input type="submit"></input>
            </form>
            `;

            document.querySelector('#api-search').addEventListener('submit', handleAPIQuery);
        }
        //Handles Google Books API search
        function handleAPIQuery(e){
            e.preventDefault();
            const search = e.target.search.value;

            // simple test to start
            console.log(search);
        }

        function loadPage() {
            getResource('http://localhost:3000/stores/1')
            .then(store => {
                renderHeader(store)
                renderFooter(store)
            })
            .catch(e => console.error(e));
        
            getResource('http://localhost:3000/books')
            .then(books => books.forEach(renderBookCard))
            .catch(e => console.error(e));
        }

    // Invoking functions    
        
        loadPage();
        document.querySelector('#book-form').addEventListener('submit', handleForm);
        document.querySelector('#nav-search').addEventListener('click', handleRenderSearch);
        document.querySelector('#nav-home').addEventListener('click', handleRenderHome);
})