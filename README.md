# Node TypeScript API

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/): Ensure that Node.js, preferably version 16 or higher, is installed on your system, as this project utilizes the latest versions of TypeScript and Nodemon.
- [npm](https://www.npmjs.com/): npm is the package manager for Node.js and comes with the Node.js installation.

Node 20.15.1 was used in the development of this application.

### Installation

Install the dependencies:

```
npm install
```

### Usage

In development the following command will start the server and use `nodemon` to auto-reload the server based on file changes

```
npm run dev
```

The server will start at `http://localhost:3000` by default.

Run the command below to execute tests:

```
npm run test
```

To compile the app in Javscript run:

```
npm run build
npm start

```

#### Postman Testing Examples

post /api/signup

```
{
  "fullName": "Justin Bosman",
  "email": "justin.bosman@example.com",
  "password": "Password1",
  "userType": "teacher",
  "createdAt": "2025-03-20T12:34:56.789Z"
}
```

get /api/user/{id}

### Future Iterations

#### Codebase

I have moved methods into their own directories to demostrate how I would structure a large repository of APIs. I would not use index filesas I have here because each "category" of route would be put into their own file. Using an index.ts file for this purpose was the most logical in my opinion. It would have been easy to do this in a single "server.ts" file.

I used SQLlite for a local store as suggested, an alternative would have been to add a docker file with a database image but this seemed unnecessary given the ease of implementing SQLlite. I could reuse the schema validation as a middleware option at route level in the routes/index.ts file if we had a larger number of routes so that I removed the logic from the controller. My preference would be to keep the controller as small as possible and move logic away to specific methods.

I will mention error handling and testing below.

Regarding linting, I have not used the eslint packages installed. I have linting set on my IDE which works for me. If this is important for this test it would be something I can setup.

#### Routing Structure

I structutured the routing into Routes/Controllers/Services because it kind of represents the MVC pattern style which I think is a clear way to organise and backend API project. I have not adhered to fully an mvc style here. I prefer to call the model logic of fetching data into a Services directory because in larger codebases these functions are used as a service to other controllers and operations. When we have a large number of routes these can be easily organised into there own files such as routes/account or routes/<productname> etc. This makes the codebase cleaner and more structured. This would also allow me to join controllers onto each other for a single route for example

```ts
accountRoute
  .route('/')
  .get(getAllAccountDetails)
  .post(postNewAccount)
  .all(handleErrorsMethod);
```

This is quite neat and easy to understand.

With more time I would add a login endpoint that accepts a users email address and password. This would allow me to demostrate a how we could add additional security layers which I will mention in the Security section below.

#### Error Handling

On a larger app, the error handling could be moved to custom methods, that way we could capture database specific errors. I would also remove setting the res status for errors as I have done the controllers and use the NextFunction from express and catch(next) in the controller. Using error middleware in the root of the express server all my error handling would then be passed through custom error handlers.

My controller would look like this

```ts
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<Response<PartialUserResponse>> => {
  try {
    const userPayload = req.body;

    // This would be moved to routes/index.ts as route level middleware
    // <!-- const isValidUserPayload = userSchema.safeParse(userPayload);
    // if (!isValidUserPayload.success) {
    //   return res.status(400).json({ errors: isValidUserPayload.error.errors });
    // } -->

    const user = await insertUser(userPayload);

    return res.status(201).json({ user });

  } catch (next)
};
```

A custom handler would look like this and would passed as middleware in server.ts

```ts
export const handleServerErrors = (
  err: Error,
  req: Request,
  res: Repsonse,
  next: NextFunction,
) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};
```

#### Security

One consideration could be add security on the get user by id route. Since its likely we would only want a succesful response from the GET endpoint if the user was actually authorised to do so. Many options exist for this like Auth0 which provides us with a number of features. My choice for this purpose however would be to implement a token based authentication middleware which would generate a user specific access token. The controller would be updated to use middleware verfiy the tokens validity using a secret signing key and an expiry time. If the access token is not valid we would return 401 error code and require the user to login. I added some encryption on the password and created a response type for the user PartialUserResponse. The encrption ensures the password is stored in our database in a safe way, the partial response type shows that we only return the user information with the password. To prevent us from oversharing or passing unnecessary data around in our requests. In the post I returned the partial response for demostration purposes, I would not return the new user data if it was not necessary.

#### Testing

I have used Jest to test the endpoints. In the past I have used mocha chai as I believed Jest to be more suitable to front end testing. However, Jest was easy to implement and the documentation was clear. All I wanted to test was that the routes returned the correct error codes for the scenario, that the logic in Services method returned the expected data given the purpose of the endpoint. In this case i believe it was only necessary to test that a correct 200 code was returned for a successful operation along with the expected data. For paths that did not exist yet or missing request body and paramaters we returned 400 and 404 error codes. Further tests that I could have added would be correctly returning 405 codes for not allowed methods. However I had not implemented this error handling. I did not test the utils/index.ts file which only has one function for the user schema validation because I would essentially be testing that dependency works.
