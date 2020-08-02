const gulp = require('gulp');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const run = require('gulp-run-command').default;
const fs = require('fs');

const androidExist = fs.existsSync('android');


// DEPLOYMENT NATIF
// Task 1 : build pour le /www
gulp.task('build:capacitor', run(`npm run build:capacitor`));

// Task 2 : Conf environnements
gulp.task('replace-conf', function() {
    if (!androidExist) {
        runSequence('add-android', function(err) {
            if (!err) {
                gulp.src('./env/android/*').pipe(gulp.dest('./android/app/'));
                runSequence('update-android');
            }
        });
    } else { console.log('Dossier ./ANDROID existe') }
});

// Task 3 : create native folder
gulp.task('add-android', run(['npx cap add android']));

// Task 4 : update files
gulp.task('update-android', run('npx cap update && npm run update:native'));

// Task 4: clear ./www
gulp.task('rm-www', function() {
  return gulp.src('./www/*', { read: false }).pipe(clean());
});


// Task 5 : compile previous tasks and prepare to natif
gulp.task('prepare:native', function() {
    runSequence('rm-www','build:capacitor', 'replace-conf');
});
