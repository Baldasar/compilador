const fs = require("fs");

const arquivo = fs.readFileSync("./exemplos/exemplo-1.txt", "utf-8");

const dicionario = {
  write: 0,
  while: 1,
  until: 2,
  to: 3,
  then: 4,
  string: 5,
  repeat: 6,
  real: 7,
  read: 8,
  program: 9,
  procedure: 10,
  or: 11,
  of: 12,
  literal: 13,
  integer: 14,
  if: 15,
  identificador: 16,
  î: 17,
  for: 18,
  end: 19,
  else: 20,
  do: 21,
  declaravariaveis: 22,
  const: 23,
  char: 24,
  chamaprocedure: 25,
  begin: 26,
  array: 27,
  and: 28,
  ">=": 29,
  ">": 30,
  "=": 31,
  "<>": 32,
  "<=": 33,
  "<": 34,
  "+": 35,
  numreal: 36,
  numinteiro: 37,
  nomestring: 38,
  nomechar: 39,
  "]": 40,
  "[": 41,
  ";": 42,
  ":": 43,
  "/": 44,
  "..": 45,
  ".": 46,
  ",": 47,
  "*": 48,
  ")": 49,
  "(": 50,
  $: 51,
  "-": 52,
};

const analisadorLexico = (codigo, dicionario) => {
  const tokens = [];
  const lexemas = [];
  const linhas = [];
  let ultimoLexema = "";

  const linhasDoArquivo = codigo.split("\n");

  linhasDoArquivo.forEach((linha, indice) => {
    let lexema = "";
    let linhaAtual = indice + 1;

    const adicionarToken = () => {
      if (lexema && lexema in dicionario) {
        tokens.push(dicionario[lexema]);
        lexemas.push(lexema);
        linhas.push(linhaAtual);
      } else if (lexema) {
        if (lexema.match(/[0-9]+/)) {
          if (lexema >= 0 && lexema <= 9999) {
            tokens.push(dicionario["numinteiro"]);
            lexemas.push(lexema);
            linhas.push(linhaAtual);
          } else {
            tokens.push("ERRO - Número inteiro fora do intervalo permitido");
            lexemas.push(lexema);
            linhas.push(linhaAtual);
          }
        } else if (lexema.match(/[0-9]+\.[0-9]+/)) {
          const regexNumeroReal = /^-?\d{1,4}(,\d{2})?$/;

          if (regexNumeroReal.test(lexema)) {
            const numero = parseFloat(lexema.replace(",", "."));
            if (numero >= 0 && numero <= 9999) {
              tokens.push(dicionario["numereal"]);
              lexemas.push(lexema);
              linhas.push(linhaAtual);
            } else {
              tokens.push("ERRO - Número real fora do intervalo permitido");
              lexemas.push(lexema);
              linhas.push(linhaAtual);
            }
          } else {
            tokens.push("ERRO - Formato de número real inválido");
            lexemas.push(lexema);
            linhas.push(linhaAtual);
          }
        } else if (lexema.match(/`[^`]*`/)) {
          tokens.push(dicionario["literal"]);
          lexemas.push(lexema);
          linhas.push(linhaAtual);
        } else if (lexema.match(/'[^']*'/)) {
          if (lexema.length > 3) {
            tokens.push("ERRO - Char com mais de um caractere");
            lexemas.push(lexema);
            linhas.push(linhaAtual);
          } else {
            tokens.push(dicionario["nomechar"]);
            lexemas.push(lexema);
            linhas.push(linhaAtual);
          }
        } else if (lexema.match(/"[^"]*"/)) {
          const stringContent = lexema.slice(1, -1);
          if (stringContent.length <= 20) {
            tokens.push(dicionario["nomestring"]);
            lexemas.push(lexema);
            linhas.push(linhaAtual);
          } else {
            tokens.push("ERRO - String com mais de 20 caracteres");
            lexemas.push(lexema);
            linhas.push(linhaAtual);
          }
        }
        if(lexema.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
          tokens.push(dicionario["identificador"]);
          lexemas.push(lexema);
          linhas.push(linhaAtual);
        }
      }
      lexema = "";
    };

    for (let i = 0; i < linha.length; i++) {
      const char = linha[i];

      if (char.match(/[a-zA-Z0-9_]/)) {
        lexema += char;
      } else {
        adicionarToken();
        lexema = "";

        if (char === "." && linha[i + 1] === ".") {
          lexema = "..";
          i++;
        } else if (char === "<" && linha[i + 1] === "=") {
          lexema = "<=";
          i++;
        } else if (char === ">" && linha[i + 1] === "=") {
          lexema = ">=";
          i++;
        } else if (char === "<" && linha[i + 1] === ">") {
          lexema = "<>";
          i++;
        } else if ("[]();,:*/+-".includes(char)) {
          lexema = char;
        } else if (
          char === " " ||
          char === "\t" ||
          char === "\r" ||
          char === "\n"
        ) {
          continue;
        } else {
          lexema = char;
        }

        adicionarToken();
      }
    }

    adicionarToken();
  });

  return { tokens, lexemas, linhas, ultimoLexema };
};

const parse = async (arquivo) => {
  console.log("Começando análise léxica...");

  const { tokens, lexemas, linhas } = await analisadorLexico(
    arquivo,
    dicionario
  );

  for (let i = 0; i < tokens.length; i++) {
    console.log(
      `\nToken: ${tokens[i]} | Lexema: ${lexemas[i]} | Linha: ${linhas[i]}`
    );
  }

  console.log("\nAnálise léxica concluída!\n");
};

parse(arquivo);
