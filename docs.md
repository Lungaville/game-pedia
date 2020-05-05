# Dokumentasi proyek SOA

## Anggota

* Richard Ivan - 217116647
* Robby Suryanata - 217116649
* Sandy Khosasi - 217116652
* William Adi Nata Mulianto - 217116667

## Daftar endpoint

### User resource

| Method | Endpoint  | Deskripsi                  | Participant |
| ------ | --------- | -------------------------- | ----------- |
| POST   | /register | Register user              |             |
| POST   | /login    | Login user (get JWT token) |             |
| GET    | /user     | GET users                  |             |
| GET    | /user/:id | GET user                   |             |
| PUT    | /user/:id | PUT user                   | It's user   |
| DELETE | /user/:id | DELETE user                | Admin       |

### Game list resource

| Method | Endpoint           | Deskripsi             | Participant |
| ------ | ------------------ | --------------------- | ----------- |
| POST   | /user/:id/game     | POST user game list   |             |
| GET    | /user/:id/game     | GET user game list    |             |
| PUT    | /user/:id/game/:id | PUT user game list    | It's user   |
| DELETE | /user/:id/game/:id | DELETE user game list | It's user   |

### Review resource

| Method | Endpoint         | Deskripsi            | Participant      |
| ------ | ---------------- | -------------------- | ---------------- |
| POST   | /review          | POST review          |                  |
| GET    | /review          | GET reviews          |                  |
| GET    | /review/:id      | GET review           |                  |
| GET    | /user/:id/review | GET user review list |                  |
| PUT    | /review/:id      | PUT review           | It's user        |
| DELETE | /review/:id      | DELETE review        | Admin, it's user |

### Game resource

| Method | Endpoint  | Deskripsi                               | Participant |
| ------ | --------- | --------------------------------------- | ----------- |
| GET    | /game     | GET games list (with optional param q=) |             |
| GET    | /game/:id | GET game detail                         |             |

### Genre resource

| Method | Endpoint   | Deskripsi                           | Participant |
| ------ | ---------- | ----------------------------------- | ----------- |
| POST   | /genre     | POST genre                          | Admin       |
| GET    | /genre     | GET genres (with optional param q=) |             |
| GET    | /genre/:id | GET genre                           |             |
| PUT    | /genre/:id | PUT genre                           | Admin       |
| DELETE | /genre/:id | DELETE genre                        | Admin       |

### Endpoint lainnya

| Method | Endpoint  | Deskripsi        | Participant |
| ------ | --------- | ---------------- | ----------- |
| GET    | /endpoint | list of endpoint |             |
