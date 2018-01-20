(function () {
  'use strict';

  angular
    .module('king.services.menu', [])
    .factory('menu', loadFunction);

  loadFunction.$inject = ['structureService', '$location', '$interval'];

  function loadFunction(structureService, $location, $interval) {
    let contain = [];
    let onload  = false
    return { on, load, generate };

    function load(paths, module,/*, softBy */) {
      contain = [];
      onload = false;

      _.flowRight(
        filter,
        fillMenu
      )(paths);

      onload = true;
    }

    function generate() {
      return contain;
    }

    function on(event, callback) {
      if (event === 'load') {
        const loadEvent = $interval(() => {
          if (onload) {
            $interval.cancel(loadEvent);
            callback(contain);
          }
        })
      }
    }

    function fillMenu(paths) {
      _.forIn(paths, (value, key) => {
        structureService
          .getModule(value.path)
          .then(module => {
            contain.push({
              text   : module.name,
              icon   : module.icon,
              url    : "#" + value.path,
              active : $location.path() === value.path
            });
          })
          .catch(console.error);
      });
    }

    function filter(paths) {
      return _.uniq(paths, 'url');
    }
  }
})();
