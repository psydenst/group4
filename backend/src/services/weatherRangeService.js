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
exports.WeatherRangeService = void 0;
exports.getWeatherRange = getWeatherRange;
var axios_1 = require("axios");
function getWeatherRange(req) {
    return __awaiter(this, void 0, void 0, function () {
        var svc;
        return __generator(this, function (_a) {
            svc = new WeatherRangeService();
            return [2 /*return*/, svc.getWeatherRange(req)];
        });
    });
}
var WeatherRangeService = /** @class */ (function () {
    function WeatherRangeService() {
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
    }
    // Rota original - 1 dia
    WeatherRangeService.prototype.getWeight = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var data, sunny, rainChance, tempMin, tempMax, weight, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fetchWeatherData(req)];
                    case 1:
                        data = _a.sent();
                        sunny = this.isSunny(data.current_weather.weathercode);
                        rainChance = data.daily.precipitation_probability_max[0] || 0;
                        tempMin = data.daily.temperature_2m_min[0];
                        tempMax = data.daily.temperature_2m_max[0];
                        weight = 1.0;
                        // Sol = +0.5
                        if (sunny)
                            weight += 0.5;
                        // Baixa chance de chuva = +0.3
                        if (rainChance < 30)
                            weight += 0.3;
                        // Temperatura ideal (18-28°C) = +0.2
                        if (tempMin >= 18 && tempMax <= 28) {
                            weight += 0.2;
                        }
                        else if (tempMin < 10 || tempMax > 35) {
                            weight -= 0.3; // Temperatura extrema = -0.3
                        }
                        return [2 /*return*/, {
                                weight: Math.round(weight * 100) / 100,
                                conditions: { sunny: sunny, rainChance: rainChance, tempMin: tempMin, tempMax: tempMax }
                            }];
                    case 2:
                        error_1 = _a.sent();
                        // Fallback para dados simulados em caso de erro
                        return [2 /*return*/, this.getMockWeight()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Nova rota - Range de dias (1-16)
    WeatherRangeService.prototype.getWeatherRange = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var days, data, dailyData, totalWeight, i, weatherCode, sunny, rainChance, tempMin, tempMax, weight, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        days = Math.min(Math.max(req.days, 1), 16);
                        return [4 /*yield*/, this.fetchWeatherRangeData(req, days)];
                    case 1:
                        data = _a.sent();
                        dailyData = [];
                        totalWeight = 0;
                        // Processar cada dia
                        for (i = 0; i < data.daily.time.length; i++) {
                            weatherCode = data.daily.weathercode[i];
                            sunny = this.isSunny(weatherCode);
                            rainChance = data.daily.precipitation_probability_max[i] || 0;
                            tempMin = data.daily.temperature_2m_min[i];
                            tempMax = data.daily.temperature_2m_max[i];
                            weight = 1.0;
                            if (sunny)
                                weight += 0.5;
                            if (rainChance < 30)
                                weight += 0.3;
                            if (tempMin >= 18 && tempMax <= 28) {
                                weight += 0.2;
                            }
                            else if (tempMin < 10 || tempMax > 35) {
                                weight -= 0.3;
                            }
                            weight = Math.round(weight * 100) / 100;
                            totalWeight += weight;
                            dailyData.push({
                                date: data.daily.time[i],
                                weight: weight,
                                sunny: sunny,
                                rainChance: rainChance,
                                tempMin: Math.round(tempMin * 10) / 10,
                                tempMax: Math.round(tempMax * 10) / 10,
                                weatherCode: weatherCode
                            });
                        }
                        return [2 /*return*/, {
                                days: dailyData,
                                averageWeight: Math.round((totalWeight / dailyData.length) * 100) / 100,
                                totalDays: dailyData.length
                            }];
                    case 2:
                        error_2 = _a.sent();
                        // Fallback para dados simulados
                        return [2 /*return*/, this.getMockWeatherRange(req.days)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WeatherRangeService.prototype.fetchWeatherData = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.baseUrl, {
                            params: {
                                latitude: req.lat,
                                longitude: req.lon,
                                current_weather: true,
                                daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode',
                                timezone: 'auto',
                                forecast_days: 1
                            },
                            timeout: 5000
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    WeatherRangeService.prototype.fetchWeatherRangeData = function (req, days) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get(this.baseUrl, {
                            params: {
                                latitude: req.lat,
                                longitude: req.lon,
                                daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode',
                                timezone: 'auto',
                                forecast_days: days
                            },
                            timeout: 10000
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // Weather codes da Open-Meteo: https://open-meteo.com/en/docs
    WeatherRangeService.prototype.isSunny = function (code) {
        // 0 = Clear sky, 1 = Mainly clear
        return code === 0 || code === 1;
    };
    WeatherRangeService.prototype.getMockWeight = function () {
        var sunny = Math.random() > 0.5;
        var rainChance = Math.floor(Math.random() * 100);
        var tempMin = Math.floor(Math.random() * 20 + 10);
        var tempMax = tempMin + Math.floor(Math.random() * 15 + 5);
        var weight = 1.0;
        if (sunny)
            weight += 0.5;
        if (rainChance < 30)
            weight += 0.3;
        if (tempMin >= 18 && tempMax <= 28)
            weight += 0.2;
        else if (tempMin < 10 || tempMax > 35)
            weight -= 0.3;
        return {
            weight: Math.round(weight * 100) / 100,
            conditions: { sunny: sunny, rainChance: rainChance, tempMin: tempMin, tempMax: tempMax }
        };
    };
    WeatherRangeService.prototype.getMockWeatherRange = function (days) {
        var dailyData = [];
        var totalWeight = 0;
        for (var i = 0; i < days; i++) {
            var date = new Date();
            date.setDate(date.getDate() + i);
            var sunny = Math.random() > 0.5;
            var rainChance = Math.floor(Math.random() * 100);
            var tempMin = Math.floor(Math.random() * 20 + 10);
            var tempMax = tempMin + Math.floor(Math.random() * 15 + 5);
            var weatherCode = sunny ? (Math.random() > 0.5 ? 0 : 1) : Math.floor(Math.random() * 10 + 10);
            var weight = 1.0;
            if (sunny)
                weight += 0.5;
            if (rainChance < 30)
                weight += 0.3;
            if (tempMin >= 18 && tempMax <= 28)
                weight += 0.2;
            else if (tempMin < 10 || tempMax > 35)
                weight -= 0.3;
            weight = Math.round(weight * 100) / 100;
            totalWeight += weight;
            dailyData.push({
                date: date.toISOString().split('T')[0],
                weight: weight,
                sunny: sunny,
                rainChance: rainChance,
                tempMin: tempMin,
                tempMax: tempMax,
                weatherCode: weatherCode
            });
        }
        return {
            days: dailyData,
            averageWeight: Math.round((totalWeight / days) * 100) / 100,
            totalDays: days
        };
    };
    return WeatherRangeService;
}());
exports.WeatherRangeService = WeatherRangeService;
