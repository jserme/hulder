/*
* This file is part of the Spludo Framework.
* Copyright (c) 2009-2010 DracoBlue, http://dracoblue.net/
*
* Licensed under the terms of MIT License. For the full copyright and license
* information, please see the LICENSE file in the root folder.
*/

var child_process = require('child_process');
var fs = require("fs");
var util = require("util");

dev_server = {

    process: null,

    files: [],

    restarting: false,

    "restart": function() {
        this.restarting = true;
        console.log('DEVSERVER: Stopping server for restart');
        this.process.kill();
    },

    "start": function() {
        var self = this;
        console.log('DEVSERVER: Starting server');
        self.watchFiles();

        this.process = child_process.spawn(process.argv[0], ['app.js']);

        this.process.stdout.addListener('data', function (data) {
            process.stdout.write(data);
        });

        this.process.stderr.addListener('data', function (data) {
            console.log(data);
        });

        this.process.addListener('exit', function (code) {
            console.log('DEVSERVER: Child process exited: ' + code);
            this.process = null;
            if (self.restarting) {
                self.restarting = true;
                self.unwatchFiles();
                self.start();
            }
        });
    },

    "watchFiles": function() {
        var self = this;

        child_process.exec('find . | grep "\.js$"', function(error, stdout, stderr) {
            var files = stdout.trim().split("\n");

            files.forEach(function(file) {
                self.files.push(file);
                fs.watchFile(file, {interval : 500}, function(curr, prev) {
                    if (curr.mtime.valueOf() != prev.mtime.valueOf() || curr.ctime.valueOf() != prev.ctime.valueOf()) {
                        console.log('DEVSERVER: Restarting because of changed file at ' + file);
                        dev_server.restart();
                    }
                });
            });
        });
   },

    "unwatchFiles": function() {
        this.files.forEach(function(file) {
            fs.unwatchFile(file);
        });
        this.files = [];
    }
}


dev_server.start();

