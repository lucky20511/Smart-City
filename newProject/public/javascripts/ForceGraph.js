/**
 * Created by Arsh Bhatti on 5/15/2017.
 */

var h = 768, w = 1920;
/* Set the color scale we want to use */
var color = d3.scale.category20();
/* Establish/instantiate an SVG container object */
var svg = d3.select("body")
    .append("svg")
    .attr("height",h)
    .attr("width",w);
/* Build the directional arrows for the links/edges */
svg.append("svg:defs")
    .selectAll("marker")
    .data(["end"])
    .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");


makeDiag()

/* Define the main worker or execution function */
function makeDiag() {
    var nodes=[
        {
            "name": "Harkanwal Saini",
            "id":'1',
            "cluster":'Haveli'

        },
        {
            "name": "Gurkirat Sidhu",
            "id":'2',
            "cluster":'Haveli'
        },
        {
            "name": "Sanjot Saini",
            "id":'3',
            "cluster":'Haveli'
        },
        {
            "name": "Manpreet Saini",
            "id":'4',
            "cluster":'Haveli'
        },
        {
            "name": "Manmeet Gill",
            "id":'5',
            "cluster":'Haveli'
        },
        {
            "name": "Arsh Bhatti",
            "id":'6',
            "cluster":'Haveli'
        },
        {
            "name": "Avdeep Sandhu",
            "id":'7',
            "cluster":'ISH'
        },
        {
            "name": "Chetan Sidhu",
            "id":'8',
            "cluster":'ISH'
        },
        {
            "name": "Gunveet Singh",
            "id":'9',
            "cluster":'SFA'
        },
        {
            "name": "Jasdeep Singh",
            "id":'10',
            "cluster":'SFA'
        },
        {
            "name": "Ashay Argal",
            "id":'11',
            "cluster":'SFA'
        },
        {
            "name": "Ajay Modi",
            "id":'12',
            "cluster":'SFA'
        }
    ];

    var links=[
        {
            "source": 0,
            "target": 0
        },
        {
            "source": 0,
            "target": 1
        },
        {
            "source": 0,
            "target": 2
        },
        {
            "source": 0,
            "target": 3
        },
        {
            "source": 0,
            "target": 4
        },
        {
            "source": 0,
            "target": 5
        },

        {
            "source": 6,
            "target": 7
        },
        {
            "source": 8,
            "target": 9
        },
        {
            "source": 8,
            "target": 10
        },
        {
            "source": 8,
            "target": 11
        }

    ];

    /* Draw the node labels first */
    var texts = svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .text(function(d) { return d.name; })
    ;
    /* Establish the dynamic force behavor of the nodes */
    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([w,h])
        .linkDistance([250])
        .charge([-1500])
        .gravity(0.3)
        .start();
    /* Draw the edges/links between the nodes */
    var edges = svg.selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1)
        //.attr("marker-end", "url(#end)")
        .attr("class", function(d){ return ["node",d.source.cluster, d.target.cluster].join(" "); });
    /* Draw the nodes themselves */
    var nodes = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .attr("opacity", 0.5)
        .style("fill", function(d,i) { return color(d.cluster); })
        .call(force.drag)
        .on('mouseover', texts.show) //Added
        .on('mouseout', texts.hide); //Added ;

    /* Run the Force effect */
    force.on("tick", function() {
        edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
        texts.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }); // End tick func
};
