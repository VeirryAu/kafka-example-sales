# kafka-examples-sales

This project is a Prove of Concept that Event Driven can be really helpful for complex project with realtime requirement

# Project Requirement

To build this project we will use 
1. MariaDB (https://mariadb.org)
2. Kafka (https://kafka.apache.org) for Asynchronous Deployment
3. NodeJS (https://nodejs.org) for Programming language
4. AWS (https://aws.amazon.com) for deployment server

# Library of Nodejs

To build this project we will use library to not reinvent the wheel
1. Sequelize (https://sequelizejs.com) for ORM to MariaDB
2. Kafkajs (https://kafka.js.org) for Kafka
3. ExpressJS (https://expressjs.com) for Node Web Server
4. JEST (https://expressjs.com) for Testing

# Deployment

To deployment and testing of this project we will use
1. AWS EC2
2. AWS Fargate
3. AWS ECS

# Run this application

docker-compose up --build

npm test

# API Docs

curl -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{"product":"Coffee","quantity":2,"price":3.5}'

# Result

