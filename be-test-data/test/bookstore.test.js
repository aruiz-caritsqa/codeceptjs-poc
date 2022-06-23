const {
  createUserAccount,
  generateToken,
  getUserAccount,
  deleteUserAccount,
} = require('../src/api-wrappers/account');
const {
  getAllBookstoreBooks,
  getBookstoreBookByIsbn,
  addBooksToCustomerCollection,
  deleteAllBooksFromCustomerCollection,
  deleteBookFromCustomerCollection,
} = require('../src/api-wrappers/bookstore');
const L = require('lodash');
const { parse } = require('node-html-parser');

const usernamePassword = 'Testing123123!'

Feature('Bookstore Endpoints @bookstore');
let userID;
let token;

Scenario('Create new user via API; Should authorize successfully; Should get token; Should find user via API', async ({ I }) => {  
  ({ userID } = await createUserAccount({ userName: usernamePassword, password: usernamePassword}));
  I.addLogMessageToAllure(`userID: ${JSON.stringify(userID, null, 2)}`);

  await I.wait(1);

  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  I.addLogMessageToAllure(`token: ${JSON.stringify(token, null, 2)}`);

  const userAccount = await getUserAccount({ token, userID });
  I.addLogMessageToAllure(`userAccount: ${JSON.stringify(userAccount, null, 2)}`);

  global.expect(userAccount).to.containSubset({
    userId: (v) => global.expect(v).to.be.a('string'),
    username: usernamePassword,
    books: (v) => global.expect(v).to.be.an('array').that.is.empty,
  })
})

Scenario('Add single Book to Customer Collection; Verify book is added to User Account', async ({ I }) => {
  const allBooks = await getAllBookstoreBooks();

  const randomIsbn = L.sample(allBooks.books).isbn;
  await addBooksToCustomerCollection({ userId: userID, token, collectionOfIsbns: [{ isbn: randomIsbn }]})

  const userAccount = await getUserAccount({ token, userID });  

  global.expect(userAccount).to.containSubset({
    books: (v) => global.expect(v).to.be.an('array') && global.expect(v).to.have.lengthOf(1),
  })
  global.expect(userAccount).to.containSubset({
    books: [{
      isbn: randomIsbn
    }],
  })
  I.addLogMessageToAllure(`user: ${JSON.stringify(userAccount, null, 2)}`);
});

Scenario('Should login & see the book in the Customer Collection', async ({ I, LoginPage, ProfilePage }) => {
  await LoginPage.loginToBookstore(usernamePassword, usernamePassword);
  // await ProfilePage.checkUrl();
  await I.addScreenshotToAllure();

  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  const userAccount = await getUserAccount({ token, userID });  

  I.addLogMessageToAllure({ userAccount, token}, 'Custom Message');  

  const helper = Object.entries(global.codeceptjs.container.helpers())[0][1];
  await I.waitForVisible(ProfilePage.bookCollectionRows());

  const bookCollectionRows = await I.getElements(ProfilePage.bookCollectionRows())
  global.expect(bookCollectionRows).to.have.lengthOf(1);
  debugger;

  const [link] = await bookCollectionRows[0].$('.//a');
  
  const linkObjHref = await I.getAttributeFromElement(link, 'href');
  global.expect(linkObjHref).to.have.string(userAccount.books[0].isbn);

  const linkObjText = await I.getTextFromElement(link);
  global.expect(linkObjText).to.equal(userAccount.books[0].title);
});

Scenario('Delete the book from the Customer Collection', async ({ I }) => {
  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  let userAccount = await getUserAccount({ token, userID });  

  await deleteBookFromCustomerCollection({ userId: userID, isbn: userAccount.books[0].isbn, token });

  userAccount = await getUserAccount({ token, userID });  
  global.expect(userAccount).to.containSubset({
    books: (v) => global.expect(v).to.be.an('array').that.is.empty,
  })
});

Scenario('Add Multiple Books to Customer Collection; Verify books are added to User Account', async ({ I }) => {
  const allBooks = await getAllBookstoreBooks();

  const randomIsbns = L.sampleSize(allBooks.books, 3).map((b) => b.isbn);

  for (let randomIsbn of randomIsbns) {
    await addBooksToCustomerCollection({ userId: userID, token, collectionOfIsbns: [{ isbn: randomIsbn }]})
  }
  
  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  const userAccount = await getUserAccount({ token, userID });  
  global.expect(userAccount).to.containSubset({
    books: (v) => global.expect(v).to.be.an('array') && global.expect(v).to.have.lengthOf(3),
  });

  const userAccountBookCollectionIsbns = userAccount.books.map((b) => b.isbn);
  for (let randomIsbn of randomIsbns) {
    global.expect(userAccountBookCollectionIsbns).to.include(randomIsbn);
  }

  I.addLogMessageToAllure(`user: ${JSON.stringify(userAccount, null, 2)}`);
});

