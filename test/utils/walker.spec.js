'use strict';

const fs = require('fs');
const path = require('path');
const unmock = require('../mock')();
const walker = require('../../lib/utils/walker');
const { baseDir } = require('../../lib/utils/env');

const mocha = require('mocha');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
chai.use(deepEqualInAnyOrder);
const should = chai.should();

const getPath = p => path.join(baseDir, p);

describe('Walker 测试', function () {

  after(() => unmock);

  describe('Walker 功能测试', function () {
    it('空测试', function () {
      const result = {
        stylelint: [],
        eslint: []
      };

      return walker().should.be.deep.equalInAnyOrder(result)
        && walker([]).should.be.deep.equalInAnyOrder(result);
    });

    it('单条 glob', function () {
      const result = {
        stylelint: [],
        eslint: [getPath('src/a.js')]
      };

      return walker('src/*.js').should.be.deep.equalInAnyOrder(result);
    });

    it('单条 glob, 匹配空', function () {
      const result = {
        stylelint: [],
        eslint: []
      };

      return walker('src/*.ts').should.be.deep.equalInAnyOrder(result);
    });

    it('单条 glob, deep', function () {
      const result = {
        stylelint: [],
        eslint: [
          getPath('src/a.js'),
          getPath('src/lib/b.js')
        ]
      };

      return walker('src/**/*.js').should.be.deep.equalInAnyOrder(result);
    });

    it('单条 glob, deep', function () {
      const result = {
        stylelint: [
          getPath('src/a.css')
        ],
        eslint: [
          getPath('src/a.js'),
          getPath('src/lib/b.js')
        ]
      };

      return walker('src/**/*').should.be.deep.equalInAnyOrder(result);
    });

    it('多条 glob', function () {
      const result = {
        stylelint: [
          getPath('src/a.css')
        ],
        eslint: [
          getPath('src/a.js')
        ]
      };

      return walker(['src/*.js', 'src/*.css']).should.be.deep.equalInAnyOrder(result);
    });

    it('多条 glob, 匹配空', function () {
      const result = {
        stylelint: [],
        eslint: []
      };

      return walker(['src/**/*.ts', 'dist/**/*.ts']).should.be.deep.equalInAnyOrder(result);
    });

    it('多条 glob, deep', function () {
      const result = {
        stylelint: [
          getPath('src/a.css')
        ],
        eslint: [
          getPath('src/a.js'),
          getPath('src/lib/b.js')
        ]
      };

      return walker(['src/**/*.js', 'src/**/*.css']).should.be.deep.equalInAnyOrder(result);
    });
  });

  describe('Ignore 功能测试', function () {

    const ignoreFilePath = path.join(baseDir, '.elintignore');

    afterEach(() => {
      if (fs.existsSync(ignoreFilePath)) {
        fs.unlinkSync(ignoreFilePath);
      }
    });

    const createIgnoreFile = content => {
      fs.appendFileSync(ignoreFilePath, content);
    };

    it('文件不存在，使用默认忽略规则', function () {
      const result = {
        stylelint: [],
        eslint: [
          getPath('src/a.js'),
          getPath('src/lib/b.js'),
          getPath('app/c.js')
        ]
      };

      return walker('**/*.js').should.be.deep.equalInAnyOrder(result);
    });

    it('文件存在，为空，没有任何忽略规则', function () {
      const result = {
        stylelint: [],
        eslint: [
          getPath('app/c.js'),
          getPath('src/a.js'),
          getPath('src/lib/b.js'),
          getPath('node_modules/elint-preset-node/index.js'),
          getPath('node_modules/elint-preset-normal/index.js'),
          getPath('bower_components/a.js')
        ]
      };

      createIgnoreFile('');

      return walker('**/*.js').should.be.deep.equalInAnyOrder(result);
    });

    it('单条忽略测试', function () {
      const result = {
        stylelint: [],
        eslint: [
          getPath('app/c.js'),
          getPath('src/a.js'),
          getPath('src/lib/b.js'),
          getPath('bower_components/a.js')
        ]
      };

      createIgnoreFile('**/node_modules/**');

      return walker('**/*.js').should.be.deep.equalInAnyOrder(result);
    });

    it('多条忽略测试', function () {
      const result = {
        stylelint: [],
        eslint: [
          getPath('app/c.js'),
          getPath('bower_components/a.js')
        ]
      };

      createIgnoreFile('**/node_modules/**\n**/src/**');

      return walker('**/*.js').should.be.deep.equalInAnyOrder(result);
    });

    it('注释测试', function () {
      const result = {
        stylelint: [],
        eslint: [
          getPath('app/c.js'),
          getPath('bower_components/a.js')
        ]
      };

      createIgnoreFile('**/node_modules/**\n**/src/**\n#**/app/**');

      return walker('**/*.js').should.be.deep.equalInAnyOrder(result);
    });
  });
});
