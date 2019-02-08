
function getSkip (page, limit) {
      const base = (page - 1) < 0 ? 0 : page - 1;
      return base * limit;
};


function removeEmptyKeysFromObject(obj) {
  Object.keys(obj).forEach(key => {
      if (
          Object.prototype.toString.call(obj[key]) === '[object Date]' &&
          (obj[key].toString().length === 0 ||
              obj[key].toString() === 'Invalid Date')
      ) {
          delete obj[key];
      } else if (obj[key] && typeof obj[key] === 'object') {
          removeEmptyKeysFromObject(obj[key]);
      } else if (
          obj[key] === undefined ||
          obj[key] === '' ||
          obj[key] === null
      ) {
          delete obj[key];
      }

      if (
          obj[key] &&
          typeof obj[key] === 'object' &&
          Object.keys(obj[key]).length === 0 &&
          Object.prototype.toString.call(obj[key]) !== '[object Date]'
      ) {
          delete obj[key];
      }
  });
  return obj;
}



module.exports = {
  removeEmptyKeysFromObject,
  getSkip
}
