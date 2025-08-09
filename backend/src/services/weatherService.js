"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
var axios_1 = require("axios");
var WeatherService = /** @class */ (function () {
    function WeatherService() {
        this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    }
    WeatherService.prototype.getWeight = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, sunny, rainChance, tempMin, tempMax, weight;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.apiKey) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchReal(req)];
                    case 1:
                        _a = _d.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = this.mockData();
                        _d.label = 3;
                    case 3:
                        data = _a;
                        sunny = data.weather[0].main === 'Clear';
                        rainChance = (((_b = data.clouds) === null || _b === void 0 ? void 0 : _b.all) || 0) + (((_c = data.rain) === null || _c === void 0 ? void 0 : _c['1h']) || 0) * 10;
                        tempMin = data.main.temp_min - 273.15;
                        tempMax = data.main.temp_max - 273.15;
                        weight = 1.0;
                        if (sunny)
                            weight += 0.5;
                        if (rainChance < 30)
                            weight += 0.3;
                        if (tempMin >= 18 && tempMax <= 28)
                            weight += 0.2;
                        else if (tempMin < 10 || tempMax > 35)
                            weight -= 0.3;
                        return [2 /*return*/, {
                                weight: Math.round(weight * 100) / 100,
                                conditions: { sunny: sunny, rainChance: rainChance, tempMin: tempMin, tempMax: tempMax }
                            }];
                }
            });
        });
    };
    WeatherService.prototype.fetchReal = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.openweathermap.org/data/2.5/weather?lat=".concat(req.lat, "&lon=").concat(req.lon, "&appid=").concat(this.apiKey))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    WeatherService.prototype.mockData = function () {
        return {
            weather: [{ main: Math.random() > 0.5 ? 'Clear' : 'Clouds' }],
            clouds: { all: Math.floor(Math.random() * 100) },
            rain: Math.random() > 0.7 ? { '1h': Math.random() * 5 } : undefined,
            main: {
                temp_min: 273.15 + Math.random() * 20 + 10,
                temp_max: 273.15 + Math.random() * 20 + 15
            }
        };
    };
    return WeatherService;
}());
exports.WeatherService = WeatherService;
