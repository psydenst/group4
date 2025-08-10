# README.md

## The documentation of our API


The **WeatherService** fetches real-time weather data from [Open-Meteo](https://open-meteo.com) to calculate a "weather weight" score for a given location. The service uses latitude and longitude as inputs, retrieves current weather, daily min/max temperature, precipitation probability, and weather codes, then applies a simple scoring system. The weight starts at 1.0 and is adjusted based on sun presence, rain probability, and temperature range, allowing a quick assessment of how favorable the weather is. Extreme temperatures reduce the score, while sunny, dry, and ideal temperature conditions increase it.

Internally, the service handles all API calls, data parsing, and calculation logic. It applies a 5-second timeout to upstream requests and throws custom errors when communication fails. This makes the API resilient to slow or unavailable weather sources while providing consistent structured responses. Developers can also use a mock data generator (`getMockWeight`) for testing without hitting the external API.

## `/weight` Endpoint

The `/weight` route is a Fastify GET endpoint that validates query parameters and returns the computed weight. It requires two query parameters: `lat` (−90 to 90) and `lon` (−180 to 180). If parameters are invalid or missing, the server responds with a `400 Bad Request`. On success, the response contains the weight and key weather conditions.

**Example cURL:**
```bash
curl "http://localhost:8080/weight?lat=40.7128&lon=-74.0060"
```

## Weather Range Service

The **WeatherRangeService** extends the single-day weather scoring logic to handle forecasts for a range of days, from 1 to 16. It consumes the [Open-Meteo](https://open-meteo.com) API, requesting daily max/min temperature, precipitation probability, and weather codes for each day in the specified range. For every day, it calculates a weight score starting at 1.0 and adjusts it based on sunlight, rain chance, and temperature comfort range, just like the single-day service. The output includes the daily breakdown with date, conditions, and score, along with the total average weight across all days.

The service enforces input validation to ensure days remain within the 1–16 range and uses a 10-second timeout for the external API call. In case of upstream failure or timeout, it falls back to generating mock daily data with randomized conditions and weights. This ensures the API remains responsive and testable, even when weather data is unavailable. The corresponding Fastify route `/` accepts `lat`, `lon`, and optional `days` query parameters, returning the structured multi-day weather score.

**Example cURL:**
```
bash
curl "http://localhost:8080/?lat=40.7128&lon=-74.0060&days=7"
```
## Seasonality Service

The **SeasonalityService** provides seasonal demand insights based on geographic coordinates, using latitude to determine the hemisphere and map the current, high, medium, and low seasons throughout the year. It defines season boundaries and intensity (high, medium, low), calculates a base seasonal weight, and can determine the next upcoming high season or check if a given date falls within one. The service supports multiple routes: `/info` returns general seasonality data; `/next-high` identifies the next high season; `/check` determines if a specific date is in high season; and `/weight` calculates a dynamic weight considering seasonality, public holidays, and vacation periods.  

For enhanced accuracy, `/weight` integrates data from the **GeocodingService**, **HolidayService**, and **VacationService** to adjust the seasonal weight. Public holidays and vacation periods can raise the weight to a peak level (up to 1.5), while low seasons reduce it to as low as 0.7. The response includes a breakdown of contributing factors, the applied rule, and business recommendations with suggested price markups or discounts. All endpoints enforce parameter validation and return structured JSON responses with clear seasonal context.

**Example cURL:**
```
bash

## Get current seasonality info
curl "http://localhost:8080/seasonality/info?lat=-23.5505"

## Get dynamic seasonal weight
curl "http://localhost:8080/seasonality/weight?lat=-23.5505&lon=-46.6333&date=2025-12-25"
```

## Pricing Service

The **PricingService** calculates a final pricing weight for a location by combining seasonal and weather-based demand factors. It makes parallel requests to the `/seasonality/weight` and `/weather/weight` endpoints, passing the current date for seasonality and the provided coordinates for both services. The two weights are multiplied to produce a single final score, which reflects both environmental and temporal demand influences. This value is rounded to three decimal places for precision and consistency. If either service call fails, the calculation is aborted and an error is thrown.

The `/pricing` route exposes this functionality via a Fastify GET endpoint. It requires `lat` and `lon` query parameters, which must be valid numeric values. This endpoint is intended to serve as a unified demand indicator for pricing strategies, leveraging the outputs of multiple specialized services to give a comprehensive, location-specific score.

**Example cURL:**
```
bash
curl "http://localhost:8080/pricing?lat=-23.5505&lon=-46.6333"
```
