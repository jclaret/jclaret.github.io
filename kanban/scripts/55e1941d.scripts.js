var CryptoJS = CryptoJS || function (s, p) {
    var m = {}, l = m.lib = {}, n = function () {
      }, r = l.Base = {
        extend: function (b) {
          n.prototype = this;
          var h = new n();
          b && h.mixIn(b);
          h.hasOwnProperty('init') || (h.init = function () {
            h.$super.init.apply(this, arguments);
          });
          h.init.prototype = h;
          h.$super = this;
          return h;
        },
        create: function () {
          var b = this.extend();
          b.init.apply(b, arguments);
          return b;
        },
        init: function () {
        },
        mixIn: function (b) {
          for (var h in b)
            b.hasOwnProperty(h) && (this[h] = b[h]);
          b.hasOwnProperty('toString') && (this.toString = b.toString);
        },
        clone: function () {
          return this.init.prototype.extend(this);
        }
      }, q = l.WordArray = r.extend({
        init: function (b, h) {
          b = this.words = b || [];
          this.sigBytes = h != p ? h : 4 * b.length;
        },
        toString: function (b) {
          return (b || t).stringify(this);
        },
        concat: function (b) {
          var h = this.words, a = b.words, j = this.sigBytes;
          b = b.sigBytes;
          this.clamp();
          if (j % 4)
            for (var g = 0; g < b; g++)
              h[j + g >>> 2] |= (a[g >>> 2] >>> 24 - 8 * (g % 4) & 255) << 24 - 8 * ((j + g) % 4);
          else if (65535 < a.length)
            for (g = 0; g < b; g += 4)
              h[j + g >>> 2] = a[g >>> 2];
          else
            h.push.apply(h, a);
          this.sigBytes += b;
          return this;
        },
        clamp: function () {
          var b = this.words, h = this.sigBytes;
          b[h >>> 2] &= 4294967295 << 32 - 8 * (h % 4);
          b.length = s.ceil(h / 4);
        },
        clone: function () {
          var b = r.clone.call(this);
          b.words = this.words.slice(0);
          return b;
        },
        random: function (b) {
          for (var h = [], a = 0; a < b; a += 4)
            h.push(4294967296 * s.random() | 0);
          return new q.init(h, b);
        }
      }), v = m.enc = {}, t = v.Hex = {
        stringify: function (b) {
          var a = b.words;
          b = b.sigBytes;
          for (var g = [], j = 0; j < b; j++) {
            var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 255;
            g.push((k >>> 4).toString(16));
            g.push((k & 15).toString(16));
          }
          return g.join('');
        },
        parse: function (b) {
          for (var a = b.length, g = [], j = 0; j < a; j += 2)
            g[j >>> 3] |= parseInt(b.substr(j, 2), 16) << 24 - 4 * (j % 8);
          return new q.init(g, a / 2);
        }
      }, a = v.Latin1 = {
        stringify: function (b) {
          var a = b.words;
          b = b.sigBytes;
          for (var g = [], j = 0; j < b; j++)
            g.push(String.fromCharCode(a[j >>> 2] >>> 24 - 8 * (j % 4) & 255));
          return g.join('');
        },
        parse: function (b) {
          for (var a = b.length, g = [], j = 0; j < a; j++)
            g[j >>> 2] |= (b.charCodeAt(j) & 255) << 24 - 8 * (j % 4);
          return new q.init(g, a);
        }
      }, u = v.Utf8 = {
        stringify: function (b) {
          try {
            return decodeURIComponent(escape(a.stringify(b)));
          } catch (g) {
            throw Error('Malformed UTF-8 data');
          }
        },
        parse: function (b) {
          return a.parse(unescape(encodeURIComponent(b)));
        }
      }, g = l.BufferedBlockAlgorithm = r.extend({
        reset: function () {
          this._data = new q.init();
          this._nDataBytes = 0;
        },
        _append: function (b) {
          'string' == typeof b && (b = u.parse(b));
          this._data.concat(b);
          this._nDataBytes += b.sigBytes;
        },
        _process: function (b) {
          var a = this._data, g = a.words, j = a.sigBytes, k = this.blockSize, m = j / (4 * k), m = b ? s.ceil(m) : s.max((m | 0) - this._minBufferSize, 0);
          b = m * k;
          j = s.min(4 * b, j);
          if (b) {
            for (var l = 0; l < b; l += k)
              this._doProcessBlock(g, l);
            l = g.splice(0, b);
            a.sigBytes -= j;
          }
          return new q.init(l, j);
        },
        clone: function () {
          var b = r.clone.call(this);
          b._data = this._data.clone();
          return b;
        },
        _minBufferSize: 0
      });
    l.Hasher = g.extend({
      cfg: r.extend(),
      init: function (b) {
        this.cfg = this.cfg.extend(b);
        this.reset();
      },
      reset: function () {
        g.reset.call(this);
        this._doReset();
      },
      update: function (b) {
        this._append(b);
        this._process();
        return this;
      },
      finalize: function (b) {
        b && this._append(b);
        return this._doFinalize();
      },
      blockSize: 16,
      _createHelper: function (b) {
        return function (a, g) {
          return new b.init(g).finalize(a);
        };
      },
      _createHmacHelper: function (b) {
        return function (a, g) {
          return new k.HMAC.init(b, g).finalize(a);
        };
      }
    });
    var k = m.algo = {};
    return m;
  }(Math);
