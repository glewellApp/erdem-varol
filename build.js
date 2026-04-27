'use strict';

const path = require('path');
const fs = require('fs-extra');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const { minify: minifyHtml } = require('html-minifier-terser');

const ROOT_DIR = __dirname;
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const HTML_FILE = 'index.html';
const CSS_FILE = 'styles.css';
const JS_FILE = 'script.js';
const ASSETS_DIR = 'assets';

function hasFlag(flag) {
  return process.argv.includes(flag);
}

async function cleanDist() {
  await fs.remove(DIST_DIR);
  console.log('Removed dist directory.');
}

async function validateSources() {
  const requiredPaths = [
    path.join(ROOT_DIR, HTML_FILE),
    path.join(ROOT_DIR, CSS_FILE),
    path.join(ROOT_DIR, JS_FILE),
  ];

  for (const filePath of requiredPaths) {
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      throw new Error(`Required source file not found: ${filePath}`);
    }
  }
}

async function build() {
  await validateSources();
  await cleanDist();
  await fs.ensureDir(DIST_DIR);

  const assetsSource = path.join(ROOT_DIR, ASSETS_DIR);
  if (await fs.pathExists(assetsSource)) {
    await fs.copy(assetsSource, path.join(DIST_DIR, ASSETS_DIR));
  }

  const [htmlSource, cssSource, jsSource] = await Promise.all([
    fs.readFile(path.join(ROOT_DIR, HTML_FILE), 'utf8'),
    fs.readFile(path.join(ROOT_DIR, CSS_FILE), 'utf8'),
    fs.readFile(path.join(ROOT_DIR, JS_FILE), 'utf8'),
  ]);

  const cssResult = new CleanCSS({ level: 2 }).minify(cssSource);
  if (cssResult.errors.length > 0) {
    throw new Error(`CSS minification failed: ${cssResult.errors.join('; ')}`);
  }

  const jsResult = await minify(jsSource, {
    compress: true,
    mangle: true,
    format: { comments: false },
  });

  if (!jsResult.code) {
    throw new Error('JavaScript minification failed: no output generated.');
  }

  const htmlResult = await minifyHtml(htmlSource, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: false,
    minifyJS: false,
  });

  await Promise.all([
    fs.writeFile(path.join(DIST_DIR, HTML_FILE), htmlResult, 'utf8'),
    fs.writeFile(path.join(DIST_DIR, CSS_FILE), cssResult.styles, 'utf8'),
    fs.writeFile(path.join(DIST_DIR, JS_FILE), jsResult.code, 'utf8'),
  ]);

  console.log('Build complete. Minified files written to dist/.');
}

(async () => {
  try {
    if (hasFlag('--clean')) {
      await cleanDist();
      return;
    }

    await build();
  } catch (error) {
    console.error('Build failed.');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
})();