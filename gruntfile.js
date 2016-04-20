module.exports = function (grunt) {

	grunt.initConfig({
		watch: {
		    jade: {
		        files: ['views/**'],
		        options: {
		            livereload: true
		        }
		    },
		    js: {
		        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
		        //tasks: ['jshint'],
		        options: {
		            livereload: true
		        }
		    },
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['public/libs/**/*.js']
			},
			all: ['public/js/*.js','test/**/*.js','app/**/*.js']
		},
		uglify: {
		  	development: {
			    files: {
				    'public/build/admin.min.js': 'public/js/admin.js',
				    'public/build/detail.min.js': [
				       'public/js/detail.js'
				    ]
			    }
			}
		},
		nodemon: {
		  dev: {
		    options: {
		      file: 'app.js',
		      args: [],
		      ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
		      watchedExtensions: ['js'],
		      watchedFolders: ['./'],
		      debug: true,
		      delayTime: 1,
		      env: {
		        PORT: 12345
		      },
		      cwd: __dirname
		    }
		  }
		},
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
		},
		concurrent: {
			// , 'less', 'uglify', 'jshint'
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	})

	// 监听文件，一旦有所改动即重新执行任务
	grunt.loadNpmTasks('grunt-contrib-watch');
	// 监听语法错误
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// 压缩js
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// 实时监听app.js
	grunt.loadNpmTasks('grunt-nodemon'); 
	// 监听慢任务
	grunt.loadNpmTasks('grunt-concurrent');
	// 监听测试模块
	grunt.loadNpmTasks('grunt-mocha-test');
	


	grunt.option('force',true);
	// 注册任务
	grunt.registerTask('default',['concurrent']);
	grunt.registerTask('test',['mochaTest']);
}