Scenario('Should login & see the books in the Customer Collection using I.grab functions', async ({ I, LoginPage, ProfilePage }) => {
  await LoginPage.loginToBookstore(usernamePassword, usernamePassword);
  // await ProfilePage.checkUrl();
  
  await I.addScreenshotToAllure();
  
  await I.waitForVisible(ProfilePage.bookCollectionRows());
  const bookTitles = await I.grabTextFromAll(ProfilePage.bookCollectionRows())
  console.log(bookTitles);
  I.addLogMessageToAllure(JSON.stringify(bookTitles));

  const bookLinks = await I.grabAttributeFromAll(`${ProfilePage.bookCollectionRows()}//a`, 'href');
  console.log(bookLinks);
  I.addLogMessageToAllure(JSON.stringify(bookLinks));

  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  const userAccount = await getUserAccount({ token, userID });  
  global.expect(userAccount).to.containSubset({
    books: (v) => global.expect(v).to.be.an('array') && global.expect(v).to.have.lengthOf(3),
  })

  for (let i=0; i<userAccount.books.length; i+=1) {
    global.expect(bookLinks[i]).to.have.string(userAccount.books[i].isbn)
    global.expect(bookTitles[i]).to.have.string(userAccount.books[i].title);
  }    
});

Scenario('Should login & see the books in the Customer Collection using helper._locate', async ({ I, LoginPage, ProfilePage }) => {
  await LoginPage.loginToBookstore(usernamePassword, usernamePassword);
  await I.waitForVisible(ProfilePage.bookCollectionRows());

  const bookCollectionRows = await I.getElements(ProfilePage.bookCollectionRows());

  global.expect(bookCollectionRows).to.have.lengthOf(3);

  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  const userAccount = await getUserAccount({ token, userID });  
  global.expect(userAccount).to.containSubset({
    books: (v) => global.expect(v).to.be.an('array') && global.expect(v).to.have.lengthOf(3),
  })

  for (let i=0; i<userAccount.books.length; i+=1) {
    const [link] = await bookCollectionRows[i].$('.//a');
    const { href: linkObjHref, text: linkObjText } = await I.executeScript(function(el) {
      return {
        href: el.href,
        text: el.textContent
      };
    }, link);
    console.log(`linkObjHref: ${linkObjHref}, linkObjText: ${linkObjText}`);  
    I.addLogMessageToAllure(`linkObjHref: ${linkObjHref}, linkObjText: ${linkObjText}`);  

    global.expect(linkObjHref).to.have.string(userAccount.books[i].isbn)
    global.expect(linkObjText).to.have.string(userAccount.books[i].title);
  }
});

Scenario('Should login & see the books in the Customer Collection using node-html-parser', async ({ I, LoginPage, ProfilePage }) => {
  await LoginPage.loginToBookstore(usernamePassword, usernamePassword);

  await I.waitForVisible(ProfilePage.bookCollectionRows());
  const bookRows = await I.grabHTMLFromAll(ProfilePage.bookCollectionRows());
  global.expect(bookRows).to.have.lengthOf(3);

  const html = parse(bookRows);

  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  const userAccount = await getUserAccount({ token, userID });  
  global.expect(userAccount).to.containSubset({
    books: (v) => global.expect(v).to.be.an('array') && global.expect(v).to.have.lengthOf(3),
  })

  for (let i=0; i<userAccount.books.length; i+=1) {
    const [bookLink] = html.querySelectorAll(`a[href="/profile?book=${userAccount.books[i].isbn}"]`);
    global.expect(bookLink.childNodes[0].text).to.equal(userAccount.books[i].title);  
  }
});

Scenario('Delete all books from the Customer Collection', async ({ I }) => {
  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  await deleteAllBooksFromCustomerCollection({ userId: userID, token });

  const userAccount = await getUserAccount({ token, userID });  
  global.expect(userAccount).to.containSubset({
    books: (v) => global.expect(v).to.be.an('array') && global.expect(v).to.have.lengthOf(0),
  })
});


Scenario('Should login & see no books in the Customer Collection', async ({ I, LoginPage, ProfilePage }) => {
  await LoginPage.loginToBookstore(usernamePassword, usernamePassword);
  // await ProfilePage.checkUrl();

  const helper = Object.entries(global.codeceptjs.container.helpers())[0][1];
  await I.dontSee(ProfilePage.bookCollectionRows());
});

Scenario('Should Delete User', async ({ I }) => {
  ({ token } = await generateToken({ userName: usernamePassword, password: usernamePassword}));
  const user = await getUserAccount({ token, userID });
  I.addLogMessageToAllure(`user: ${JSON.stringify(user, null, 2)}`);

  const res = await deleteUserAccount({ userID, token, isRaw: true });
  global.expect(res.statusCode).to.equal(204)

  await global.expect(getUserAccount({ token, userID })).to.eventually.be.rejectedWith('401');
})