(function (s) {
  function p(a, k, b, h, l, j, m) {
    a = a + (k & b | ~k & h) + l + m;
    return (a << j | a >>> 32 - j) + k;
  }
  function m(a, k, b, h, l, j, m) {
    a = a + (k & h | b & ~h) + l + m;
    return (a << j | a >>> 32 - j) + k;
  }
  function l(a, k, b, h, l, j, m) {
    a = a + (k ^ b ^ h) + l + m;
    return (a << j | a >>> 32 - j) + k;
  }
  function n(a, k, b, h, l, j, m) {
    a = a + (b ^ (k | ~h)) + l + m;
    return (a << j | a >>> 32 - j) + k;
  }
  for (var r = CryptoJS, q = r.lib, v = q.WordArray, t = q.Hasher, q = r.algo, a = [], u = 0; 64 > u; u++)
    a[u] = 4294967296 * s.abs(s.sin(u + 1)) | 0;
  q = q.MD5 = t.extend({
    _doReset: function () {
      this._hash = new v.init([
        1732584193,
        4023233417,
        2562383102,
        271733878
      ]);
    },
    _doProcessBlock: function (g, k) {
      for (var b = 0; 16 > b; b++) {
        var h = k + b, w = g[h];
        g[h] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360;
      }
      var b = this._hash.words, h = g[k + 0], w = g[k + 1], j = g[k + 2], q = g[k + 3], r = g[k + 4], s = g[k + 5], t = g[k + 6], u = g[k + 7], v = g[k + 8], x = g[k + 9], y = g[k + 10], z = g[k + 11], A = g[k + 12], B = g[k + 13], C = g[k + 14], D = g[k + 15], c = b[0], d = b[1], e = b[2], f = b[3], c = p(c, d, e, f, h, 7, a[0]), f = p(f, c, d, e, w, 12, a[1]), e = p(e, f, c, d, j, 17, a[2]), d = p(d, e, f, c, q, 22, a[3]), c = p(c, d, e, f, r, 7, a[4]), f = p(f, c, d, e, s, 12, a[5]), e = p(e, f, c, d, t, 17, a[6]), d = p(d, e, f, c, u, 22, a[7]), c = p(c, d, e, f, v, 7, a[8]), f = p(f, c, d, e, x, 12, a[9]), e = p(e, f, c, d, y, 17, a[10]), d = p(d, e, f, c, z, 22, a[11]), c = p(c, d, e, f, A, 7, a[12]), f = p(f, c, d, e, B, 12, a[13]), e = p(e, f, c, d, C, 17, a[14]), d = p(d, e, f, c, D, 22, a[15]), c = m(c, d, e, f, w, 5, a[16]), f = m(f, c, d, e, t, 9, a[17]), e = m(e, f, c, d, z, 14, a[18]), d = m(d, e, f, c, h, 20, a[19]), c = m(c, d, e, f, s, 5, a[20]), f = m(f, c, d, e, y, 9, a[21]), e = m(e, f, c, d, D, 14, a[22]), d = m(d, e, f, c, r, 20, a[23]), c = m(c, d, e, f, x, 5, a[24]), f = m(f, c, d, e, C, 9, a[25]), e = m(e, f, c, d, q, 14, a[26]), d = m(d, e, f, c, v, 20, a[27]), c = m(c, d, e, f, B, 5, a[28]), f = m(f, c, d, e, j, 9, a[29]), e = m(e, f, c, d, u, 14, a[30]), d = m(d, e, f, c, A, 20, a[31]), c = l(c, d, e, f, s, 4, a[32]), f = l(f, c, d, e, v, 11, a[33]), e = l(e, f, c, d, z, 16, a[34]), d = l(d, e, f, c, C, 23, a[35]), c = l(c, d, e, f, w, 4, a[36]), f = l(f, c, d, e, r, 11, a[37]), e = l(e, f, c, d, u, 16, a[38]), d = l(d, e, f, c, y, 23, a[39]), c = l(c, d, e, f, B, 4, a[40]), f = l(f, c, d, e, h, 11, a[41]), e = l(e, f, c, d, q, 16, a[42]), d = l(d, e, f, c, t, 23, a[43]), c = l(c, d, e, f, x, 4, a[44]), f = l(f, c, d, e, A, 11, a[45]), e = l(e, f, c, d, D, 16, a[46]), d = l(d, e, f, c, j, 23, a[47]), c = n(c, d, e, f, h, 6, a[48]), f = n(f, c, d, e, u, 10, a[49]), e = n(e, f, c, d, C, 15, a[50]), d = n(d, e, f, c, s, 21, a[51]), c = n(c, d, e, f, A, 6, a[52]), f = n(f, c, d, e, q, 10, a[53]), e = n(e, f, c, d, y, 15, a[54]), d = n(d, e, f, c, w, 21, a[55]), c = n(c, d, e, f, v, 6, a[56]), f = n(f, c, d, e, D, 10, a[57]), e = n(e, f, c, d, t, 15, a[58]), d = n(d, e, f, c, B, 21, a[59]), c = n(c, d, e, f, r, 6, a[60]), f = n(f, c, d, e, z, 10, a[61]), e = n(e, f, c, d, j, 15, a[62]), d = n(d, e, f, c, x, 21, a[63]);
      b[0] = b[0] + c | 0;
      b[1] = b[1] + d | 0;
      b[2] = b[2] + e | 0;
      b[3] = b[3] + f | 0;
    },
    _doFinalize: function () {
      var a = this._data, k = a.words, b = 8 * this._nDataBytes, h = 8 * a.sigBytes;
      k[h >>> 5] |= 128 << 24 - h % 32;
      var l = s.floor(b / 4294967296);
      k[(h + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360;
      k[(h + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360;
      a.sigBytes = 4 * (k.length + 1);
      this._process();
      a = this._hash;
      k = a.words;
      for (b = 0; 4 > b; b++)
        h = k[b], k[b] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360;
      return a;
    },
    clone: function () {
      var a = t.clone.call(this);
      a._hash = this._hash.clone();
      return a;
    }
  });
  r.MD5 = t._createHelper(q);
  r.HmacMD5 = t._createHmacHelper(q);
}(Math));
'use strict';
function Kanban(name, numberOfColumns) {
  return {
    name: name,
    numberOfColumns: numberOfColumns,
    columns: []
  };
}
function KanbanColumn(name) {
  return {
    name: name,
    cards: []
  };
}
function KanbanCard(name, details, color) {
  this.name = name;
  this.details = details;
  this.color = color;
  return this;
}
'use strict';
angular.module('mpk', [
  'ui.bootstrap',
  'ngSanitize'
]);
'use strict';
angular.module('mpk').factory('cloudService', [
  '$http',
  '$log',
  '$q',
  '$timeout',
  'cryptoService',
  function ($http, $log, $q, $timeout, cryptoService) {
    return {
      settings: { notLoaded: true },
      loadSettings: function () {
        var settings = localStorage.getItem('myPersonalKanban.cloudSettings');
        if (settings == undefined) {
          this.settings = { notSetup: true };
          return this.settings;
        }
        this.settings = angular.fromJson(settings);
        this.settings.notSetup = false;
        return this.settings;
      },
      saveSettings: function (settings) {
        this.settings = settings;
        localStorage.setItem('myPersonalKanban.cloudSettings', angular.toJson(this.settings, false));
        return this.settings;
      },
      downloadKanban: function () {
        if (this.settings.notLoaded) {
          this.loadSettings();
        }
        var params = {
            kanbanKey: this.settings.kanbanKey,
            action: 'get'
          };
        return $http.jsonp('https://my-personal-kanban.appspot.com/service/kanban?callback=JSON_CALLBACK', { params: params });
      },
      uploadKanban: function (kanban) {
        if (this.settings.notLoaded) {
          this.loadSettings();
        }
        var self = this;
        function splitSlice(str, len) {
          var ret = [];
          for (var offset = 0, strLen = str.length; offset < strLen; offset += len) {
            ret.push(str.slice(offset, len + offset));
          }
          return ret;
        }
        ;
        function sendStart(numberOfFragments) {
          var params = {
              kanbanKey: self.settings.kanbanKey,
              action: 'put',
              fragments: numberOfFragments
            };
          return $http.jsonp('https://my-personal-kanban.appspot.com/service/kanban?callback=JSON_CALLBACK', { params: params });
        }
        ;
        function sendChunk(chunk, chunkNumber) {
          var params = {
              kanbanKey: self.settings.kanbanKey,
              action: 'put',
              chunk: chunk,
              chunkNumber: chunkNumber
            };
          return $http.jsonp('https://my-personal-kanban.appspot.com/service/kanban?callback=JSON_CALLBACK', { params: params });
        }
        ;
        function checkKanbanValidity(kanban) {
          var hash = cryptoService.md5Hash(kanban);
          var params = {
              kanbanKey: self.settings.kanbanKey,
              action: 'put',
              hash: hash
            };
          return $http.jsonp('https://my-personal-kanban.appspot.com/service/kanban?callback=JSON_CALLBACK', { params: params });
        }
        ;
        var kanbanInChunks = splitSlice(kanban, 1000);
        var promise = sendStart(kanbanInChunks.length);
        angular.forEach(kanbanInChunks, function (value, index) {
          promise = promise.then(function () {
            return sendChunk(value, index + 1);
          });
        });
        return promise.then(function () {
          return checkKanbanValidity(kanban);
        });
      },
      isConfigurationValid: function () {
        if (this.settings.notLoaded) {
          this.loadSettings();
        }
        return this.settings.kanbanKey != undefined && this.settings.kanbanKey != '';
      },
      validateKanbanKey: function (kanbanKey) {
        return $http.jsonp('https://my-personal-kanban.appspot.com/service/kanban?callback=JSON_CALLBACK', {
          params: {
            action: 'key',
            kanbanKey: kanbanKey
          }
        });
      }
    };
  }
]);
'use strict';
angular.module('mpk').factory('kanbanRepository', [
  'cloudService',
  function (cloudService) {
    return {
      kanbansByName: {},
      lastUsed: '',
      theme: 'default-bright',
      lastUpdated: 0,
      add: function (kanban) {
        this.kanbansByName[kanban.name] = kanban;
        this.save();
        return kanban;
      },
      all: function () {
        return this.kanbansByName;
      },
      get: function (kanbanName) {
        return this.kanbansByName[kanbanName];
      },
      remove: function (kanbanName) {
        if (this.kanbansByName[kanbanName]) {
          delete this.kanbansByName[kanbanName];
        }
        return this.kanbansByName;
      },
      prepareSerializedKanbans: function () {
        var toBeSerialized = {
            kanbans: this.kanbansByName,
            lastUsed: this.lastUsed,
            theme: this.theme,
            lastUpdated: this.lastUpdated
          };
        return angular.toJson(toBeSerialized, false);
      },
      save: function () {
        var prepared = this.prepareSerializedKanbans();
        localStorage.setItem('myPersonalKanban', prepared);
        return this.kanbansByName;
      },
      load: function () {
        var saved = angular.fromJson(localStorage.getItem('myPersonalKanban'));
        if (saved === null) {
          return null;
        }
        this.kanbansByName = saved.kanbans;
        this.lastUsed = saved.lastUsed;
        this.theme = saved.theme;
        this.lastUpdated = saved.lastUpdated;
        return this.kanbansByName;
      },
      getLastUsed: function () {
        if (!this.lastUsed) {
          return this.kanbansByName[Object.keys(this.kanbansByName)[0]];
        }
        return this.kanbansByName[this.lastUsed];
      },
      setLastUsed: function (kanbanName) {
        this.lastUsed = kanbanName;
        return this.lastUsed;
      },
      getTheme: function () {
        return this.theme;
      },
      setTheme: function (theme) {
        this.theme = theme;
        this.save();
        return this.theme;
      },
      upload: function () {
        return cloudService.uploadKanban(this.prepareSerializedKanbans());
      },
      setLastUpdated: function (updated) {
        this.lastUpdated = updated;
        return this;
      },
      getLastUpdated: function () {
        return this.lastUpdated;
      },
      download: function () {
        return cloudService.downloadKanban();
      },
      saveDownloadedKanban: function (kanban, lastUpdated) {
        var fromCloud = angular.fromJson(kanban);
        this.kanbansByName = fromCloud.kanbans;
        this.lastUsed = fromCloud.lastUsed;
        this.theme = fromCloud.theme;
        this.lastUpdated = lastUpdated;
        this.save();
        return this;
      },
      renameLastUsedTo: function (newName) {
        var lastUsed = this.getLastUsed();
        delete this.kanbansByName[lastUsed.name];
        lastUsed.name = newName;
        this.kanbansByName[newName] = lastUsed;
        this.lastUsed = newName;
        return true;
      }
    };
  }
]);
'use strict';
angular.module('mpk').factory('kanbanManipulator', function () {
  return {
    addColumn: function (kanban, columnName) {
      kanban.columns.push(new KanbanColumn(columnName));
    },
    addCardToColumn: function (kanban, column, cardTitle, details, color) {
      angular.forEach(kanban.columns, function (col) {
        if (col.name === column.name) {
          col.cards.push(new KanbanCard(cardTitle, details, color));
        }
      });
    },
    removeCardFromColumn: function (kanban, column, card) {
      angular.forEach(kanban.columns, function (col) {
        if (col.name === column.name) {
          col.cards.splice(col.cards.indexOf(card), 1);
        }
      });
    }
  };
});
'use strict';
angular.module('mpk').factory('themesProvider', [
  '$window',
  function ($window) {
    var themes = $window.themes;
    return {
      getThemes: function () {
        return themes;
      },
      setCurrentTheme: function (theme) {
        var themeStylesheet = document.getElementById('themeStylesheet');
        var pathPart = themeStylesheet.href.substr(0, themeStylesheet.href.lastIndexOf('/'));
        themeStylesheet.href = pathPart + '/' + theme + '.css';
        return themeStylesheet.href;
      },
      defaultTheme: 'default-bright'
    };
  }
]);
'use strict';
var ApplicationController = function ($scope, $window, kanbanRepository, themesProvider) {
  $scope.colorOptions = [
    'FFFFFF',
    'DBDBDB',
    'FFB5B5',
    'FF9E9E',
    'FCC7FC',
    'FC9AFB',
    'CCD0FC',
    '989FFA',
    'CFFAFC',
    '9EFAFF',
    '94D6FF',
    'C1F7C2',
    'A2FCA3',
    'FAFCD2',
    'FAFFA1',
    'FCE4D4',
    'FCC19D'
  ];
  $scope.$on('ChangeCurrentKanban', function () {
    $scope.kanban = kanbanRepository.getLastUsed();
    $scope.allKanbans = Object.keys(kanbanRepository.all());
    $scope.selectedToOpen = $scope.kanban.name;
  });
  $scope.$on('Open', function (event, args) {
    $scope.kanban = kanbanRepository.get(args.kanbanName);
    kanbanRepository.setLastUsed(args.kanbanName);
    $scope.newName = args.kanbanName;
    kanbanRepository.save();
  });
  $scope.$on('KanbanDeleted', function () {
    $scope.kanban = undefined;
    $scope.allKanbans = Object.keys(kanbanRepository.all());
  });
  $scope.$on('UploadStarted', function () {
    $scope.errorMessage = '';
    $scope.showError = false;
    $scope.infoMessage = 'Uploading Kanban ...';
    $scope.showInfo = true;
    $scope.showSpinner = true;
  });
  $scope.$on('UploadFinished', function () {
    $scope.infoMessage = '';
    $scope.showInfo = false;
    $scope.showSpinner = false;
  });
  function handleErrorUploadDownload(event, errorMessage) {
    $scope.infoMessage = '';
    $scope.showInfo = true;
    $scope.showError = true;
    $scope.showSpinner = false;
    $scope.errorMessage = errorMessage;
  }
  $scope.$on('UploadFinishedWithErrors', handleErrorUploadDownload);
  $scope.$on('UploadError', function () {
    $scope.infoMessage = '';
    $scope.showInfo = true;
    $scope.showSpinner = false;
    $scope.showError = true;
    $scope.errorMessage = 'There was a problem uploading your Kanban.';
  });
  $scope.$on('DownloadStarted', function () {
    $scope.infoMessage = 'Downloading your Kanban ...';
    $scope.showSpinner = true;
    $scope.showError = false;
    $scope.errorMessage = '';
  });
  $scope.$on('DownloadFinished', function () {
    $window.location.reload();
  });
  $scope.$on('DownloadFinishedWithError', handleErrorUploadDownload);
  $scope.$on('DownloadError', function () {
    $scope.infoMessage = '';
    $scope.showInfo = true;
    $scope.showError = true;
    $scope.showSpinner = false;
    $scope.errorMessage = 'Problem Downloading your Kanban. Check Internet connectivity and try again.';
  });
  $scope.editingKanbanName = function () {
    $scope.editingName = true;
  };
  $scope.editingName = false;
  $scope.rename = function () {
    kanbanRepository.renameLastUsedTo($scope.newName);
    kanbanRepository.save();
    $scope.allKanbans = Object.keys(kanbanRepository.all());
    $scope.editingName = false;
  };
  $scope.spinConfig = {
    lines: 10,
    length: 3,
    width: 2,
    radius: 5
  };
  var currentKanban = new Kanban('Kanban name', 0);
  var loadedRepo = kanbanRepository.load();
  if (loadedRepo && kanbanRepository.getLastUsed() != undefined) {
    currentKanban = kanbanRepository.getLastUsed();
  }
  $scope.kanban = currentKanban;
  $scope.allKanbans = Object.keys(kanbanRepository.all());
  $scope.selectedToOpen = $scope.newName = currentKanban.name;
  $scope.$watch('kanban', function () {
    kanbanRepository.save();
  }, true);
  var windowHeight = angular.element($window).height() - 110;
  $scope.minHeightOfColumn = 'min-height:' + windowHeight + 'px;';
  $scope.triggerOpen = function () {
    $scope.$broadcast('TriggerOpenKanban');
  };
  if (kanbanRepository.getTheme() != undefined && kanbanRepository.getTheme() != '') {
    themesProvider.setCurrentTheme(kanbanRepository.getTheme());
  }
};
'use strict';
var MenuController = function ($scope, kanbanRepository, $modal) {
  $scope.newKanban = function () {
    var modalInstance = $modal.open({
        templateUrl: 'NewKanbanModal.html',
        controller: 'NewKanbanController'
      });
    modalInstance.result.then(function (created) {
      if (created) {
        $scope.$emit('ChangeCurrentKanban');
      }
    });
  };
  $scope.openKanban = function () {
    var modalInstance = $modal.open({
        templateUrl: 'OpenKanban.html',
        controller: 'OpenKanbanController',
        resolve: {
          allKanbans: function () {
            return $scope.allKanbans;
          },
          currentKanban: function () {
            return $scope.kanban;
          }
        }
      });
    modalInstance.result.then(function (toOpen) {
      if (toOpen) {
        $scope.$emit('Open', { kanbanName: toOpen });
      }
    });
  };
  $scope.delete = function () {
    if (confirm('You sure you want to delete the entire Kanban?')) {
      kanbanRepository.remove($scope.kanban.name);
      var all = kanbanRepository.all();
      var names = Object.keys(all);
      if (names.length > 0) {
        kanbanRepository.setLastUsed(names[0]);
      } else {
        kanbanRepository.setLastUsed(undefined);
      }
      $scope.$emit('KanbanDeleted');
      $scope.openKanban();
    }
    return false;
  };
  $scope.selectTheme = function () {
    $modal.open({
      templateUrl: 'SelectTheme.html',
      controller: 'SwitchThemeController'
    });
  };
  $scope.$on('TriggerOpen', function () {
    $scope.openKanban();
  });
};
'use strict';
var NewKanbanController = function ($scope, $modalInstance, kanbanRepository, kanbanManipulator) {
  $scope.numberOfColumns = 3;
  $scope.kanbanName = '';
  $scope.createNew = function () {
    if (!this.newKanbanForm.$valid) {
      return false;
    }
    var newKanban = new Kanban(this.kanbanName, this.numberOfColumns);
    for (var i = 1; i < parseInt(this.numberOfColumns) + 1; i++) {
      kanbanManipulator.addColumn(newKanban, 'Column ' + i);
    }
    kanbanRepository.add(newKanban);
    this.kanbanName = '';
    this.numberOfColumns = 3;
    kanbanRepository.setLastUsed(newKanban.name);
    $modalInstance.close(true);
    return true;
  };
  $scope.closeNewKanban = function () {
    $scope.numberOfColumns = 3;
    $scope.kanbanName = '';
    $modalInstance.close();
  };
};
'use strict';
var OpenKanbanController = function ($scope, $modalInstance, allKanbans, currentKanban) {
  $scope.allKanbans = allKanbans;
  $scope.selectedToOpen = currentKanban ? currentKanban.name : undefined;
  $scope.close = function () {
    $modalInstance.close();
  };
  $scope.open = function () {
    if (!this.openKanbanForm.$valid) {
      return false;
    }
    $modalInstance.close(this.selectedToOpen);
    return true;
  };
};
'use strict';
var CardController = function ($scope, $modalInstance, colorOptions, card) {
  function initScope(scope, card, colorOptions) {
    scope.name = card.name;
    scope.details = card.details;
    scope.card = card;
    scope.cardColor = card.color;
    scope.colorOptions = colorOptions;
    scope.editTitle = false;
    scope.editDetails = false;
  }
  $scope.close = function () {
    $modalInstance.close();
  };
  $scope.update = function () {
    if (!this.cardDetails.$valid) {
      return false;
    }
    this.card.name = this.name;
    this.card.details = this.details;
    this.card.color = this.cardColor;
    $modalInstance.close(this.card);
  };
  $scope.editTitle = function () {
    var scope = this;
    scope.editTitle = false;
  };
  initScope($scope, card, colorOptions);
};
'use strict';
var NewKanbanCardController = function ($scope, $modalInstance, kanbanManipulator, colorOptions, column) {
  function initScope(scope, colorOptions) {
    scope.kanbanColumnName = column.name;
    scope.column = column;
    scope.title = '';
    scope.details = '';
    scope.cardColor = colorOptions[0];
    scope.colorOptions = colorOptions;
  }
  $scope.addNewCard = function () {
    if (!this.newCardForm.$valid) {
      return false;
    }
    $modalInstance.close({
      title: this.title,
      column: column,
      details: this.details,
      color: this.cardColor
    });
  };
  $scope.close = function () {
    $modalInstance.close();
  };
  initScope($scope, colorOptions);
};
'use strict';
var KanbanController = function ($scope, $modal, kanbanManipulator) {
  $scope.addNewCard = function (column) {
    var modalInstance = $modal.open({
        templateUrl: 'NewKanbanCard.html',
        controller: 'NewKanbanCardController',
        resolve: {
          colorOptions: function () {
            return $scope.colorOptions;
          },
          column: function () {
            return column;
          }
        }
      });
    modalInstance.result.then(function (cardDetails) {
      if (cardDetails) {
        kanbanManipulator.addCardToColumn($scope.kanban, cardDetails.column, cardDetails.title, cardDetails.details, cardDetails.color);
      }
    });
  };
  $scope.delete = function (card, column) {
    if (confirm('You sure?')) {
      kanbanManipulator.removeCardFromColumn($scope.kanban, column, card);
    }
  };
  $scope.openCardDetails = function (card) {
    $modal.open({
      templateUrl: 'OpenCard.html',
      controller: 'CardController',
      resolve: {
        colorOptions: function () {
          return $scope.colorOptions;
        },
        card: function () {
          return card;
        }
      }
    });
  };
  $scope.details = function (card) {
    if (card.details !== undefined && card.details !== '') {
      return card.details;
    }
    return card.name;
  };
  $scope.colorFor = function (card) {
    return card.color !== undefined && card.color !== '' ? card.color : $scope.colorOptions[0];
  };
};
'use strict';
var CloudMenuController = function ($scope, $modal, kanbanRepository, cloudService) {
  $scope.openCloudSetup = function (showConfigurationError) {
    var modalInstance = $modal.open({
        templateUrl: 'SetupCloudModal.html',
        controller: 'SetupCloudController',
        resolve: {
          showConfigurationError: function () {
            return showConfigurationError;
          }
        }
      });
    return false;
  };
  $scope.upload = function () {
    if (!cloudService.isConfigurationValid()) {
      return $scope.openCloudSetup(true);
    }
    var promise = kanbanRepository.upload();
    $scope.$emit('UploadStarted');
    promise.then(function (result) {
      if (result.data.success) {
        kanbanRepository.setLastUpdated(result.data.lastUpdated).save();
        $scope.$emit('UploadFinished');
      } else {
        $scope.$emit('UploadFinishedWithErrors', result.data.error);
        console.error(result);
      }
    }, function (errors) {
      $scope.$emit('UploadError');
    });
    return false;
  };
  $scope.download = function () {
    if (!cloudService.isConfigurationValid()) {
      return $scope.openCloudSetup(true);
    }
    $scope.$emit('DownloadStarted');
    var promise = kanbanRepository.download();
    promise.success(function (data) {
      if (data.success) {
        kanbanRepository.saveDownloadedKanban(data.kanban, data.lastUpdated);
        $scope.$emit('DownloadFinished');
      } else {
        $scope.$emit('DownloadFinishedWithError', data.error);
      }
    }).error(function (data, status, headers, config) {
      $scope.$emit('DownloadError', data);
    });
    return false;
  };
};
'use strict';
var SwitchThemeController = function ($scope, $modalInstance, themesProvider, kanbanRepository) {
  $scope.model = {};
  $scope.model.themes = themesProvider.getThemes();
  var theme = kanbanRepository.getTheme();
  if (theme == undefined || theme == '') {
    theme = themesProvider.defaultTheme;
  }
  $scope.model.selectedTheme = theme;
  $scope.close = function () {
    $modalInstance.close();
  };
  $scope.switchTheme = function () {
    themesProvider.setCurrentTheme($scope.model.selectedTheme);
    kanbanRepository.setTheme($scope.model.selectedTheme);
    $modalInstance.close();
  };
};
'use strict';
var SetupCloudController = function ($scope, $modalInstance, cloudService, showConfigurationError) {
  $scope.model = {};
  $scope.model.showConfigurationError = showConfigurationError;
  $scope.close = function () {
    $modalInstance.close();
  };
  $scope.saveSettings = function () {
    if ($scope.model.kanbanKey != undefined && $scope.model.kanbanKey.length != 0) {
      var settings = { kanbanKey: $scope.model.kanbanKey };
      cloudService.saveSettings(settings);
      $scope.close();
    }
  };
  var settings = cloudService.loadSettings();
  if (!settings.notSetup) {
    $scope.model.kanbanKey = settings.kanbanKey;
  }
};
'use strict';
angular.module('mpk').directive('colorSelector', function () {
  return {
    restrict: 'E',
    scope: {
      options: '=',
      model: '=ngModel',
      prefix: '@',
      showRadios: '=',
      showHexCode: '='
    },
    require: 'ngModel',
    template: '<span ng-show="showHexCode">&nbsp;#{{model}}</span><div class="pull-left" ng-repeat="option in options" ng-model="option">\n' + '\t<label class="colorBox" for="{{prefix}}{{option}}" ng-class="{selected: option == model}" style="background-color: #{{option}};" ng-click="selectColor(option)"></label>\n' + '\t<br ng-show="showRadios"/>\n' + '\t<input type="radio" id="{{prefix}}{{option}}" name="{{prefix}}" value="{{option}}" ng-show="showRadios" ng-model="model"/>\n' + '</div>\n',
    link: function (scope) {
      if (scope.model === undefined || scope.model === '') {
        scope.model = scope.options[0];
      }
      scope.selectColor = function (color) {
        scope.model = color;
      };
    }
  };
});
'use strict';
angular.module('mpk').directive('focusMe', [
  '$timeout',
  function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        if (attrs.focusMe) {
          scope.$watch(attrs.focusMe, function (value) {
            if (value === true) {
              $timeout(function () {
                element[0].focus();
              });
            }
          });
        } else {
          $timeout(function () {
            element[0].focus();
          });
        }
      }
    };
  }
]);
'use strict';
'use strict';
angular.module('mpk').value('uiSortableConfig', {}).directive('uiSortable', [
  'uiSortableConfig',
  '$timeout',
  '$log',
  function (uiSortableConfig, $timeout, $log) {
    return {
      require: '?ngModel',
      link: function (scope, element, attrs, ngModel) {
        var savedNodes;
        function combineCallbacks(first, second) {
          if (second && typeof second === 'function') {
            return function (e, ui) {
              first(e, ui);
              second(e, ui);
            };
          }
          return first;
        }
        var opts = {};
        var callbacks = {
            receive: null,
            remove: null,
            start: null,
            stop: null,
            update: null
          };
        angular.extend(opts, uiSortableConfig);
        if (ngModel) {
          scope.$watch(attrs.ngModel + '.length', function () {
            $timeout(function () {
              element.sortable('refresh');
            });
          });
          callbacks.start = function (e, ui) {
            ui.item.sortable = {
              index: ui.item.index(),
              cancel: function () {
                ui.item.sortable._isCanceled = true;
              },
              isCanceled: function () {
                return ui.item.sortable._isCanceled;
              },
              _isCanceled: false
            };
          };
          callbacks.activate = function () {
            savedNodes = element.contents();
            var placeholder = element.sortable('option', 'placeholder');
            if (placeholder && placeholder.element && typeof placeholder.element === 'function') {
              var phElement = placeholder.element();
              if (!phElement.jquery) {
                phElement = angular.element(phElement);
              }
              var excludes = element.find('[class="' + phElement.attr('class') + '"]');
              savedNodes = savedNodes.not(excludes);
            }
          };
          callbacks.update = function (e, ui) {
            if (!ui.item.sortable.received) {
              ui.item.sortable.dropindex = ui.item.index();
              ui.item.sortable.droptarget = ui.item.parent();
              element.sortable('cancel');
            }
            savedNodes.detach();
            if (element.sortable('option', 'helper') === 'clone') {
              savedNodes = savedNodes.not(savedNodes.last());
            }
            savedNodes.appendTo(element);
            if (ui.item.sortable.received && !ui.item.sortable.isCanceled()) {
              scope.$apply(function () {
                ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0, ui.item.sortable.moved);
              });
            }
          };
          callbacks.stop = function (e, ui) {
            if (!ui.item.sortable.received && 'dropindex' in ui.item.sortable && !ui.item.sortable.isCanceled()) {
              scope.$apply(function () {
                ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0, ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]);
              });
            } else {
              if ((!('dropindex' in ui.item.sortable) || ui.item.sortable.isCanceled()) && element.sortable('option', 'helper') !== 'clone') {
                savedNodes.detach().appendTo(element);
              }
            }
          };
          callbacks.receive = function (e, ui) {
            ui.item.sortable.received = true;
          };
          callbacks.remove = function (e, ui) {
            if (!ui.item.sortable.isCanceled()) {
              scope.$apply(function () {
                ui.item.sortable.moved = ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0];
              });
            }
          };
          scope.$watch(attrs.uiSortable, function (newVal) {
            angular.forEach(newVal, function (value, key) {
              if (callbacks[key]) {
                if (key === 'stop') {
                  value = combineCallbacks(value, function () {
                    scope.$apply();
                  });
                }
                value = combineCallbacks(callbacks[key], value);
              }
              element.sortable('option', key, value);
            });
          }, true);
          angular.forEach(callbacks, function (value, key) {
            opts[key] = combineCallbacks(value, opts[key]);
          });
        } else {
          $log.info('ui.sortable: ngModel not provided!', element);
        }
        element.sortable(opts);
      }
    };
  }
]);
'use strict';
angular.module('mpk').filter('cardDetails', function () {
  return function (input) {
    if (input == undefined || input === '')
      return input;
    return input.replace(/&#10;/g, '<br />');
  };
});
'use strict';
angular.module('mpk').factory('cryptoService', function () {
  return {
    md5Hash: function (stringToHash) {
      return CryptoJS.MD5(stringToHash).toString();
    }
  };
});
'use strict';
angular.module('mpk').directive('spin', function () {
  var augmentOpts = function (color, opts) {
    if (!opts.color) {
      opts.color = color;
    }
  };
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<div ng-transclude></div>',
    scope: {
      config: '=spin',
      spinif: '=spinIf'
    },
    link: function (scope, element, attrs) {
      var cssColor = element.css('color'), stoped = false, hideElement = !!scope.config.hideElement, spinner;
      augmentOpts(cssColor, scope.config), spinner = new Spinner(scope.config), spinner.spin(element[0]);
      scope.$watch('config', function (newValue, oldValue) {
        if (newValue == oldValue)
          return;
        spinner.stop();
        hideElement = !!newValue.config.hideElement;
        spinner = new Spinner(newValue);
        if (!stoped)
          spinner.spin(element[0]);
      }, true);
      if (attrs.hasOwnProperty('spinIf')) {
        scope.$watch('spinif', function (newValue) {
          if (newValue) {
            spinner.spin(element[0]);
            if (hideElement) {
              element.css('display', '');
            }
            stoped = false;
          } else {
            spinner.stop();
            if (hideElement) {
              element.css('display', 'none');
            }
            stoped = true;
          }
        });
      }
      scope.$on('$destroy', function () {
        spinner.stop();
      });
    }
  };
});
'use strict';
angular.module('mpk').directive('validKey', [
  '$http',
  function ($http) {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        function validate() {
          var key = element.val();
          var params = {
              kanbanKey: key,
              action: 'key'
            };
          $http.jsonp('https://my-personal-kanban.appspot.com/service/kanban?callback=JSON_CALLBACK', { params: params }).success(function (data) {
            console.log(data);
            ctrl.$setValidity('validKey', data.success);
          }).error(function () {
            ctrl.$setValidity('validKeyUnableToVerify', false);
          });
        }
        ;
        scope.$watch(attrs.ngModel, validate);
      }
    };
  }
]);