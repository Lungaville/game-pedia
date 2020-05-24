# Dokumentasi proyek SOA

* Tema : Video Games
* API : https://api-docs.igdb.com/

## Anggota

* Richard Ivan - 217116647
* Robby Suryanata - 217116649
* Sandy Khosasi - 217116652
* William Adi Nata Mulianto - 217116667

## Pembagian

| Resource type          | User    |
| ---------------------- | ------- |
| User + Midtrans API    | Robby   |
| User data + IGDB API   | Willy   |
| Review + list endpoint | Sandy   |
| Genre + game           | Richard |

## List participant

| Participant Type | Level                   | Description                 |
| ---------------- | ----------------------- | --------------------------- |
| All              | -                       | No authentication           |
| It's user        | Depends on user's level | Resorce created by the user |
| Basic            | 1                       | 1000 requests/month, $0     |
| Pro              | 2                       | unlimited requests, $30     |
| Admin            | 3                       | Can do everything           |

## Daftar endpoint

Catatan :Endpoint dan Participant mungkin terjadi perubahan kecil

### User resource

| Method | Endpoint   | Deskripsi                  | Participant |
| ------ | ---------- | -------------------------- | ----------- |
| POST   | /register  | Register user              | All         |
| POST   | /login     | Login user (get JWT token) | All         |
| GET    | /users     | GET users                  | All         |
| GET    | /users/:id | GET user                   | All         |
| PATCH  | /users/:id | PUT user                   | It's user   |
| DELETE | /users/:id | DELETE user                | It's user   |

### Game list resource

| Method | Endpoint              | Deskripsi             | Participant |
| ------ | --------------------- | --------------------- | ----------- |
| POST   | /user/game            | POST user game list   | Basic       |
| GET    | /user/:id_user/game   | GET user game list    | It's user   |
| DELETE | /user/game/:id_game   | DELETE user game list | It's user   |
| GET    | /user/:id_user/review | GET user review list  | All         |

### Review resource

| Method | Endpoint    | Deskripsi     | Participant |
| ------ | ----------- | ------------- | ----------- |
| POST   | /review     | POST review   | Basic       |
| GET    | /review     | GET reviews   | All         |
| GET    | /review/:id | GET review    | All         |
| PATCH  | /review/:id | PATCH review  | It's user   |
| DELETE | /review/:id | DELETE review | It's user   |

### Game resource

| Method | Endpoint  | Deskripsi                          | Participant |
| ------ | --------- | ---------------------------------- | ----------- |
| POST   | /game     | POST games                         | Pro         |
| GET    | /game     | GET games (with optional param q=) | All         |
| GET    | /game/:id | GET game detail                    | All         |

### Genre resource

| Method | Endpoint   | Deskripsi                           | Participant |
| ------ | ---------- | ----------------------------------- | ----------- |
| POST   | /genre     | POST genre                          | Pro         |
| GET    | /genre     | GET genres (with optional param q=) | All         |
| GET    | /genre/:id | GET genre                           | All         |
| PATCH  | /genre/:id | PATCH genre                         | It's users  |
| DELETE | /genre/:id | DELETE genre                        | It's users  |

### Endpoint lainnya

| Method | Endpoint  | Deskripsi        | Participant |
| ------ | --------- | ---------------- | ----------- |
| GET    | /endpoint | list of endpoint | All         |
