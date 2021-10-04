/*
dictdl - Fetch word meanings and example usage
Copyright (C) 2021  DevHyperCoder <devan at devhypercoder dot com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import axios from "axios";
import chalk from "chalk";
import readline from "readline"
import fs from "fs/promises"
import util from 'util';

async function main() {
  console.log(
    "dictdl - Download word meanings and examples from https://dictionaryapi.dev/"
  );

  try{
    const fileName =await getFileName()

    const wordList = (await fs.readFile(fileName)).toString().replace(/\r\n/g,'\n').split('\n'); 

    const wordDefintions = await getMultiWordMeanings(wordList);

    wordDefintions.forEach((wordDefintion) => {
      if (!wordDefintion) return;

      console.log("=".repeat(process.stdout.columns));
      console.log(chalk.bold.cyan(wordDefintion.wordName));
      wordDefintion.defintions.forEach((def) => {
        console.log("");
        console.log(chalk.bold(def.definition));
        console.log(def.example);
      });
      console.log("=".repeat(process.stdout.columns));
    });

  } catch(e) {
    console.error((e as Error).message)
    
  }
}

async function getFileName() {

  const rl = readline.createInterface({input:process.stdin,output:process.stdout})
  const question = util.promisify(rl.question).bind(rl);

  let  fileName = await  question( "Enter filename: ") as unknown as string;

  if (fileName === "" ){
    if (process.env.DICTDL_FILE === undefined|| process.env.DICTDL_FILE === "") {
      rl.close()
      throw new Error(`File name ${chalk.bold("not")} provided. Please provide one or set the ${chalk.bold("DICTDL_FILE")} environment variable`)
    }

    fileName = process.env.DICTDL_FILE!
  }

  rl.close()

  return fileName
}

async function getMultiWordMeanings(words: string[]) {
  const wordMeaningPromises = words.map((word) => {
    return getWordMeaning(word);
  });

  const wordMeanings = await Promise.all(wordMeaningPromises);

  return wordMeanings.map((entry) => {
    if(!entry) {
      return null
    }

    const defintions = entry!.meanings.map((meaning) => {
      return meaning.definitions[0];
    });

    return {
      wordName: entry!.word,
      defintions,
    };
  });
}

async function getWordMeaning(word: string): Promise<Entry | null> {
  try{
  const res = await axios.get(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  return res.data[0] as Entry;
  }catch(e) {
    console.error((e as Error).message)
      console.warn(`${chalk.red("WARN:")} Could not find entry for ${chalk.bold(word)}`)
      return null
  }
}

interface Entry {
  word: string;
  phonetics: Phonetics[];
  meanings: Meaning[];
}

interface Phonetics {
  text: string;
  audio: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface Definition {
  definition: string;
  example: string;
  synonyms: string[] | null;
}

main();
