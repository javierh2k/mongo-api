const glob = require( 'glob');

const routesLoader = (dirname)  => {
  return new Promise((resolve, reject) => {
    const routes = [];
    glob(
      `${dirname}/*`,
      {
        ignore: [ '**/index.js', '**/request/**']
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }
        files.forEach(file => {
          const route = require(file); // eslint-disable-line global-require, import/no-dynamic-require
          routes.push(route);
        });
        return resolve(routes);
      }
    );
  });
}


module.exports =  function(app) {
  var routesPath = process.cwd() + '/api/routes';
  console.log((__dirname));
  console.log((routesPath));
  routesLoader(routesPath).then(files => {
    console.log(files);
    files.forEach(route => {
      app.use(route.routes()).use(
        route.allowedMethods({
          throw: true
        })
      );
    });
  });
}
