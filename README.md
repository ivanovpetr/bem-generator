#Bem-Generator
CLI that generates bem file structure based on input file; 
#Usage
Simply execute index.js with arguments. 
 ```bash
 $ node index.js input path/to/output
 ```
where input is a json file like a:
 ```shell
  {
    "blocks":[                              # → Array of all blocks
      "wrapper",                            # → Block can be just a string
      {
        "name": "section",                  # → or object with nested elements 
        "elements": [                       # → Array of elements
          "center",                         # → Element can be just a stirng as block is
          {
            "name":"button",                # → or object too
            "modificators":[                # → Array of modificators of element
              "active"
            ]
          }
        ],
        "modificators": [                   # → Array of modificators of block
          "big",                            # → Modificator also can be a string
          {                                 # → and can be group
            "group": "type",                # → Prefix to the group items
            "items": ["footer","top-line"]  # → on output will be type-footer,type-top-line 
          }
        ]
      }
    ]
  }  
 ```
 Input above will turns into that file structure:
 ```shell
 bem.blocks                     
 ├── section/     
 │   ├── _big/
 │   │   └── section_big.scss 
 │   ├── _type/  
 │   │   ├── section_type_top-line.scss
 │   │   └── section_type_footer.scss
 │   ├── __center/  
 │   │   └── section__center.scss
 │   ├── __button/
 │   │   ├── _active/
 │   │   │   └── section__button_active.scss
 │   │   └── section__button.scss
 │   └── section.sass      
 └── wrapper/          
     └── wrapper.scss                
 ```
 "section" block file will contain next content:
 ```scss
    @import "_big/section_big.scss";
    @import "_type/section_type_top-line";
    @import "_type/section_type_footer";
    @import "__center/section__center";
    @import "__button/section__button";
    @import "__button/_active/section__button_active";
    
    .section{
    
    }
```