##FlyGo

A web application for finding flights when you don't have a destination yet.

###Concept

FlyGo is for finding flights when you have dates and a budget but not a destination. The goal of the FlyGo project is to only find flights that match your criteria which can be any combination of the below:

* Budget
* Dates (fixed or flexible)
* Layover length
* Continent (include or exclude)
* Domestic or International
* Airline Alliance

###Setup

First register for an API key from [Sabre Dev Studio](https://developer.sabre.com/member/register) and go through the [Authentication Steps](https://developer.sabre.com/docs/read/rest_basics/authentication).

Then clone this repo to your local machine and navigate to its root directory. Run `npm install` to install all npm dependencies.

After loading the npm modules download to the public directory angular-ui-unique by running `bower install angular-ui-utils#bower-unique`

Once all dependencies have installed run

>SECRET='Bearer {YOUR-KEY-HERE}' npm start

to run the server. The Flygo page can be accessed at `http://localhost:3000` in your browser

###TODO

* Implement Continent filter
* Better UI
* Change depart and arrive to not show date unless arrive on different date

###Sources

Airfare data is sourced from [Sabre](https://developer.sabre.com), and airport and airline codes are originally sourced from [OpenFlights.org](http://openflights.org/data.html) and modified/converted into json files by me.