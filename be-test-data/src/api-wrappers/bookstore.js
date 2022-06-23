const { request } = require('../helpers/requester')

const getAllBookstoreBooks = async ({ 
  token,

  method = 'GET',
  body,
  headers = {
    'content-type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  isRaw = false,
} = {}) => {
  const res = await request(
    method,
    `${global.TEST_URL}/BookStore/v1/Books`,
    {
      ...body,      
    },
    {
      headers
    }
  );

  if (isRaw) {
    return res;
  }
  global.expect(res.statusCode, `getAllBookstoreBooks :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(200)
  return res.body;
}

const getBookstoreBookByIsbn = async ({ 
  isbn,

  method = 'GET',  
  body,
  headers = {
    'content-type': 'application/json',
  },
  isRaw = false,
} = {}) => {
  const res = await request(
    method,
    `${global.TEST_URL}/BookStore/v1/Book?ISBN=${isbn}`,
    {
      ...body,      
    },
    {
      headers
    }
  );

  if (isRaw) {
    return res;
  }
  global.expect(res.statusCode, `getBookstoreBookByIsbn :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(200)
  return res.body;
}

const addBooksToCustomerCollection = async ({ 
  userId,
  collectionOfIsbns,
  token,
  method = 'POST',  
  body,
  headers = {
    'content-type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  isRaw = false,
}) => {
  // TODO: read swagger docs
  if (!isRaw) {
    global.expect(userId).to.be.a('string');
    global.expect(collectionOfIsbns).to.be.a('array')
    for(const elem of collectionOfIsbns) {
      global.expect(elem).to.be.a('object');
      global.expect(elem).to.have.all.keys('isbn');
      global.expect(elem.isbn).to.be.a('string');
    }
  }

  const res = await request(
    method,
    `${global.TEST_URL}/BookStore/v1/Books`,
    {
      userId,
      collectionOfIsbns,    
      ...body,      
    },
    {
      headers
    }
  );

  if (isRaw) {
    return res;
  }
  global.expect(res.statusCode, `addBooksToCustomerCollection :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(201)
  return res.body;
}

const deleteAllBooksFromCustomerCollection = async ({ 
  userId,
  token,

  method = 'DELETE',
  body,
  headers = {
    'content-type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  isRaw = false,
} = {}) => {
  const res = await request(
    method,
    `${global.TEST_URL}/BookStore/v1/Books?UserId=${userId}`,
    {
      ...body,      
    },
    {
      headers
    }
  );

  if (isRaw) {
    return res;
  }
  global.expect(res.statusCode, `deleteAllBooksFromCustomerCollection :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(204)
  return res.body;
}

const deleteBookFromCustomerCollection = async ({ 
  userId,
  isbn,
  token,

  method = 'DELETE',  
  body,
  headers = {
    'content-type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  isRaw = false,
} = {}) => {
  const res = await request(
    method,
    `${global.TEST_URL}/BookStore/v1/Books?UserId=${userId}`,
    {
      isbn,
      userId,
      ...body,      
    },
    {
      headers
    }
  );

  if (isRaw) {
    return res;
  }
  global.expect(res.statusCode, `deleteAllBooksFromCustomerCollection :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(204)
  return res.body;
}

module.exports = {
  getAllBookstoreBooks,
  getBookstoreBookByIsbn,
  addBooksToCustomerCollection,
  deleteBookFromCustomerCollection,
  deleteAllBooksFromCustomerCollection,
}
