# Yotube_API
Problem Statment : To make an API to fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.

(As a guide I've included a video of a working model to this repository.)
A stepwise description to execute  this project :

As stated in the question, I have created an API that would retrieve the most recent videos from YouTube, paginated, and arranged in reverse chronological order of their publishing date-time. Additionally, it will store information about videos, including their ID, publication date, channel ID, title, description, thumbnails, and channel title with proper indexes. Further, I created a Dashobard where  API returns the saved videos and user can search a particular video from  stored videos using their title and description. When a key's quota is used up, it automatically switches to the second key.This project uses EJS, node.js, express.js, and MongoDB as its technology stack.


Step 1: Install required node_modules : node-fetch ,express, https ,body-parser, path ,mongoose

Step 2: start a server using command : node app.js
 
Step 3 : The server will launch at port 5000,Go to {GET request} (http://localhost:5000/), result of it will be routed to its own post request.

Step  4 : Or Make a post request to (http://localhost:5000/)  using this Keys/parameters ( as MongoDB uses Key -value pair ) Pagentation{1/2/3/4}, maxvideos {8 or 10}, search

Step 5 : You may now search for any term and have the option to select maxvideos and pagination no

Step 6 : API will fetch latest videos sorted in reverse chronological order of their publishing date-time from YouTube, The results of your search will be saved in a MongoDB database.

Step 7 : Data that has been saved will be accessible through the dashboard which has route {"/dashboard" } at GET request (http://localhost:5000/dashboard)

Step 8 : By using the stored videos' titles and descriptions, you can search them right on this dashboard

Step 9: The results of the search  query will be displayed upon Post  request of (http://localhost:5000/findresult) which has route {"/findresult" }, as it's required two Keys/parameters  ( as MongoDB uses Key -value pair )  search and searchvia(title or description)

Step 10 : If the title or description of the video does not match any previously stored videos, it will return "Video Does not exist in database" , else search videos will be published.

Step 11 :- Example :- for searching in Stored videos you can use this example : seachvia{title : "✨Lord Shiva Never Ending Blessing to Everyone😇🙏🏽🧿"} While searching, each String's character must be exact.

Note :  Please restart a server if any unnecessary errors occurred.

I ran into a problem when working on this project.As YouTube's API only permits 10k searches each day, when I continuously fetch data from it, the limit is exceeded because each search returns more than 80K results.As a result, I have limited a search result ; It will call an API until it receives the specified number of results.

As a guide I've included a video of a working model to this repository.
