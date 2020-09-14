# R with TypeScript

---

---

A small codebase for emulating a business scenario with TypeScript.

[![NPM version][shield-npm]](#)
[![Node.js version support][shield-node]](#)
[![Dependencies][shield-dependencies]](#)
[![Code coverage][shield-coverage]](#)

## Table of Contents

- [Requirements](#requirements)
- [Architecture Diagram](#architecture-diagram)
- [Usage](#usage)
- [Design Decision](#design-decision)
- [To Do](#to-do)
- [Assumption Made](#assumptions-made)
- [Task Requirements](#task-requirements)
- [Other Information](#other-information)

## Requirements

This codebase requires the following to run:

- [Node.js][node] 16+
- [npm][npm] (normally comes with Node.js)

## Architecture Diagram

[![Architecture Diagram][architecture-diagram]](https://d2v3ocmqltf3x3.cloudfront.net/R/r-typescript.png)

## Usage

Intalling dependencies:

```sh
npm install
```

Where to start?

- `api.ts` is the first points of entry in this application.

### Test

```sh
npm test
```

### Run

```sh
npm run start
```

## Design Decision

- Programming Language: TypeScript (JavaScript), I have been doing TypeScript for the past 2 years, It's what I am used to at the moment.

## Assumptions Made

-

## Task Requirements

- [ ] Maintainability - PR Template, Commit, Linter
- [ ] Store config in the environment
- [ ] Node JS - Worker
- [ ] Node JS - API
- [ ] React JS - UI
- [ ] Design System - Storybook - UI
- [ ] Mobile first - UI
- [ ] Package application in a Docker container
- [ ] Achieve > 80% test coverage
- [ ] Healthcheck endpoint
- [ ] OpenAPI 3 Docs (Swagger)
- [ ] Infrastructure as Code (Cloud Formation)
- [ ] Cloudfront CDN
- [ ] CI/CD with GitHub Action
- [ ] SAST with GitHub Action - CodeQL
- [ ] HTTPS from the gateway layer
- [ ] Secrets Management
- [ ] Auth
- [ ] AWESOME architecture diagram
- [ ] End to end API Test with Supertest
- [ ] Access Control
- [ ] Graceful Shutdown
- [ ] Validate user input
- [ ] Throttling
- [ ] Mask PII
- [ ] Encrypted Local Database
- [ ] Leverage Customer Data Platform

## To Do

- Queue
- EKS
- AWS Well Architected
- Chaos Engineering

## The Twelve-Factor App

- [ ] Codebase
- [ ] Dependencies
- [ ] Config
- [ ] Backing service
- [ ] Build, release, run
- [ ] Processes
- [ ] Port binding
- [ ] Concurrency
- [ ] Disposability
- [ ] Dev/prod parity
- [ ] Logs
- [ ] Admin process

## Well Architected Framework

- [ ] Operational Excellence
- [ ] Security
- [ ] Reliability
- [ ] Backing service
- [ ] Performance Efficiency
- [ ] Cost Optimisation
- [ ] Sustainability

## Software Quality

- [ ] Reliability
- [ ] Security
- [ ] Efficiency
- [ ] Maintainability
- [ ] Size

## Areas of Improvement

- Application
  - More sophiscticated health check
  - IoC Container for Dependency Injection (or even use framework such as NEST?)

- Architecture
  - Put it behind an API Gateway or Leverage Service Mesh pattern
  - Deploy into Lambda or EKS - EC2 or Fargate (refer to cost)

- Auth
  - Full OAuth2 flow (an additional Auth server is needed)
  - Authentication - (AWS Cognito, Azure AD, Firebase Auth, Auth0 or Okta)
  - Move `scopePermissions` away from access token(ideally in user or additonal request)

- Data Layer
  - Database
    - SaaS or Docker Compose
    - Parameterised for SQL Injection
    - Encrypt data at rest

- Documentations
  - Runbook
  - Playbook
  - SLA
  - Cost analysis

- Infrastructure
  - Docker Compose with related dependencies
    (e.g. databases or cache with EFS, logging, nginx, queue or PACT broker)
  - Using the right Load Balancer (ALB. ELB or NLB)
  - Terraform that supports Multi cloud environment instead of CloudFormation (AWS)

- Observability
  - Leverage fluentD if make sense
  - Publish logs to Log Forwarder for further processing with the 3rd party vendor
  (Splunk, DataDog, New Relic or ELK)
  - Enable XRay or 3rd party vendor for distributed tracing (New Relic, DataDog, Splunk)
  - Other more sophisticated metrics dashboard, alternative to CloudWatch (New Relic, DataDog, Splunk)

- Operation
  - Support A/B testing with simple feature toggling or 3rd party vendor such as LaunchDarkly
  - Leveraged 3rd party vendor that deals with streamlined customer data such as Segment

- Security
  - HTTPS from application layer
  - Attribute Based Access Control gives more flexibility
  - Throttling (currently only BY IP)
    - Distributed State
    - By API Key & API Secret or Token
  - OWASP
    - XSS: Validate input & output(if html)
    - CSRF: Anti-Forgery tokens or double submit cookies
    - SQL Injection: Parameterised SQL query

- Testing
  - Integration or contract testing
  - DAST (e.g. SonarCube, Checkmarx or JFrog)
  - Stress testing (e.g. Vegeta or Apache JMeter)
  - Penetration testing

## Other Information

Time breakdown:

- backend development: 0 hour.
- frontend development: 0 hour.
- documentation: 0 hour.
- operation: 0 hour.

[node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[shield-coverage]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg
[shield-dependencies]: https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/badge/node.js%20support-16.14.1-brightgreen.svg
[shield-npm]: https://img.shields.io/badge/npm-v8.5.0-blue.svg
[architecture-diagram]: https://d2v3ocmqltf3x3.cloudfront.net/R/r-typescript.png
