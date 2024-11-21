// 1. createElemWithText Function
function createElemWithText(tagName = 'p', text = '', className = '') {
    const element = document.createElement(tagName);
    element.textContent = text;
    if (className) {
        element.className = className;
    }
    return element;
}

// 2. createSelectOptions Function
function createSelectOptions(users = []) {
    if (users.length === 0) return undefined;
    
    return users.map(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

// 3. toggleCommentSection Function
function toggleCommentSection(postId) {
    if (!postId) return undefined;
    
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (section) {
        section.classList.toggle('hide');
        return section;
    }
    return null;
}

// 4. toggleCommentButton Function
function toggleCommentButton(postId) {
    if (!postId) return undefined;

    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (button) {
        button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
        return button;
    }
    return null;
}

// 5. deleteChildElements Function
function deleteChildElements(element) {
  if (!element || !(element instanceof HTMLElement)) {
    return undefined; 
  }
  while (element.firstChild) {
    element.removeChild(element.firstChild); 
  }
  return element; 
}



// 6. addButtonListeners Function
function addButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  if (!buttons.length) return buttons;

  buttons.forEach(button => {
    const postId = button.dataset.postId;
    if (postId) {
      button.addEventListener('click', (event) => toggleComments(event, postId));
    }
  });

  return buttons;
}



// 7. removeButtonListeners Function
function removeButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  if (buttons.length === 0) {
    return buttons;
  }

  buttons.forEach(button => {
    const postId = button.getAttribute('data-postId');
    if (postId) {
      button.removeEventListener('click', function() {
        toggleComments(postId);
      });
    }
  });

  return buttons;
}


// 8. createComments Function
function createComments(comments = []) {
    if (comments.length === 0) return undefined;

    const fragment = document.createDocumentFragment();

    comments.forEach(comment => {
        const article = document.createElement('article');
        const h3 = document.createElement('h3');
        h3.textContent = comment.name;
        const p1 = document.createElement('p');
        p1.textContent = comment.body;
        const p2 = document.createElement('p');
        p2.textContent = `From: ${comment.email}`;

        article.appendChild(h3);
        article.appendChild(p1);
        article.appendChild(p2);

        fragment.appendChild(article);
    });

    return fragment;
}

// 9. populateSelectMenu Function
function populateSelectMenu(users = []) {
    if (!users || users.length === 0) return undefined;

    const selectMenu = document.getElementById('selectMenu');
    if (!selectMenu) return undefined;

    const options = createSelectOptions(users);
    options.forEach(option => selectMenu.appendChild(option));

    return selectMenu;
}

// 10. getUsers Function 
async function getUsers() {
    const url = 'https://jsonplaceholder.typicode.com/users';

    try {
        const response = await fetch(url);
        
        // Check if response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`Failed to fetch users data: ${response.status}`);
        }

        // Parse and return the response as JSON
        return await response.json();
    } catch (error) {
        console.error("Error fetching users data:", error);
        return undefined;  
    }
}


//11. getUserPosts Function
async function getUserPosts(userId) {
    if (!userId) {
        return undefined;  
    }

    const url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
    
    try {
        const response = await fetch(url);  
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return await response.json();  
    } catch (error) {
        console.error('Error fetching posts:', error);
        return undefined;
    }
}

//12. getUser Function
async function getUser(userId) {
    if (!userId) return undefined;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return undefined;
    }
}


//13. getPostComments Function
async function getPostComments(postId) {
    if (!postId) {
        return undefined;
    }

    const url = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch comments for post ${postId}: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching comments:", error);
        return undefined;
    }
}


//14. displayComments Function
async function displayComments(postId) {
    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');

    const comments = await getPostComments(postId);
    if (!comments) {
        return section;
    }

    const fragment = createComments(comments);
    section.appendChild(fragment);

    return section;
}

//15. createPosts Function
async function createPosts(posts) {
    if (!posts) return undefined;

    const fragment = document.createDocumentFragment();

    for (const post of posts) {
        const article = document.createElement('article');

        const h2 = document.createElement('h2');
        h2.textContent = post.title;

        const pBody = document.createElement('p');
        pBody.textContent = post.body;

        const pId = document.createElement('p');
        pId.textContent = `Post ID: ${post.id}`;

        const author = await getUser(post.userId);
        const pAuthor = document.createElement('p');
        pAuthor.textContent = `Author: ${author.name} with ${author.company.name}`;

        const pCatchphrase = document.createElement('p');
        pCatchphrase.textContent = author.company.catchPhrase;

        const button = document.createElement('button');
        button.textContent = 'Show Comments';
        button.dataset.postId = post.id;

        article.append(h2, pBody, pId, pAuthor, pCatchphrase, button);

        const section = await displayComments(post.id);
        article.appendChild(section);

        fragment.appendChild(article);
    }

    return fragment;
}

//16. displayPosts Function
async function displayPosts(posts) {
    const mainElement = document.querySelector('main');
    let element;

    if (posts && posts.length > 0) {
        element = await createPosts(posts);
    } else {
        element = document.createElement('p');
        element.textContent = "Select an Employee to display their posts.";
        element.classList.add('default-text');
    }

    mainElement.appendChild(element);
    return element;
}

//17. toggleComments Function
function toggleComments(event, postId) {
    if (!event || !postId) {
        return undefined;
    }

    event.target.listener = true;

    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section, button];
}


//18. refreshPosts Function
async function refreshPosts(posts) {
    if (!posts) {
        return undefined;
    }

    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector('main'));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];
}


//19. selectMenuChangeEventHandler Function
async function selectMenuChangeEventHandler(event) {
    if (!event || !event.target || !event.target.value) {
        return undefined;
    }

    const selectMenu = event.target;
    selectMenu.disabled = true;

    const userId = parseInt(selectMenu.value) || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);

    selectMenu.disabled = false;

    return [userId, posts, refreshPostsArray];
}


//20. initPage Function
async function initPage() {
    const users = await getUsers(); 
    const select = populateSelectMenu(users); 

    return [users, select];
}


//21.  initApp Function
function initApp() {
    initPage(); 

    const selectMenu = document.getElementById('selectMenu'); 

    // Add an event listener to the #selectMenu for the "change" event
    selectMenu.addEventListener('change', (event) => {
        selectMenuChangeEventHandler(event); 
    });
}
document.addEventListener("DOMContentLoaded", initApp);
