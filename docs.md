# Dokumentasi proyek SOA

## Anggota

* Richard Ivan - 217116647
* Robby Suryanata - 217116649
* Sandy Khosasi - 217116652
* William Adi Nata Mulianto - 217116667

## Daftar endpoint

### User

| METHOD | URL       | Deskripsi                  |
| ------ | --------- | -------------------------- |
| POST   | /register | Register user              |
| POST   | /login    | Login user (get JWT token) |
| GET    | /user     | GET users                  |
| GET    | /user/:id | GET user                   |
| PUT    | /user/:id | PUT user                   |
| DELETE | /user/:id | DELETE user                |

### User's data

| METHOD | URL                | Deskripsi             |
| ------ | ------------------ | --------------------- |
| POST   | /user/:id/game     | POST user game list   |
| GET    | /user/:id/game     | GET user game list    |
| PUT    | /user/:id/game/:id | PUT user game list    |
| DELETE | /user/:id/game/:id | DELETE user game list |
| GET    | /user/:id/review   | GET user review list  |

### Review

| METHOD | URL         | Deskripsi     |
| ------ | ----------- | ------------- |
| POST   | /review     | POST review   |
| GET    | /review     | GET reviews   |
| GET    | /review/:id | GET review    |
| PUT    | /review/:id | PUT review    |
| DELETE | /review/:id | DELETE review |

### Game

| METHOD | URL       | Deskripsi                               |
| ------ | --------- | --------------------------------------- |
| GET    | /game     | GET games list (with optional param q=) |
| GET    | /game/:id | GET game detail                         |

### Genre

| METHOD | URL        | Deskripsi    |
| ------ | ---------- | ------------ |
| POST   | /genre     | POST genre   |
| GET    | /genre     | GET genres   |
| GET    | /genre/:id | GET genre    |
| PUT    | /genre/:id | PUT genre    |
| DELETE | /genre/:id | DELETE genre |

### Endpoint lainnya

| METHOD | URL       | Deskripsi        |
| ------ | --------- | ---------------- |
| GET    | /endpoint | list of endpoint |
