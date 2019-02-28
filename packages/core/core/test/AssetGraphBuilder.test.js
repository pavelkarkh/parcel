// @flow strict-local

import invariant from 'assert';
import path from 'path';
import nullthrows from 'nullthrows';
import {AbortController} from 'abortcontroller-polyfill/dist/cjs-ponyfill';

import AssetGraphBuilder from '../src/AssetGraphBuilder';
import ConfigResolver from '../src/ConfigResolver';
import Dependency from '../src/Dependency';
import Environment from '../src/Environment';

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const CONFIG_DIR = path.join(FIXTURES_DIR, 'config');

const DEFAULT_ENV = new Environment({
  context: 'browser',
  engines: {
    browsers: ['> 1%']
  }
});

const TARGETS = [
  {
    name: 'test',
    distPath: 'dist/out.js',
    env: DEFAULT_ENV
  }
];

describe('AssetGraphBuilder', () => {
  let config;
  let builder;
  beforeEach(async () => {
    config = nullthrows(await new ConfigResolver().resolve(CONFIG_DIR));

    builder = new AssetGraphBuilder({
      cliOpts: {cache: false},
      config,
      rootDir: FIXTURES_DIR,
      entries: ['./module-b'],
      targets: TARGETS
    });
  });

  it('creates an AssetGraphBuilder', async () => {
    invariant(
      builder.graph.nodes.has(
        new Dependency({
          moduleSpecifier: './module-b',
          env: DEFAULT_ENV
        }).id
      )
    );
  });

  it('throws a BuildAbortError when resolving if signal aborts', async () => {
    const controller = new AbortController();
    controller.abort();

    try {
      await builder.resolve(
        new Dependency({
          moduleSpecifier: './module-b',
          env: DEFAULT_ENV,
          sourcePath: FIXTURES_DIR + '/index'
        }),
        {
          signal: controller.signal
        }
      );
    } catch (e) {
      invariant(e.code === 'BUILD_ABORTED');
      return;
    }

    throw new Error('must throw BuildAbortError');
  });
});
