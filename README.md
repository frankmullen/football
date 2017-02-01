# football

The purpose of this project was to compare the historical performance of Manchester United and Liverpool football clubs using d3.js, dc.js, Crossfilter and Flask.

However, I ran into problems.

First, I couldn't figure out how to create a composite chart from a single data source. I solved this by separating my data into 2 files and creating a composite chart with one line chart for each club. This code is on the master branch.

Next, the brush functionality wouldn't work. Filtering the composite chart didn't make changes elsewhere on the page, like it should. I subsequently discovered this feature hasn't yet been implemented in dc.js

I then tried to create a dashboard for just Manchester United. I successfully created the line chart and a pie chart showing the divisions the club had played in. But when I tried to create charts containing the clubs win-draw-loss data, I ran into more problems. My data was in the format: [{"Season": 2016, "Played": 38, "Won": 24, "Drew": 8, "Lost": 6}]. Crossfilter wouldn't let me combine the data from the win, lose, draw columns into one chart.

I could extensively redesign my data source to get around these problems, but for now I've moved ahead to do the [School Donations Dashboard](https://github.com/frankmullen/school_donations) project as part of my [Code Institute](https://www.codeinstitute.net/) training.
