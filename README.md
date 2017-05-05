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

For local environments:

```sh
$ NODE_ENV=local node .
```

For development environments:

```sh
$ NODE_ENV=development node .
```

For staging environments:

```sh
$ NODE_ENV=staging node .
```

For production environments:

```sh
$ NODE_ENV=production node .
```

### Business

This repository lets us resolve the business rules of a delivery food system
where a client can request a order of several dishes which are created by a
chef and delivered by a driver. The follow relational diagram, shows us a deep
look of the business.

![alt tag](https://raw.githubusercontent.com/rpinaa/nodejs-architecture-loopback-domain/master/er-scheme.png)

## License

MIT

**Free Software, Hell Yeah!**
