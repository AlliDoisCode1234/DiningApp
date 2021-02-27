- [1. Planning](#1-planning)
  - [1.1. Basic Microservices and Business Microservices](#11-basic-microservices-and-business-microservices)
  - [1.2. Code Design](#12-code-design)
  - [1.3. Tradeoffs](#13-tradeoffs)
  - [1.4. Assumptions](#14-assumptions)
  - [1.5. Improved Design](#15-improved-design)
  - [1.6. Written section](#16-written-section)
  - [1.7. Extras](#17-extras)
    - [1.7.1. HTTPS](#171-https)
    - [1.7.2. Security](#172-security)
    - [1.7.3. Fun with Streams](#173-fun-with-streams)
    - [1.7.4. Postman Documentation](#174-postman-documentation)

# 1. Planning

## 1.1. Basic Microservices and Business Microservices

(left side, business microservices, right side, dependent basic microservices)

- Enroll - focused on things like setting User Allergies & User Budget (userAllergies N:N, userBudget 1:1) & KnownAllergens, and create Accounts. This microservice for example, is the Accounts microservice. The enroll microservice depends on this functionality/api.
- Billing/PO - focused on things like list Recipes, Ingredients, Recipe Components, User Orders
- Settings - the account settings (set/get allergies, budget)

Enroll

1. Create user
2. Set budget settings
3. Set allergies settings

PO

1. Add recipe to order for the current week
2. Show recipes in order for user for the current week
3. List recipes within (number, list) - only Recipe PO should have access to this, with their ingredients

Settings

1. Get Account budget
2. Get Account allergies

PO and Settings depend on **Recipe PO**

Recipe PO

1. List recipes within (account budget & within account allergies constraints and list ingredients)

## 1.2. Code Design

- Controllers - Routes
- Services - POJOS, DB Service (if applicable), API Service

## 1.3. Tradeoffs

Additional request required to access CRUD Rest API in exchange for simplicity. An alternative to this would be to
share the database api, and have the individual apis perform public but scoped requests. That way, shared data can be
performed by apis who are share multiple database apis from different 'basic' microservices. _By basic I mean that these
apis generally perform CRUD operations._

Secondly users are recipes components are stored by using a reference \_id as their key. This is beneficial because we can easily
change usernames and have this be a reflection in our data integrity - meaning that all other references to that user like the user's
budget would be linked to the same user, despite changing the username in the Accounts table.

User and Account used interchangeably.

Because of this, we are most likely forced to index / compound index, as we are using the reference id to maintain data fidelity/veracity,
however certain ms/databases may use a primary key lookup such as UserAllergiesSettings, UserBudgetSettings since their relationship are 1:1 to the Account/User

## 1.4. Assumptions

Initial Assumptions : A user's budget is set once, but should be changeable. It should be done after a new account is created.
A user's budget with a Percent Factor (Float 0.0-1.0) & Expected Meals per week (Number) determines what is in a user's budget on the basis of the
recipe cost vs this computed value
A user should be able to add this many recipes per week, and should be allowed to remove recipes from the week order, and not exceed his week total.

Simply, a user views recipes only within his budget settings based on an average price expectancy, showing all recipes <= the price of the limit.
And a user may only be able to add a certain number of recipes based on his settings as well

A user may change the budget settings, but when doing so it will remove the week's orders.

**Improving Design** : Functionality consideration should be given to adding recipes of any price range, and add those to the order, so long as it is within a budget settings criteria. Perhaps a user's budget can be calculated more accurately by saying (budget - (cost of current recipes)) && also limiting by
recipe order count as well. This is definitely a better approach. The current design now reflects this idea.

We realize we need to visualize the user's activity from start to finish - the entire flow - to understand the core business logic required to
build the app. Then we can take this business logic and separate them into individual microservices.

## 1.5. Improved Design

- L0 Database

- L1 Basic Microservices () (User Allergies, User Budget, KnownAllergens) (private)

- L2 Business Microservices (Settings, Billing, Enroll)

- L3 Advanced Business Microservices (ie Recipe PO)

## 1.6. Written section

1. Node is fast, especially with streams / async batching and forking with fast-fail (async in javascript is still implemented using callbacks, promises or async). Mongo is incredible fast as well, when lookups involve PKs, index or compound indexing.
2. While the design is simple, it requires that we do quite a lot to achieve the impact on performance and scalability we need. We have to build each one of these microservices, point them to their appropriate databases or dependencies, and write a database layer or service layer on top of that for each api. Then we have to scale the containers using a load balancer, replicate / shard the databases, implement mechanisms for fail precaution such as queues. Then we have to write unit tests, and integration tests for each one of our microservices. And before any of this is done, we have to provision the environments required for dev, qa prod etc and build tools like Jenkins
   ie. Jenkins : First, a developer commits the code to the source code repository. ... Soon after a commit occurs, the Jenkins server detects the changes that have occurred in the source code repository. Jenkins will pull those changes and will start preparing a new build. If the build fails, then the concerned team will be notified.
   In the future, we can use docker-compose to spin up these microservices with their database dependencies for better utilization of resources, and for more controller orchestrations.
3. Described in the Assumptions section
4. Described in the Tradeoffs section

**Limit Scope**

Core focus : scalability / performance. Considerations made such as streaming, database and microservices scaling, fault tolerance, database optimization, network query / algorithm optimization ( fail-fast promise, best-case optimizations, streaming ). (Vertical / Horizontal scaling)

Planning (1/3) - what do I need to do to achieve my goals? How can I get there?

Design (1/3) - what are some of the ways we can design this? To design this, we must properly understand it. Go back to Planning if this is an issue. Keep it simple.

Coding (1/3) - How does the code look to reflect the design? What design patterns should I use to reflect the design well? How can I keep the code simple, since the design is simple?

## 1.7. Extras

### 1.7.1. HTTPS

https://blog.jscrambler.com/setting-up-5-useful-middlewares-for-an-express-api/

### 1.7.2. Security

Will need to consider mitigation against Replays / DDOS

### 1.7.3. Fun with Streams

While specific instances of **Writable** streams may differ in various ways, all Writable streams follow the same fundamental usage pattern as illustrated in the example below:

```
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```

Readable.from(): Creating **readable** streams from iterables
stream. Readable.from(iterable, [options]) it’s a utility method for creating Readable Streams out of iterators, which holds the data contained in iterable. Iterable can be a synchronous iterable or an asynchronous iterable. The parameter options is optional and can, among other things, be used to specify a text encoding.

```
const { Readable } = require('stream');

async function \* generate() {
yield 'hello';
yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
console.log(chunk);
});
```

### 1.7.4. Postman Documentation

https://documenter.getpostman.com/view/12244200/TWDRrehB

Todo : Swagger docs
