# Smart-City

The frontend of this project has features like 'Force Directed Graphs' written using D3.js. These graphs are used to visualize the architectural structure of the community inside the Smart City. The different nodes represented by the 'Force-Directed Graph' are clusters inside the smart city. The links represented between these clusters are basically the real life communication channels that connect these different clusters. This graph can be seen on the admin panel when logged into the administrator's account. 

The other kind of graphs that are available to the admin are 3D-Pie charts which are rendered using High Charts javascript library. This chart can be used to visualize the composition of the members of each cluster and their demographics according to the whole Smart City Community.

The moderator has a different role than the administrator and hence has a different chart available to him. Through the moderator's dashboard, we can see a Line chart that is rendered using High Charts javascript library. It visualizes the number of users that are added to the particular cluster that the Moderator belongs to.

The front end of this project assumes that you have Node.js and Express.js set up. The configuration files for express server are included in the project library in the folder/bin.
A Javascript frontend library called vis.js needs to be locally downloaded and added to the following folder inside the project root directory: "newproject/javascripts/"

