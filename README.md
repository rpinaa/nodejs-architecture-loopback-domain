# nodejs-architecture-loopback-domain
NodeJS 7 non-blocking I/O Architecture, using Loopback and Domain layer

## Requirements

- NodeJS 7.5+

## Stack

- JavaScript 6
- Loopback 3.x
- Async 2.x

## Contribution guide

### Remotes

The **remotes** follow the convention:

- _**origin**_: fork in the account of the developer

- _**upstream**_: main repository

### Building

Install the dependencies before start:

```sh
$ sudo npm install -g strongloop
$ cd nodejs-architecture-loopback-domain
$ sudo npm install -d
```

For local environment:

```sh
$ NODE_ENV=local node .
```

For development environment:

```sh
$ NODE_ENV=development node .
```

For staging environment:

```sh
$ NODE_ENV=staging node .
```

For production environment:

```sh
$ NODE_ENV=production node .
```

### Project structure

```
common/                     --> store all components which are related with the business rules and the client integration
  models/                   --> store domain layer, mapper layer or service layer
    order.js/               --> order service
    order.json/             --> order domain
    order-mapper.js/        --> order-mapper service
    order-mapper.json/      --> order-mapper mapper
server/                     --> store all components which are related with the data sources
  boot/                     --> store all boot components which are needed by the bootstrapping of the application
    authentication.js       --> default script to enable/disable the auth native service
    root.js                 --> default script to define the main front controller
    model.js                --> custom sccript to persist entity models, acl model, access token model or another kind of model
  models/                   --> store all components which are related with data bases, SOA conexions, rest/soap integrations, etc.
    address-entity.js       --> address-entity entity
    address-entity.json     --> address-entity scheme
    order-entity.js         --> order-entity entity
    order-entity.json       --> order-entity scheme
```

## License

MIT

**Free Software, Hell Yeah!**
