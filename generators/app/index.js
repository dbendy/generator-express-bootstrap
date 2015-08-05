'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var async = require('async');
var validateModuleName = require('validate-npm-package-name');
var _ = require('lodash');
var fs = require('fs');

var handleError = function(err) {
	console.log("Something went wrong:", err.stack);
	process.exit();
};

module.exports = yeoman.generators.Base.extend({

	initializing: {
		welcome: function () {
			// Have Yeoman greet the user.
			this.log(yosay('Welcome to Daniel Bendavid\'s Express-Bootsstrap app generator!'));
		}
	},

	prompting: {
		mainPrompt: function () {
			var done = this.async();
			var prompts = [

				{
					name: 'appName',
					type: 'input',
					default: process.cwd().split('/').pop().toLowerCase(),
					message: 'App name (only lower case)?',
					filter: function(input) {
						return input.toString();
					},
					validate: function(input) {
						// this function validates the app name against the npm rules for module names
						return validateModuleName(input).validForNewPackages;
					}
				},

				{
					name: 'description',
					type: 'input',
					default: '',
					message: 'Description?',
					filter: function(input) {
						return input.toString();
					}
				},

				{
					name: 'author',
					type: 'input',
					default: '',
					message: 'Author?',
					filter: function(input) {
						return input.toString();
					}
				}
			];

			this.prompt(prompts, function (props) {
				this.appName = props.appName;
				this.description = props.description;
				this.author = props.author;
				done();
			}.bind(this));
		}
	},

	configuring: {
	},

	writing: {

		writePackage: function () {
			this.log("Writing package.json...");
			var source = this.templatePath('../_package.json');
			var destination = this.destinationPath('package.json');
			var data = {
				appName: this.appName,
				description: this.description,
				author: this.author
			};
			this.fs.copyTpl(source, destination, data);
		},

		writingConfig: function() {
			this.log("Writing config.js...");
			var source = this.templatePath('../_config.js');
			var destination = this.destinationPath('config.js');
			this.fs.copyTpl(source, destination, {appName: this.appName});
		},

		copyingFiles: function () {
			this.log("Copying files...");
			// this is necessary so that files that start with dot (.) are not ignored
			var templateContents = fs.readdirSync(this.sourceRoot());
			var self = this;
			templateContents.forEach(function(file) {
				self.fs.copy(self.templatePath(file), self.destinationPath(file));
			});
		}

	},

	install: {
		runNpmInstall: function() {
			this.log("Running first npm install...");
			this.npmInstall();
		}
	},

	end: {
		startApp: function() {
			this.log("Starting app...");
			this.log("Open up your browser and go to 127.0.0.1:3000");
			this.spawnCommand('npm', ['start']);
		}
	}
});
