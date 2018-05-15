#Bem-Generator
CLI that generates bem file structure based on input file; 
#Usage
Simply execute index.js with arguments. 
 ```bash
 $ node index.js input path/to/output
 ```
where input is a json file like:
 ```
  {
    "blocks":[ //Array of all blocks
      "wrapper", //Block can be just a string
      {
        "name": "section", //or object with nested elements 
        "elements": [ //Array of elements
          {
            "name": "center" // Element can be just a stirng as block is
          },
          {
            "name":"view-tiles", // or object too
            "modificators":[ // Array of modificators of element
              "active"
            ]
          }
        ],
        "modificators": [ // Array of modificators of block
          "big", // Modificator also can be a string
          { //and can be group
            "group": "type", //Prefix to the group items
            "items": ["footer","top-line"] //on output will be type-footer,type-top-line 
          }
        ]
      }
    ]
  }  
 ```