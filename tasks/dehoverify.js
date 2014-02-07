/*
 * grunt-dehoverify
 * https://github.com/lapple/grunt-dehoverify
 *
 * Copyright (c) 2014 Aziz Yuldashev
 * Licensed under the MIT license.
 */

'use strict';

var rework = require('rework');
var walk = require('rework-walk');

var dehoverify = function(style) {
  walk(style, function(rule) {
    if (!rule.selectors) {
      return;
    }

    rule.selectors = rule.selectors.filter(function(selector) {
      return !(/\:hover/.test(selector));
    });

    if (rule.selectors.length === 0) {
      rule.declarations = [];
    }
  });
};

module.exports = function(grunt) {

  grunt.registerMultiTask('dehoverify', function() {
    var options = this.options({});

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var css = grunt.file.read(filepath);

        return rework(css).use(dehoverify).toString({ compress: true });
      }).join(grunt.util.lineFeed);

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest.cyan + '" created.');
    });
  });

};
