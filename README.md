# google_earth_kart

`npm i` and then `npm run dev` to run server

Frontend: http://localhost:5173/
Backend: http://localhost:3001/

## Linter
To run the linter for the entire project, run this command:

```bash
npx prettier --write .
```

## Important for Backend Dev:
Every time you change anything in the backend folder, make sure to do the following every time:
    - CLOSE out the running local host tab
    - RESET the server (`npm run dev` again)
    - REOPEN the local host tab
If you don't, the backend will get confused. This problem will be fine once we have a continuously running server.