const fs = require('fs');
const path = require('path');

const isCodeFile = (file) => file.endsWith('.ts');
const isCommentOrEmpty = (line) => line.trim() === '' || line.trim().startsWith('//');

// Clasificación de líneas de código
let newLines = 0;
let reusedLines = 0;
let modifiedLines = 0;

/**
 * Función para contar líneas de código nuevas
 * @param {Array} lines - Array de líneas de un archivo
 */
const countNewLines = (lines) => {
  return lines.filter(line => !isCommentOrEmpty(line)).length;
};

/**
 * Función para contar líneas de código reutilizadas (simulación)
 * Aquí podrías agregar reglas específicas para identificar líneas reutilizadas
 */
const countReusedLines = (lines) => {
  // Asumimos que líneas que contienen importaciones se consideran reutilizadas
  return lines.filter(line => line.includes('import')).length;
};

/**
 * Función para contar líneas de código modificadas (simulación)
 * Aquí podrías agregar reglas para identificar líneas modificadas
 */
const countModifiedLines = (lines) => {
  // Asumimos que líneas con ciertas palabras claves como "TODO" son líneas modificadas
  return lines.filter(line => line.includes('TODO') || line.includes('FIXME')).length;
};

/**
 * Función recursiva para contar líneas de código en un directorio y clasificarlas
 * @param {string} dir - Directorio del proyecto
 */
const countLines = (dir) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      countLines(fullPath); // Recursividad para subdirectorios
    } else if (stats.isFile() && isCodeFile(file)) {
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const fileLines = fileContent.split('\n');

      newLines += countNewLines(fileLines);
      reusedLines += countReusedLines(fileLines);
      modifiedLines += countModifiedLines(fileLines);
    }
  });
};

// Directorio raíz del proyecto
const projectDir = path.resolve(__dirname, '.');
countLines(projectDir);

console.log(`Líneas de código nuevas: ${newLines}`);
console.log(`Líneas de código reutilizadas: ${reusedLines}`);
console.log(`Líneas de código modificadas: ${modifiedLines}`);
