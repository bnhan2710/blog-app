## About this folder

This folder contain the dependecy mapping using [inversify](https://inversify.io/) for the application

Why we need DI Container?

Becase in this source we implement the Dependency Injection, and so that we need the places for mapping the dependecy, example mapping the Interface to specific Implement Class:

```
container.bind<Interface>(TYPES.Interface).to(ImplementClass);
```
