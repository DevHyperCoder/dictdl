# dictdl - Fetch word meanings and example usage

## How to use ?

- Install NodeJS (latest version should suffice)
- Clone this repository
- Install the dependencies (`pnpm install` or `npm install`)
- Create a file with words seperated with `\n` (newline character)
- Optional: Set the `DICTDL_FILE` environment variable to the file
- Run. `npm run build && npm run start` OR, build the code (`npm run build`) and then run anytime using (`node dist/index.js`)

## API

`dictdl` uses the [Free Dictionary API](https://dictionaryapi.dev/)

## LICENSE 

`dictdl` is free and open source software licensed under the GNU General Public License 3. Our copy of the same can be found [here](./LICENSE)
