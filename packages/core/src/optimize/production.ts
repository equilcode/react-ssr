import fs from 'fs';
import fse from 'fs-extra';
import MemoryFileSystem from 'memory-fs';
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import { configureWebpack } from './webpack.config';
import { getEntry } from './helpers';
import {
  getSsrConfig,
  getEngine,
  getPageId,
  readFileWithProps,
  decompressProps,
  sleep,
} from '../helpers';

const cwd = process.cwd();
const ext = '.' + getEngine();
const config = getSsrConfig();

const ufs = require('unionfs').ufs;
const memfs = new MemoryFileSystem();
ufs.use(fs).use(memfs);

export default async (app: express.Application): Promise<void> => {
  fse.removeSync(path.join(cwd, config.distDir));

  let compiled = false;
  const [entry, entryPages] = await getEntry(memfs);
  const webpackConfig: webpack.Configuration = configureWebpack(entry);
  const compiler: webpack.Compiler = webpack(webpackConfig);
  compiler.hooks.afterCompile.tap('finish', () => { compiled = true });
  compiler.inputFileSystem = ufs;
  compiler.run((err: Error, stats: webpack.Stats) => {
    err && console.error(err.stack || err);
    stats.hasErrors() && console.error(stats.toString());

    for (let i = 0; i < entryPages.length; i++) {
      const page = entryPages[i];
      const pageId = getPageId(page, '_');

      const cssRoute = `/_react-ssr/${pageId}.css`;
      app.use(cssRoute, (req, res) => {
        const filename = path.join(cwd, config.distDir, `${pageId}.css`);
        let style = '';
        if (fs.existsSync(filename)) {
          style = fs.readFileSync(filename).toString();
        }
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(style, 'utf-8');
      });

      const jsRoute = `/_react-ssr/${pageId}.js`;
      app.use(jsRoute, (req, res) => {
        const props = decompressProps(req.query.props);
        const filename = path.join(cwd, config.distDir, `${pageId}.js`);
        const script = readFileWithProps(filename, props);
        res.status(200).type('.js').send(script);
      });
      console.log(`[ info ] optimized "${config.viewsDir}/${getPageId(page, '/')}${ext}"`);
    }
  });

  while (true) {
    if (compiled) {
      break;
    }
    await sleep(100);
  }

  // TODO: use promise
  // wait until completed
  await sleep(1000);
};
