# Justin's Forum App

A RESTful online forum/blog application with CRUD operations.
<br> Users can post articles and pictures, comment on other's posts, and edit or delete their own posts.

Full stack MERN Application, deployed on Heroku.

🔗 **Live preview** of the app is [here](https://justins-forum.herokuapp.com/).

🔗 **API** can be accessed [here](https://justins-forum-api.herokuapp.com/).

## API Documentation

- Base URL: [https://justins-forum-api.herokuapp.com/](https://justins-forum-api.herokuapp.com/)

| Method | Endpoint     | Usage             | Parameters                               | 🔒  |
| ------ | :----------- | :---------------- | ---------------------------------------- | --- |
| GET    | /            | Get all posts     |                                          |     |
| GET    | /user        | Get current user  |                                          | ✅  |
| POST   | /user/log-in | Log in in as user | username*, password*, confirm-password\* |

_required (\*)_

## Features:

- RESTful API is versatile and accessible by any frontend.
- CRUD Operations:
  - Create, read, edit, and delete posts

# Built With:

- ReactJS
- JavaScript
- NodeJS
- ExpressJS
- MongoDB + Mongoose
- Axios
- HTML/CSS
- Heroku Hosting

## Pictures:

#### Main Page:

![Image of App](./images/Readme1.png)
