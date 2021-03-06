# nodejs-architecture-loopback-domain
NodeJS 9 non-blocking I/O Architecture, using Loopback and Domain layer

## Requirements

- NodeJS 9+

## Stack

- JavaScript 6
- Loopback 3.x
- Loopback Boot 2.x
- Loopback Explorer 5.x
- Loopback Limit Max 1.x
- Loopback Mysql 5.x

## Loopback Enterprise Architecture

In a real application we need enterprise components which have the necessary quality attributes. This is an example of maintainability and efficiency working with NodeJS applications.  

```
Order.createOrder = (order, cb) => {
    const sourceOrder = new Order(OrderMapper.map(order));

    return OrderEntity
      .find({where: {name: sourceOrder.name}})
      .then(OrderEntity.throwErrorIfExist)
      .then(() => OrderEntity.beginTransaction('READ COMMITTED', AbstractEntity.getTx))
      .then(async transaction => {
        const addressEntity = new AddressEntity(sourceOrder.address);
        const orderEntity = new OrderEntity(sourceOrder);
    
        const ctxAddressEntity = await AddressEntity.create(addressEntity, {transaction});
    
        orderEntity.address(ctxAddressEntity);
    
        const ctxOrderEntity = await OrderEntity.create(orderEntity, {transaction});
        const order = new Order(ctxOrderEntity);
    
        order.address = ctxAddressEntity;
    
        return OrderMapper.reverseMap(order);
      })
      .catch(cb);
};
```

## Contribution guide

### Remotes

The **remotes** follow the convention:

- _**origin**_: fork in the account of the developer

- _**upstream**_: main repository

### Content and messages of the commits

#### Content

Each commit must refer to a single issue. If there are many changes that affect different pieces, those changes should be contributed in several commits. If there are several commits on the same element with successive changes that are correcting themselves, all those commits must come together (squash) in a single commit before contributing. Each fix or feature commit must contain the associated sources and tests.

#### Messages

The messages should follow the convention established at: https://github.com/conventional-changelog/conventional-changelog

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

### Debugging

For local environment:

```sh
$ NODE_ENV=local node --inspect --debug-brk server/server.js
```

### Integration Testing

For local environment, execute IT against local DB

```sh
$ NODE_ENV=local npm test
```

For development environment, execute IT against real DB

```sh
$ NODE_ENV=test npm test
```

### Code Testing

For local environment, execute the code test approach and security vulnerabilities:

```sh
$ NODE_ENV=local npm run posttest
```

### Packaging

Using docker environment we have:

```sh
$ docker build -t DOCKER_ORCHESTRATOR/ORCHESTRATOR_ID/DOCKER_IMAGE_NAME:DOCKER_IMAGE_TAG .
```

Only for local environment:

```sh
$ docker build -t app:local .
```

Only for cloud environment and Google Container Registry orchestrator:

```sh
$ docker build -t gcr.io/GOOGLE_PROJECT_ID/DOCKER_IMAGE_NAME:DOCKER_IMAGE_TAG .
```

### Exposing

Only for local environment:

```sh
$ docker run -p 8080:8080 app
```

### Integration

For Kubernetes integration we have the "deployment-development.yaml" file as a deployment descriptor. You can use kubectl to create or delete a deployment:

```sh
$ kubectl delete -f deployment.yaml --namespace=NAMESPACE_NAME
```

```sh
$ kubectl create -f deployment.yaml --namespace=NAMESPACE_NAME
```

Check the bitbucket-pipelines to know how to apply or update several images in a Workflow of CI

### Exploring

Only for local environment:

Go to http://localhost:3000/explorer/#/ to see the Swagger UI Explorer

![alt tag](https://raw.githubusercontent.com/rpinaa/nodejs-architecture-loopback-domain/master/swagger-api.png)

### Project structure

```
common/                     --> store components which are related with the business and domain rules
  models/                   --> store domain layer, mapper layer or service layer
    order.js/               --> order RESTFul
    order.json/             --> order domain
    order-mapper.js/        --> order-mapper service
    order-mapper.json/      --> order-mapper mapper
server/                     --> store components which are related with the data sources
  boot/                     --> store all boot components which are needed by the bootstrapping of the application
    authentication.js       --> default script to enable/disable the auth native service
    root.js                 --> default script to define the main front controller
    model.js                --> custom sccript to persist entity models, acl, access token or another model
  models/                   --> store components which are related with data bases, rest/soap conexions, etc
    address-entity.js       --> address-entity entity
    address-entity.json     --> address-entity scheme
    order-entity.js         --> order-entity entity
    order-entity.json       --> order-entity scheme
  component-config.json     --> default configuration file for loopback components
  config.json               --> default configuration file for loopback remoting API
  datasources.json          --> default configuration file for loopback data sources
  middleware.json           --> default configuration file for loopback middleware flow
  model-config.json         --> default configuration file for all loopback models, include common and server
package.json                --> main NPM file
```

## License

MIT

**Free Software, Hell Yeah!**
