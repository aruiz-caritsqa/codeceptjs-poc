const { request } = require('../helpers/requester')

const isAuthorized = async ({ 
  userName, 
  password,

  method = 'POST',
  body,
  headers = {
    'content-type': 'application/json'
  },
  isRaw = false,
}) => {
  if (!isRaw) {
    global.expect(userName).to.be.a('string');
    global.expect(password).to.be.a('string');
  }

  const res = await request(
    method,
    `${global.TEST_URL}/Account/v1/Authorized`,
    {
      ...body,      
      userName,
      password,      
    },
    {
      headers
    }
  );

  if (isRaw) {
    return res;
  }
  global.expect(res.statusCode, `isAuthorized :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(200)
  return res.body;
}

const generateToken = async ({ 
  userName, 
  password,

  method = 'POST',
  body,
  headers = {
    'content-type': 'application/json'
  },
  isRaw = false,
}) => {
  if (!isRaw) {
    global.expect(userName).to.be.a('string');
    global.expect(password).to.be.a('string');
  }

  const res = await request(
    method,
    `${global.TEST_URL}/Account/v1/GenerateToken`,
    {    
      ...body,      
      userName,
      password,            
    },
    {
      headers
    }
  );

  if (isRaw) {
    return res;
  }
  global.expect(res.statusCode, `generateToken :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(200)
  return res.body;
}

const createUserAccount = async ({
  userName, 
  password,

  method = 'POST',
  body,
  headers = {
    'content-type': 'application/json'
  },
  isRaw = false,
}) => {
  if (!isRaw) {
    global.expect(userName).to.be.a('string');
    global.expect(password).to.be.a('string');
  }

  const res = await request(
    method,
    `${global.TEST_URL}/Account/v1/User`,
    {
      ...body,      
      userName,
      password,      
    },
    {
      headers
    }
  );

  if (isRaw) {
    return res;
  }
  global.expect(res.statusCode, `createUserAccount :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(201)
  return res.body;
}

const deleteUserAccount = async ({
  userID,
  token,

  method = 'DELETE',
  body = undefined,
  headers = {
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json'
  },
  isRaw = false,
}) => {
  if (!isRaw) {
    global.expect(userID).to.be.a('string');
    global.expect(token).to.be.a('string');
  }

  const res = await request(
    method,
    `${global.TEST_URL}/Account/v1/User/${userID}`,
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
  global.expect(res.statusCode, `deleteUserAccount :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(204)
  return res.body;
}

const getUserAccount = async ({
  userID,
  token,  

  method = 'GET',
  body = undefined,
  headers = {
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json'
  },
  isRaw = false,
}) => {
  if (!isRaw) {
    global.expect(userID).to.be.a('string');
    global.expect(token).to.be.a('string');
  }

  const res = await request(
    method,
    `${global.TEST_URL}/Account/v1/User/${userID}`,
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
  global.expect(res.statusCode, `getUserAccount :: Unexpected statusCode: ${res.statusCode} => ${JSON.stringify(res.body)}`).to.equal(200)
  return res.body;
}

module.exports = {
  isAuthorized,
  generateToken,
  createUserAccount,
  deleteUserAccount,
  getUserAccount,
}